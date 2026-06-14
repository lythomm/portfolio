<script setup lang="ts">
interface ExperienceItem {
  id: string
  year: string
  role: string
  company: string
  desc: string
}

const props = defineProps<{
  experience: ExperienceItem[]
}>()
</script>

<template>
  <div class="bg-white p-4 flex-1 flex flex-col font-sans text-xs text-black select-none overflow-y-auto">
    <div class="font-bold text-gray-500 pb-1 border-b border-gray-200 mb-4 text-[11px] flex items-center">
      <span>Curriculum Vitae - Thomas LY</span>
    </div>

    <!-- Retro page sheet -->
    <div class="max-w-[650px] mx-auto w-full bg-[#fcfcfc] border border-gray-300 p-6 shadow-sm flex flex-col gap-5 text-gray-800 leading-relaxed rounded-sm">
      
      <!-- Resume Header -->
      <div class="border-b-[3px] border-[#0a246a] pb-3 text-center">
        <h2 class="text-xl font-black text-[#0a246a] tracking-wide m-0">THOMAS LY</h2>
        <div class="text-[11px] font-bold text-gray-500 mt-1 uppercase">Développeur Fullstack Web & Logiciel</div>
        <div class="text-[9px] text-gray-400 mt-1 flex flex-wrap justify-center gap-x-4 gap-y-1">
          <span>📧 lythomm@gmail.com</span>
          <span>🌐 github.com/lythomm</span>
          <span>📍 Toulouse, France</span>
        </div>
      </div>

      <!-- Professional Timeline -->
      <div>
        <h3 class="font-bold text-sm text-[#0a246a] border-b border-sky-200 pb-0.5 mb-4 uppercase flex items-center gap-1.5">
          <span>💼</span> Expériences Professionnelles
        </h3>
        
        <div class="flex flex-col gap-4 pl-2">
          <div 
            v-for="exp in experience" 
            :key="exp.id" 
            class="relative border-l border-gray-300 pl-4 py-0.5 group"
          >
            <!-- Timeline bullet point -->
            <div class="absolute w-[8px] h-[8px] rounded-full bg-blue-600 -left-[4.5px] top-[4px] border border-white group-hover:scale-125 transition-transform shadow"></div>
            
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-1">
              <span class="font-bold text-[#0a246a] text-[11px]">{{ exp.role }}</span>
              <span class="px-1.5 py-0.5 bg-sky-100 border border-sky-200 text-sky-800 rounded-full text-[8px] font-bold w-fit">
                {{ exp.year }}
              </span>
            </div>

            <div class="font-bold text-gray-600 text-[10px] mb-1.5">{{ exp.company }}</div>
            
            <p v-html="exp.desc" class="text-[10px] text-gray-500 leading-relaxed font-light">
            </p>
          </div>
        </div>
      </div>

      <!-- Education Section (Static examples) -->
      <div>
        <h3 class="font-bold text-sm text-[#0a246a] border-b border-sky-200 pb-0.5 mb-3 uppercase flex items-center gap-1.5">
          <span>🎓</span> Formations
        </h3>
        <div class="flex flex-col gap-2.5 pl-2">
          <div class="flex justify-between items-start">
            <div>
              <div class="font-bold">Ingénieur spécialité AISL (Architecture et Ingénierie des Systèmes et Logiciels)</div>
              <div class="text-gray-500 text-[10px]">IPST-CNAM</div>
            </div>
            <span class="text-[9px] text-gray-400 font-bold whitespace-nowrap">2021 - 2023</span>
          </div>
          <div class="flex justify-between items-start">
            <div>
              <div class="font-bold">License Informatique</div>
              <div class="text-gray-500 text-[10px]">ISPT-CNAM</div>
            </div>
            <span class="text-[9px] text-gray-400 font-bold whitespace-nowrap">2020-2021</span>
          </div>
          <div class="flex justify-between items-start">
            <div>
              <div class="font-bold">DUT Informatique</div>
              <div class="text-gray-500 text-[10px]">IUT Informatique de Paul Sabatier (Toulouse)</div>
            </div>
            <span class="text-[9px] text-gray-400 font-bold whitespace-nowrap">2018-2020</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Help page look-alike custom styling */
</style>
