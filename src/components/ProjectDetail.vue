<script setup lang="ts">
interface Project {
  id: string
  title: string
  desc: string
  longDesc: string
  tags: string[]
  link: string
  github: string
}

const props = defineProps<{
  project: Project
}>()

const emit = defineEmits<{
  (e: 'back'): void
}>()
</script>

<template>
  <div class="bg-white p-4 flex flex-col flex-1 font-sans text-xs text-black select-none min-h-0">
    
    <!-- Header with back button -->
    <div class="flex items-center justify-between pb-2 border-b border-gray-200 mb-3">
      <button 
        class="flex items-center gap-1 px-2.5 py-0.5 bg-[#f1f1f1] border border-gray-400 hover:bg-gray-100 rounded cursor-pointer shadow-[inset_1px_1px_0_white]"
        @click="emit('back')"
      >
        <span>⬅️</span> Précédent
      </button>
      <span class="text-xs text-gray-400 uppercase font-bold">Détails du projet</span>
    </div>

    <!-- Project details -->
    <div class="flex-1 flex flex-col md:flex-row gap-4 overflow-y-auto pr-1 min-h-0">
      
      <!-- Left Column (Visual Card / Details) -->
      <div class="md:w-[35%] flex flex-col items-center bg-[#f4f7fc] border border-[#d2dcf0] rounded p-4 text-center h-fit">
        <img src="/assets/icons/folder_documents.png" alt="Icon" class="w-12 h-12 object-contain mb-3" />
        <h3 class="font-bold text-xl! text-[#0a246a] mb-4">{{ project.title }}</h3>
        
        <!-- Action Buttons -->
        <div class="flex flex-col gap-1.5 w-full">
          <a 
            :href="project.link" 
            target="_blank"
          >
            <button class="w-full cursor-pointer font-bold">
              🌐 Lancer l'application
            </button>
          </a>
          <a
          v-if="project.github"
          :href="project.github" 
          target="_blank"
          >
            <button class="w-full cursor-pointer">
              🐙 Visiter le dépôt GitHub
            </button>
          </a>
        </div>
      </div>

      <!-- Right Column (Tech Specs / Long Description) -->
      <div class="flex-1 flex flex-col gap-3">
        <div>
          <div class="font-bold text-[#0a246a] mb-1.5 border-b border-sky-100 pb-0.5">Description détaillée :</div>
          <p class="leading-relaxed text-gray-700 whitespace-pre-line text-sm">
            {{ project.longDesc }}
          </p>
        </div>

        <div>
          <div class="font-bold text-[#0a246a] mb-1.5 border-b border-sky-100 pb-0.5">Technologies utilisées :</div>
          <div class="flex flex-wrap gap-1.5 mt-1.5">
            <span 
              v-for="tag in project.tags" 
              :key="tag" 
              class="px-2 py-0.5 bg-sky-50 border border-sky-200 text-sky-700 rounded text-[9px] font-bold"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
