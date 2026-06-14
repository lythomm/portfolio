<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'open-app', id: string): void
  (e: 'close-all'): void
}>()

const menuRef = ref<HTMLElement | null>(null)

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  // Do not close if clicking the start button itself
  if (props.isOpen && menuRef.value && !menuRef.value.contains(target) && !target.closest('.start-button')) {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<template>
  <div
    v-if="isOpen"
    ref="menuRef"
    class="start-menu absolute left-0 bottom- taskbar-height z-[9999] w-[380px] h-[400px] bg-[#225ad5] border-[2px] border-[#225ad5] rounded-t-lg shadow-2xl flex flex-col font-sans select-none overflow-hidden"
  >
    <!-- Header -->
    <div class="h-[55px] bg-gradient-to-r from-[#1d50c7] to-[#4281f4] flex items-center px-3 gap-3 border-b border-[#1844b2]">
      <div class="w-9 h-9 rounded-md border border-white/60 bg-sky-200 overflow-hidden shadow-inner flex items-center justify-center">
        <!-- Rétro User Image -->
        <span class="text-xl">🤵</span>
      </div>
      <div class="flex flex-col">
        <span class="text-white font-bold text-sm drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]">Thomas</span>
        <span class="text-[#b4d2ff] text-[10px] uppercase font-bold tracking-wider leading-none">Développeur Fullstack</span>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="flex-1 flex bg-white text-xs text-[#333]">
      <!-- Left Side (Programs) -->
      <div class="w-[55%] bg-white p-1.5 flex flex-col gap-1">
        <div class="text-[10px] text-gray-400 font-bold px-1.5 py-0.5 border-b border-gray-100 uppercase">Programmes</div>
        
        <div 
          class="start-item flex items-center gap-2 p-1.5 rounded hover:bg-[#3d7ade] hover:text-white cursor-pointer"
          @click="emit('open-app', 'projects'); emit('close')"
        >
          <img src="/assets/icons/folder_documents.png" alt="Projets" class="w-[22px] h-[22px] object-contain pointer-events-none" />
          <div class="flex flex-col">
            <span class="font-bold">Mes Réalisations</span>
            <span class="text-[9px] opacity-70 hover:text-white">Liste des projets web</span>
          </div>
        </div>

        <div 
          class="start-item flex items-center gap-2 p-1.5 rounded hover:bg-[#3d7ade] hover:text-white cursor-pointer"
          @click="emit('open-app', 'skills'); emit('close')"
        >
          <img src="/assets/icons/skills.png" alt="Compétences" class="w-[22px] h-[22px] object-contain pointer-events-none" />
          <div class="flex flex-col">
            <span class="font-bold">Mes Compétences</span>
            <span class="text-[9px] opacity-70 hover:text-white">Frontend, Backend, Outils</span>
          </div>
        </div>

        <div 
          class="start-item flex items-center gap-2 p-1.5 rounded hover:bg-[#3d7ade] hover:text-white cursor-pointer"
          @click="emit('open-app', 'resume'); emit('close')"
        >
          <img src="/assets/icons/resume.png" alt="Parcours" class="w-[22px] h-[22px] object-contain pointer-events-none" />
          <div class="flex flex-col">
            <span class="font-bold">Mon Parcours (CV)</span>
            <span class="text-[9px] opacity-70 hover:text-white">Formations et expériences</span>
          </div>
        </div>

        <div 
          class="start-item flex items-center gap-2 p-1.5 rounded hover:bg-[#3d7ade] hover:text-white cursor-pointer"
          @click="emit('open-app', 'mail'); emit('close')"
        >
          <img src="/assets/icons/mail.svg" alt="Outlook Express" class="w-[22px] h-[22px] object-contain pointer-events-none" />
          <div class="flex flex-col">
            <span class="font-bold">Outlook Express</span>
            <span class="text-[9px] opacity-70 hover:text-white">Envoyer un e-mail</span>
          </div>
        </div>

        <div 
          class="start-item flex items-center gap-2 p-1.5 rounded hover:bg-[#3d7ade] hover:text-white cursor-pointer"
          @click="emit('open-app', 'minesweeper'); emit('close')"
        >
          <img src="/assets/icons/minesweeper.svg" alt="Démineur" class="w-[22px] h-[22px] object-contain pointer-events-none" />
          <div class="flex flex-col">
            <span class="font-bold">Démineur</span>
            <span class="text-[9px] opacity-70 hover:text-white">Jeu rétro classique</span>
          </div>
        </div>

        <div 
          class="start-item flex items-center gap-2 p-1.5 rounded hover:bg-[#3d7ade] hover:text-white cursor-pointer"
          @click="emit('open-app', 'sudoku'); emit('close')"
        >
          <img src="/assets/icons/sudoku.svg" alt="Sudoku" class="w-[22px] h-[22px] object-contain pointer-events-none" />
          <div class="flex flex-col">
            <span class="font-bold">Sudoku</span>
            <span class="text-[9px] opacity-70 hover:text-white">Jeu de réflexion logique</span>
          </div>
        </div>
      </div>

      <!-- Right Side (System Folders) -->
      <div class="w-[45%] bg-[#d3e5fa] border-l border-[#b5d6f6] p-1.5 flex flex-col gap-1.5 shadow-inner">
        <div 
          class="flex items-center gap-1.5 p-1 rounded hover:bg-[#3d7ade] hover:text-white cursor-pointer group"
          @click="emit('open-app', 'computer'); emit('close')"
        >
          <img src="/assets/icons/computer.png" alt="Poste de travail" class="w-4 h-4 object-contain" />
          <span class="font-bold group-hover:text-white text-[#0a246a]">Poste de travail</span>
        </div>

        <div 
          class="flex items-center gap-1.5 p-1 rounded hover:bg-[#3d7ade] hover:text-white cursor-pointer group"
          @click="emit('open-app', 'projects'); emit('close')"
        >
          <img src="/assets/icons/folder_documents.png" alt="Mes Projets" class="w-4 h-4 object-contain" />
          <span class="font-bold group-hover:text-white text-[#0a246a]">Mes Documents</span>
        </div>

        <div class="border-t border-[#b5d6f6] my-1"></div>

        <div class="flex items-center gap-1.5 p-1 text-gray-500 opacity-60">
          <span class="text-[14px]">⚙️</span>
          <span class="font-bold">Panneau de configuration</span>
        </div>

        <div class="flex items-center gap-1.5 p-1 text-gray-500 opacity-60">
          <span class="text-[14px]">🔍</span>
          <span class="font-bold">Rechercher</span>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="h-[42px] bg-gradient-to-r from-[#1d50c7] to-[#4281f4] flex items-center justify-end px-3 gap-3 border-t border-[#1844b2]">
      <div 
        role="button"
        tabindex="0"
        class="flex items-center gap-1.5 bg-[#d37016] border border-[#f39c12] hover:bg-[#e67e22] text-white px-2 py-1 rounded text-[11px] font-bold shadow-md cursor-pointer transition-colors"
        @click="emit('close-all'); emit('close')"
        @keydown.enter="emit('close-all'); emit('close')"
        @keydown.space.prevent="emit('close-all'); emit('close')"
      >
        <span class="text-sm">🔑</span> Fermer tout
      </div>
    </div>
  </div>
</template>

<style scoped>
.start-menu {
  bottom: 30px; /* Aligned exactly above the taskbar */
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}
</style>
