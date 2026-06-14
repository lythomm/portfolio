<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

interface TaskbarWindow {
  id: string
  title: string
  isOpen: boolean
  isMinimized: boolean
  zIndex: number
  isActive: boolean
  icon?: string
}

const props = defineProps<{
  windows: TaskbarWindow[]
  isStartMenuOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle-start'): void
  (e: 'task-click', id: string): void
}>()

const currentTime = ref('')
let timer: any = null

const updateClock = () => {
  const now = new Date()
  let hours = now.getHours().toString().padStart(2, '0')
  let minutes = now.getMinutes().toString().padStart(2, '0')
  currentTime.value = `${hours}:${minutes}`
}

onMounted(() => {
  updateClock()
  timer = setInterval(updateClock, 1000)
})

const handleTabClick = (id: string) => {
  emit('task-click', id)
}

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="taskbar absolute left-0 bottom-0 w-full h-[30px] bg-gradient-to-b from-[#245ddb] via-[#225ad5] to-[#1941a5] border-t border-[#1844b2] flex items-center justify-between z-[99999] select-none font-sans">
    
    <!-- Start Button & Active Tasks -->
    <div class="flex items-center h-full flex-1 min-w-0">
      
      <!-- Start Button (Green XP Button) -->
      <!-- Start Button (Green XP Button) -->
      <div
        role="button"
        tabindex="0"
        class="start-button flex items-center gap-1.5 h-full px-4 text-white font-black italic text-[14px] bg-gradient-to-b from-[#4fa64f] via-[#3c8e3c] to-[#285a28] hover:from-[#5cb85c] hover:via-[#4cae4c] hover:to-[#357ebd] shadow-[inset_-2px_0_4px_rgba(0,0,0,0.4),2px_0_4px_rgba(0,0,0,0.2)] rounded-r-lg cursor-pointer border-none select-none active:brightness-90 transition-all flex-shrink-0"
        :class="isStartMenuOpen ? 'brightness-75' : ''"
        @click.stop="emit('toggle-start')"
        @keydown.enter="emit('toggle-start')"
        @keydown.space.prevent="emit('toggle-start')"
      >
        <!-- Rétro Logo flag placeholder -->
        <span class="text-sm not-italic drop-shadow-[1px_1px_1px_rgba(0,0,0,0.5)]">❖</span>
        <span class="drop-shadow-[1.5px_1.5px_1px_rgba(0,0,0,0.6)] tracking-wide">démarrer</span>
      </div>

      <!-- Vertical divider -->
      <div class="h-[20px] w-[1px] bg-[#1a44a7] shadow-[1px_0_0_#2b69ee] mx-1"></div>

      <!-- Quick Launch Placeholder (Retro style) -->
      <div class="hidden md:flex items-center gap-1.5 px-1">
        <div class="w-5 h-5 flex items-center justify-center hover:bg-white/10 rounded cursor-pointer" @click="emit('task-click', 'computer')">
          <img src="/assets/icons/computer.png" alt="Poste" class="w-4 h-4 object-contain" />
        </div>
        <div class="w-5 h-5 flex items-center justify-center hover:bg-white/10 rounded cursor-pointer" @click="emit('task-click', 'projects')">
          <img src="/assets/icons/folder_documents.png" alt="Projets" class="w-4 h-4 object-contain" />
        </div>
      </div>

      <!-- Vertical divider -->
      <div class="hidden md:block h-[20px] w-[1px] bg-[#1a44a7] shadow-[1px_0_0_#2b69ee] mx-1"></div>

      <!-- Task Buttons List -->
      <div class="flex items-center gap-1 h-full px-1 overflow-x-auto no-scrollbar min-w-0 flex-1">
        <div
          v-for="win in windows"
          :key="win.id"
          role="button"
          tabindex="0"
          class="task-tab flex items-center gap-1.5 h-[22px] max-w-[150px] min-w-[50px] flex-1 px-2 border rounded text-xs text-white cursor-pointer select-none transition-all truncate"
          :class="[
            win.isActive 
              ? 'bg-[#1e4eb8] border-[#183c9c] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.6)] font-bold' 
              : 'bg-[#3d7ade] border-[#2556b6] hover:bg-[#4d8bee]'
          ]"
          @click.stop="handleTabClick(win.id)"
          @keydown.enter="handleTabClick(win.id)"
          @keydown.space.prevent="handleTabClick(win.id)"
        >
          <!-- Icon for the App -->
          <img 
            :src="win.icon || '/assets/icons/computer.png'"
            :alt="win.title"
            class="w-3.5 h-3.5 object-contain flex-shrink-0"
          />
          <span class="truncate">{{ win.title }}</span>
        </div>
      </div>

    </div>

    <!-- Clock / System Tray -->
    <div class="systray h-full bg-[#092e8a] border-l border-[#123d9b] shadow-[inset_2px_0_4px_rgba(0,0,0,0.5)] flex items-center px-3 text-white text-[11px] font-medium gap-2">
      <!-- Minimal icons representing system tools -->
      <span class="text-[10px] opacity-75">🔊</span>
      <!-- Real Time Clock -->
      <span>{{ currentTime }}</span>
    </div>

  </div>
</template>

<style scoped>
.taskbar {
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
