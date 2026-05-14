<template>
  <div
    :class="[
      'rounded-xl border border-dark-border bg-dark-surface',
      'transition-all duration-200',
      'hover:border-dark-border/60 hover:shadow-lg',
      props.customClass,
    ]"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  customClass?: string;
}

const props = defineProps<Props>();
</script>
