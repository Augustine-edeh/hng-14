<script setup lang="ts">
import { computed } from 'vue'
import { BrainCircuit, CloudSun, Fuel, ShieldCheck } from 'lucide-vue-next'
import type { Flight, OpsPoint } from '@/models/aviation'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppCard from '@/components/ui/AppCard.vue'

const props = defineProps<{
  latest: OpsPoint | null
  flights: Flight[]
}>()

const recommendations = computed(() => {
  const highRisk = props.flights.filter((flight) => flight.risk > 65).slice(0, 3)
  const latest = props.latest

  return [
    {
      icon: Fuel,
      title: 'Fuel optimization',
      text: latest && latest.fuelEfficiency < 78 ? 'Re-sequence long-haul departures for uplift efficiency.' : 'Fuel burn model is within target envelope.',
      tone: latest && latest.fuelEfficiency < 78 ? 'warning' : 'normal',
    },
    {
      icon: CloudSun,
      title: 'Route intelligence',
      text: highRisk[0] ? `${highRisk[0].id} should evaluate weather-aware rerouting on ${highRisk[0].route}.` : 'No route requires intervention.',
      tone: highRisk[0] ? 'advisory' : 'normal',
    },
    {
      icon: ShieldCheck,
      title: 'Safety posture',
      text: latest && latest.safetyScore < 90 ? 'Increase supervisor watch on active anomalies.' : 'Safety score remains strong across visible operations.',
      tone: latest && latest.safetyScore < 90 ? 'warning' : 'normal',
    },
  ] as const
})
</script>

<template>
  <AppCard>
    <div class="mb-4 flex items-center gap-3">
      <div class="rounded-md bg-[hsl(var(--primary)/0.14)] p-2 text-[hsl(var(--primary))]">
        <BrainCircuit class="h-5 w-5" />
      </div>
      <div>
        <h2 class="text-base font-semibold">Operations Intelligence</h2>
        <p class="text-sm text-[hsl(var(--muted-foreground))]">Decision support from live telemetry</p>
      </div>
    </div>

    <div class="space-y-3">
      <article v-for="item in recommendations" :key="item.title" class="rounded-md border border-[hsl(var(--border))] p-3">
        <div class="flex items-center justify-between gap-3">
          <div class="flex min-w-0 items-center gap-2">
            <component :is="item.icon" class="h-4 w-4 shrink-0 text-[hsl(var(--primary))]" />
            <h3 class="truncate text-sm font-medium">{{ item.title }}</h3>
          </div>
          <AppBadge :tone="item.tone">{{ item.tone }}</AppBadge>
        </div>
        <p class="mt-2 text-sm leading-6 text-[hsl(var(--muted-foreground))]">{{ item.text }}</p>
      </article>
    </div>
  </AppCard>
</template>
