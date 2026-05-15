import { defineStore } from "pinia";
import { ref, computed, shallowRef } from "vue";
import type { Flight, TimeRange, FilterOptions } from "../shared/types";

export const useFlightStore = defineStore("flights", () => {
  const flights = shallowRef<Map<string, Flight>>(new Map());
  const timeRange = ref<TimeRange>("realtime");
  const filters = ref<FilterOptions>({
    airports: [],
    aircraft: [],
    statuses: [],
    alertSeverities: [],
  });
  const searchQuery = ref("");
  const isPaused = ref(false);

  // Get flights array
  const flightsList = computed(() => {
    let result = Array.from(flights.value.values());

    // Apply filters
    if (filters.value.airports.length > 0) {
      result = result.filter(
        (f) =>
          filters.value.airports.includes(f.origin) ||
          filters.value.airports.includes(f.destination),
      );
    }

    if (filters.value.aircraft.length > 0) {
      result = result.filter((f) =>
        filters.value.aircraft.includes(f.aircraftType),
      );
    }

    if (filters.value.statuses.length > 0) {
      result = result.filter((f) => filters.value.statuses.includes(f.status));
    }

    // Apply search
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(
        (f) =>
          f.flightNumber.toLowerCase().includes(query) ||
          f.origin.toLowerCase().includes(query) ||
          f.destination.toLowerCase().includes(query) ||
          f.aircraftType.toLowerCase().includes(query),
      );
    }

    return result;
  });

  // Get sorted flights (newest first)
  const sortedFlights = computed(() => {
    return [...flightsList.value].sort(
      (a, b) => b.lastUpdate.getTime() - a.lastUpdate.getTime(),
    );
  });

  // Get flight statistics
  const statistics = computed(() => ({
    total: flightsList.value.length,
    delayed: flightsList.value.filter((f) => f.delay > 0).length,
    onTime: flightsList.value.filter((f) => f.delay <= 0).length,
    avgDelay:
      flightsList.value.length > 0
        ? flightsList.value.reduce((sum, f) => sum + f.delay, 0) /
          flightsList.value.length
        : 0,
    avgAltitude:
      flightsList.value.length > 0
        ? flightsList.value.reduce((sum, f) => sum + f.altitude, 0) /
          flightsList.value.length
        : 0,
    avgSpeed:
      flightsList.value.length > 0
        ? flightsList.value.reduce((sum, f) => sum + f.speed, 0) /
          flightsList.value.length
        : 0,
  }));

  // Update or add flight
  const upsertFlight = (flight: Flight) => {
    const newMap = new Map(flights.value);
    newMap.set(flight.id, flight);
    flights.value = newMap;
  };

  // Remove flight
  const removeFlight = (flightId: string) => {
    const newMap = new Map(flights.value);
    newMap.delete(flightId);
    flights.value = newMap;
  };

  // Get specific flight
  const getFlight = (id: string) => flights.value.get(id);

  // Set flights
  const setFlights = (newFlights: Flight[]) => {
    const map = new Map<string, Flight>();
    newFlights.forEach((f) => map.set(f.id, f));
    flights.value = map;
  };

  // Clear flights
  const clearFlights = () => {
    flights.value = new Map();
  };

  // Update filters
  const setFilters = (newFilters: Partial<FilterOptions>) => {
    filters.value = { ...filters.value, ...newFilters };
  };

  return {
    flights,
    timeRange,
    filters,
    searchQuery,
    isPaused,
    flightsList,
    sortedFlights,
    statistics,
    upsertFlight,
    removeFlight,
    getFlight,
    setFlights,
    clearFlights,
    setFilters,
  };
});
