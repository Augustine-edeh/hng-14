import { defineStore } from "pinia";
import { ref, computed, shallowRef } from "vue";
import type { OperationalAlert, AlertSeverity } from "../shared/types";

export const useAlertStore = defineStore("alerts", () => {
  const alerts = shallowRef<Map<string, OperationalAlert>>(new Map());
  const severityFilter = ref<AlertSeverity[]>([
    "low",
    "medium",
    "high",
    "critical",
  ]);
  const showResolved = ref(false);

  // Get alerts array
  const alertsList = computed(() => {
    let result = Array.from(alerts.value.values());

    // Filter by severity
    if (severityFilter.value.length > 0) {
      result = result.filter((a) => severityFilter.value.includes(a.severity));
    }

    // Filter by resolved status
    if (!showResolved.value) {
      result = result.filter((a) => !a.resolved);
    }

    return result;
  });

  // Get sorted alerts (newest, highest severity first)
  const sortedAlerts = computed(() => {
    const severityOrder: Record<AlertSeverity, number> = {
      critical: 0,
      high: 1,
      medium: 2,
      low: 3,
    };

    return [...alertsList.value].sort((a, b) => {
      if (a.severity !== b.severity) {
        return severityOrder[a.severity] - severityOrder[b.severity];
      }
      return b.timestamp.getTime() - a.timestamp.getTime();
    });
  });

  // Get active alerts count
  const activeCount = computed(() => {
    return Array.from(alerts.value.values()).filter((a) => !a.resolved).length;
  });

  // Get critical alerts count
  const criticalCount = computed(() => {
    return alertsList.value.filter((a) => a.severity === "critical").length;
  });

  // Add or update alert
  const upsertAlert = (alert: OperationalAlert) => {
    const newMap = new Map(alerts.value);
    newMap.set(alert.id, alert);
    alerts.value = newMap;
  };

  // Mark alert as resolved
  const resolveAlert = (alertId: string) => {
    const alert = alerts.value.get(alertId);
    if (alert) {
      alert.resolved = true;
      const newMap = new Map(alerts.value);
      newMap.set(alertId, alert);
      alerts.value = newMap;
    }
  };

  // Remove alert
  const removeAlert = (alertId: string) => {
    const newMap = new Map(alerts.value);
    newMap.delete(alertId);
    alerts.value = newMap;
  };

  // Set all alerts
  const setAlerts = (newAlerts: OperationalAlert[]) => {
    const map = new Map<string, OperationalAlert>();
    newAlerts.forEach((a) => map.set(a.id, a));
    alerts.value = map;
  };

  // Clear alerts
  const clearAlerts = () => {
    alerts.value = new Map();
  };

  // Update severity filter
  const setSeverityFilter = (severities: AlertSeverity[]) => {
    severityFilter.value = severities;
  };

  return {
    alerts,
    severityFilter,
    showResolved,
    alertsList,
    sortedAlerts,
    activeCount,
    criticalCount,
    upsertAlert,
    resolveAlert,
    removeAlert,
    setAlerts,
    clearAlerts,
    setSeverityFilter,
  };
});
