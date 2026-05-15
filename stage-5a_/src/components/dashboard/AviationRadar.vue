<script setup lang="ts">
import { computed } from 'vue'
import { Plane, RadioTower } from 'lucide-vue-next'
import type { Airport, Flight } from '@/models/aviation'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppCard from '@/components/ui/AppCard.vue'

const props = defineProps<{
  flights: Flight[]
  airports: Airport[]
}>()

defineEmits<{
  openFlight: [flight: Flight]
  openMap: []
}>()

const visibleFlights = computed(() =>
  props.flights.slice(0, 22).map((flight) => ({
    flight,
    x: `${((flight.longitude + 80) / 140) * 100}%`,
    y: `${100 - ((flight.latitude + 35) / 90) * 100}%`,
  })),
)

const visibleAirports = computed(() =>
  props.airports.slice(0, 9).map((airport, index) => ({
    airport,
    x: `${12 + (index % 3) * 38 + (airport.congestion % 8)}%`,
    y: `${18 + Math.floor(index / 3) * 28}%`,
  })),
)
</script>

<template>
  <AppCard class="overflow-hidden p-0">
    <div class="flex items-center justify-between border-b border-[hsl(var(--border))] p-4">
      <div>
        <h2 class="text-base font-semibold">Aviation Radar</h2>
        <p class="text-sm text-[hsl(var(--muted-foreground))]">Live traffic movement and airport pressure</p>
      </div>
      <button class="text-sm font-medium text-[hsl(var(--primary))]" type="button" @click="$emit('openMap')">
        Expand
      </button>
    </div>

    <button
      class="relative block h-[340px] w-full overflow-hidden bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.16),transparent_34%),linear-gradient(135deg,hsl(var(--card)),hsl(var(--background)))] text-left"
      type="button"
      @click="$emit('openMap')"
    >
      <div class="absolute inset-0 opacity-45">
        <div class="absolute left-1/2 top-0 h-full w-px bg-[hsl(var(--border))]" />
        <div class="absolute left-0 top-1/2 h-px w-full bg-[hsl(var(--border))]" />
        <div class="absolute inset-8 rounded-full border border-[hsl(var(--primary)/0.18)]" />
        <div class="absolute inset-20 rounded-full border border-[hsl(var(--primary)/0.12)]" />
      </div>

      <span
        v-for="item in visibleAirports"
        :key="item.airport.code"
        class="absolute -translate-x-1/2 -translate-y-1/2"
        :style="{ left: item.x, top: item.y }"
      >
        <span class="flex items-center gap-1 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background)/0.72)] px-2 py-1 text-xs">
          <RadioTower class="h-3 w-3 text-[hsl(var(--accent))]" />
          {{ item.airport.code }}
        </span>
      </span>

      <span
        v-for="item in visibleFlights"
        :key="item.flight.id"
        class="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out"
        :style="{ left: item.x, top: item.y }"
      >
        <button
          class="group flex items-center gap-1 rounded-md bg-[hsl(var(--primary)/0.12)] px-2 py-1 text-xs text-[hsl(var(--foreground))] ring-1 ring-[hsl(var(--primary)/0.24)] transition hover:bg-[hsl(var(--primary)/0.22)]"
          type="button"
          @click.stop="$emit('openFlight', item.flight)"
        >
          <Plane class="h-3.5 w-3.5 text-[hsl(var(--primary))]" :style="{ transform: `rotate(${item.flight.heading}deg)` }" />
          {{ item.flight.id }}
        </button>
      </span>

      <div class="absolute bottom-4 left-4 flex flex-wrap gap-2">
        <AppBadge tone="info">{{ flights.length }} aircraft</AppBadge>
        <AppBadge tone="warning">{{ airports.filter((airport) => airport.congestion > 70).length }} congested airports</AppBadge>
      </div>
    </button>
  </AppCard>
</template>
