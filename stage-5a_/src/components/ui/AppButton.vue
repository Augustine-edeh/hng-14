<script setup lang="ts">
import { computed } from 'vue'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex min-h-10 items-center justify-center gap-2 rounded-md border text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:brightness-110',
        secondary: 'border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.68)] hover:bg-[hsl(var(--muted))]',
        ghost: 'border-transparent bg-transparent hover:bg-[hsl(var(--muted)/0.72)]',
        danger: 'border-transparent bg-[hsl(var(--destructive))] text-white hover:brightness-110',
      },
      size: {
        sm: 'h-9 px-3',
        md: 'h-10 px-4',
        icon: 'h-10 w-10 px-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
)

type ButtonVariants = VariantProps<typeof buttonVariants>

const props = defineProps<{
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  class?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  title?: string
}>()

const classes = computed(() => cn(buttonVariants({ variant: props.variant, size: props.size }), props.class))
</script>

<template>
  <button :class="classes" :type="type ?? 'button'" :disabled="disabled" :title="title">
    <slot />
  </button>
</template>
