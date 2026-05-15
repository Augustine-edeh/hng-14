<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue'
import { Moon, Sun } from 'lucide-vue-next'
import AppButton from '../ui/AppButton.vue'

const theme = ref<'dark' | 'light'>('dark')
const isLight = computed(() => theme.value === 'light')

onMounted(() => {
  const saved = window.localStorage.getItem('august-air-theme')
  theme.value = saved === 'light' ? 'light' : 'dark'
})

watchEffect(() => {
  document.documentElement.classList.toggle('light', isLight.value)
  window.localStorage.setItem('august-air-theme', theme.value)
})

function toggle() {
  theme.value = isLight.value ? 'dark' : 'light'
}
</script>

<template>
  <AppButton variant="secondary" size="icon" :title="isLight ? 'Use dark theme' : 'Use light theme'" @click="toggle">
    <Sun v-if="!isLight" class="h-4 w-4" />
    <Moon v-else class="h-4 w-4" />
  </AppButton>
</template>
