<script setup lang="ts">
import { computed } from 'vue'
import { AlertTriangle, Fuel, Plane, Route, ShieldCheck, Wrench } from 'lucide-vue-next'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppDialog from '@/components/ui/AppDialog.vue'
import BarLoadChart from '@/components/charts/BarLoadChart.vue'
import RealtimeChart from '@/components/charts/RealtimeChart.vue'
import RiskHeatmap from '@/components/charts/RiskHeatmap.vue'
import type { ActivityEvent, Airport, ChartMode, Flight, OpsPoint } from '@/models/aviation'
import { formatTime } from '@/lib/utils'

const props = defineProps<{
  panel: 'metric' | 'chart' | 'flight' | 'event' | 'map' | null
  metric: string | null
  flight: Flight | null
  event: ActivityEvent | null
  points: OpsPoint[]
  flights: Flight[]
  airports: Airport[]
  chartMode: ChartMode
  enabled: Record<'onTimeRate' | 'fuelEfficiency' | 'maintenanceRisk' | 'passengerLoad', boolean>
  regionRows: Array<{ region: string; flights: number; risk: number; delay: number }>
}>()

const emit = defineEmits<{
  close: []
  inspect: [point: OpsPoint | null]
}>()

const title = computed(() => {
  if (props.panel === 'flight') return props.flight ? `${props.flight.id} Operations Detail` : 'Flight Detail'
  if (props.panel === 'event') return 'Operational Event Detail'
  if (props.panel === 'chart') return 'Fullscreen Telemetry Analytics'
  if (props.panel === 'map') return 'Aviation Radar Intelligence'
  return `${props.metric ?? 'Metric'} Analytics`
})

const mode = computed(() => (props.panel === 'flight' || props.panel === 'event' ? 'sheet' : 'fullscreen'))
</script>

<template>
  <AppDialog :open="panel !== null" :title="title" :mode="mode" @close="$emit('close')">
    <div v-if="panel === 'flight' && flight" class="grid gap-4">
      <div class="grid gap-3 sm:grid-cols-2">
        <div class="rounded-lg border border-[hsl(var(--border))] p-4">
          <div class="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]"><Plane class="h-4 w-4" /> Aircraft</div>
          <p class="mt-2 text-2xl font-semibold">{{ flight.aircraft }}</p>
          <p class="text-sm text-[hsl(var(--muted-foreground))]">{{ flight.airline }} · {{ flight.route }}</p>
        </div>
        <div class="rounded-lg border border-[hsl(var(--border))] p-4">
          <div class="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]"><Fuel class="h-4 w-4" /> Fuel level</div>
          <p class="mt-2 text-2xl font-semibold">{{ flight.fuelLevel.toFixed(1) }}%</p>
          <div class="mt-3 h-2 rounded-full bg-[hsl(var(--muted))]">
            <div class="h-2 rounded-full bg-[hsl(var(--primary))]" :style="{ width: `${flight.fuelLevel}%` }" />
          </div>
        </div>
      </div>

      <div class="grid gap-3 sm:grid-cols-3">
        <AppBadge tone="info"><Route class="h-3.5 w-3.5" /> {{ flight.origin }} to {{ flight.destination }}</AppBadge>
        <AppBadge :tone="flight.risk > 70 ? 'critical' : flight.risk > 50 ? 'warning' : 'normal'">Risk {{ flight.risk.toFixed(0) }}</AppBadge>
        <AppBadge tone="muted">{{ flight.weather }}</AppBadge>
      </div>

      <div class="rounded-lg border border-[hsl(var(--border))] p-4">
        <h3 class="font-medium">Telemetry</h3>
        <div class="mt-3 grid gap-3 sm:grid-cols-2">
          <p>Altitude <strong>{{ flight.altitude.toLocaleString() }} ft</strong></p>
          <p>Airspeed <strong>{{ flight.speed }} kt</strong></p>
          <p>Heading <strong>{{ flight.heading }}°</strong></p>
          <p>ETA <strong>{{ flight.etaMinutes }} min</strong></p>
          <p>Position <strong>{{ flight.latitude }}, {{ flight.longitude }}</strong></p>
          <p>Status <strong>{{ flight.status }}</strong></p>
        </div>
      </div>

      <div class="rounded-lg border border-[hsl(var(--border))] p-4">
        <h3 class="flex items-center gap-2 font-medium"><Wrench class="h-4 w-4" /> Maintenance alerts</h3>
        <ul class="mt-3 space-y-2 text-sm text-[hsl(var(--muted-foreground))]">
          <li v-if="!flight.maintenanceAlerts.length">No active maintenance alerts for this aircraft.</li>
          <li v-for="alert in flight.maintenanceAlerts" :key="alert">{{ alert }}</li>
        </ul>
      </div>
    </div>

    <div v-else-if="panel === 'event' && event" class="grid gap-4">
      <div class="flex flex-wrap items-center gap-2">
        <AppBadge :tone="event.severity" class="capitalize">{{ event.severity }}</AppBadge>
        <AppBadge tone="muted">{{ event.source }}</AppBadge>
        <AppBadge tone="info">{{ formatTime(event.timestamp) }}</AppBadge>
      </div>
      <p class="rounded-lg border border-[hsl(var(--border))] p-4 text-lg leading-8">{{ event.message }}</p>
      <div class="grid gap-3 sm:grid-cols-2">
        <p class="rounded-lg border border-[hsl(var(--border))] p-4">Region <strong>{{ event.region }}</strong></p>
        <p class="rounded-lg border border-[hsl(var(--border))] p-4">Flight <strong>{{ event.flightId ?? 'Network level' }}</strong></p>
      </div>
      <div class="rounded-lg border border-[hsl(var(--border))] p-4">
        <h3 class="flex items-center gap-2 font-medium"><AlertTriangle class="h-4 w-4" /> Recommended response</h3>
        <p class="mt-2 text-sm leading-6 text-[hsl(var(--muted-foreground))]">
          Correlate this event with current route, aircraft health, airport congestion, and weather risk before dispatch intervention.
        </p>
      </div>
    </div>

    <div v-else-if="panel === 'chart'" class="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(360px,0.7fr)]">
      <div class="rounded-lg border border-[hsl(var(--border))] p-4">
        <RealtimeChart :points="points" :mode="chartMode" :enabled="enabled" @inspect="$emit('inspect', $event)" />
      </div>
      <div class="grid gap-4">
        <div class="rounded-lg border border-[hsl(var(--border))] p-4">
          <h3 class="font-medium">Regional distribution</h3>
          <BarLoadChart :rows="regionRows" />
        </div>
        <div class="rounded-lg border border-[hsl(var(--border))] p-4">
          <h3 class="font-medium">Risk matrix</h3>
          <RiskHeatmap :flights="flights" />
        </div>
      </div>
    </div>

    <div v-else-if="panel === 'map'" class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div class="relative min-h-[62vh] overflow-hidden rounded-lg border border-[hsl(var(--border))] bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.18),transparent_38%),hsl(var(--background))]">
        <div v-for="flight in flights" :key="flight.id" class="absolute" :style="{ left: `${((flight.longitude + 80) / 140) * 100}%`, top: `${100 - ((flight.latitude + 35) / 90) * 100}%` }">
          <Plane class="h-5 w-5 text-[hsl(var(--primary))]" :style="{ transform: `rotate(${flight.heading}deg)` }" />
        </div>
      </div>
      <div class="space-y-3">
        <article v-for="airport in airports" :key="airport.code" class="rounded-lg border border-[hsl(var(--border))] p-3">
          <div class="flex items-center justify-between">
            <strong>{{ airport.code }}</strong>
            <AppBadge :tone="airport.congestion > 72 ? 'warning' : 'normal'">{{ airport.congestion.toFixed(0) }}%</AppBadge>
          </div>
          <p class="mt-1 text-sm text-[hsl(var(--muted-foreground))]">{{ airport.city }} · {{ airport.weather }}</p>
        </article>
      </div>
    </div>

    <div v-else class="grid gap-4 lg:grid-cols-3">
      <div class="rounded-lg border border-[hsl(var(--border))] p-4 lg:col-span-2">
        <RealtimeChart :points="points" :mode="chartMode" :enabled="enabled" @inspect="$emit('inspect', $event)" />
      </div>
      <div class="rounded-lg border border-[hsl(var(--border))] p-4">
        <h3 class="flex items-center gap-2 font-medium"><ShieldCheck class="h-4 w-4" /> Operational readout</h3>
        <p class="mt-3 text-sm leading-6 text-[hsl(var(--muted-foreground))]">
          This metric is derived from the active stream window and correlated with visible alerts, congestion, weather, and fleet health.
        </p>
      </div>
    </div>
  </AppDialog>
</template>
