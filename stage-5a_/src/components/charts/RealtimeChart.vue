<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart } from 'echarts/charts'
import {
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components'
import type { EChartsOption } from 'echarts'
import type { ChartMode, OpsPoint } from '../../models/aviation'
import { formatTime } from '../../lib/utils'

use([CanvasRenderer, LineChart, BarChart, GridComponent, TooltipComponent, LegendComponent, DataZoomComponent, VisualMapComponent])

const props = defineProps<{
  points: OpsPoint[]
  mode: ChartMode
  enabled: Record<'onTimeRate' | 'fuelEfficiency' | 'maintenanceRisk' | 'passengerLoad', boolean>
}>()

const emit = defineEmits<{
  inspect: [point: OpsPoint | null]
}>()

const palette = {
  onTimeRate: '#22d3ee',
  fuelEfficiency: '#34d399',
  maintenanceRisk: '#f97316',
  passengerLoad: '#a78bfa',
}

const labels: Record<keyof typeof palette, string> = {
  onTimeRate: 'On-time rate',
  fuelEfficiency: 'Fuel efficiency',
  maintenanceRisk: 'Maintenance risk',
  passengerLoad: 'Passenger load',
}

const option = computed<EChartsOption>(() => {
  const categories = props.points.map((point) => formatTime(point.timestamp))
  const keys = (Object.keys(palette) as Array<keyof typeof palette>).filter((key) => props.enabled[key])

  return {
    animationDuration: 450,
    animationEasing: 'cubicOut',
    backgroundColor: 'transparent',
    color: keys.map((key) => palette[key]),
    grid: { top: 38, right: 18, bottom: 42, left: 42 },
    legend: {
      top: 0,
      textStyle: { color: 'hsl(215 15% 69%)' },
      itemWidth: 12,
      itemHeight: 8,
    },
    tooltip: {
      trigger: 'axis',
      confine: true,
      backgroundColor: 'rgba(8, 15, 28, 0.94)',
      borderColor: 'rgba(148, 163, 184, 0.28)',
      textStyle: { color: '#f8fafc' },
    },
    xAxis: {
      type: 'category',
      boundaryGap: props.mode !== 'line',
      data: categories,
      axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.26)' } },
      axisLabel: { color: 'rgba(148, 163, 184, 0.86)', hideOverlap: true },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.13)' } },
      axisLabel: { color: 'rgba(148, 163, 184, 0.86)' },
    },
    dataZoom: [{ type: 'inside', throttle: 80 }],
    series: keys.map((key) => ({
      name: labels[key],
      type: 'line',
      smooth: true,
      showSymbol: false,
      symbolSize: 8,
      sampling: 'lttb',
      emphasis: { focus: 'series' },
      areaStyle: props.mode === 'area' ? { opacity: key === 'maintenanceRisk' ? 0.12 : 0.16 } : undefined,
      lineStyle: { width: key === 'maintenanceRisk' ? 2 : 2.4 },
      data: props.points.map((point) => Number(point[key].toFixed(1))),
    })),
  }
})

function handleChartClick(params: { dataIndex?: number }) {
  const point = typeof params.dataIndex === 'number' ? props.points[params.dataIndex] : null
  emit('inspect', point ?? null)
}
</script>

<template>
  <VChart class="h-[320px] min-h-[280px] w-full" :option="option" autoresize @click="handleChartClick" />
</template>
