<script setup lang="ts">
import { Pause, Play, RadioTower, Search, SlidersHorizontal } from 'lucide-vue-next'
import AppBadge from '../ui/AppBadge.vue'
import AppButton from '../ui/AppButton.vue'
import type { ActivityEvent, ChartMode, Region, TimeRange } from '../../models/aviation'

defineProps<{
  status: string
  isPaused: boolean
}>()

const region = defineModel<Region | 'All'>('region', { required: true })
const severity = defineModel<ActivityEvent['severity'] | 'All'>('severity', { required: true })
const timeRange = defineModel<TimeRange>('timeRange', { required: true })
const chartMode = defineModel<ChartMode>('chartMode', { required: true })
const query = defineModel<string>('query', { required: true })

const regions: Array<Region | 'All'> = ['All', 'West Africa', 'Europe', 'Middle East', 'North America', 'Southern Africa']
const severities: Array<ActivityEvent['severity'] | 'All'> = ['All', 'normal', 'advisory', 'warning', 'critical']
const ranges: Array<{ label: string; value: TimeRange }> = [
  { label: '1m', value: '1m' },
  { label: '5m', value: '5m' },
  { label: '15m', value: '15m' },
  { label: '1h', value: '60m' },
]

defineEmits<{
  toggle: []
}>()
</script>

<template>
  <div class="glass-panel rounded-lg p-3">
    <div class="grid gap-3 lg:grid-cols-[auto_1fr_auto] lg:items-center">
      <div class="flex flex-wrap items-center gap-2">
        <AppBadge :tone="status === 'live' ? 'normal' : status === 'paused' ? 'muted' : 'warning'">
          <RadioTower class="h-3.5 w-3.5" />
          {{ status }}
        </AppBadge>
        <AppButton variant="secondary" @click="$emit('toggle')">
          <Play v-if="isPaused" class="h-4 w-4" />
          <Pause v-else class="h-4 w-4" />
          {{ isPaused ? 'Resume' : 'Pause' }}
        </AppButton>
      </div>

      <div class="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
        <label class="relative">
          <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
          <input
            v-model="query"
            class="h-10 w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background)/0.45)] pl-9 pr-3 text-sm outline-none transition focus:border-[hsl(var(--primary))]"
            placeholder="Search ops feed"
          />
        </label>
        <select v-model="region" class="h-10 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background)/0.45)] px-3 text-sm outline-none">
          <option v-for="item in regions" :key="item" :value="item">{{ item }}</option>
        </select>
        <select v-model="severity" class="h-10 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background)/0.45)] px-3 text-sm capitalize outline-none">
          <option v-for="item in severities" :key="item" :value="item">{{ item }}</option>
        </select>
        <select v-model="timeRange" class="h-10 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background)/0.45)] px-3 text-sm outline-none">
          <option v-for="item in ranges" :key="item.value" :value="item.value">Last {{ item.label }}</option>
        </select>
        <select v-model="chartMode" class="h-10 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background)/0.45)] px-3 text-sm capitalize outline-none">
          <option value="area">Area chart</option>
          <option value="line">Line chart</option>
        </select>
      </div>

      <div class="hidden items-center gap-2 text-sm text-[hsl(var(--muted-foreground))] lg:flex">
        <SlidersHorizontal class="h-4 w-4" />
        Live controls
      </div>
    </div>
  </div>
</template>
