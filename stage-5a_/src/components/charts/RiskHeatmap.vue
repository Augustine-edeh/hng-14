<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { HeatmapChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, VisualMapComponent } from 'echarts/components'
import type { EChartsOption } from 'echarts'
import type { Flight } from '../../models/aviation'

use([CanvasRenderer, HeatmapChart, GridComponent, TooltipComponent, VisualMapComponent])

const props = defineProps<{
  flights: Flight[]
}>()

const axes = ['Weather', 'Fleet', 'Crew', 'Ground', 'Security']

const option = computed<EChartsOption>(() => {
  const topFlights = props.flights.slice(0, 8)
  const data = topFlights.flatMap((flight, flightIndex) =>
    axes.map((_, axisIndex) => [axisIndex, flightIndex, Math.round(Math.max(0, flight.risk + (axisIndex - 2) * 6))]),
  )

  return {
    animationDuration: 360,
    backgroundColor: 'transparent',
    grid: { top: 18, right: 12, bottom: 32, left: 66 },
    tooltip: { confine: true },
    xAxis: {
      type: 'category',
      data: axes,
      axisLabel: { color: 'rgba(148, 163, 184, 0.86)' },
      splitArea: { show: true },
    },
    yAxis: {
      type: 'category',
      data: topFlights.map((flight) => flight.id),
      axisLabel: { color: 'rgba(148, 163, 184, 0.86)' },
      splitArea: { show: true },
    },
    visualMap: {
      min: 0,
      max: 100,
      show: false,
      inRange: { color: ['#0f766e', '#eab308', '#ef4444'] },
    },
    series: [{ type: 'heatmap', data, label: { show: false }, emphasis: { itemStyle: { borderColor: '#fff' } } }],
  }
})
</script>

<template>
  <VChart class="h-[250px] w-full" :option="option" autoresize />
</template>
