<script setup lang="ts">
interface SkillItem {
  name: string
  level: number
}

interface SkillCategory {
  category: string
  items: SkillItem[]
}

const props = defineProps<{
  skills: SkillCategory[]
}>()
</script>

<template>
  <div class="bg-[#f0f0f0] p-3 flex-1 flex flex-col font-sans text-xs text-black select-none overflow-y-auto">
    <div class="font-bold text-gray-500 pb-1 border-b border-gray-200 mb-3 text-[11px]">
      Propriétés système : Compétences de Thomas
    </div>

    <!-- System info style box -->
    <div class="bg-white border border-gray-300 rounded p-3 mb-4 shadow-sm flex items-start gap-4">
      <img src="/assets/icons/skills.png" alt="Skills" class="w-10 h-10 object-contain flex-shrink-0" />
      <div>
        <h4 class="font-bold text-[#0a246a] text-sm">Thomas - Développeur Fullstack</h4>
        <p class="text-[10px] text-gray-500 mt-0.5 leading-relaxed">
          Niveaux d'expertise évalués d'après les projets réalisés en production et personnels. 
          Surveillance du système de compétences : OK.
        </p>
      </div>
    </div>

    <!-- Skill Categories -->
    <div class="flex flex-col gap-4">
      <div 
        v-for="cat in skills" 
        :key="cat.category" 
        class="bg-white border border-gray-300 rounded p-3"
      >
        <h5 class="font-bold text-[#0a246a] border-b border-gray-100 pb-1 mb-3 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
          📁 <span>{{ cat.category }}</span>
        </h5>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
          <div 
            v-for="skill in cat.items" 
            :key="skill.name" 
            class="flex flex-col gap-1"
          >
            <div class="flex justify-between items-center px-0.5">
              <span class="font-medium text-gray-800">{{ skill.name }}</span>
              <span class="text-[10px] text-gray-500 font-bold">{{ skill.level }}%</span>
            </div>
            
            <!-- XP Styled Progress Bar -->
            <div class="xp-progress-bar h-[12px] bg-gray-200 border border-gray-300 p-[1px] rounded-[1px] relative overflow-hidden shadow-inner flex">
              <!-- Pixelated green/blue blocks represent progress -->
              <div 
                class="progress-fill h-full bg-gradient-to-r from-emerald-500 to-green-500 flex gap-[2px] rounded-[1px]"
                :style="{ width: `${skill.level}%` }"
              >
                <!-- Retro divider lines on the progress bar -->
                <div class="w-[6px] h-full bg-white/20 flex-shrink-0"></div>
                <div class="w-[6px] h-full bg-white/20 flex-shrink-0"></div>
                <div class="w-[6px] h-full bg-white/20 flex-shrink-0"></div>
                <div class="w-[6px] h-full bg-white/20 flex-shrink-0"></div>
                <div class="w-[6px] h-full bg-white/20 flex-shrink-0"></div>
                <div class="w-[6px] h-full bg-white/20 flex-shrink-0"></div>
                <div class="w-[6px] h-full bg-white/20 flex-shrink-0"></div>
                <div class="w-[6px] h-full bg-white/20 flex-shrink-0"></div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.xp-progress-bar {
  box-shadow: inset 1px 1px 2px rgba(0,0,0,0.15);
}
.progress-fill {
  box-shadow: inset 1px 1px 1px rgba(255,255,255,0.4), inset -1px -1px 1px rgba(0,0,0,0.2);
}
</style>
