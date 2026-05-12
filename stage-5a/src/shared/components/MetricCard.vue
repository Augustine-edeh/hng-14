<template>
  <div class="metric-card">
    <div class="flex items-start justify-between mb-2">
      <div class="flex items-center gap-2">
        <div class="text-2xl">{{ icon }}</div>
        <h3 class="text-sm font-medium text-slate-400">{{ label }}</h3>
      </div>
      <div v-if="trend" :class="['text-sm font-semibold', trendColor]">
        {{ trend }}
      </div>
    </div>

    <div class="flex items-baseline gap-2 mb-1">
      <div class="text-3xl font-bold text-cyan-400">{{ formattedValue }}</div>
      <div v-if="unit" class="text-sm text-slate-500">{{ unit }}</div>
    </div>

    <div v-if="subtitle" class="text-xs text-slate-500">{{ subtitle }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  label: string;
  value: number | string;
  icon?: string;
  unit?: string;
  subtitle?: string;
  trend?: string;
  trendUp?: boolean;
  formatter?: (val: number) => string;
}

const props = withDefaults(defineProps<Props>(), {
  icon: "📊",
  formatter: (val: number) => String(val),
});

const formattedValue = computed(() => {
  const val =
    typeof props.value === "number"
      ? props.value
      : parseFloat(String(props.value));
  return props.formatter(val as number);
});

const trendColor = computed(() => {
  if (!props.trend) return "";
  return props.trendUp ? "text-green-400" : "text-red-400";
});
</script>

<style scoped>
.metric-card {
  @apply glass-panel transition-all duration-300;
}

.metric-card:hover {
  @apply border-cyan-500/50 bg-white/10;
}
</style>
