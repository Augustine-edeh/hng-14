<script setup lang="ts">
import { computed } from 'vue'
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from 'lucide-vue-next'
import AppCard from '../ui/AppCard.vue'

const props = defineProps<{
  label: string
  value: string | number
  detail: string
  trend: number
  inverse?: boolean
  icon: LucideIcon
}>()

const isPositive = computed(() => (props.inverse ? props.trend <= 0 : props.trend >= 0))
</script>

<template>
  <AppCard class="min-h-[138px]">
    <div class="flex items-start justify-between gap-3">
      <div>
        <p class="text-sm text-[hsl(var(--muted-foreground))]">{{ label }}</p>
        <p class="mt-2 text-2xl font-semibold tracking-normal md:text-3xl">{{ value }}</p>
      </div>
      <div class="rounded-md bg-[hsl(var(--primary)/0.14)] p-2 text-[hsl(var(--primary))]">
        <component :is="icon" class="h-5 w-5" />
      </div>
    </div>
    <div class="mt-4 flex items-center justify-between gap-3 text-sm">
      <span class="truncate text-[hsl(var(--muted-foreground))]">{{ detail }}</span>
      <span
        class="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-medium"
        :class="isPositive ? 'bg-emerald-500/12 text-emerald-300' : 'bg-red-500/12 text-red-300'"
      >
        <ArrowUpRight v-if="isPositive" class="h-3.5 w-3.5" />
        <ArrowDownRight v-else class="h-3.5 w-3.5" />
        {{ Math.abs(trend).toFixed(1) }}%
      </span>
    </div>
  </AppCard>
</template>
