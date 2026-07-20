<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline', 'ghost'].includes(value)
  },
  href: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'button'
  }
})

const componentType = computed(() => props.href ? 'a' : 'button')
const linkProps = computed(() => props.href ? { href: props.href } : { type: props.type })
</script>

<template>
  <component 
    :is="componentType"
    v-bind="linkProps"
    class="inline-flex items-center justify-center font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-[var(--radius-base)] px-6 py-2.5"
    :class="{
      'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] shadow-[var(--shadow-card)]': variant === 'primary',
      'bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-border)]': variant === 'secondary',
      'border border-[var(--color-border)] bg-transparent hover:bg-[var(--color-surface)] text-[var(--color-text)]': variant === 'outline',
      'bg-transparent hover:bg-[var(--color-surface)] text-[var(--color-text)]': variant === 'ghost'
    }"
  >
    <slot></slot>
  </component>
</template>
