<script setup lang="ts">
import { computed, watch } from 'vue'
import { X } from 'lucide-vue-next'
import AppButton from '@/components/ui/AppButton.vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  open: boolean
  title: string
  description?: string
  mode?: 'dialog' | 'sheet' | 'fullscreen'
  class?: string
}>()

const emit = defineEmits<{
  close: []
}>()

const panelClass = computed(() =>
  cn(
    'glass-panel fixed z-50 flex flex-col overflow-hidden rounded-lg outline-none transition',
    props.mode === 'sheet' && 'bottom-0 right-0 top-0 w-full max-w-[620px] rounded-none border-y-0 border-r-0',
    props.mode === 'fullscreen' && 'inset-3 rounded-lg md:inset-6',
    (!props.mode || props.mode === 'dialog') &&
      'left-1/2 top-1/2 max-h-[88vh] w-[calc(100vw-24px)] max-w-[900px] -translate-x-1/2 -translate-y-1/2',
    props.class,
  ),
)

function close() {
  emit('close')
}

watch(
  () => props.open,
  (open) => {
    document.body.style.overflow = open ? 'hidden' : ''
  },
)
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="open" class="fixed inset-0 z-40 bg-black/58 backdrop-blur-sm" @click="close" />
    </Transition>

    <Transition
      enter-active-class="duration-200 ease-out"
      enter-from-class="translate-y-3 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-3 opacity-0"
    >
      <section
        v-if="open"
        :class="panelClass"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
        tabindex="-1"
        @keydown.esc="close"
      >
        <header class="flex items-start justify-between gap-4 border-b border-[hsl(var(--border))] p-4 md:p-5">
          <div class="min-w-0">
            <h2 class="text-lg font-semibold tracking-normal md:text-xl">{{ title }}</h2>
            <p v-if="description" class="mt-1 text-sm leading-6 text-[hsl(var(--muted-foreground))]">{{ description }}</p>
          </div>
          <AppButton variant="ghost" size="icon" title="Close" @click="close">
            <X class="h-5 w-5" />
          </AppButton>
        </header>
        <div class="min-h-0 flex-1 overflow-auto p-4 md:p-5">
          <slot />
        </div>
      </section>
    </Transition>
  </Teleport>
</template>
