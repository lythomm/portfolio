<script setup lang="ts">

const props = defineProps<{
  id: string
  label: string
  iconSrc: string
  isSelected: boolean
}>()

const emit = defineEmits<{
  (e: 'select', id: string): void
  (e: 'open', id: string): void
}>()

const handleClick = () => {
  emit('select', props.id)
}

const handleDblClick = () => {
  emit('open', props.id)
}
</script>

<template>
  <div
    class="desktop-icon flex flex-col items-center justify-center p-2 rounded cursor-pointer w-[80px] text-center gap-1 select-none border border-transparent transition-all"
    :class="isSelected ? 'bg-blue-600/30 border-blue-400/50' : 'hover:bg-white/10'"
    @click.stop="handleClick"
    @dblclick.stop="handleDblClick"
  >
    <!-- Icon Wrapper -->
    <div class="relative w-9 h-9 flex items-center justify-center">
      <img
        :src="iconSrc"
        :alt="label"
        class="w-8 h-8 object-contain pointer-events-none"
        :class="isSelected ? 'brightness-75' : ''"
      />
      <div 
        v-if="isSelected" 
        class="absolute inset-0 bg-blue-600/20 rounded pointer-events-nonemix-blend-multiply"
      ></div>
    </div>

    <!-- Text Label -->
    <span
      class="text-xs text-white drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.8)] font-medium leading-tight px-1 rounded break-words"
      :class="isSelected ? 'bg-[#0a246a] text-white !drop-shadow-none' : ''"
    >
      {{ label }}
    </span>
  </div>
</template>

<style scoped>
</style>
