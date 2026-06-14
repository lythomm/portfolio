<script setup lang="ts">
interface Project {
  id: string
  title: string
  desc: string
  tags: string[]
  icon: string
}

const props = defineProps<{
  projects: Project[]
}>()

const emit = defineEmits<{
  (e: 'select-project', projectId: string): void
}>()
</script>

<template>
  <div class="bg-white p-3 flex-1 overflow-y-auto font-sans text-xs text-black select-none">
    <div class="font-bold text-gray-500 pb-1 border-b border-gray-200 mb-4 text-[11px] flex justify-between items-center">
      <span>Dossier : C:\Mes Documents\Projets</span>
      <span>{{ projects.length }} élément(s)</span>
    </div>

    <!-- Grid Layout showing projects as files -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div
        v-for="proj in projects"
        :key="proj.id"
        class="flex flex-col items-center p-3 rounded border border-transparent hover:bg-sky-100/60 hover:border-sky-200/80 cursor-pointer text-center group active:bg-sky-200/50"
        @dblclick="emit('select-project', proj.id)"
        @click="emit('select-project', proj.id)"
      >
        <!-- Project Icon -->
        <img
          src="/assets/icons/folder_documents.png"
          :alt="proj.title"
          class="w-10 h-10 object-contain mb-2 pointer-events-none transition-transform"
        />
        
        <!-- Title -->
        <span class="font-bold text-[#0a246a] group-hover:underline text-[11px] leading-tight mb-1">
          {{ proj.title }}
        </span>
        
        <!-- Short description -->
        <span class="text-[9px] text-gray-500 line-clamp-2 max-w-[120px]">
          {{ proj.desc }}
        </span>

        <!-- Tiny tech badges -->
        <div class="flex flex-wrap justify-center gap-0.5 mt-2 max-w-[120px]">
          <span 
            v-for="tag in proj.tags.slice(0, 2)" 
            :key="tag" 
            class="px-1 py-0.2 bg-gray-100 border border-gray-200 rounded-[2px] text-[8px] text-gray-600 scale-95"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
