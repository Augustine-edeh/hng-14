import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { ActivityEvent } from "../shared/types";
import { MAX_ACTIVITY_ITEMS } from "../shared/constants";

export const useActivityStore = defineStore("activity", () => {
  const events = ref<ActivityEvent[]>([]);
  const searchQuery = ref("");
  const typeFilter = ref<string[]>([]);

  // Get filtered and sorted events
  const filteredEvents = computed(() => {
    let result = [...events.value];

    // Filter by type
    if (typeFilter.value.length > 0) {
      result = result.filter((e: ActivityEvent) =>
        typeFilter.value.includes(e.type),
      );
    }

    // Filter by search query
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(
        (e: ActivityEvent) =>
          e.title.toLowerCase().includes(query) ||
          e.description.toLowerCase().includes(query),
      );
    }

    return result;
  });

  // Get recent events (newest first)
  const recentEvents = computed(() => {
    return [...filteredEvents.value].sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
    );
  });

  // Add event
  const addEvent = (event: ActivityEvent) => {
    events.value.unshift(event);
    // Keep only recent events in memory
    if (events.value.length > MAX_ACTIVITY_ITEMS) {
      events.value = events.value.slice(0, MAX_ACTIVITY_ITEMS);
    }
  };

  // Add multiple events
  const addEvents = (newEvents: ActivityEvent[]) => {
    events.value.unshift(...newEvents);
    if (events.value.length > MAX_ACTIVITY_ITEMS) {
      events.value = events.value.slice(0, MAX_ACTIVITY_ITEMS);
    }
  };

  // Remove event
  const removeEvent = (eventId: string) => {
    events.value = events.value.filter((e) => e.id !== eventId);
  };

  // Clear events
  const clearEvents = () => {
    events.value = [];
  };

  // Update search query
  const setSearchQuery = (query: string) => {
    searchQuery.value = query;
  };

  // Update type filter
  const setTypeFilter = (types: string[]) => {
    typeFilter.value = types;
  };

  // Get event count
  const eventCount = computed(() => events.value.length);

  // Get recent event count
  const recentEventCount = computed(() => recentEvents.value.length);

  return {
    events,
    searchQuery,
    typeFilter,
    filteredEvents,
    recentEvents,
    eventCount,
    recentEventCount,
    addEvent,
    addEvents,
    removeEvent,
    clearEvents,
    setSearchQuery,
    setTypeFilter,
  };
});
