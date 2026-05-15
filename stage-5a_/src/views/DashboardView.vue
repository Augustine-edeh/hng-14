<script setup lang="ts">
import { computed, onMounted, onUnmounted } from "vue";
import {
  Activity,
  Gauge,
  PlaneTakeoff,
  RadioTower,
  ShieldCheck,
  Users,
  AlertTriangle,
  CloudLightning,
  Fuel,
  Wrench,
} from "lucide-vue-next";
import { useOpsStore } from "@/stores/opsStore";
import AppBadge from "@/components/ui/AppBadge.vue";
import AppButton from "@/components/ui/AppButton.vue";
import AppCard from "@/components/ui/AppCard.vue";
import ActivityFeed from "@/components/dashboard/ActivityFeed.vue";
import AviationRadar from "@/components/dashboard/AviationRadar.vue";
import BarLoadChart from "@/components/charts/BarLoadChart.vue";
import DashboardControls from "@/components/dashboard/DashboardControls.vue";
import FlightTable from "@/components/dashboard/FlightTable.vue";
import IntelligencePanel from "@/components/dashboard/IntelligencePanel.vue";
import MetricCard from "@/components/dashboard/MetricCard.vue";
import OperationsDetailPanels from "@/components/dashboard/OperationsDetailPanels.vue";
import RealtimeChart from "@/components/charts/RealtimeChart.vue";
import RiskHeatmap from "@/components/charts/RiskHeatmap.vue";
import TopNavigation from "@/components/dashboard/TopNavigation.vue";
import { formatTime } from "@/lib/utils";

const store = useOpsStore();

const datasetToggles = [
  { key: "onTimeRate", label: "On-time" },
  { key: "fuelEfficiency", label: "Fuel" },
  { key: "maintenanceRisk", label: "Maintenance" },
  { key: "passengerLoad", label: "Load" },
] as const;

const metricCards = computed(() => [
  {
    label: "Airborne Fleet",
    value: store.metrics.airborne,
    detail: `${store.metrics.activeFlights} flights tracked`,
    trend: 4.8,
    icon: PlaneTakeoff,
  },
  {
    label: "Delayed Flights",
    value: store.metrics.delayedFlights,
    detail: "Minor and major disruptions",
    trend: -1.4,
    inverse: true,
    icon: AlertTriangle,
  },
  {
    label: "On-time Performance",
    value: `${store.metrics.onTimeRate.toFixed(1)}%`,
    detail: `${store.metrics.delayMinutes.toFixed(1)} min avg delay`,
    trend: 2.2,
    icon: Gauge,
  },
  {
    label: "Weather Risk",
    value: `${store.metrics.weatherRisk.toFixed(0)}%`,
    detail: "Airport weather pressure",
    trend: 3.3,
    inverse: true,
    icon: CloudLightning,
  },
  {
    label: "Safety Score",
    value: `${store.metrics.safetyScore.toFixed(1)}%`,
    detail: `${store.metrics.criticalEvents} critical retained`,
    trend: 1.1,
    icon: ShieldCheck,
  },
  {
    label: "Active Alerts",
    value: store.metrics.activeAlerts,
    detail: "Non-normal events retained",
    trend: -2.1,
    inverse: true,
    icon: RadioTower,
  },
  {
    label: "Passenger Load",
    value: `${store.metrics.avgPassengerLoad.toFixed(1)}%`,
    detail: "Rolling cabin utilization",
    trend: -0.6,
    icon: Users,
  },
  {
    label: "Fuel Efficiency",
    value: `${store.metrics.fuelEfficiency.toFixed(1)}%`,
    detail: "Fleet fuel performance",
    trend: 1.7,
    icon: Fuel,
  },
  {
    label: "Maintenance Watch",
    value: store.metrics.aircraftInMaintenance,
    detail: "Aircraft with active notes",
    trend: -0.8,
    inverse: true,
    icon: Wrench,
  },
]);

const inspectedDetails = computed(() => {
  const point = store.inspectedPoint;
  if (!point) return null;
  return [
    ["Time", formatTime(point.timestamp)],
    ["Region", point.region],
    ["Airborne", point.airborne.toString()],
    ["Network latency", `${point.networkLatency.toFixed(0)} ms`],
    ["Baggage throughput", point.baggageThroughput.toLocaleString()],
  ];
});

onMounted(() => {
  store.start();
});

onUnmounted(() => {
  store.stop();
});
</script>

<template>
  <TopNavigation
    :status="store.health.status"
    :alerts="store.metrics.activeAlerts"
    @quick-action="store.openMetric('Command center')"
    @notifications="store.openMetric('Notification center')"
  />

  <main
    class="mx-auto flex w-full max-w-[1800px] flex-col gap-4 px-3 py-4 sm:px-5 lg:px-6"
  >
    <header
      class="grid gap-4 rounded-xl border border-[hsl(var(--border)/0.72)] bg-[linear-gradient(135deg,hsl(var(--card)/0.86),hsl(var(--background)/0.54))] p-4 shadow-2xl shadow-black/10 lg:grid-cols-[1fr_auto] lg:items-end lg:p-6"
    >
      <div>
        <div class="flex flex-wrap items-center gap-2">
          <AppBadge tone="info">
            <RadioTower class="h-3.5 w-3.5" />
            AeroPulse Network
          </AppBadge>
          <AppBadge
            :tone="
              store.health.status === 'live'
                ? 'normal'
                : store.health.status === 'paused'
                  ? 'muted'
                  : 'warning'
            "
          >
            {{ store.health.status }}
          </AppBadge>
        </div>
        <h1
          class="mt-3 text-3xl font-semibold tracking-normal sm:text-4xl lg:text-5xl"
        >
          AeroPulse Ops
        </h1>
        <p
          class="mt-2 max-w-3xl text-sm leading-6 text-[hsl(var(--muted-foreground))] sm:text-base"
        >
          Real-time aviation operations intelligence for live flights, fleet
          health, delays, weather disruption, and airline command workflows.
        </p>
      </div>

      <div class="flex items-center gap-2 lg:justify-end">
        <AppButton variant="secondary" @click="store.openChart">
          <Gauge class="h-4 w-4" />
          Fullscreen Analytics
        </AppButton>
        <AppButton variant="secondary" @click="store.inspectPoint(null)">
          <Activity class="h-4 w-4" />
          Clear Inspect
        </AppButton>
      </div>
    </header>

    <DashboardControls
      v-model:region="store.selectedRegion"
      v-model:severity="store.selectedSeverity"
      v-model:time-range="store.timeRange"
      v-model:chart-mode="store.chartMode"
      v-model:query="store.query"
      :status="store.health.status"
      :is-paused="store.isPaused"
      @toggle="store.toggleStreaming"
    />

    <div
      v-if="store.health.error"
      class="rounded-lg border border-amber-400/35 bg-amber-500/12 px-4 py-3 text-sm text-amber-200"
    >
      {{ store.health.error }} Reconnect attempts:
      {{ store.health.reconnectAttempts }}.
    </div>

    <section class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        v-for="card in metricCards"
        :key="card.label"
        :label="card.label"
        :value="card.value"
        :detail="card.detail"
        :trend="card.trend"
        :inverse="card.inverse"
        :icon="card.icon"
        @open="store.openMetric(card.label)"
      />
    </section>

    <section
      class="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(400px,0.8fr)]"
    >
      <AppCard>
        <div
          class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h2 class="text-lg font-semibold">Network Performance Stream</h2>
            <p class="text-sm text-[hsl(var(--muted-foreground))]">
              Line and area visualization with bounded live datasets
            </p>
          </div>
          <div class="flex flex-wrap gap-2">
            <label
              v-for="item in datasetToggles"
              :key="item.key"
              class="inline-flex min-h-9 items-center gap-2 rounded-md border border-[hsl(var(--border))] px-3 text-sm"
            >
              <input
                type="checkbox"
                :checked="store.enabledDatasets[item.key]"
                class="accent-[hsl(var(--primary))]"
                @change="
                  store.setDataset(
                    item.key,
                    ($event.target as HTMLInputElement).checked,
                  )
                "
              />
              {{ item.label }}
            </label>
          </div>
        </div>
        <RealtimeChart
          :points="store.filteredPoints"
          :mode="store.chartMode"
          :enabled="store.enabledDatasets"
          @inspect="
            (point) => {
              store.inspectPoint(point);
              store.openChart();
            }
          "
        />
      </AppCard>

      <div class="grid gap-4">
        <AviationRadar
          :flights="store.filteredFlights"
          :airports="store.airports"
          @open-flight="store.openFlight"
          @open-map="store.openMap"
        />
        <IntelligencePanel
          :latest="store.latestPoint"
          :flights="store.filteredFlights"
        />
        <AppCard>
          <h2 class="text-base font-semibold">Inspected Data Point</h2>
          <div v-if="inspectedDetails" class="mt-3 grid gap-2">
            <div
              v-for="[label, value] in inspectedDetails"
              :key="label"
              class="flex items-center justify-between gap-4 text-sm"
            >
              <span class="text-[hsl(var(--muted-foreground))]">{{
                label
              }}</span>
              <span class="font-medium">{{ value }}</span>
            </div>
          </div>
          <p
            v-else
            class="mt-3 text-sm leading-6 text-[hsl(var(--muted-foreground))]"
          >
            Select a chart point to inspect the validated payload at that
            moment.
          </p>
        </AppCard>
      </div>
    </section>

    <section class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <AppCard>
        <h2 class="text-base font-semibold">Regional Load & Risk</h2>
        <BarLoadChart :rows="store.regionSummary" />
      </AppCard>
      <AppCard>
        <h2 class="text-base font-semibold">Operational Risk Heatmap</h2>
        <RiskHeatmap :flights="store.filteredFlights" />
      </AppCard>
    </section>

    <section
      class="grid gap-4 2xl:grid-cols-[minmax(0,1.25fr)_minmax(420px,0.75fr)]"
    >
      <FlightTable :flights="store.filteredFlights" @open="store.openFlight" />
      <ActivityFeed :events="store.filteredEvents" @open="store.openEvent" />
    </section>

    <OperationsDetailPanels
      :panel="store.activePanel"
      :metric="store.activeMetric"
      :flight="store.selectedFlight"
      :event="store.selectedEvent"
      :points="store.filteredPoints"
      :flights="store.filteredFlights"
      :airports="store.airports"
      :chart-mode="store.chartMode"
      :enabled="store.enabledDatasets"
      :region-rows="store.regionSummary"
      @close="store.closePanel"
      @inspect="store.inspectPoint"
    />
  </main>
</template>
