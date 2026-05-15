import { defineStore } from "pinia";
import { ref } from "vue";
import type { DashboardMetrics, ChartDataPoint } from "../shared/types";
import { MAX_DATA_POINTS, DEFAULT_METRICS } from "../shared/constants";

export const useMetricsStore = defineStore("metrics", () => {
  const currentMetrics = ref<DashboardMetrics>({ ...DEFAULT_METRICS });

  // Historical data for charts (keyed by metric name)
  const historicalData = ref<Record<string, ChartDataPoint[]>>({
    activeFlights: [],
    delayedFlights: [],
    fleetHealthScore: [],
    avgFuelEfficiency: [],
    avgArrivalDelay: [],
  });

  // Update current metrics
  const updateMetrics = (metrics: DashboardMetrics) => {
    currentMetrics.value = metrics;

    // Add to historical data
    const timestamp = Date.now();
    Object.keys(metrics).forEach((key) => {
      if (key in historicalData.value) {
        const value = metrics[key as keyof DashboardMetrics];
        if (typeof value === "number") {
          historicalData.value[key].push({
            timestamp,
            value: value as number,
            label: new Date(timestamp).toLocaleTimeString(),
          });

          // Keep only last N data points for memory efficiency
          const maxPoints = MAX_DATA_POINTS["realtime"] || 300;
          if (historicalData.value[key].length > maxPoints) {
            historicalData.value[key] =
              historicalData.value[key].slice(-maxPoints);
          }
        }
      }
    });
  };

  // Get chart data for a specific metric
  const getMetricHistory = (metricName: string) => {
    return historicalData.value[metricName] || [];
  };

  // Get all metrics history
  const getAllHistory = () => historicalData.value;

  // Reset metrics
  const resetMetrics = () => {
    currentMetrics.value = { ...DEFAULT_METRICS };
    Object.keys(historicalData.value).forEach((key) => {
      historicalData.value[key] = [];
    });
  };

  // Clear historical data older than time period
  const clearOldData = (maxAgeMs: number) => {
    const cutoffTime = Date.now() - maxAgeMs;
    Object.keys(historicalData.value).forEach((key) => {
      historicalData.value[key] = historicalData.value[key].filter(
        (point) => point.timestamp > cutoffTime,
      );
    });
  };

  return {
    currentMetrics,
    historicalData,
    updateMetrics,
    getMetricHistory,
    getAllHistory,
    resetMetrics,
    clearOldData,
  };
});
