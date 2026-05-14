<template>
  <div class="min-h-screen bg-dark-bg flex items-center justify-center p-4">
    <!-- Animated background gradient -->
    <div
      class="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <div
        class="absolute top-0 left-1/4 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl animate-pulse"
      />
      <div
        class="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-secondary/5 rounded-full blur-3xl animate-pulse"
      />
    </div>

    <div class="w-full max-w-md">
      <!-- Logo/Header -->
      <div class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-brand-primary/10 mb-4"
        >
          <svg
            class="w-6 h-6 text-brand-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8m0 8l-9-2m9 2l9-2m-9-8l9 2m-9-2l-9 2"
            />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-text-base mb-2">AeroPulse Ops</h1>
        <p class="text-text-secondary">Aviation Operations Intelligence</p>
      </div>

      <!-- Auth Card -->
      <Card class="p-8 shadow-premium">
        <slot />
      </Card>

      <!-- Footer -->
      <p class="text-center text-text-tertiary text-sm mt-6">
        <slot name="footer" />
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import Card from "./Card.vue";
</script>

<style scoped>
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}
</style>
