<template>
  <div class="chart-container">
    <div class="chart-header">
      <h3 class="text-lg font-semibold text-slate-200">{{ title }}</h3>
      <button
        @click="$emit('fullscreen')"
        class="btn-secondary"
        title="Fullscreen"
      >
        ⛶
      </button>
    </div>
    <div
      ref="chartElement"
      class="chart-canvas"
      :style="{ height: props.height }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, shallowRef } from "vue";
import * as echarts from "echarts";

interface Props {
  title: string;
  option: any;
  height?: string;
}

const props = withDefaults(defineProps<Props>(), {
  height: "300px",
});

defineEmits<{
  fullscreen: [];
}>();

const chartElement = ref<HTMLDivElement>();
const chart = shallowRef<any>(null);

onMounted(() => {
  if (chartElement.value) {
    chart.value = echarts.init(chartElement.value, "dark");
    chart.value.setOption(props.option);

    window.addEventListener("resize", handleResize);
  }
});

onUnmounted(() => {
  if (chart.value) {
    chart.value.dispose();
  }
  window.removeEventListener("resize", handleResize);
});

const handleResize = () => {
  if (chart.value) {
    chart.value.resize();
  }
};

// Watch for option changes
watch(
  () => props.option,
  (newOption) => {
    if (chart.value) {
      chart.value.setOption(newOption, { replaceMerge: ["series"] });
    }
  },
  { deep: true },
);
</script>

<style scoped>
.chart-container {
  @apply glass-panel overflow-hidden;
}

.chart-header {
  @apply flex items-center justify-between p-4 border-b border-slate-700/30;
}

.chart-canvas {
  width: 100%;
}
</style>
