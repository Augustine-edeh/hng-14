<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: string
}>()

const classes = computed(() => cn('glass-panel rounded-lg p-4 md:p-5', props.class))
</script>

<template>
  <section :class="classes">
    <slot />
  </section>
</template>
