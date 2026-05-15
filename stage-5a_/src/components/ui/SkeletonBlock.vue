<script setup lang="ts">
defineProps<{ class?: string }>()
</script>

<template>
  <div :class="['animate-pulse rounded-md bg-[hsl(var(--muted)/0.74)]', $props.class]" />
</template>
