<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium text-text-base mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-error">*</span>
    </label>

    <input
      :id="id"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :value="modelValue"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
      :class="[
        // Base styles
        'w-full px-4 py-2.5 rounded-lg',
        'border border-dark-border bg-dark-surface text-text-base',
        'placeholder:text-text-tertiary',
        'transition-all duration-200',

        // Focus states
        'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent',
        'focus:shadow-lg focus:shadow-brand-primary/10',

        // States
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'hover:border-dark-border/60',

        // Error state
        error ? 'border-error ring-1 ring-error/30' : '',

        // Custom classes
        props.customClass,
      ]"
    />

    <p v-if="error" class="text-error text-sm mt-1">{{ error }}</p>
    <p v-if="hint" class="text-text-tertiary text-sm mt-1">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  modelValue?: string;
  type?: string;
  placeholder?: string;
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  customClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  modelValue: "",
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const id = computed(
  () => props.id || `input-${Math.random().toString(36).substr(2, 9)}`,
);
</script>
