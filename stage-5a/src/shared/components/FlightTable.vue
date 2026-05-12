<template>
  <div class="flight-table-container glass-panel flex flex-col">
    <div
      class="table-header-section flex items-center justify-between p-4 border-b border-slate-700/30"
    >
      <h3 class="text-lg font-semibold text-slate-200">
        Live Flight Operations
      </h3>
      <div class="search-box flex-1 max-w-xs ml-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search flights..."
          class="input-field text-sm"
        />
      </div>
    </div>

    <div class="table-wrapper overflow-x-auto flex-1">
      <table class="w-full">
        <thead>
          <tr class="border-b border-slate-700/30">
            <th class="table-header">Flight</th>
            <th class="table-header">Aircraft</th>
            <th class="table-header">Route</th>
            <th class="table-header">Altitude</th>
            <th class="table-header">Speed</th>
            <th class="table-header">Fuel</th>
            <th class="table-header">Status</th>
            <th class="table-header">Delay</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="flight in displayedFlights"
            :key="flight.id"
            @click="selectFlight(flight.id)"
            class="table-row border-b border-slate-700/20 hover:bg-slate-800/30 cursor-pointer transition-colors"
          >
            <td class="table-cell font-semibold text-cyan-400">
              {{ flight.flightNumber }}
            </td>
            <td class="table-cell text-sm">{{ flight.aircraftType }}</td>
            <td class="table-cell text-sm">
              {{ flight.origin }} → {{ flight.destination }}
            </td>
            <td class="table-cell text-sm">
              {{ formatAltitude(flight.altitude) }}
            </td>
            <td class="table-cell text-sm">{{ formatSpeed(flight.speed) }}</td>
            <td class="table-cell text-sm">
              <div class="w-12 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-green-400 to-cyan-400"
                  :style="{ width: `${flight.fuel}%` }"
                />
              </div>
            </td>
            <td class="table-cell">
              <span :class="getStatusColor(flight.status)" class="status-badge">
                {{ flight.status }}
              </span>
            </td>
            <td
              class="table-cell"
              :class="flight.delay > 0 ? 'text-red-400' : 'text-green-400'"
            >
              {{ formatDelay(flight.delay) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="displayedFlights.length === 0"
      class="empty-state p-8 text-center text-slate-400"
    >
      <p class="text-slate-400">No flights found</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { Flight } from "../types";
import {
  formatAltitude,
  formatSpeed,
  formatDelay,
  getStatusColor,
} from "../utils";

interface Props {
  flights: Flight[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  select: [flightId: string];
}>();

const searchQuery = ref("");

const displayedFlights = computed(() => {
  let result = props.flights;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (f) =>
        f.flightNumber.toLowerCase().includes(query) ||
        f.origin.toLowerCase().includes(query) ||
        f.destination.toLowerCase().includes(query),
    );
  }

  return result.slice(0, 10); // Show top 10
});

const selectFlight = (flightId: string) => {
  emit("select", flightId);
};
</script>

<style scoped>
/* .flight-table-container {
  @apply glass-panel flex flex-col;
} */

/* .table-header-section {
  @apply flex items-center justify-between p-4 border-b border-slate-700/30;
} */

/* .search-box {
  @apply flex-1 max-w-xs ml-4;
} */

/* .table-wrapper {
  @apply overflow-x-auto flex-1;
} */

/* .table-row {
  @apply border-b border-slate-700/20;
} */

/* .empty-state {
  @apply p-8 text-center text-slate-400;
} */
</style>
