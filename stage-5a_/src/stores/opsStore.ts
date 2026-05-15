import { computed, ref, shallowRef } from 'vue'
import { defineStore } from 'pinia'
import { AviationStream } from '../services/aviationStream'
import type { ActivityEvent, ChartMode, Flight, OpsPoint, Region, StreamHealth, StreamPayload, TimeRange } from '../models/aviation'
import { average } from '../lib/utils'

const pointLimit = 900
const eventLimit = 220
const rangeWindows: Record<TimeRange, number> = {
  '1m': 60_000,
  '5m': 5 * 60_000,
  '15m': 15 * 60_000,
  '60m': 60 * 60_000,
}

export const useOpsStore = defineStore('ops', () => {
  const stream = shallowRef<AviationStream | null>(null)
  const points = shallowRef<OpsPoint[]>([])
  const flights = shallowRef<Flight[]>([])
  const events = shallowRef<ActivityEvent[]>([])
  const selectedRegion = ref<Region | 'All'>('All')
  const selectedSeverity = ref<ActivityEvent['severity'] | 'All'>('All')
  const query = ref('')
  const timeRange = ref<TimeRange>('5m')
  const chartMode = ref<ChartMode>('area')
  const enabledDatasets = ref({
    onTimeRate: true,
    fuelEfficiency: true,
    maintenanceRisk: true,
    passengerLoad: true,
  })
  const inspectedPoint = ref<OpsPoint | null>(null)
  const health = ref<StreamHealth>({
    status: 'connecting',
    lastMessageAt: null,
    reconnectAttempts: 0,
    error: null,
  })

  const isPaused = computed(() => health.value.status === 'paused')

  const filteredPoints = computed(() => {
    const cutoff = Date.now() - rangeWindows[timeRange.value]
    return points.value.filter((point) => {
      const matchesRange = point.timestamp >= cutoff
      const matchesRegion = selectedRegion.value === 'All' || point.region === selectedRegion.value
      return matchesRange && matchesRegion
    })
  })

  const latestPoint = computed(() => points.value.at(-1) ?? null)

  const filteredFlights = computed(() => {
    const region = selectedRegion.value
    return flights.value
      .filter((flight) => region === 'All' || flight.region === region)
      .sort((a, b) => b.risk - a.risk)
  })

  const filteredEvents = computed(() => {
    const normalizedQuery = query.value.trim().toLowerCase()
    return events.value.filter((event) => {
      const matchesRegion = selectedRegion.value === 'All' || event.region === selectedRegion.value
      const matchesSeverity = selectedSeverity.value === 'All' || event.severity === selectedSeverity.value
      const matchesQuery =
        !normalizedQuery ||
        `${event.message} ${event.source} ${event.flightId ?? ''}`.toLowerCase().includes(normalizedQuery)
      return matchesRegion && matchesSeverity && matchesQuery
    })
  })

  const metrics = computed(() => {
    const visible = filteredPoints.value
    const latest = latestPoint.value
    const trendBase = visible.slice(-12)

    return {
      airborne: latest?.airborne ?? 0,
      onTimeRate: latest?.onTimeRate ?? 0,
      fuelEfficiency: latest?.fuelEfficiency ?? 0,
      safetyScore: latest?.safetyScore ?? 0,
      maintenanceRisk: latest?.maintenanceRisk ?? 0,
      delayMinutes: latest?.delayMinutes ?? 0,
      avgPassengerLoad: average(trendBase.map((point) => point.passengerLoad)),
      activeFlights: filteredFlights.value.length,
      criticalEvents: events.value.filter((event) => event.severity === 'critical').length,
    }
  })

  const regionSummary = computed(() => {
    const summary = new Map<string, { region: string; flights: number; risk: number; delay: number }>()
    filteredFlights.value.forEach((flight) => {
      const current = summary.get(flight.region) ?? { region: flight.region, flights: 0, risk: 0, delay: 0 }
      current.flights += 1
      current.risk += flight.risk
      current.delay += Math.max(0, flight.etaMinutes < 0 ? Math.abs(flight.etaMinutes) : 0)
      summary.set(flight.region, current)
    })

    return [...summary.values()].map((item) => ({
      ...item,
      risk: item.flights ? item.risk / item.flights : 0,
    }))
  })

  function ingest(payload: StreamPayload) {
    points.value = [...points.value, payload.point].slice(-pointLimit)
    flights.value = payload.flights
    events.value = [...payload.events, ...events.value].slice(0, eventLimit)
    health.value = {
      ...health.value,
      status: 'live',
      lastMessageAt: payload.point.timestamp,
      error: null,
    }
  }

  function start() {
    if (stream.value) return
    const nextStream = new AviationStream()
    nextStream.onMessage(ingest)
    nextStream.onError((error) => {
      health.value = {
        ...health.value,
        status: 'degraded',
        error: error.message,
        reconnectAttempts: health.value.reconnectAttempts + 1,
      }
    })
    nextStream.onStatus((status) => {
      health.value = {
        ...health.value,
        status,
      }
    })
    stream.value = nextStream
    nextStream.connect()
  }

  function stop() {
    stream.value?.disconnect()
    stream.value = null
  }

  function toggleStreaming() {
    if (health.value.status === 'paused') {
      stream.value?.resume()
      health.value = { ...health.value, status: 'connecting' }
      return
    }

    stream.value?.pause()
    health.value = { ...health.value, status: 'paused' }
  }

  function setDataset(key: keyof typeof enabledDatasets.value, value: boolean) {
    enabledDatasets.value = { ...enabledDatasets.value, [key]: value }
  }

  function inspectPoint(point: OpsPoint | null) {
    inspectedPoint.value = point
  }

  return {
    chartMode,
    enabledDatasets,
    events,
    filteredEvents,
    filteredFlights,
    filteredPoints,
    health,
    inspectedPoint,
    isPaused,
    latestPoint,
    metrics,
    points,
    query,
    regionSummary,
    selectedRegion,
    selectedSeverity,
    timeRange,
    inspectPoint,
    setDataset,
    start,
    stop,
    toggleStreaming,
  }
})
