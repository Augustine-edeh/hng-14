<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import type { EChartsOption } from 'echarts'

use([CanvasRenderer, BarChart, GridComponent, TooltipComponent])

const props = defineProps<{
  rows: Array<{ region: string; flights: number; risk: number }>
}>()

const option = computed<EChartsOption>(() => ({
  animationDuration: 420,
  backgroundColor: 'transparent',
  grid: { top: 16, right: 18, bottom: 48, left: 34 },
  tooltip: {
    trigger: 'axis',
    confine: true,
    backgroundColor: 'rgba(8, 15, 28, 0.94)',
    borderColor: 'rgba(148, 163, 184, 0.28)',
    textStyle: { color: '#f8fafc' },
  },
  xAxis: {
    type: 'category',
    data: props.rows.map((row) => row.region.replace(' ', '\n')),
    axisLabel: { color: 'rgba(148, 163, 184, 0.88)', interval: 0 },
    axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.24)' } },
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.13)' } },
    axisLabel: { color: 'rgba(148, 163, 184, 0.86)' },
  },
  series: [
    {
      name: 'Flights',
      type: 'bar',
      data: props.rows.map((row) => row.flights),
      itemStyle: { color: '#22d3ee', borderRadius: [4, 4, 0, 0] },
      barWidth: '42%',
    },
    {
      name: 'Risk',
      type: 'bar',
      data: props.rows.map((row) => Number(row.risk.toFixed(1))),
      itemStyle: { color: '#f97316', borderRadius: [4, 4, 0, 0] },
      barWidth: '42%',
    },
  ],
}))
</script>

<template>
  <VChart class="h-[260px] w-full" :option="option" autoresize />
</template>
