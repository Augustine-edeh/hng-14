import { defineStore } from "pinia";
import { ref } from "vue";
import type { TimeRange } from "../shared/types";

export const useUIStore = defineStore("ui", () => {
  const isStreamingActive = ref(false);
  const isStreamingPaused = ref(false);
  const selectedTimeRange = ref<TimeRange>("realtime");
  const selectedFlight = ref<string | null>(null);
  const selectedAlert = ref<string | null>(null);
  const sidebarOpen = ref(true);
  const fullscreenChart = ref<string | null>(null);

  // Control panel state
  const showCharts = ref(true);
  const showActivityFeed = ref(true);
  const showAviationMap = ref(true);

  // Chart visibility toggles
  const visibleCharts = ref({
    altitudeTrend: true,
    delaysByAirport: true,
    fleetHealth: true,
    fuelEfficiency: true,
  });

  // Toggle streaming
  const toggleStreaming = () => {
    isStreamingActive.value = !isStreamingActive.value;
  };

  const setStreaming = (active: boolean) => {
    isStreamingActive.value = active;
  };

  // Toggle pause
  const togglePause = () => {
    isStreamingPaused.value = !isStreamingPaused.value;
  };

  const setPause = (paused: boolean) => {
    isStreamingPaused.value = paused;
  };

  // Update time range
  const setTimeRange = (range: TimeRange) => {
    selectedTimeRange.value = range;
  };

  // Flight selection
  const selectFlight = (flightId: string | null) => {
    selectedFlight.value = flightId;
  };

  // Alert selection
  const selectAlert = (alertId: string | null) => {
    selectedAlert.value = alertId;
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value;
  };

  // Toggle fullscreen for chart
  const toggleFullscreenChart = (chartId: string | null) => {
    fullscreenChart.value = fullscreenChart.value === chartId ? null : chartId;
  };

  // Toggle visibility of major sections
  const toggleChartsSection = () => {
    showCharts.value = !showCharts.value;
  };

  const toggleActivityFeedSection = () => {
    showActivityFeed.value = !showActivityFeed.value;
  };

  const toggleAviationMapSection = () => {
    showAviationMap.value = !showAviationMap.value;
  };

  // Toggle individual chart visibility
  const toggleChartVisibility = (chartKey: string) => {
    if (chartKey in visibleCharts.value) {
      visibleCharts.value[chartKey as keyof typeof visibleCharts.value] =
        !visibleCharts.value[chartKey as keyof typeof visibleCharts.value];
    }
  };

  // Reset UI state
  const resetUI = () => {
    selectedFlight.value = null;
    selectedAlert.value = null;
    fullscreenChart.value = null;
  };

  return {
    isStreamingActive,
    isStreamingPaused,
    selectedTimeRange,
    selectedFlight,
    selectedAlert,
    sidebarOpen,
    fullscreenChart,
    showCharts,
    showActivityFeed,
    showAviationMap,
    visibleCharts,
    toggleStreaming,
    setStreaming,
    togglePause,
    setPause,
    setTimeRange,
    selectFlight,
    selectAlert,
    toggleSidebar,
    toggleFullscreenChart,
    toggleChartsSection,
    toggleActivityFeedSection,
    toggleAviationMapSection,
    toggleChartVisibility,
    resetUI,
  };
});
