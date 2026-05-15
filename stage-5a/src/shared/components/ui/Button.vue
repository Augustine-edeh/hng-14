<template>
  <button
    :class="[
      'inline-flex items-center justify-center',
      'rounded-lg font-medium transition-all duration-200',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'focus-visible:ring-offset-dark-bg dark:focus-visible:ring-offset-light-bg',
      'focus-visible:ring-brand-primary',
      sizeClasses[size],
      variantClasses[variant],
      props.customClass,
    ]"
    v-bind="$attrs"
  >
    <!-- Loading spinner -->
    <svg
      v-if="isLoading"
      class="animate-spin -ml-1 mr-2 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    <slot />
  </button>
</template>
<script setup lang="ts">
interface Props {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  customClass?: string;
}
const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "md",
  isLoading: false,
});
const sizeClasses = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};
const variantClasses = {
  primary:
    "bg-brand-primary hover:bg-brand-secondary text-white shadow-md hover:shadow-lg",
  secondary:
    "bg-dark-surface hover:bg-dark-surface-hover text-text-base border border-dark-border hover:border-brand-primary",
  outline:
    "border border-dark-border text-text-base hover:border-brand-primary hover:text-brand-primary",
  ghost: "text-text-base hover:bg-dark-surface hover:text-brand-primary",
  danger: "bg-error hover:bg-red-600 text-white shadow-md hover:shadow-lg",
};
</script>
