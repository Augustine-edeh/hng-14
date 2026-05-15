<script setup lang="ts">
import { computed } from 'vue'
import { Plane, Wrench } from 'lucide-vue-next'
import type { Flight } from '@/models/aviation'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppCard from '@/components/ui/AppCard.vue'

const props = defineProps<{
  flights: Flight[]
}>()

defineEmits<{
  open: [flight: Flight]
}>()

const visibleFlights = computed(() => props.flights.slice(0, 18))

function riskTone(risk: number) {
  if (risk > 78) return 'critical'
  if (risk > 58) return 'warning'
  if (risk > 34) return 'advisory'
  return 'normal'
}
</script>

<template>
  <AppCard class="p-0">
    <div class="flex items-center justify-between border-b border-[hsl(var(--border))] p-4">
      <div>
        <h2 class="text-base font-semibold">Fleet Operations</h2>
        <p class="text-sm text-[hsl(var(--muted-foreground))]">Live flight status and health risk</p>
      </div>
      <Plane class="h-5 w-5 text-[hsl(var(--primary))]" />
    </div>

    <div class="overflow-auto">
      <table class="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead class="sticky top-0 bg-[hsl(var(--card))] text-xs uppercase text-[hsl(var(--muted-foreground))]">
          <tr>
            <th class="px-4 py-3 font-medium">Flight</th>
            <th class="px-4 py-3 font-medium">Route</th>
            <th class="px-4 py-3 font-medium">Airline</th>
            <th class="px-4 py-3 font-medium">Aircraft</th>
            <th class="px-4 py-3 font-medium">Status</th>
            <th class="px-4 py-3 font-medium">Altitude</th>
            <th class="px-4 py-3 font-medium">Speed</th>
            <th class="px-4 py-3 font-medium">Fuel</th>
            <th class="px-4 py-3 font-medium">Weather</th>
            <th class="px-4 py-3 font-medium">Risk</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="flight in visibleFlights"
            :key="flight.id"
            class="cursor-pointer border-t border-[hsl(var(--border)/0.58)] transition hover:bg-[hsl(var(--muted)/0.38)]"
            tabindex="0"
            @click="$emit('open', flight)"
            @keydown.enter="$emit('open', flight)"
          >
            <td class="px-4 py-3 font-medium">{{ flight.id }}</td>
            <td class="px-4 py-3 text-[hsl(var(--muted-foreground))]">{{ flight.route }}</td>
            <td class="px-4 py-3 text-[hsl(var(--muted-foreground))]">{{ flight.airline }}</td>
            <td class="px-4 py-3 text-[hsl(var(--muted-foreground))]">{{ flight.aircraft }}</td>
            <td class="px-4 py-3"><AppBadge tone="muted">{{ flight.status }}</AppBadge></td>
            <td class="px-4 py-3">{{ flight.altitude.toLocaleString() }} ft</td>
            <td class="px-4 py-3">{{ flight.speed }} kt</td>
            <td class="px-4 py-3">{{ flight.fuelLevel.toFixed(0) }}%</td>
            <td class="px-4 py-3 text-[hsl(var(--muted-foreground))]">{{ flight.weather }}</td>
            <td class="px-4 py-3">
              <AppBadge :tone="riskTone(flight.risk)" class="min-w-16 justify-center">
                <Wrench class="h-3.5 w-3.5" />
                {{ flight.risk.toFixed(0) }}
              </AppBadge>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </AppCard>
</template>
