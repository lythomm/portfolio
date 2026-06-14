<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

interface Cell {
  row: number
  col: number
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  isQuestioned: boolean
  neighborMines: number
  exploded: boolean
}

const emit = defineEmits<{
  (e: 'resize-window', payload: { width: number; height: number }): void
  (e: 'close-app'): void
  (e: 'show-alert', payload: { message: string; title: string; type: 'info' | 'warning' | 'error' }): void
}>()

// Game settings
type Difficulty = 'beginner' | 'intermediate' | 'expert'
const difficulty = ref<Difficulty>('beginner')

interface DiffSetting {
  rows: number
  cols: number
  mines: number
  winWidth: number
  winHeight: number
}

const settings: Record<Difficulty, DiffSetting> = {
  beginner: { rows: 9, cols: 9, mines: 10, winWidth: 252, winHeight: 375 },
  intermediate: { rows: 16, cols: 16, mines: 40, winWidth: 420, winHeight: 543 },
  expert: { rows: 16, cols: 30, mines: 99, winWidth: 756, winHeight: 543 }
}

// Board State
const rows = computed(() => settings[difficulty.value].rows)
const cols = computed(() => settings[difficulty.value].cols)
const totalMines = computed(() => settings[difficulty.value].mines)

const grid = ref<Cell[][]>([])
const gameStatus = ref<'idle' | 'playing' | 'won' | 'lost'>('idle')
const timer = ref(0)
const isLMBDown = ref(false) // Left mouse button down on grid (for 😮 smiley)
const activeMenu = ref<'game' | 'help' | null>(null)



let timerInterval: any = null

// Flag count is calculated as totalMines minus the number of flags placed
const flagsCount = computed(() => {
  let count = 0
  for (let r = 0; r < rows.value; r++) {
    for (let c = 0; c < cols.value; c++) {
      if (grid.value[r] && grid.value[r][c] && grid.value[r][c].isFlagged) {
        count++
      }
    }
  }
  return totalMines.value - count
})

// Smiley indicator emoji
const smileyEmoji = computed(() => {
  if (gameStatus.value === 'won') return '😎'
  if (gameStatus.value === 'lost') return '😵'
  if (isLMBDown.value) return '😮'
  return '🙂'
})

// Initialize Board with empty cells
const initializeGrid = () => {
  const newGrid: Cell[][] = []
  for (let r = 0; r < rows.value; r++) {
    const rowCells: Cell[] = []
    for (let c = 0; c < cols.value; c++) {
      rowCells.push({
        row: r,
        col: c,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        isQuestioned: false,
        neighborMines: 0,
        exploded: false
      })
    }
    newGrid.push(rowCells)
  }
  grid.value = newGrid
  gameStatus.value = 'idle'
  timer.value = 0
  stopTimer()
}

// Start Timer
const startTimer = () => {
  stopTimer()
  timerInterval = setInterval(() => {
    if (timer.value < 999) {
      timer.value++
    }
  }, 1000)
}

// Stop Timer
const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

// Place mines randomly after the first click
const placeMines = (excludeRow: number, excludeCol: number) => {
  let minesPlaced = 0
  while (minesPlaced < totalMines.value) {
    const r = Math.floor(Math.random() * rows.value)
    const c = Math.floor(Math.random() * cols.value)

    // Exclude the clicked cell and its immediate 8 neighbors to give a nice opening
    const isExcluded = Math.abs(r - excludeRow) <= 1 && Math.abs(c - excludeCol) <= 1

    if (!grid.value[r][c].isMine && !isExcluded) {
      grid.value[r][c].isMine = true
      minesPlaced++
    }
  }

  // Calculate neighbor counts
  for (let r = 0; r < rows.value; r++) {
    for (let c = 0; c < cols.value; c++) {
      if (!grid.value[r][c].isMine) {
        grid.value[r][c].neighborMines = countNeighborMines(r, c)
      }
    }
  }
}

// Count neighbor mines
const countNeighborMines = (row: number, col: number): number => {
  let count = 0
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const nr = row + dr
      const nc = col + dc
      if (nr >= 0 && nr < rows.value && nc >= 0 && nc < cols.value) {
        if (grid.value[nr][nc].isMine) {
          count++
        }
      }
    }
  }
  return count
}

// Left click: Reveal Cell
const handleLeftClick = (row: number, col: number) => {
  if (gameStatus.value === 'won' || gameStatus.value === 'lost') return
  
  const cell = grid.value[row][col]
  if (cell.isRevealed || cell.isFlagged) return

  // First click safety
  if (gameStatus.value === 'idle') {
    gameStatus.value = 'playing'
    placeMines(row, col)
    startTimer()
  }

  revealCell(row, col)
  checkWin()
}

// Recursive reveal
const revealCell = (row: number, col: number) => {
  const cell = grid.value[row][col]
  if (cell.isRevealed || cell.isFlagged) return

  cell.isRevealed = true

  if (cell.isMine) {
    // Boom!
    cell.exploded = true
    handleGameOver()
    return
  }

  if (cell.neighborMines === 0) {
    // Cascade reveal neighbors
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = row + dr
        const nc = col + dc
        if (nr >= 0 && nr < rows.value && nc >= 0 && nc < cols.value) {
          revealCell(nr, nc)
        }
      }
    }
  }
}

// Right click: Flag / Question mark cycle
const handleRightClick = (e: Event, row: number, col: number) => {
  e.preventDefault()
  if (gameStatus.value === 'won' || gameStatus.value === 'lost') return

  const cell = grid.value[row][col]
  if (cell.isRevealed) return

  if (!cell.isFlagged && !cell.isQuestioned) {
    cell.isFlagged = true
  } else if (cell.isFlagged) {
    cell.isFlagged = false
    cell.isQuestioned = true
  } else if (cell.isQuestioned) {
    cell.isQuestioned = false
  }
}

// Chord Action (reveal surrounding if flags count matches neighbor count)
const handleChordClick = (row: number, col: number) => {
  if (gameStatus.value !== 'playing') return
  
  const cell = grid.value[row][col]
  if (!cell.isRevealed || cell.neighborMines === 0) return

  // Count flags around the cell
  let flags = 0
  const neighbors: Cell[] = []

  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const nr = row + dr
      const nc = col + dc
      if (nr >= 0 && nr < rows.value && nc >= 0 && nc < cols.value) {
        const nCell = grid.value[nr][nc]
        if (nCell.isFlagged) {
          flags++
        } else if (!nCell.isRevealed) {
          neighbors.push(nCell)
        }
      }
    }
  }

  // If flags count matches the cell value, reveal all unflagged neighbors
  if (flags === cell.neighborMines) {
    neighbors.forEach(n => {
      revealCell(n.row, n.col)
    })
    checkWin()
  }
}

// Check Win Condition
const checkWin = () => {
  if (gameStatus.value === 'lost') return

  let win = true
  for (let r = 0; r < rows.value; r++) {
    for (let c = 0; c < cols.value; c++) {
      const cell = grid.value[r][c]
      if (!cell.isMine && !cell.isRevealed) {
        win = false
        break
      }
    }
  }

  if (win) {
    gameStatus.value = 'won'
    stopTimer()
    // Auto-flag all remaining mines
    for (let r = 0; r < rows.value; r++) {
      for (let c = 0; c < cols.value; c++) {
        const cell = grid.value[r][c]
        if (cell.isMine) {
          cell.isFlagged = true
          cell.isQuestioned = false
        }
      }
    }
  }
}

// Handle Game Over
const handleGameOver = () => {
  gameStatus.value = 'lost'
  stopTimer()

  // Reveal all mines and incorrect flags
  for (let r = 0; r < rows.value; r++) {
    for (let c = 0; c < cols.value; c++) {
      const cell = grid.value[r][c]
      if (cell.isMine && !cell.isFlagged) {
        cell.isRevealed = true
      } else if (!cell.isMine && cell.isFlagged) {
        // Incorrect flag (shown with a special cross or color in final view)
      }
    }
  }
}

// Reset Game
const resetGame = () => {
  initializeGrid()
}

// Switch difficulty and emit resize event
const changeDifficulty = (diff: Difficulty) => {
  difficulty.value = diff
  activeMenu.value = null
  initializeGrid()
  
  // Emit resize event to App.vue so the window size updates
  const set = settings[diff]
  emit('resize-window', { width: set.winWidth, height: set.winHeight })
}

// Close Dropdowns on Click Outside
const handleClickOutside = () => {
  activeMenu.value = null
}

const toggleMenu = (menu: 'game' | 'help') => {
  if (activeMenu.value === menu) {
    activeMenu.value = null
  } else {
    activeMenu.value = menu
  }
}

// Help actions
const showRules = () => {
  activeMenu.value = null
  emit('show-alert', {
    message: "1. Le but est de découvrir toutes les cases vides sans faire exploser de mines.\n\n" +
      "2. Le nombre indiqué sur une case révèle le nombre de mines dans ses 8 cases voisines.\n\n" +
      "3. Clic gauche : Révéler une case.\n\n" +
      "4. Clic droit : Placer un drapeau (🚩) pour marquer une mine suspecte. Clic droit à nouveau pour placer un point d'interrogation (?).\n\n" +
      "5. Double-clic : Si le nombre de drapeaux autour d'un chiffre correspond à sa valeur, double-cliquez pour révéler instantanément les cases voisines non marquées.\n\n" +
      "6. Le premier clic est TOUJOURS sécurisé !",
    title: "Règles du Démineur",
    type: "info"
  })
}

const showAbout = () => {
  activeMenu.value = null
  emit('show-alert', {
    message: "Démineur Rétro - Édition Thomas OS\n\n" +
      "Propulsé par Vue 3 & XP.css.\n\n" +
      "Un hommage fidèle au légendaire jeu de réflexion Windows XP.",
    title: "À propos du Démineur",
    type: "info"
  })
}

const closeApp = () => {
  activeMenu.value = null
  emit('close-app')
}

// Shortcut F2 for new game
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'F2') {
    e.preventDefault()
    resetGame()
  }
}

onMounted(() => {
  initializeGrid()
  window.addEventListener('keydown', handleKeyDown)
  document.addEventListener('click', handleClickOutside)
  
  // Emit initial size on mount
  const set = settings[difficulty.value]
  emit('resize-window', { width: set.winWidth, height: set.winHeight })
})

onBeforeUnmount(() => {
  stopTimer()
  window.removeEventListener('keydown', handleKeyDown)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="minesweeper-game flex flex-col h-full bg-[#c0c0c0] font-sans select-none text-black">
    <!-- Menu Bar -->
    <div class="menu-bar flex items-center bg-[#ece9d8] border-b border-[#808080] text-xs py-0.5 px-2 relative z-50">
      <div class="relative mr-1">
        <div 
          role="button"
          tabindex="0"
          class="px-2 py-0.5 hover:bg-[#316ac5] hover:text-white cursor-pointer select-none outline-none"
          :class="{ 'bg-[#316ac5] text-white': activeMenu === 'game' }"
          @click.stop="toggleMenu('game')"
        >
          Jeu
        </div>
        <div v-if="activeMenu === 'game'" class="absolute left-0 mt-0.5 bg-white border border-[#808080] shadow-md z-[60] w-44 py-1 flex flex-col text-black font-medium">
          <div role="button" tabindex="0" class="group px-4 py-1 hover:bg-[#316ac5] hover:text-white cursor-pointer flex justify-between w-full text-left rounded-none font-medium text-xs outline-none" @click="resetGame">
            <span>Nouveau</span>
            <span class="text-gray-400 group-hover:text-white">F2</span>
          </div>
          <div class="border-t border-gray-300 my-1"></div>
          <div role="button" tabindex="0" class="px-4 py-1 hover:bg-[#316ac5] hover:text-white cursor-pointer flex items-center gap-2 w-full text-left rounded-none font-medium text-xs outline-none" @click="changeDifficulty('beginner')">
            <span class="w-3 text-xs">{{ difficulty === 'beginner' ? '✓' : '' }}</span>
            <span>Débutant (9x9)</span>
          </div>
          <div role="button" tabindex="0" class="px-4 py-1 hover:bg-[#316ac5] hover:text-white cursor-pointer flex items-center gap-2 w-full text-left rounded-none font-medium text-xs outline-none" @click="changeDifficulty('intermediate')">
            <span class="w-3 text-xs">{{ difficulty === 'intermediate' ? '✓' : '' }}</span>
            <span>Intermédiaire (16x16)</span>
          </div>
          <div role="button" tabindex="0" class="px-4 py-1 hover:bg-[#316ac5] hover:text-white cursor-pointer flex items-center gap-2 w-full text-left rounded-none font-medium text-xs outline-none" @click="changeDifficulty('expert')">
            <span class="w-3 text-xs">{{ difficulty === 'expert' ? '✓' : '' }}</span>
            <span>Expert (30x16)</span>
          </div>
          <div class="border-t border-gray-300 my-1"></div>
          <div role="button" tabindex="0" class="px-4 py-1 hover:bg-[#316ac5] hover:text-white cursor-pointer w-full text-left rounded-none font-medium text-xs outline-none" @click="closeApp">
            Quitter
          </div>
        </div>
      </div>
      <div class="relative">
        <div 
          role="button"
          tabindex="0"
          class="px-2 py-0.5 hover:bg-[#316ac5] hover:text-white cursor-pointer select-none outline-none"
          :class="{ 'bg-[#316ac5] text-white': activeMenu === 'help' }"
          @click.stop="toggleMenu('help')"
        >
          ?
        </div>
        <div v-if="activeMenu === 'help'" class="absolute left-0 mt-0.5 bg-white border border-[#808080] shadow-md z-[60] w-44 py-1 flex flex-col text-black font-medium">
          <div role="button" tabindex="0" class="px-4 py-1 hover:bg-[#316ac5] hover:text-white cursor-pointer w-full text-left rounded-none font-medium text-xs outline-none" @click="showRules">
            Comment jouer
          </div>
          <div role="button" tabindex="0" class="px-4 py-1 hover:bg-[#316ac5] hover:text-white cursor-pointer w-full text-left rounded-none font-medium text-xs outline-none" @click="showAbout">
            À propos du Démineur
          </div>
        </div>
      </div>
    </div>

    <!-- Play Area Wrapper with double borders -->
    <div class="game-border-outer p-2 flex-1 flex flex-col justify-center items-center">
      <div class="game-container bg-[#c0c0c0] p-1.5 border-t-2 border-l-2 border-[#808080] border-b-2 border-r-2 border-[#fff] flex flex-col gap-2">
        
        <!-- Scoreboard Header -->
        <div class="scoreboard flex items-center justify-between p-1 border-t-2 border-l-2 border-[#808080] border-b-2 border-r-2 border-[#fff] bg-[#c0c0c0] w-full">
          <!-- Mines Count -->
          <div class="digital-counter">
            {{ String(Math.max(-99, Math.min(999, flagsCount))).padStart(3, '0') }}
          </div>

          <!-- Face Indicator Button -->
          <button 
            class="face-btn w-[26px] h-[26px] flex items-center justify-center text-base p-0 cursor-pointer select-none active:scale-95 active:border-inset"
            @click="resetGame"
          >
            {{ smileyEmoji }}
          </button>

          <!-- Timer -->
          <div class="digital-counter">
            {{ String(timer).padStart(3, '0') }}
          </div>
        </div>

        <!-- Grid Container -->
        <div 
          class="grid-border border-t-2 border-l-2 border-[#808080] border-b-2 border-r-2 border-[#fff] overflow-auto select-none bg-[#808080]"
          @mousedown="isLMBDown = true"
          @mouseup="isLMBDown = false"
          @mouseleave="isLMBDown = false"
        >
          <div 
            class="grid flex flex-col"
            :style="{ 
              width: cols * 24 + 'px', 
              height: rows * 24 + 'px' 
            }"
          >
            <div 
              v-for="(rowCells, rIndex) in grid" 
              :key="rIndex" 
              class="flex"
            >
              <div
                v-for="(cell, cIndex) in rowCells"
                :key="cIndex"
                class="cell w-6 h-6 select-none flex items-center justify-center"
                :class="[
                  cell.isRevealed 
                    ? (cell.exploded ? 'cell-exploded' : 'cell-revealed') 
                    : 'cell-hidden'
                ]"
                @click="handleLeftClick(cell.row, cell.col)"
                @contextmenu.prevent="handleRightClick($event, cell.row, cell.col)"
                @dblclick="handleChordClick(cell.row, cell.col)"
              >
                <template v-if="cell.isRevealed">
                  <!-- Mine exploded -->
                  <span v-if="cell.isMine" class="text-sm">💣</span>
                  
                  <!-- Adjacent numbers -->
                  <span 
                    v-else-if="cell.neighborMines > 0"
                    :class="'num-' + cell.neighborMines"
                    class="font-black text-sm"
                  >
                    {{ cell.neighborMines }}
                  </span>
                </template>
                <template v-else>
                  <!-- If game is lost and it's a false flag (flagged non-mine), show X -->
                  <span v-if="gameStatus === 'lost' && !cell.isMine && cell.isFlagged" class="text-xs font-bold text-red-600">❌</span>
                  
                  <!-- Normal flag -->
                  <span v-else-if="cell.isFlagged" class="text-xs">🚩</span>
                  
                  <!-- Question mark -->
                  <span v-else-if="cell.isQuestioned" class="text-xs font-bold">?</span>
                  
                  <!-- If game is lost and it's a mine (unflagged), show bomb -->
                  <span v-else-if="gameStatus === 'lost' && cell.isMine" class="text-xs">💣</span>
                </template>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.minesweeper-game {
  box-shadow: inset 1px 1px 0 #fff;
}

/* 7-Segment style retro display */
.digital-counter {
  font-family: 'Courier New', Courier, monospace;
  background-color: black;
  color: #ff0000;
  font-weight: bold;
  font-size: 22px;
  padding: 1px 4px;
  border-top: 1.5px solid #808080;
  border-left: 1.5px solid #808080;
  border-right: 1.5px solid #fff;
  border-bottom: 1.5px solid #fff;
  letter-spacing: 1.5px;
  min-width: 46px;
  height: 28px;
  line-height: 24px;
  text-align: right;
  user-select: none;
}

/* Face Button */
.face-btn {
  background-color: #c0c0c0;
  border-top: 2px solid #fff;
  border-left: 2px solid #fff;
  border-right: 2px solid #808080;
  border-bottom: 2px solid #808080;
  box-shadow: none !important;
  outline: none !important;
  border-radius: 0;
}
.face-btn:active {
  border-top: 2px solid #808080;
  border-left: 2px solid #808080;
  border-right: 2px solid #fff;
  border-bottom: 2px solid #fff;
}

/* Grid Cells styling */
.cell {
  box-sizing: border-box;
  width: 24px;
  height: 24px;
  user-select: none;
  -webkit-user-drag: none;
}

/* 3D Bevel for hidden cell */
.cell-hidden {
  background-color: #c0c0c0;
  border-top: 2.5px solid #fff;
  border-left: 2.5px solid #fff;
  border-right: 2.5px solid #808080;
  border-bottom: 2.5px solid #808080;
}

.cell-hidden:active:not(:has(span)) {
  border: 1px solid #808080;
  background-color: #c0c0c0;
  width: 24px;
  height: 24px;
}

/* Flat border for revealed cell */
.cell-revealed {
  background-color: #c0c0c0;
  border: 1px solid #808080;
}

/* Red background for the cell that exploded */
.cell-exploded {
  background-color: #ff0000;
  border: 1px solid #808080;
}

/* Classic Minesweeper numbers colors */
.num-1 { color: #0000ff; }
.num-2 { color: #008000; }
.num-3 { color: #ff0000; }
.num-4 { color: #000080; }
.num-5 { color: #800000; }
.num-6 { color: #008080; }
.num-7 { color: #000000; }
.num-8 { color: #808080; }

.active-border-inset {
  border-top: 2px solid #808080;
  border-left: 2px solid #808080;
  border-right: 2px solid #fff;
  border-bottom: 2px solid #fff;
}
</style>
