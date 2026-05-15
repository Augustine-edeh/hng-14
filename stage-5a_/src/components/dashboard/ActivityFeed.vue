<script setup lang="ts">
import { computed } from 'vue'
import { AlertTriangle, CheckCircle2, Info, ShieldAlert } from 'lucide-vue-next'
import type { ActivityEvent } from '../../models/aviation'
import { formatRelativeAge, formatTime } from '../../lib/utils'
import AppBadge from '../ui/AppBadge.vue'
import AppCard from '../ui/AppCard.vue'

const props = defineProps<{
  events: ActivityEvent[]
}>()

const visibleEvents = computed(() => props.events.slice(0, 80))

const icons = {
  normal: CheckCircle2,
  advisory: Info,
  warning: AlertTriangle,
  critical: ShieldAlert,
}
</script>

<template>
  <AppCard class="flex min-h-[420px] flex-col p-0">
    <div class="flex items-center justify-between border-b border-[hsl(var(--border))] p-4">
      <div>
        <h2 class="text-base font-semibold">Real-time Activity Feed</h2>
        <p class="text-sm text-[hsl(var(--muted-foreground))]">Newest operational signals first</p>
      </div>
      <AppBadge tone="info">{{ events.length }} retained</AppBadge>
    </div>

    <div v-if="!visibleEvents.length" class="flex flex-1 items-center justify-center p-8 text-center text-sm text-[hsl(var(--muted-foreground))]">
      Waiting for validated operations events.
    </div>

    <div v-else class="max-h-[560px] overflow-auto">
      <article
        v-for="event in visibleEvents"
        :key="event.id"
        class="grid grid-cols-[auto_1fr] gap-3 border-b border-[hsl(var(--border)/0.62)] p-4 last:border-0"
      >
        <div
          class="mt-1 rounded-md p-2"
          :class="{
            'bg-emerald-500/12 text-emerald-300': event.severity === 'normal',
            'bg-cyan-500/12 text-cyan-300': event.severity === 'advisory',
            'bg-amber-500/12 text-amber-300': event.severity === 'warning',
            'bg-red-500/12 text-red-300': event.severity === 'critical',
          }"
        >
          <component :is="icons[event.severity]" class="h-4 w-4" />
        </div>
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-2">
            <AppBadge :tone="event.severity" class="capitalize">{{ event.severity }}</AppBadge>
            <span class="text-xs text-[hsl(var(--muted-foreground))]">{{ event.source }}</span>
            <span class="text-xs text-[hsl(var(--muted-foreground))]">{{ formatTime(event.timestamp) }}</span>
          </div>
          <p class="mt-2 text-sm leading-6">{{ event.message }}</p>
          <div class="mt-2 flex flex-wrap gap-2 text-xs text-[hsl(var(--muted-foreground))]">
            <span>{{ event.region }}</span>
            <span v-if="event.flightId">{{ event.flightId }}</span>
            <span>{{ formatRelativeAge(event.timestamp) }}</span>
          </div>
        </div>
      </article>
    </div>
  </AppCard>
</template>
