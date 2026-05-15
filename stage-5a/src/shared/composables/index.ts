import { ref, computed, onMounted, onUnmounted } from "vue";
import { useFlightStore } from "../../stores/flightStore";
import { useAlertStore } from "../../stores/alertStore";
import { useMetricsStore } from "../../stores/metricsStore";
import { useActivityStore } from "../../stores/activityStore";
import { streamingService } from "../services/streaming";
import type { Flight, OperationalAlert } from "../types";

/**
 * Composable for managing real-time streaming data
 */
export function useStreamingData() {
  const flightStore = useFlightStore();
  const alertStore = useAlertStore();
  const metricsStore = useMetricsStore();
  const activityStore = useActivityStore();

  const isConnected = ref(false);
  const isPaused = ref(false);
  const unsubscribe = ref<(() => void) | null>(null);

  /**
   * Handle incoming stream messages
   */
  const handleStreamMessage = (message: any) => {
    try {
      if (message.type === "flight") {
        const flight = message.data as Flight;
        flightStore.upsertFlight(flight);
      } else if (message.type === "alert") {
        const alert = message.data as OperationalAlert;
        alertStore.upsertAlert(alert);

        // Also add to activity feed
        activityStore.addEvent({
          id: alert.id,
          type: "alert",
          title: `Alert: ${alert.type}`,
          description: alert.message,
          severity: alert.severity,
          timestamp: alert.timestamp,
        });
      } else if (message.type === "metric") {
        metricsStore.updateMetrics(message.data);
      }
    } catch (error) {
      console.error("Error handling stream message:", error);
    }
  };

  /**
   * Start consuming streaming data
   */
  const start = (flightCount: number = 20) => {
    if (isConnected.value) return;

    streamingService.startStreaming(flightCount);
    unsubscribe.value = streamingService.subscribe(handleStreamMessage);
    isConnected.value = true;
  };

  /**
   * Stop consuming streaming data
   */
  const stop = () => {
    if (unsubscribe.value) {
      unsubscribe.value();
      unsubscribe.value = null;
    }
    streamingService.stopStreaming();
    isConnected.value = false;
  };

  /**
   * Pause streaming
   */
  const pause = () => {
    streamingService.pause();
    isPaused.value = true;
  };

  /**
   * Resume streaming
   */
  const resume = () => {
    streamingService.resume();
    isPaused.value = false;
  };

  /**
   * Cleanup on unmount
   */
  onUnmounted(() => {
    stop();
  });

  return {
    isConnected,
    isPaused,
    start,
    stop,
    pause,
    resume,
  };
}

/**
 * Composable for chart data transformation
 */
export function useChartData() {
  const metricsStore = useMetricsStore();

  /**
   * Get line chart data for metric
   */
  const getLineChartData = (metricName: string) => {
    const history = metricsStore.getMetricHistory(metricName);

    return {
      xAxis: {
        type: "time",
        data: history.map((p: any) => p.timestamp),
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: history.map((p: any) => p.value),
          type: "line",
          smooth: true,
          areaStyle: {
            color: "rgba(6, 182, 212, 0.1)",
          },
        },
      ],
    };
  };

  /**
   * Get bar chart data for metric
   */
  const getBarChartData = (labels: string[], values: number[]) => {
    return {
      xAxis: {
        type: "category",
        data: labels,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: values,
          type: "bar",
        },
      ],
    };
  };

  /**
   * Get area chart data for metric
   */
  const getAreaChartData = (metricName: string) => {
    const history = metricsStore.getMetricHistory(metricName);

    return {
      xAxis: {
        type: "time",
        data: history.map((p: any) => p.timestamp),
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: history.map((p: any) => p.value),
          type: "area",
          areaStyle: {
            color: "rgba(6, 182, 212, 0.3)",
          },
        },
      ],
    };
  };

  return {
    getLineChartData,
    getBarChartData,
    getAreaChartData,
  };
}

/**
 * Composable for responsive utilities
 */
export function useResponsive() {
  const windowWidth = ref(
    typeof window !== "undefined" ? window.innerWidth : 0,
  );
  const windowHeight = ref(
    typeof window !== "undefined" ? window.innerHeight : 0,
  );

  const isMobile = computed(() => windowWidth.value < 768);
  const isTablet = computed(
    () => windowWidth.value >= 768 && windowWidth.value < 1024,
  );
  const isDesktop = computed(() => windowWidth.value >= 1024);

  const handleResize = () => {
    windowWidth.value = window.innerWidth;
    windowHeight.value = window.innerHeight;
  };

  onMounted(() => {
    window.addEventListener("resize", handleResize);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", handleResize);
  });

  return {
    windowWidth,
    windowHeight,
    isMobile,
    isTablet,
    isDesktop,
  };
}

/**
 * Composable for data pagination
 */
export function usePagination<T>(items: T[], pageSize: number = 10) {
  const currentPage = ref(1);

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    const end = start + pageSize;
    return items.slice(start, end);
  });

  const totalPages = computed(() => {
    return Math.ceil(items.length / pageSize);
  });

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  };

  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  };

  const goToPage = (page: number) => {
    currentPage.value = Math.max(1, Math.min(page, totalPages.value));
  };

  return {
    currentPage,
    paginatedItems,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
  };
}
