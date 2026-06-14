<script setup lang="ts">
import { ref, watch } from 'vue'

interface Wallpaper {
  type: string
  value: string
  label: string
}

const props = defineProps<{
  wallpapers: Wallpaper[]
  currentIndex: number
}>()

const emit = defineEmits<{
  (e: 'select-wallpaper', index: number): void
  (e: 'close'): void
}>()

const tempIndex = ref(props.currentIndex)

// Synchronize state if props change (e.g. from elsewhere)
watch(() => props.currentIndex, (newVal) => {
  tempIndex.value = newVal
})

const handleApply = () => {
  emit('select-wallpaper', tempIndex.value)
}

const handleOk = () => {
  handleApply()
  emit('close')
}

const handleCancel = () => {
  emit('close')
}
</script>

<template>
  <div class="bg-[#ece9d8] flex-1 flex flex-col font-sans text-xs text-black p-3 select-none justify-between h-full">
    <!-- Main content area split into columns -->
    <div class="flex flex-col gap-4 items-center">
      <!-- 1. Monitor Mockup Preview -->
      <div class="flex flex-col items-center">
        <!-- Monitor Frame -->
        <div class="w-[180px] h-[120px] bg-[#d8d4c0] border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080] rounded p-1.5 flex flex-col items-center justify-center shadow-md">
          <!-- CRT Screen Area -->
          <div class="w-full h-full border-2 border-b-white border-r-white border-t-[#808080] border-l-[#808080] bg-black overflow-hidden relative">
            <div 
              class="w-full h-full"
              :style="
                wallpapers[tempIndex].type === 'image'
                  ? { backgroundImage: wallpapers[tempIndex].value, backgroundSize: 'cover', backgroundPosition: 'center' }
                  : wallpapers[tempIndex].type === 'color'
                  ? { backgroundColor: wallpapers[tempIndex].value }
                  : { background: wallpapers[tempIndex].value }
              "
            ></div>
          </div>
        </div>
        <!-- Monitor Neck -->
        <div class="w-[24px] h-[12px] bg-[#c0bda8] border-x border-[#808080] -mt-[1px]"></div>
        <!-- Monitor Stand Base -->
        <div class="w-[80px] h-[6px] bg-[#d8d4c0] border-t border-x border-white rounded-t-sm shadow-sm"></div>
        <div class="w-[84px] h-[4px] bg-[#a09e90] border-x border-b border-[#808080] rounded-b-sm"></div>
      </div>

      <!-- 2. Selection Area -->
      <div class="w-full flex flex-col gap-1.5">
        <span class="text-gray-700 font-bold text-xs">Arrière-plan :</span>
        
        <div class="flex gap-3 h-[120px] w-full">
          <!-- Listbox -->
          <div class="flex-1 border-2 border-b-white border-r-white border-t-[#808080] border-l-[#808080] bg-white overflow-y-auto p-[1px]">
            <div 
              v-for="(wp, idx) in wallpapers" 
              :key="idx"
              class="px-2 py-1 cursor-default text-xs truncate flex items-center justify-between"
              :class="tempIndex === idx ? 'bg-[#316ac5] text-white' : 'text-black hover:bg-gray-100'"
              @click="tempIndex = idx"
            >
              <span>{{ wp.label }}</span>
              <span v-if="currentIndex === idx" class="text-[9px]" :class="tempIndex === idx ? 'text-sky-200' : 'text-green-600'">[Actuel]</span>
            </div>
          </div>

          <!-- Quick Actions on the side -->
          <div class="flex flex-col gap-2 w-[85px] justify-start">
            <button 
              class="xp-btn py-1 px-2 border text-center font-bold text-xs w-full cursor-pointer hover:bg-gray-50 active:brightness-95"
              @click="tempIndex = 0"
            >
              Par défaut
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Buttons Area -->
    <div class="flex justify-end gap-1.5 mt-4 pt-2 border-t border-[#d8d4c0]">
      <button 
        class="xp-btn py-1 px-4 min-w-[70px] text-center font-semibold cursor-pointer active:brightness-95"
        @click="handleOk"
      >
        OK
      </button>
      <button 
        class="xp-btn py-1 px-4 min-w-[70px] text-center cursor-pointer active:brightness-95"
        @click="handleCancel"
      >
        Annuler
      </button>
      <button 
        class="xp-btn py-1 px-4 min-w-[70px] text-center cursor-pointer active:brightness-95"
        :disabled="tempIndex === currentIndex"
        :class="{ 'opacity-50 pointer-events-none': tempIndex === currentIndex }"
        @click="handleApply"
      >
        Appliquer
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Windows XP classic 3D button styling */
.xp-btn {
  background: linear-gradient(180deg, #ffffff 0%, #ece9d8 100%);
  border: 1px solid #707070;
  border-radius: 3px;
  box-shadow: inset 1px 1px 0px #ffffff;
  outline: none;
}
.xp-btn:hover {
  background: linear-gradient(180deg, #f5f5f5 0%, #e1dfcc 100%);
  border-color: #505050;
}
.xp-btn:active {
  background: #e1dfcc;
  box-shadow: inset 1px 1px 2px rgba(0,0,0,0.2);
  border-color: #303030;
}
</style>
