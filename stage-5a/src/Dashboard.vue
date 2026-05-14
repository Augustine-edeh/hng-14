<template>
  <div class="min-h-screen bg-dark-bg transition-colors duration-300">
    <!-- Header -->
    <header
      class="sticky top-0 z-50 border-b border-dark-border bg-dark-surface/80 backdrop-blur-xl"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center"
            >
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8m0 8l-9-2m9 2l9-2m-9-8l9 2m-9-2l-9 2"
                />
              </svg>
            </div>
            <div>
              <h1 class="text-lg font-bold text-text-base">AeroPulse Ops</h1>
              <p class="text-xs text-text-tertiary">Aviation Operations</p>
            </div>
          </div>

          <!-- Center Controls -->
          <div class="hidden md:flex items-center gap-4">
            <div class="flex items-center gap-2 bg-dark-surface rounded-lg p-1">
              <button
                v-if="!streaming.isConnected"
                @click="startStreaming"
                class="px-3 py-1.5 rounded text-sm font-medium transition-colors hover:bg-dark-surface-hover text-text-secondary hover:text-brand-primary"
              >
                ▶ Start
              </button>
              <button
                v-else
                @click="stopStreaming"
                class="px-3 py-1.5 rounded text-sm font-medium transition-colors hover:bg-dark-surface-hover text-text-secondary hover:text-brand-primary"
              >
                ⏹ Stop
              </button>

              <button
                v-if="streaming.isConnected"
                @click="
                  streaming.isPaused ? streaming.resume() : streaming.pause()
                "
                class="px-3 py-1.5 rounded text-sm font-medium transition-colors hover:bg-dark-surface-hover text-text-secondary hover:text-brand-primary"
              >
                {{ streaming.isPaused ? "▶" : "⏸" }}
              </button>
            </div>

            <!-- Status Indicator -->
            <div class="flex items-center gap-2">
              <div
                class="w-2 h-2 rounded-full"
                :class="
                  streaming.isConnected
                    ? 'bg-success animate-pulse'
                    : 'bg-text-tertiary'
                "
              />
              <span class="text-xs font-medium text-text-secondary">
                {{ streaming.isConnected ? "Live" : "Offline" }}
              </span>
            </div>
          </div>

          <!-- Right Section -->
          <div class="flex items-center gap-4">
            <!-- Theme Toggle -->
            <button
              @click="themeStore.toggleTheme"
              class="p-2 rounded-lg hover:bg-dark-surface transition-colors text-text-secondary hover:text-text-base"
              :title="`Switch to ${themeStore.resolvedTheme === 'dark' ? 'light' : 'dark'} mode`"
            >
              <svg
                v-if="themeStore.resolvedTheme === 'dark'"
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 3v1m0 16v1m9-9h-1m-16 0H1m15.364 1.636l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <svg
                v-else
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            </button>

            <!-- User Menu (Placeholder) -->
            <button
              class="p-2 rounded-lg hover:bg-dark-surface transition-colors text-text-secondary hover:text-text-base"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Hero Section -->
      <div class="mb-12">
        <h2 class="text-3xl font-bold text-text-base mb-2">Dashboard</h2>
        <p class="text-text-secondary">
          Real-time monitoring of your aviation operations
        </p>
      </div>

      <!-- Metrics Grid -->
      <section class="mb-12">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

      <!-- Analytics Section -->
      <section class="mb-12">
        <h3 class="text-lg font-semibold text-text-base mb-6">
          Real-Time Analytics
        </h3>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Chart
            title="Altitude Trend"
            :option="altitudeTrendChart"
            height="300px"
            @fullscreen="uiStore.toggleFullscreenChart('altitude')"
          />

          <Chart
            title="Fleet Health Score"
            :option="fleetHealthChart"
            height="300px"
            @fullscreen="uiStore.toggleFullscreenChart('health')"
          />
        </div>
      </section>

      <!-- Operations Section -->
      <section class="mb-12">
        <h3 class="text-lg font-semibold text-text-base mb-6">
          Flight Operations
        </h3>
        <FlightTable
          :flights="flightStore.sortedFlights"
          @select="uiStore.selectFlight"
        />
      </section>

      <!-- Activity Feed Section -->
      <section class="mb-12">
        <h3 class="text-lg font-semibold text-text-base mb-6">Live Activity</h3>
        <ActivityFeed :events="activityStore.recentEvents" :max-items="15" />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, computed } from "vue";
import { useFlightStore } from "./stores/flightStore";
import { useMetricsStore } from "./stores/metricsStore";
import { useActivityStore } from "./stores/activityStore";
import { useUIStore } from "./stores/uiStore";
import { useThemeStore } from "./stores/themeStore";
import { useStreamingData } from "./shared/composables";
import MetricCard from "./shared/components/MetricCard.vue";
import Chart from "./shared/components/Chart.vue";
import FlightTable from "./shared/components/FlightTable.vue";
import ActivityFeed from "./shared/components/ActivityFeed.vue";

// Stores
const flightStore = useFlightStore();
const metricsStore = useMetricsStore();
const activityStore = useActivityStore();
const uiStore = useUIStore();
const themeStore = useThemeStore();

// Streaming
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

// Streaming lifecycle
onMounted(() => {
  streaming.start(20);
});

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
