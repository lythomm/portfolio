<script setup lang="ts">
const emit = defineEmits<{
  (e: 'open-folder', folderId: string): void
}>()
</script>

<template>
  <div class="flex flex-1 h-full select-none text-xs font-sans text-black">
    <!-- Left Sidebar (XP style task panel) -->
    <div class="hidden sm:block w-[180px] bg-gradient-to-b from-[#7baaff] to-[#3b7ede] p-2 flex-shrink-0">
      
      <!-- System Tasks Section -->
      <div class="bg-white/80 rounded-t-lg rounded-b border border-white/60 overflow-hidden mb-3">
        <div class="bg-gradient-to-r from-[#e7f0ff] to-[#abbdd9] px-2 py-1 font-bold text-[#0a246a] border-b border-white flex items-center justify-between">
          <span>Gestion des tâches</span>
        </div>
        <div class="p-2 flex flex-col gap-1.5 text-[10px]">
          <div class="flex items-center gap-1.5 cursor-pointer hover:underline text-[#0c39a6]" @click="emit('open-folder', 'projects')">
            📂 <span>Voir mes réalisations</span>
          </div>
          <div class="flex items-center gap-1.5 cursor-pointer hover:underline text-[#0c39a6]" @click="emit('open-folder', 'skills')">
            ⚙️ <span>Voir mes compétences</span>
          </div>
          <div class="flex items-center gap-1.5 cursor-pointer hover:underline text-[#0c39a6]" @click="emit('open-folder', 'resume')">
            📄 <span>Voir mon CV</span>
          </div>
        </div>
      </div>

      <!-- Other Places Section -->
      <div class="bg-white/80 rounded-t-lg rounded-b border border-white/60 overflow-hidden mb-3">
        <div class="bg-gradient-to-r from-[#e7f0ff] to-[#abbdd9] px-2 py-1 font-bold text-[#0a246a] border-b border-white flex items-center justify-between">
          <span>Autres emplacements</span>
        </div>
        <div class="p-2 flex flex-col gap-1.5 text-[10px] text-[#0c39a6]">
          <div class="flex items-center gap-1.5">
            🖥️ <span>Réseau local</span>
          </div>
          <div class="flex items-center gap-1.5">
            📁 <span>Mes Documents</span>
          </div>
          <div class="flex items-center gap-1.5">
            🗑️ <span>Corbeille</span>
          </div>
        </div>
      </div>

    </div>

    <!-- Right Content Area (Explorer Grid) -->
    <div class="flex-1 bg-white p-3 overflow-y-auto">
      
      <!-- Hard Disk Drives Section -->
      <div class="mb-4">
        <div class="font-bold text-gray-500 pb-1 border-b border-gray-200 mb-3 text-[11px]">
          Fichiers stockés sur cet ordinateur
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <!-- Projects Folder -->
          <div 
            class="flex items-center gap-3 p-2 rounded hover:bg-sky-100/60 cursor-pointer border border-transparent hover:border-sky-200/80 active:bg-sky-200/50"
            @dblclick="emit('open-folder', 'projects')"
            @click="emit('open-folder', 'projects')" 
          >
            <img src="/assets/icons/folder_documents.png" alt="Projets" class="w-8 h-8 object-contain" />
            <div class="flex flex-col">
              <span class="font-bold">Mes Projets</span>
              <span class="text-[10px] text-gray-500">Dossier de fichiers</span>
            </div>
          </div>

          <!-- Skills Folder -->
          <div 
            class="flex items-center gap-3 p-2 rounded hover:bg-sky-100/60 cursor-pointer border border-transparent hover:border-sky-200/80 active:bg-sky-200/50"
            @dblclick="emit('open-folder', 'skills')"
            @click="emit('open-folder', 'skills')" 
          >
            <img src="/assets/icons/skills.png" alt="Compétences" class="w-8 h-8 object-contain" />
            <div class="flex flex-col">
              <span class="font-bold">Mes Compétences</span>
              <span class="text-[10px] text-gray-500">Dossier système</span>
            </div>
          </div>

          <!-- CV Folder -->
          <div 
            class="flex items-center gap-3 p-2 rounded hover:bg-sky-100/60 cursor-pointer border border-transparent hover:border-sky-200/80 active:bg-sky-200/50"
            @dblclick="emit('open-folder', 'resume')"
            @click="emit('open-folder', 'resume')" 
          >
            <img src="/assets/icons/resume.png" alt="Parcours" class="w-8 h-8 object-contain" />
            <div class="flex flex-col">
              <span class="font-bold">CV</span>
              <span class="text-[10px] text-gray-500">Document texte</span>
            </div>
          </div>
        </div>

      </div>

      <!-- System Devices Section -->
      <div>
        <div class="font-bold text-gray-500 pb-1 border-b border-gray-200 mb-3 text-[11px]">
          Périphériques utilisant des supports amovibles
        </div>

        <div class="flex items-center gap-3 p-2 w-[200px] opacity-65">
          <img src="/assets/icons/disk.png" alt="Disquette 3½" class="w-8 h-8 object-contain" />
          <div class="flex flex-col">
            <span class="font-bold">Lecteur de disquette (A:)</span>
            <span class="text-[10px] text-gray-500">Support amovible</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
