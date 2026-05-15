<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue'
import { usePreferredDark } from '@vueuse/core'
import { Moon, Sun } from 'lucide-vue-next'
import AppButton from '@/components/ui/AppButton.vue'

const prefersDark = usePreferredDark()
const theme = ref<'dark' | 'light' | 'system'>('system')
const resolvedTheme = computed(() => (theme.value === 'system' ? (prefersDark.value ? 'dark' : 'light') : theme.value))
const isLight = computed(() => resolvedTheme.value === 'light')

onMounted(() => {
  const saved = window.localStorage.getItem('august-air-theme')
  theme.value = saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'system'
})

watchEffect(() => {
  document.documentElement.classList.toggle('light', resolvedTheme.value === 'light')
  window.localStorage.setItem('august-air-theme', theme.value)
})

function toggle() {
  theme.value = resolvedTheme.value === 'light' ? 'dark' : 'light'
}
</script>

<template>
  <AppButton variant="secondary" size="icon" :title="isLight ? 'Use dark theme' : 'Use light theme'" @click="toggle">
    <Sun v-if="!isLight" class="h-4 w-4" />
    <Moon v-else class="h-4 w-4" />
  </AppButton>
</template>
