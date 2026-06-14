<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import portfolioData from './data/portfolio.json'

// Components
import DesktopIcon from './components/DesktopIcon.vue'
import Window from './components/Window.vue'
import Taskbar from './components/Taskbar.vue'
import StartMenu from './components/StartMenu.vue'
import AlertDialog from './components/AlertDialog.vue'

// Window Contents
import MyComputer from './components/MyComputer.vue'
import ProjectsList from './components/ProjectsList.vue'
import ProjectDetail from './components/ProjectDetail.vue'
import SkillsViewer from './components/SkillsViewer.vue'
import ResumeViewer from './components/ResumeViewer.vue'
import Minesweeper from './components/Minesweeper.vue'
import Sudoku from './components/Sudoku.vue'
import MailApp from './components/MailApp.vue'
import DisplayProperties from './components/DisplayProperties.vue'

interface WindowState {
  id: string
  title: string
  isOpen: boolean
  isMinimized: boolean
  isMaximized: boolean
  zIndex: number
  x: number
  y: number
  width: number
  height: number
  icon?: string
}

// Boot State: 'power_off' | 'booting' | 'fading' | 'desktop'
const bootState = ref<'power_off' | 'booting' | 'fading' | 'desktop'>('power_off')

const isCrtActive = ref(true)

const toggleCrt = () => {
  isCrtActive.value = !isCrtActive.value
  localStorage.setItem('crt-preference', isCrtActive.value.toString())
}

const powerOn = () => {
  bootState.value = 'booting'
  
  // Start fading out the boot screen at 3.5s
  setTimeout(() => {
    bootState.value = 'fading'
  }, 3500)
  
  // Transition to desktop at 4.0s
  setTimeout(() => {
    bootState.value = 'desktop'
    
    // Play startup sound when reaching the desktop
    const audio = new Audio('/assets/startup_sound.wav')
    audio.volume = 0.5
    audio.play().catch(err => {
      console.warn('Audio playback failed or was blocked by browser:', err)
    })
  }, 4000)
}

// Global active z-index counter
const currentMaxZIndex = ref(10)
const selectedIconId = ref<string | null>(null)
const isStartMenuOpen = ref(false)

// For project detail selection in Projects window
const selectedProjectId = ref<string | null>(null)
const selectedProject = computed(() => {
  return portfolioData.projects.find(p => p.id === selectedProjectId.value) || null
})

// Desktop shortcut icons configuration
const desktopIcons = ref([
  { id: 'computer', label: 'Poste de travail', icon: '/assets/icons/computer.png' },
  { id: 'projects', label: 'Mes Projets', icon: '/assets/icons/folder_documents.png' },
  { id: 'skills', label: 'Mes Compétences', icon: '/assets/icons/skills.png' },
  { id: 'resume', label: 'CV', icon: '/assets/icons/resume.png' },
  { id: 'mail', label: 'Outlook Express', icon: '/assets/icons/mail.svg' },
  { id: 'trash', label: 'Corbeille', icon: '/assets/icons/recycle_bin.png' }
])

const wallpapers = [
  { type: 'image', value: "url('/assets/wallpapers/bliss.jpg')", label: 'Bliss (Par défaut)' },
  { type: 'image', value: "url('/assets/wallpapers/sea.png')", label: 'La Mer' },
  { type: 'image', value: "url('/assets/wallpapers/moutain.jpg')", label: 'La Montagne' },
  { type: 'image', value: "url('/assets/wallpapers/cave.jpg')", label: 'La Grotte' },
  { type: 'image', value: "url('/assets/wallpapers/egypt.jpg')", label: 'Égypte' },
  { type: 'image', value: "url('/assets/wallpapers/forest.jpg')", label: 'Forêt' },
  { type: 'color', value: '#008080', label: 'Windows 98 Vert (Teal)' },
  { type: 'color', value: '#3a6ea5', label: 'Windows XP Bleu' },
  { type: 'gradient', value: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', label: 'Bleu Royal' }
]
const currentWallpaperIndex = ref(0)
const wallpaperStyle = computed(() => {
  const wp = wallpapers[currentWallpaperIndex.value]
  if (wp.type === 'image') {
    return { backgroundImage: wp.value, backgroundSize: 'cover', backgroundPosition: 'center' }
  } else if (wp.type === 'color') {
    return { backgroundColor: wp.value, backgroundImage: 'none' }
  } else {
    return { background: wp.value }
  }
})


// Windows configurations and initial states
const windows = reactive<Record<string, WindowState>>({
  computer: {
    id: 'computer',
    title: 'Poste de travail',
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    zIndex: 1,
    x: 50,
    y: 50,
    width: 600,
    height: 400
  },
  projects: {
    id: 'projects',
    title: 'Mes Projets',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 2,
    x: 100,
    y: 100,
    width: 650,
    height: 450
  },
  skills: {
    id: 'skills',
    title: 'Mes Compétences',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 3,
    x: 150,
    y: 80,
    width: 580,
    height: 420
  },
  resume: {
    id: 'resume',
    title: 'CV',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 4,
    x: 200,
    y: 60,
    width: 600,
    height: 480
  },
  minesweeper: {
    id: 'minesweeper',
    title: 'Démineur',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 5,
    x: 120,
    y: 80,
    width: 252,
    height: 375,
    icon: '/assets/icons/minesweeper.svg'
  },
  sudoku: {
    id: 'sudoku',
    title: 'Sudoku',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 6,
    x: 150,
    y: 100,
    width: 360,
    height: 500,
    icon: '/assets/icons/sudoku.svg'
  },
  mail: {
    id: 'mail',
    title: 'Outlook Express - Nouveau message',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 7,
    x: 180,
    y: 80,
    width: 580,
    height: 460,
    icon: '/assets/icons/mail.svg'
  },
  display: {
    id: 'display',
    title: 'Propriétés de l\'affichage',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 8,
    x: 220,
    y: 70,
    width: 320,
    height: 420,
    icon: '/assets/icons/computer.png'
  }
})

// Track window focus ID
const activeWindowId = ref<string | null>('computer')

// List of open windows for Taskbar
const openWindowsList = computed(() => {
  return Object.values(windows)
    .filter(w => w.isOpen)
    .map(w => ({
      id: w.id,
      title: w.title,
      isOpen: w.isOpen,
      isMinimized: w.isMinimized,
      zIndex: w.zIndex,
      isActive: w.id === activeWindowId.value && !w.isMinimized,
      icon: w.icon
    }))
})

// Window Actions
const focusWindow = (id: string) => {
  if (windows[id]) {
    currentMaxZIndex.value++
    windows[id].zIndex = currentMaxZIndex.value
    windows[id].isMinimized = false
    activeWindowId.value = id
  }
}

// Custom Alert Dialog State
const alertDialog = reactive({
  isOpen: false,
  title: 'Message',
  message: '',
  type: 'info' as 'info' | 'warning' | 'error'
})

const showCustomAlert = (message: string, title = 'Message', type: 'info' | 'warning' | 'error' = 'info') => {
  alertDialog.message = message
  alertDialog.title = title
  alertDialog.type = type
  alertDialog.isOpen = true
}

const openWindow = (id: string) => {
  if (id === 'trash') {
    showCustomAlert("La corbeille est vide !", "Corbeille", "info")
    return
  }
  if (id.startsWith('new_folder_')) {
    showCustomAlert("Ce dossier est vide.", "Dossier vide", "info")
    return
  }
  if (windows[id]) {
    windows[id].isOpen = true
    focusWindow(id)
  }
}

const closeWindow = (id: string) => {
  if (windows[id]) {
    windows[id].isOpen = false
    if (activeWindowId.value === id) {
      activeWindowId.value = null
    }
  }
}

const minimizeWindow = (id: string) => {
  if (windows[id]) {
    windows[id].isMinimized = true
    if (activeWindowId.value === id) {
      activeWindowId.value = null
    }
  }
}

const maximizeWindow = (id: string) => {
  if (windows[id]) {
    windows[id].isMaximized = !windows[id].isMaximized
    focusWindow(id)
  }
}

const moveWindow = (payload: { id: string; x: number; y: number }) => {
  if (windows[payload.id]) {
    windows[payload.id].x = payload.x
    windows[payload.id].y = payload.y
  }
}

const resizeWindow = (payload: { id: string; x: number; y: number; width: number; height: number }) => {
  if (windows[payload.id]) {
    windows[payload.id].x = payload.x
    windows[payload.id].y = payload.y
    windows[payload.id].width = payload.width
    windows[payload.id].height = payload.height
  }
}

const handleMinesweeperResize = (payload: { width: number; height: number }) => {
  if (windows.minesweeper) {
    windows.minesweeper.width = payload.width
    windows.minesweeper.height = payload.height
  }
}

const handleSudokuResize = (payload: { width: number; height: number }) => {
  if (windows.sudoku) {
    windows.sudoku.width = payload.width
    windows.sudoku.height = payload.height
  }
}

const handleTaskClick = (id: string) => {
  const win = windows[id]
  if (!win) return

  if (win.isMinimized) {
    focusWindow(id)
  } else if (activeWindowId.value === id) {
    minimizeWindow(id)
  } else {
    focusWindow(id)
  }
}

const contextMenu = reactive({
  isOpen: false,
  x: 0,
  y: 0
})

const isRefreshing = ref(false)

const handleDesktopClick = () => {
  selectedIconId.value = null
  isStartMenuOpen.value = false
  contextMenu.isOpen = false
}

const handleDesktopRightClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  
  const isDesktopBg = target.classList.contains('desktop-bg') || 
                      (target.closest('.desktop-grid-area') !== null && 
                       target.closest('.window') === null && 
                       target.closest('.desktop-icon') === null &&
                       target.closest('.start-button') === null &&
                       target.closest('.taskbar') === null &&
                       target.closest('.start-menu') === null)
                      
  if (!isDesktopBg) {
    return
  }
  
  contextMenu.x = e.clientX
  contextMenu.y = e.clientY
  contextMenu.isOpen = true
}

const arrangeIcons = () => {
  contextMenu.isOpen = false
  desktopIcons.value.sort((a, b) => a.label.localeCompare(b.label))
  isRefreshing.value = true
  setTimeout(() => {
    isRefreshing.value = false
  }, 200)
}

const refreshDesktop = () => {
  contextMenu.isOpen = false
  isRefreshing.value = true
  setTimeout(() => {
    isRefreshing.value = false
  }, 250)
}



const toggleCrtEffect = () => {
  contextMenu.isOpen = false
  toggleCrt()
}

const changeWallpaper = () => {
  contextMenu.isOpen = false
  openWindow('display')
}

const openProperties = () => {
  contextMenu.isOpen = false
  openWindow('display')
}

const closeAllWindows = () => {
  Object.keys(windows).forEach(key => {
    windows[key].isOpen = false
  })
  selectedProjectId.value = null
  activeWindowId.value = null
}

// Handle project selection inside projects window
const selectProject = (projectId: string) => {
  selectedProjectId.value = projectId
  focusWindow('projects')
}

// Adapt layout for mobile devices
const checkMobileLayout = () => {
  const isMobile = window.innerWidth < 768
  Object.keys(windows).forEach(key => {
    windows[key].isMaximized = isMobile
  })
}

const handleWindowClick = () => {
  contextMenu.isOpen = false
}

onMounted(() => {
  checkMobileLayout()
  window.addEventListener('resize', checkMobileLayout)
  window.addEventListener('click', handleWindowClick)
  
  const saved = localStorage.getItem('crt-preference')
  if (saved !== null) {
    isCrtActive.value = saved === 'true'
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobileLayout)
  window.removeEventListener('click', handleWindowClick)
})
</script>

<template>
  <!-- 1. Écran de Démarrage Initial (power_off) -->
  <div v-if="bootState === 'power_off'" class="w-screen h-screen bg-black flex flex-col items-center justify-center font-sans select-none p-4">
    <div 
      role="button"
      tabindex="0"
      class="w-20 h-20 rounded-full xp-power-button flex items-center justify-center cursor-pointer active:scale-95 transition-all duration-200"
      @click="powerOn"
      @keydown.enter="powerOn"
      @keydown.space.prevent="powerOn"
    >
      <span class="text-4xl text-white font-bold drop-shadow-[0_2px_3px_rgba(0,0,0,0.6)]">⏻</span>
    </div>
    <span class="text-xs text-zinc-400 uppercase tracking-widest mt-4 font-semibold">
      Cliquer pour démarrer
    </span>
  </div>

  <!-- 2. Bureau et Superposition de Boot (bootState !== 'power_off') -->
  <template v-else>
    <div class="crt-effects-container" :class="{ 'crt-enabled': isCrtActive }">
      <div class="crt-screen-inner">
        <!-- Bureau Virtuel -->
        <div 
          class="relative w-screen h-screen overflow-hidden desktop-bg flex flex-col font-sans select-none"
          :style="wallpaperStyle"
          @click="handleDesktopClick"
          @contextmenu.prevent="handleDesktopRightClick"
        >
      
      <!-- 1. Bureau Grid Area (Icons + Windows) -->
      <div 
        class="flex-1 w-full h-[calc(100vh-30px)] p-3 relative desktop-grid-area transition-opacity duration-150"
        :class="{ 'opacity-30': isRefreshing }"
      >
        
        <!-- Desktop Icons Grid (Left column) -->
        <div class="absolute left-3 top-3 flex flex-col gap-4 z-0">
          <DesktopIcon
            v-for="icon in desktopIcons"
            :key="icon.id"
            :id="icon.id"
            :label="icon.label"
            :icon-src="icon.icon"
            :is-selected="selectedIconId === icon.id"
            @select="selectedIconId = $event"
            @open="openWindow"
          />
        </div>

        <!-- Desktop Icons Grid (Right column) -->
        <div class="absolute right-3 top-3 flex flex-col gap-4 z-0">
          <DesktopIcon
            id="minesweeper"
            label="Démineur"
            icon-src="/assets/icons/minesweeper.svg"
            :is-selected="selectedIconId === 'minesweeper'"
            @select="selectedIconId = $event"
            @open="openWindow"
          />
          <DesktopIcon
            id="sudoku"
            label="Sudoku"
            icon-src="/assets/icons/sudoku.svg"
            :is-selected="selectedIconId === 'sudoku'"
            @select="selectedIconId = $event"
            @open="openWindow"
          />
        </div>

        <!-- 2. Windows Render Loop -->
        
        <!-- WINDOW: Poste de travail -->
        <Window
          v-if="windows.computer.isOpen"
          :id="windows.computer.id"
          :title="windows.computer.title"
          :is-open="windows.computer.isOpen"
          :is-minimized="windows.computer.isMinimized"
          :is-maximized="windows.computer.isMaximized"
          :z-index="windows.computer.zIndex"
          :x="windows.computer.x"
          :y="windows.computer.y"
          :width="windows.computer.width"
          :height="windows.computer.height"
          :min-width="600"
          :min-height="400"
          @focus="focusWindow"
          @close="closeWindow"
          @minimize="minimizeWindow"
          @maximize="maximizeWindow"
          @move="moveWindow"
          @resize="resizeWindow"
        >
          <template #icon>
            <img src="/assets/icons/computer.png" alt="" class="w-4 h-4 object-contain pointer-events-none" />
          </template>
          <MyComputer @open-folder="openWindow" />
        </Window>

        <!-- WINDOW: Mes Projets -->
        <Window
          v-if="windows.projects.isOpen"
          :id="windows.projects.id"
          :title="windows.projects.title"
          :is-open="windows.projects.isOpen"
          :is-minimized="windows.projects.isMinimized"
          :is-maximized="windows.projects.isMaximized"
          :z-index="windows.projects.zIndex"
          :x="windows.projects.x"
          :y="windows.projects.y"
          :width="windows.projects.width"
          :height="windows.projects.height"
          :min-width="650"
          :min-height="450"
          @focus="focusWindow"
          @close="closeWindow"
          @minimize="minimizeWindow"
          @maximize="maximizeWindow"
          @move="moveWindow"
          @resize="resizeWindow"
        >
          <template #icon>
            <img src="/assets/icons/folder_documents.png" alt="" class="w-4 h-4 object-contain pointer-events-none" />
          </template>
          
          <ProjectDetail 
            v-if="selectedProjectId && selectedProject" 
            :project="selectedProject" 
            @back="selectedProjectId = null" 
          />
          <ProjectsList 
            v-else 
            :projects="portfolioData.projects" 
            @select-project="selectProject" 
          />
        </Window>

        <!-- WINDOW: Mes Compétences -->
        <Window
          v-if="windows.skills.isOpen"
          :id="windows.skills.id"
          :title="windows.skills.title"
          :is-open="windows.skills.isOpen"
          :is-minimized="windows.skills.isMinimized"
          :is-maximized="windows.skills.isMaximized"
          :z-index="windows.skills.zIndex"
          :x="windows.skills.x"
          :y="windows.skills.y"
          :width="windows.skills.width"
          :height="windows.skills.height"
          :min-width="580"
          :min-height="420"
          @focus="focusWindow"
          @close="closeWindow"
          @minimize="minimizeWindow"
          @maximize="maximizeWindow"
          @move="moveWindow"
          @resize="resizeWindow"
        >
          <template #icon>
            <img src="/assets/icons/skills.png" alt="" class="w-4 h-4 object-contain pointer-events-none" />
          </template>
          <SkillsViewer :skills="portfolioData.skills" />
        </Window>

        <!-- WINDOW: Mon Parcours -->
        <Window
          v-if="windows.resume.isOpen"
          :id="windows.resume.id"
          :title="windows.resume.title"
          :is-open="windows.resume.isOpen"
          :is-minimized="windows.resume.isMinimized"
          :is-maximized="windows.resume.isMaximized"
          :z-index="windows.resume.zIndex"
          :x="windows.resume.x"
          :y="windows.resume.y"
          :width="windows.resume.width"
          :height="windows.resume.height"
          :min-width="600"
          :min-height="480"
          @focus="focusWindow"
          @close="closeWindow"
          @minimize="minimizeWindow"
          @maximize="maximizeWindow"
          @move="moveWindow"
          @resize="resizeWindow"
        >
          <template #icon>
            <img src="/assets/icons/resume.png" alt="" class="w-4 h-4 object-contain pointer-events-none" />
          </template>
          <ResumeViewer :experience="portfolioData.experience" />
        </Window>

        <!-- WINDOW: Démineur -->
        <Window
          v-if="windows.minesweeper.isOpen"
          :id="windows.minesweeper.id"
          :title="windows.minesweeper.title"
          :is-open="windows.minesweeper.isOpen"
          :is-minimized="windows.minesweeper.isMinimized"
          :is-maximized="windows.minesweeper.isMaximized"
          :z-index="windows.minesweeper.zIndex"
          :x="windows.minesweeper.x"
          :y="windows.minesweeper.y"
          :width="windows.minesweeper.width"
          :height="windows.minesweeper.height"
          :min-width="200"
          :min-height="300"
          @focus="focusWindow"
          @close="closeWindow"
          @minimize="minimizeWindow"
          @maximize="maximizeWindow"
          @move="moveWindow"
          @resize="resizeWindow"
        >
          <template #icon>
            <img src="/assets/icons/minesweeper.svg" alt="" class="w-4 h-4 object-contain pointer-events-none" />
          </template>
          <Minesweeper 
            @resize-window="handleMinesweeperResize" 
            @close-app="closeWindow('minesweeper')" 
            @show-alert="payload => showCustomAlert(payload.message, payload.title, payload.type)"
          />
        </Window>

        <!-- WINDOW: Sudoku -->
        <Window
          v-if="windows.sudoku.isOpen"
          :id="windows.sudoku.id"
          :title="windows.sudoku.title"
          :is-open="windows.sudoku.isOpen"
          :is-minimized="windows.sudoku.isMinimized"
          :is-maximized="windows.sudoku.isMaximized"
          :z-index="windows.sudoku.zIndex"
          :x="windows.sudoku.x"
          :y="windows.sudoku.y"
          :width="windows.sudoku.width"
          :height="windows.sudoku.height"
          :min-width="320"
          :min-height="450"
          @focus="focusWindow"
          @close="closeWindow"
          @minimize="minimizeWindow"
          @maximize="maximizeWindow"
          @move="moveWindow"
          @resize="resizeWindow"
        >
          <template #icon>
            <img src="/assets/icons/sudoku.svg" alt="" class="w-4 h-4 object-contain pointer-events-none" />
          </template>
          <Sudoku 
            @resize-window="handleSudokuResize" 
            @close-app="closeWindow('sudoku')" 
            @show-alert="payload => showCustomAlert(payload.message, payload.title, payload.type)"
          />
        </Window>

        <!-- WINDOW: Outlook Express -->
        <Window
          v-if="windows.mail.isOpen"
          :id="windows.mail.id"
          :title="windows.mail.title"
          :is-open="windows.mail.isOpen"
          :is-minimized="windows.mail.isMinimized"
          :is-maximized="windows.mail.isMaximized"
          :z-index="windows.mail.zIndex"
          :x="windows.mail.x"
          :y="windows.mail.y"
          :width="windows.mail.width"
          :height="windows.mail.height"
          :min-width="480"
          :min-height="350"
          @focus="focusWindow"
          @close="closeWindow"
          @minimize="minimizeWindow"
          @maximize="maximizeWindow"
          @move="moveWindow"
          @resize="resizeWindow"
        >
          <template #icon>
            <img src="/assets/icons/mail.svg" alt="" class="w-4 h-4 object-contain pointer-events-none" />
          </template>
          <MailApp 
            :portfolio-email="portfolioData.profile.email"
            @close-app="closeWindow('mail')"
            @show-alert="payload => showCustomAlert(payload.message, payload.title, payload.type)"
          />
        </Window>

        <!-- WINDOW: Propriétés de l'affichage -->
        <Window
          v-if="windows.display.isOpen"
          :id="windows.display.id"
          :title="windows.display.title"
          :is-open="windows.display.isOpen"
          :is-minimized="windows.display.isMinimized"
          :is-maximized="windows.display.isMaximized"
          :z-index="windows.display.zIndex"
          :x="windows.display.x"
          :y="windows.display.y"
          :width="windows.display.width"
          :height="windows.display.height"
          :min-width="320"
          :min-height="420"
          @focus="focusWindow"
          @close="closeWindow"
          @minimize="minimizeWindow"
          @maximize="maximizeWindow"
          @move="moveWindow"
          @resize="resizeWindow"
        >
          <template #icon>
            <img src="/assets/icons/computer.png" alt="" class="w-4 h-4 object-contain pointer-events-none" />
          </template>
          <DisplayProperties 
            :wallpapers="wallpapers"
            :current-index="currentWallpaperIndex"
            @select-wallpaper="currentWallpaperIndex = $event"
            @close="closeWindow('display')"
          />
        </Window>

      </div>

      <!-- 3. Start Menu Panel -->
      <StartMenu
        :is-open="isStartMenuOpen"
        :is-crt-active="isCrtActive"
        @close="isStartMenuOpen = false"
        @open-app="openWindow"
        @close-all="closeAllWindows"
        @toggle-crt="toggleCrt"
      />

      <!-- 4. Taskbar Bottom Area -->
      <Taskbar
        :windows="openWindowsList"
        :is-start-menu-open="isStartMenuOpen"
        :is-crt-active="isCrtActive"
        @toggle-start="isStartMenuOpen = !isStartMenuOpen"
        @task-click="handleTaskClick"
        @toggle-crt="toggleCrt"
      />

      <!-- Custom Alert Dialog Modal -->
      <AlertDialog
        :is-open="alertDialog.isOpen"
        :title="alertDialog.title"
        :message="alertDialog.message"
        :type="alertDialog.type"
        @close="alertDialog.isOpen = false"
      />

      <!-- Custom Windows XP style Context Menu -->
      <div 
        v-if="contextMenu.isOpen"
        class="fixed z-[9999999] bg-[#f1eec0] md:bg-[#ece9d8] border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080] shadow-[2px_2px_4px_rgba(0,0,0,0.4)] p-0.5 text-xs text-black font-sans min-w-[170px] pointer-events-auto"
        :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
        @click.stop
      >
        <div class="hover:bg-[#316ac5] hover:text-white px-6 py-1 cursor-default flex justify-between items-center gap-4" @click="arrangeIcons">
          <span>Réorganiser les icônes</span>
        </div>
        <div class="hover:bg-[#316ac5] hover:text-white px-6 py-1 cursor-default flex justify-between items-center gap-4" @click="refreshDesktop">
          <span>Actualiser</span>
        </div>
        
        <div class="h-[1px] bg-[#808080] my-1 mx-1 shadow-[0_1px_0_#ffffff]"></div>
        
        <div class="hover:bg-[#316ac5] hover:text-white px-6 py-1 cursor-default flex justify-between items-center gap-4" @click="toggleCrtEffect">
          <span class="flex items-center gap-2">
            <span class="w-3 text-center text-xs font-bold">{{ isCrtActive ? '✓' : '' }}</span>
            <span>Effet Écran CRT</span>
          </span>
        </div>
        
        <div class="hover:bg-[#316ac5] hover:text-white px-6 py-1 cursor-default flex justify-between items-center gap-4" @click="changeWallpaper">
          <span>Changer de fond d'écran</span>
        </div>
        
        <div class="h-[1px] bg-[#808080] my-1 mx-1 shadow-[0_1px_0_#ffffff]"></div>
        
        <div class="hover:bg-[#316ac5] hover:text-white px-6 py-1 cursor-default flex justify-between items-center gap-4" @click="openProperties">
          <span class="font-bold">Propriétés</span>
        </div>
      </div>

    </div>

    <!-- Écran de Boot Windows XP (Superposé en z-[999999]) -->
    <div 
      v-if="bootState === 'booting' || bootState === 'fading'" 
      class="fixed inset-0 w-screen h-screen bg-black flex flex-col items-center justify-center font-sans text-white select-none z-[999999] transition-opacity duration-500"
      :class="bootState === 'fading' ? 'opacity-0 pointer-events-none' : 'opacity-100'"
    >
      <div class="flex flex-col items-center justify-center gap-4">
        
        <!-- Drapeau Windows XP recréé en CSS -->
        <div class="relative w-24 h-20 transform -skew-x-12 rotate-6 scale-90 mb-4 flex flex-col gap-1 pointer-events-none">
          <div class="flex gap-1 h-1/2">
            <div class="w-1/2 h-full bg-[#f35427] rounded-tl-[6px] rounded-br-[10px] shadow-lg"></div>
            <div class="w-1/2 h-full bg-[#4ebd1b] rounded-tr-[10px] rounded-bl-[6px] shadow-lg"></div>
          </div>
          <div class="flex gap-1 h-1/2">
            <div class="w-1/2 h-full bg-[#00a1f1] rounded-bl-[10px] rounded-tr-[6px] shadow-lg"></div>
            <div class="w-1/2 h-full bg-[#ffb900] rounded-br-[6px] rounded-tl-[10px] shadow-lg"></div>
          </div>
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none transform -rotate-12"></div>
        </div>

        <!-- Titre Thomas OS -->
        <div class="flex flex-col items-center text-center">
          <div class="flex items-baseline gap-1">
            <span class="text-2xl font-bold tracking-tight text-white">Thomas</span>
            <span class="text-lg font-bold italic text-[#00a1f1]">OS</span>
          </div>
          <div class="w-40 h-[1px] bg-gradient-to-r from-transparent via-zinc-700 to-transparent my-1"></div>
          <span class="text-[8px] uppercase tracking-[0.25em] text-zinc-500 font-bold">Edition Professionnelle</span>
        </div>

        <!-- Barre de chargement XP (Power loader) -->
        <div class="mt-16 flex flex-col items-center">
          <div class="w-[150px] h-[15px] border-2 border-zinc-700 bg-black rounded p-[1px] relative overflow-hidden flex items-center shadow-inner">
            <div class="absolute h-[9px] flex gap-[2.5px] animate-xp-boot-load">
              <div class="w-2.5 h-full bg-gradient-to-b from-sky-400 via-blue-500 to-blue-600 rounded-[1px] shadow-[0_0_2px_rgba(56,189,248,0.5)]"></div>
              <div class="w-2.5 h-full bg-gradient-to-b from-sky-400 via-blue-500 to-blue-600 rounded-[1px] shadow-[0_0_2px_rgba(56,189,248,0.5)]"></div>
              <div class="w-2.5 h-full bg-gradient-to-b from-sky-400 via-blue-500 to-blue-600 rounded-[1px] shadow-[0_0_2px_rgba(56,189,248,0.5)]"></div>
            </div>
          </div>
        </div>

      </div>

      <!-- Copyright -->
      <div class="absolute bottom-6 text-[9px] text-zinc-600 font-light flex flex-col items-center gap-0.5">
        <span>Copyright © 2026 Thomas LY. Tous droits réservés.</span>
        <span class="opacity-55 text-[7px]">Propulsé par Vue 3 & Tailwind v4</span>
      </div>
    </div>
    
      </div> <!-- Close crt-screen-inner -->
      <div class="crt-vignette"></div>
    </div> <!-- Close crt-effects-container -->


  </template>
</template>

<style>
/* Reset and utilities */
body {
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

/* XP turn-off style power button (Monochrome Grayscale theme style) */
.xp-power-button {
  background: linear-gradient(180deg, #6b6b6b 0%, #444444 40%, #2c2c2c 70%, #181818 100%);
  border: 1.5px solid #2d2d2d;
  box-shadow: 
    inset 0 2px 3px rgba(255,255,255,0.4),
    inset 0 -2px 3px rgba(0,0,0,0.4),
    0 4px 8px rgba(0,0,0,0.5);
  position: relative;
  overflow: hidden;
}

.xp-power-button::after {
  content: "";
  position: absolute;
  top: 1px;
  left: 10%;
  width: 80%;
  height: 40%;
  background: linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.0) 100%);
  border-radius: 50% 50% 20% 20% / 60% 60% 30% 30%;
  pointer-events: none;
}

.xp-power-button:hover {
  background: linear-gradient(180deg, #8b8b8b 0%, #5e5e5e 40%, #3d3d3d 70%, #222222 100%);
  border-color: #3d3d3d;
  box-shadow: 
    inset 0 2px 4px rgba(255,255,255,0.5),
    inset 0 -2px 3px rgba(0,0,0,0.3),
    0 0 12px rgba(255,255,255,0.15);
}

.xp-power-button:active {
  background: linear-gradient(180deg, #181818 0%, #3a3a3a 100%);
  border-color: #111111;
  box-shadow: 
    inset 0 3px 5px rgba(0,0,0,0.8),
    0 1px 2px rgba(0,0,0,0.3);
}

/* Boot loader sliding animation */
@keyframes xp-boot-load {
  0% { left: -38px; }
  100% { left: 150px; }
}

.animate-xp-boot-load {
  animation: xp-boot-load 1.8s linear infinite;
  position: absolute;
}
</style>
