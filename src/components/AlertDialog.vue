<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    isOpen: boolean
    title: string
    message: string
    type?: 'info' | 'warning' | 'error'
    confirmText?: string
  }>(),
  {
    type: 'info',
    confirmText: 'OK'
  }
)

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <div
    v-if="isOpen"
    class="dialog-overlay fixed inset-0 flex items-center justify-center z-[1000000] bg-black/5"
    @click.self="emit('close')"
  >
    <div 
      class="window dialog-window shadow-2xl select-none" 
      style="width: 320px;"
      @mousedown.stop
    >
      <!-- Title Bar -->
      <div class="title-bar">
        <div class="title-bar-text font-bold flex items-center gap-1">
          <!-- Tiny icon on the title bar -->
          <span v-if="type === 'info'">ℹ️</span>
          <span v-else-if="type === 'warning'">⚠️</span>
          <span v-else>❌</span>
          {{ title }}
        </div>
        <div class="title-bar-controls">
          <button aria-label="Close" @click="emit('close')"></button>
        </div>
      </div>

      <!-- Window Body -->
      <div class="window-body bg-[#f0f0f0] p-4 flex flex-col gap-4">
        
        <!-- Content row (Icon + Msg) -->
        <div class="flex items-start gap-4">
          <!-- Left side icon -->
          <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center">
            <!-- Info Icon -->
            <svg v-if="type === 'info'" viewBox="0 0 32 32" class="w-8 h-8">
              <circle cx="16" cy="16" r="14" fill="#0046d5" stroke="#ffffff" stroke-width="2"/>
              <circle cx="16" cy="9" r="2.5" fill="#ffffff"/>
              <rect x="14.5" y="14" width="3" height="10" fill="#ffffff" rx="1"/>
              <rect x="13.5" y="14" width="2" height="1.5" fill="#ffffff"/>
              <rect x="14.5" y="23" width="4" height="1.5" fill="#ffffff"/>
            </svg>

            <!-- Warning Icon -->
            <svg v-else-if="type === 'warning'" viewBox="0 0 32 32" class="w-8 h-8">
              <polygon points="16,2 30,28 2,28" fill="#f1c40f" stroke="#ffffff" stroke-width="2"/>
              <rect x="14.5" y="11" width="3" height="8" fill="#000000" rx="1"/>
              <circle cx="16" cy="23.5" r="2" fill="#000000"/>
            </svg>

            <!-- Error Icon -->
            <svg v-else viewBox="0 0 32 32" class="w-8 h-8">
              <circle cx="16" cy="16" r="14" fill="#e74c3c" stroke="#ffffff" stroke-width="2"/>
              <path d="M11,11 L21,21 M21,11 L11,21" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
            </svg>
          </div>

          <div class="flex-1 text-xs text-black leading-relaxed font-sans pt-1 select-text whitespace-pre-line">
            {{ message }}
          </div>
        </div>

        <!-- Button Row -->
        <div class="flex justify-center mt-2">
          <button 
            class="px-5 py-1 text-xs font-bold font-sans cursor-pointer min-w-[75px]"
            @click="emit('close')"
          >
            {{ confirmText }}
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.dialog-overlay {
  /* Ensure it blocks clicks on the desktop behind it */
  pointer-events: auto;
}
.dialog-window {
  position: relative;
  background-color: #f0f0f0;
}
</style>
