<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '../../lib/utils'
import type { Severity } from '../../models/aviation'

const props = defineProps<{
  tone?: Severity | 'info' | 'muted'
  class?: string
}>()

const classes = computed(() =>
  cn(
    'inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium',
    props.tone === 'critical' && 'border-red-400/35 bg-red-500/12 text-red-200 light:text-red-700',
    props.tone === 'warning' && 'border-amber-400/35 bg-amber-500/12 text-amber-200 light:text-amber-700',
    props.tone === 'advisory' && 'border-cyan-400/35 bg-cyan-500/12 text-cyan-100 light:text-cyan-700',
    props.tone === 'normal' && 'border-emerald-400/35 bg-emerald-500/12 text-emerald-100 light:text-emerald-700',
    props.tone === 'info' && 'border-[hsl(var(--primary)/0.35)] bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))]',
    (!props.tone || props.tone === 'muted') &&
      'border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.52)] text-[hsl(var(--muted-foreground))]',
    props.class,
  ),
)
</script>

<template>
  <span :class="classes">
    <slot />
  </span>
</template>
