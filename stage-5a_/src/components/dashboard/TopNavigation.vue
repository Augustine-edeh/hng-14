<script setup lang="ts">
import { Bell, Command, Menu, Plane, RadioTower, Zap } from 'lucide-vue-next'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppButton from '@/components/ui/AppButton.vue'
import ThemeToggle from '@/components/dashboard/ThemeToggle.vue'

defineProps<{
  status: string
  alerts: number
}>()

defineEmits<{
  quickAction: []
  notifications: []
}>()
</script>

<template>
  <nav class="sticky top-0 z-30 border-b border-[hsl(var(--border)/0.72)] bg-[hsl(var(--background)/0.78)] backdrop-blur-xl">
    <div class="mx-auto flex h-16 w-full max-w-[1800px] items-center justify-between gap-3 px-3 sm:px-5 lg:px-6">
      <div class="flex min-w-0 items-center gap-3">
        <AppButton class="md:hidden" variant="ghost" size="icon" title="Open mobile navigation">
          <Menu class="h-5 w-5" />
        </AppButton>
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
          <Plane class="h-5 w-5" />
        </div>
        <div class="min-w-0">
          <p class="truncate text-sm font-semibold tracking-normal">AeroPulse Ops</p>
          <p class="hidden text-xs text-[hsl(var(--muted-foreground))] sm:block">Airline operations intelligence</p>
        </div>
      </div>

      <div class="hidden items-center gap-2 md:flex">
        <AppBadge :tone="status === 'live' ? 'normal' : status === 'paused' ? 'muted' : 'warning'">
          <RadioTower class="h-3.5 w-3.5" />
          {{ status }}
        </AppBadge>
        <AppBadge tone="info">
          <Zap class="h-3.5 w-3.5" />
          batched stream
        </AppBadge>
      </div>

      <div class="flex items-center gap-2">
        <AppButton variant="secondary" class="hidden sm:inline-flex" @click="$emit('quickAction')">
          <Command class="h-4 w-4" />
          Command
        </AppButton>
        <AppButton variant="secondary" size="icon" title="Notifications" @click="$emit('notifications')">
          <span class="relative">
            <Bell class="h-4 w-4" />
            <span v-if="alerts" class="absolute -right-1.5 -top-1.5 h-2.5 w-2.5 rounded-full bg-[hsl(var(--destructive))]" />
          </span>
        </AppButton>
        <ThemeToggle />
      </div>
    </div>
  </nav>
</template>
