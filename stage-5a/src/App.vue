<template>
  <div
    class="aero-pulse-app min-h-screen bg-gradient-to-br from-aviation-darker via-aviation-dark to-slate-900 bg-grid overflow-hidden"
  >
    <!-- Header -->
    <header
      class="border-b border-slate-700/30 bg-gradient-to-r from-slate-900/50 to-slate-800/30 backdrop-blur-md sticky top-0 z-40"
    >
      <div class="container-responsive py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="text-2xl">✈️</div>
          <div>
            <h1
              class="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
            >
              AeroPulse Ops
            </h1>
            <p class="text-xs text-slate-400">
              Real-Time Aviation Operations Control
            </p>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <!-- Time Range Selector -->
          <div class="flex items-center gap-2">
            <span class="text-xs text-slate-400">Time Range:</span>
            <select
              v-model="uiStore.selectedTimeRange"
              class="input-field text-sm py-1"
            >
              <option value="1m">Last 1 min</option>
              <option value="5m">Last 5 mins</option>
              <option value="15m">Last 15 mins</option>
              <option value="1h">Last 1 hour</option>
              <option value="realtime">Real-Time</option>
            </select>
          </div>

          <!-- Control Buttons -->
          <button
            v-if="!streaming.isConnected"
            @click="startStreaming"
            class="btn-primary"
          >
            ▶ Start
          </button>
          <button v-else @click="stopStreaming" class="btn-secondary">
            ⏹ Stop
          </button>

          <button
            v-if="streaming.isConnected"
            @click="streaming.isPaused ? streaming.resume() : streaming.pause()"
            class="btn-secondary"
          >
            {{ streaming.isPaused ? "▶ Resume" : "⏸ Pause" }}
          </button>

          <div
            class="text-sm"
            :class="streaming.isConnected ? 'text-green-400' : 'text-slate-400'"
          >
            {{ streaming.isConnected ? "● Live" : "○ Offline" }}
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container-responsive py-6 space-y-6">
      <!-- Metrics Section -->
      <section class="metrics-section">
        <h2 class="text-xl font-bold text-slate-200 mb-4">Dashboard Metrics</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Active Flights"
            :value="flightStore.statistics.total"
            icon="✈️"
            :trend="`+${Math.floor(Math.random() * 5)}`"
            :trend-up="true"
          />
          <MetricCard
            label="Delayed Flights"
            :value="flightStore.statistics.delayed"
            icon="⏱️"
            :trend="`${Math.floor(Math.random() * 10) - 5}%`"
            :trend-up="flightStore.statistics.delayed < 5"
          />
          <MetricCard
            label="Fleet Health"
            :value="metricsStore.currentMetrics.fleetHealthScore"
            unit="%"
            icon="💪"
            :trend="`+${Math.floor(Math.random() * 3)}`"
            :trend-up="true"
          />
          <MetricCard
            label="Avg Arrival Delay"
            :value="metricsStore.currentMetrics.avgArrivalDelay"
            unit="min"
            icon="⏳"
            :trend="`${Math.floor(Math.random() * 5)}`"
            :trend-up="metricsStore.currentMetrics.avgArrivalDelay < 10"
          />
        </div>
      </section>

      <!-- Charts Section -->
      <section class="charts-section space-y-4">
        <h2 class="text-xl font-bold text-slate-200">Real-Time Analytics</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <!-- Altitude Trend Chart -->
          <Chart
            title="Altitude Trend"
            :option="altitudeTrendChart"
            height="250px"
            @fullscreen="uiStore.toggleFullscreenChart('altitude')"
          />

          <!-- Fleet Health Chart -->
          <Chart
            title="Fleet Health Score"
            :option="fleetHealthChart"
            height="250px"
            @fullscreen="uiStore.toggleFullscreenChart('health')"
          />
        </div>
      </section>

      <!-- Flight Operations Section -->
      <section class="operations-section">
        <h2 class="text-xl font-bold text-slate-200 mb-4">Flight Operations</h2>
        <FlightTable
          :flights="flightStore.sortedFlights"
          @select="uiStore.selectFlight"
        />
      </section>

      <!-- Activity Feed Section -->
      <section class="activity-section">
        <h2 class="text-xl font-bold text-slate-200 mb-4">Live Activity</h2>
        <ActivityFeed :events="activityStore.recentEvents" :max-items="15" />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, computed } from "vue";
import * as echarts from "echarts";
import { useFlightStore } from "./stores/flightStore";
import { useMetricsStore } from "./stores/metricsStore";
import { useActivityStore } from "./stores/activityStore";
import { useUIStore } from "./stores/uiStore";
import { useStreamingData } from "./shared/composables";
import MetricCard from "./shared/components/MetricCard.vue";
import Chart from "./shared/components/Chart.vue";
import FlightTable from "./shared/components/FlightTable.vue";
import ActivityFeed from "./shared/components/ActivityFeed.vue";

// Store instances
const flightStore = useFlightStore();
const metricsStore = useMetricsStore();
const activityStore = useActivityStore();
const uiStore = useUIStore();

// Streaming composable
const streaming = useStreamingData();

// Chart configurations
const altitudeTrendChart = computed(() => ({
  animation: false,
  tooltip: {
    trigger: "axis",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderColor: "#06b6d4",
  },
  grid: {
    left: "60px",
    right: "20px",
    top: "20px",
    bottom: "40px",
    containLabel: true,
  },
  xAxis: {
    type: "time",
    boundaryGap: false,
    axisLine: { lineStyle: { color: "#475569" } },
    axisLabel: { color: "#94a3b8" },
  },
  yAxis: {
    type: "value",
    name: "Altitude (ft)",
    axisLine: { lineStyle: { color: "#475569" } },
    axisLabel: { color: "#94a3b8", formatter: "{value}" },
  },
  series: [
    {
      name: "Altitude",
      type: "line",
      smooth: true,
      data: flightStore.sortedFlights
        .slice(0, 5)
        .map((f, i) => [Date.now() - (5 - i) * 1000, f.altitude]),
      lineStyle: { color: "#06b6d4", width: 2 },
      areaStyle: { color: "rgba(6, 182, 212, 0.1)" },
      itemStyle: { color: "#06b6d4" },
    },
  ],
}));

const fleetHealthChart = computed(() => ({
  animation: false,
  tooltip: {
    trigger: "item",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderColor: "#06b6d4",
  },
  grid: {
    left: "60px",
    right: "20px",
    top: "20px",
    bottom: "40px",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    data: ["Health", "Efficiency", "Safety", "Capacity"],
    axisLine: { lineStyle: { color: "#475569" } },
    axisLabel: { color: "#94a3b8" },
  },
  yAxis: {
    type: "value",
    axisLine: { lineStyle: { color: "#475569" } },
    axisLabel: { color: "#94a3b8" },
  },
  series: [
    {
      data: [
        metricsStore.currentMetrics.fleetHealthScore,
        metricsStore.currentMetrics.avgFuelEfficiency,
        85 + Math.random() * 15,
        70 + Math.random() * 25,
      ],
      type: "bar",
      itemStyle: {
        color: "#06b6d4",
      },
    },
  ],
}));

// Start streaming on mount
onMounted(() => {
  streaming.start(20);
});

// Cleanup on unmount
onUnmounted(() => {
  streaming.stop();
});

// Control functions
const startStreaming = () => {
  streaming.start(20);
};

const stopStreaming = () => {
  streaming.stop();
};
</script>

<style scoped>
.aero-pulse-app {
  min-height: 100vh;
}

.metrics-section,
.charts-section,
.operations-section,
.activity-section {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
