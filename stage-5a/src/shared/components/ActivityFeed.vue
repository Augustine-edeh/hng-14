<template>
  <div class="glass-panel flex flex-col activity-feed-container">
    <div
      class="feed-header flex flex-col gap-3 p-4 border-b border-slate-700/30"
    >
      <h3 class="text-lg font-semibold text-slate-200">Live Activity Feed</h3>
      <div class="feed-controls flex gap-2">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search events..."
          class="input-field text-sm"
        />
      </div>
    </div>

    <div class="feed-content flex-1 overflow-y-auto">
      <div
        v-for="event in displayedEvents"
        :key="event.id"
        class="feed-item p-4 border-b border-slate-700/20 hover:bg-slate-800/20 transition-colors"
      >
        <div class="feed-timestamp text-xs text-slate-500 mb-2">
          {{ formatRelativeTime(event.timestamp) }}
        </div>

        <div class="feed-body space-y-2">
          <div class="feed-title-section flex items-center gap-2 flex-wrap">
            <span
              v-if="event.severity"
              :class="getSeverityColor(event.severity)"
              class="status-badge"
            >
              {{ event.severity }}
            </span>
            <h4 class="feed-title text-sm font-semibold text-slate-200">
              {{ event.title }}
            </h4>
          </div>
          <p class="feed-description text-xs text-slate-400 line-clamp-2">
            {{ event.description }}
          </p>
        </div>
      </div>
    </div>

    <div
      v-if="displayedEvents.length === 0"
      class="empty-state p-8 text-center text-slate-400"
    >
      <p class="text-slate-400">No activity yet</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { ActivityEvent } from "../types";
import { formatRelativeTime, getSeverityColor } from "../utils";

interface Props {
  events: ActivityEvent[];
  maxItems?: number;
}

const props = withDefaults(defineProps<Props>(), {
  maxItems: 20,
});

const searchQuery = ref("");

const displayedEvents = computed(() => {
  let result = props.events;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (e) =>
        e.title.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query),
    );
  }

  return result.slice(0, props.maxItems);
});
</script>

<style scoped>
/* .feed-header {
  @apply flex flex-col gap-3 p-4 border-b border-slate-700/30;
} */

/* .feed-controls {
  @apply flex gap-2;
} */

/* .feed-content {
  @apply flex-1 overflow-y-auto;
} */

/* .feed-item {
  @apply p-4 border-b border-slate-700/20 hover:bg-slate-800/20 transition-colors;
} */

/* .feed-timestamp {
  @apply text-xs text-slate-500 mb-2;
} */

/* .feed-body {
  @apply space-y-2;
} */

/* .feed-title-section {
  @apply flex items-center gap-2 flex-wrap;
} */

/* .feed-title {
  @apply text-sm font-semibold text-slate-200;
} */

/* .feed-description {
  @apply text-xs text-slate-400 line-clamp-2;
} */

/* .empty-state {
  @apply p-8 text-center text-slate-400;
} */

/* Custom scrollbar for feed */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(6, 182, 212, 0.2);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(6, 182, 212, 0.3);
}
</style>
