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
    <div class="font-bold text-gray-500 pb-1 border-b border-gray-200 mb-3 text-xs">
      Propriétés système : Compétences de Thomas
    </div>

    <!-- System info style box -->
    <div class="bg-white border border-gray-300 rounded p-3 mb-4 shadow-sm flex items-start gap-4">
      <img src="/assets/icons/skills.png" alt="Skills" class="w-10 h-10 object-contain flex-shrink-0" />
      <div>
        <h4 class="font-bold text-[#0a246a] text-sm">Thomas - Développeur Fullstack</h4>
      </div>
    </div>

    <!-- Skill Categories -->
    <div class="flex flex-col gap-4">
      <div 
        v-for="cat in skills" 
        :key="cat.category" 
        class="bg-white border border-gray-300 rounded p-3"
      >
        <h5 class="font-bold text-[#0a246a] border-b border-gray-100 pb-1 mb-3 text-xs uppercase tracking-wider flex items-center gap-1.5">
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
              <span class="text-xs text-gray-500 font-bold">{{ skill.level }}%</span>
            </div>
            
            <!-- XP Styled Progress Bar -->
            <div class="xp-progress-bar h-[12px] bg-gray-150 border border-gray-300 p-[1px] rounded-[1px] relative overflow-hidden flex">
              <!-- Segmented green blocks represent progress -->
              <div 
                class="progress-fill h-full rounded-[1px]"
                :style="{ width: `${skill.level}%` }"
              ></div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.xp-progress-bar {
  box-shadow: inset 1px 1px 2px rgba(0,0,0,0.2);
  background-color: #e2e2e2;
}
.progress-fill {
  background-image: 
    linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.7) 0%,
      rgba(255, 255, 255, 0.15) 25%,
      rgba(0, 0, 0, 0.05) 50%,
      rgba(0, 0, 0, 0.25) 80%,
      rgba(255, 255, 255, 0.4) 100%
    ),
    linear-gradient(
      90deg,
      #3cc13c 0px,
      #3cc13c 6px,
      transparent 6px,
      transparent 8px
    );
  background-size: 100% 100%, 8px 100%;
  box-shadow: inset 1px 1px 1px rgba(255,255,255,0.4);
}
</style>
