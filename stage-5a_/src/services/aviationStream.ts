import { z } from 'zod'
import {
  ActivityEventSchema,
  FlightSchema,
  OpsPointSchema,
  StreamPayloadSchema,
  type ActivityEvent,
  type Flight,
  type FlightStatus,
  type Region,
  type StreamPayload,
} from '../models/aviation'
import { clamp, sanitizeText } from '../lib/utils'

type Listener = (payload: StreamPayload) => void
type ErrorListener = (error: Error) => void
type StatusListener = (status: 'connecting' | 'live' | 'reconnecting' | 'offline') => void

const regions: Region[] = ['West Africa', 'Europe', 'Middle East', 'North America', 'Southern Africa']
const routePairs = ['LOS-ABV', 'LOS-ACC', 'ABV-LHR', 'LOS-DXB', 'KAN-LOS', 'PHC-ABV', 'LOS-JFK', 'ABV-CPT']
const aircraft = ['A220-300', 'A320neo', 'B737 MAX 8', 'B787-9', 'E195-E2']
const statuses: FlightStatus[] = ['Boarding', 'Taxi', 'Climb', 'Cruise', 'Descent', 'Approach', 'Landed', 'Delayed']
const eventSources = ['AOC Dispatch', 'Fleet Health', 'Crew Desk', 'Ground Ops', 'Weather Intel', 'Security Ops']

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function randomInt(min: number, max: number) {
  return Math.round(randomBetween(min, max))
}

function pick<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)] ?? items[0]
}

function makeFlight(index: number, timestamp: number): Flight {
  const status = pick(statuses)
  const isGround = status === 'Boarding' || status === 'Taxi' || status === 'Landed' || status === 'Delayed'
  const risk = clamp(randomBetween(5, status === 'Delayed' ? 84 : 54), 0, 100)

  return FlightSchema.parse({
    id: `AU${String(100 + index).padStart(3, '0')}`,
    route: pick(routePairs),
    aircraft: pick(aircraft),
    status,
    region: pick(regions),
    altitude: isGround ? randomInt(0, 4500) : randomInt(18000, 41000),
    speed: isGround ? randomInt(0, 120) : randomInt(360, 545),
    etaMinutes: randomInt(status === 'Landed' ? -8 : 12, 480),
    risk,
    updatedAt: timestamp,
  })
}

function makeEvent(timestamp: number, flights: Flight[]): ActivityEvent {
  const flight = pick(flights)
  const risk = flight?.risk ?? 20
  const severity: ActivityEvent['severity'] =
    risk > 78 ? 'critical' : risk > 58 ? 'warning' : risk > 36 ? 'advisory' : 'normal'
  const messages = {
    normal: ['Gate turn progressing on target', 'Telemetry packet verified', 'Crew check-in completed'],
    advisory: ['Weather deviation recommended', 'Fuel uplift variance detected', 'Passenger load trend rising'],
    warning: ['Slot pressure increasing at destination', 'Maintenance trend needs engineering review', 'Baggage belt queue above target'],
    critical: ['Operational risk threshold breached', 'Security correlation requires supervisor review', 'Aircraft health anomaly escalated'],
  }

  return ActivityEventSchema.parse({
    id: `${timestamp}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp,
    severity,
    source: pick(eventSources),
    message: sanitizeText(pick(messages[severity])),
    region: flight?.region ?? pick(regions),
    flightId: flight?.id,
  })
}

function buildPayload(previousAirborne: number): StreamPayload {
  const timestamp = Date.now()
  const flights = Array.from({ length: 34 }, (_, index) => makeFlight(index, timestamp))
  const airborne = clamp(previousAirborne + randomInt(-4, 5), 48, 118)
  const avgRisk = flights.reduce((sum, flight) => sum + flight.risk, 0) / flights.length

  const point = OpsPointSchema.parse({
    timestamp,
    region: pick(regions),
    airborne,
    onTimeRate: clamp(91 - avgRisk * 0.12 + randomBetween(-2.2, 2.2), 68, 99.4),
    fuelEfficiency: clamp(83 + randomBetween(-7, 6), 55, 98),
    safetyScore: clamp(97 - avgRisk * 0.08 + randomBetween(-1.5, 1.5), 78, 99.9),
    maintenanceRisk: clamp(avgRisk + randomBetween(-8, 12), 3, 96),
    passengerLoad: clamp(76 + randomBetween(-9, 14), 42, 100),
    delayMinutes: clamp(randomBetween(4, 32) + avgRisk * 0.12, 0, 120),
    baggageThroughput: randomInt(2200, 6200),
    networkLatency: clamp(randomBetween(38, 220) + avgRisk * 1.2, 20, 900),
  })

  return StreamPayloadSchema.parse({
    point,
    flights,
    events: Array.from({ length: randomInt(1, 4) }, () => makeEvent(timestamp, flights)),
  })
}

export class AviationStream {
  private listeners = new Set<Listener>()
  private errorListeners = new Set<ErrorListener>()
  private statusListeners = new Set<StatusListener>()
  private timer: number | null = null
  private reconnectTimer: number | null = null
  private previousAirborne = 74
  private attempts = 0
  private paused = false

  onMessage(listener: Listener) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  onError(listener: ErrorListener) {
    this.errorListeners.add(listener)
    return () => this.errorListeners.delete(listener)
  }

  onStatus(listener: StatusListener) {
    this.statusListeners.add(listener)
    return () => this.statusListeners.delete(listener)
  }

  connect() {
    this.clear()
    this.paused = false
    this.emitStatus('connecting')
    this.timer = window.setInterval(() => this.tick(), 900)
    window.setTimeout(() => this.emitStatus('live'), 350)
  }

  pause() {
    this.paused = true
    this.clearTimer()
  }

  resume() {
    if (!this.paused) return
    this.connect()
  }

  disconnect() {
    this.paused = true
    this.clear()
    this.emitStatus('offline')
  }

  private tick() {
    if (Math.random() < 0.018) {
      this.handleError(new Error('Secure ops stream dropped. Reconnecting with backoff.'))
      return
    }

    try {
      const raw = Math.random() < 0.014 ? { invalid: true } : buildPayload(this.previousAirborne)
      const payload = StreamPayloadSchema.parse(raw)
      this.previousAirborne = payload.point.airborne
      this.attempts = 0
      this.emitStatus('live')
      this.listeners.forEach((listener) => listener(payload))
    } catch (error) {
      if (error instanceof z.ZodError) {
        this.handleError(new Error('Malformed aviation payload rejected by schema validation.'))
      } else {
        this.handleError(error instanceof Error ? error : new Error('Unknown stream error.'))
      }
    }
  }

  private handleError(error: Error) {
    this.errorListeners.forEach((listener) => listener(error))
    this.emitStatus('reconnecting')
    this.clearTimer()
    this.attempts += 1
    const delay = Math.min(8000, 700 * 2 ** Math.min(this.attempts, 4))
    this.reconnectTimer = window.setTimeout(() => {
      if (!this.paused) this.connect()
    }, delay)
  }

  private emitStatus(status: 'connecting' | 'live' | 'reconnecting' | 'offline') {
    this.statusListeners.forEach((listener) => listener(status))
  }

  private clearTimer() {
    if (this.timer) window.clearInterval(this.timer)
    this.timer = null
  }

  private clear() {
    this.clearTimer()
    if (this.reconnectTimer) window.clearTimeout(this.reconnectTimer)
    this.reconnectTimer = null
  }
}
