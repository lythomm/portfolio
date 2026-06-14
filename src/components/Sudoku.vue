<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

interface SudokuCell {
  row: number
  col: number
  value: number // current value, 0 if empty
  solutionValue: number // correct value
  isClue: boolean // true if part of the initial puzzle
  isConflict: boolean // true if violates Sudoku rules
  notes: number[] // list of pencil mark candidate numbers (1-9)
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
  blanks: number
  winWidth: number
  winHeight: number
}

const settings: Record<Difficulty, DiffSetting> = {
  beginner: { blanks: 35, winWidth: 360, winHeight: 500 },
  intermediate: { blanks: 45, winWidth: 360, winHeight: 500 },
  expert: { blanks: 54, winWidth: 360, winHeight: 500 }
}

// Board State
const grid = ref<SudokuCell[][]>([])
const selectedCell = ref<{ row: number; col: number } | null>(null)
const gameStatus = ref<'idle' | 'playing' | 'won' | 'lost'>('idle')
const timer = ref(0)
const mistakes = ref(0)
const maxMistakes = 3
const notesMode = ref(false) // Toggle pencil marks mode
const activeMenu = ref<'game' | 'help' | null>(null)

let timerInterval: any = null

// Helper to check if number is valid in temporary board
const isValidPlace = (board: number[][], row: number, col: number, num: number): boolean => {
  // Row check
  for (let c = 0; c < 9; c++) {
    if (board[row][c] === num) return false
  }
  // Col check
  for (let r = 0; r < 9; r++) {
    if (board[r][col] === num) return false
  }
  // 3x3 Box check
  const boxRow = Math.floor(row / 3) * 3
  const boxCol = Math.floor(col / 3) * 3
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (board[boxRow + r][boxCol + c] === num) return false
    }
  }
  return true
}

// Backtracking solver to fill grid
const fillGrid = (board: number[][]): boolean => {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        // Try numbers in random order
        const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5)
        for (const num of nums) {
          if (isValidPlace(board, r, c, num)) {
            board[r][c] = num
            if (fillGrid(board)) return true
            board[r][c] = 0
          }
        }
        return false // Trigger backtrack
      }
    }
  }
  return true
}

// Generate new Sudoku puzzle
const generatePuzzle = () => {
  stopTimer()
  timer.value = 0
  mistakes.value = 0
  selectedCell.value = null
  notesMode.value = false

  // 1. Create solved board
  const board: number[][] = Array.from({ length: 9 }, () => Array(9).fill(0))
  fillGrid(board)

  // 2. Remove cells according to difficulty
  const solutionBoard = JSON.parse(JSON.stringify(board))
  const blanks = settings[difficulty.value].blanks

  let blanksRemoved = 0
  while (blanksRemoved < blanks) {
    const r = Math.floor(Math.random() * 9)
    const c = Math.floor(Math.random() * 9)
    if (board[r][c] !== 0) {
      board[r][c] = 0
      blanksRemoved++
    }
  }

  // 3. Populate grid ref
  const newGrid: SudokuCell[][] = []
  for (let r = 0; r < 9; r++) {
    const rowCells: SudokuCell[] = []
    for (let c = 0; c < 9; c++) {
      const val = board[r][c]
      rowCells.push({
        row: r,
        col: c,
        value: val,
        solutionValue: solutionBoard[r][c],
        isClue: val !== 0,
        isConflict: false,
        notes: []
      })
    }
    newGrid.push(rowCells)
  }

  grid.value = newGrid
  gameStatus.value = 'playing'
  startTimer()
  checkConflicts()
}

// Conflict checking (row, col, block duplicate detection)
const checkConflicts = () => {
  // Reset all conflicts
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      grid.value[r][c].isConflict = false
    }
  }

  // Row conflicts
  for (let r = 0; r < 9; r++) {
    const counts: Record<number, number[]> = {}
    for (let c = 0; c < 9; c++) {
      const val = grid.value[r][c].value
      if (val !== 0) {
        if (!counts[val]) counts[val] = []
        counts[val].push(c)
      }
    }
    Object.values(counts).forEach(indices => {
      if (indices.length > 1) {
        indices.forEach(c => { grid.value[r][c].isConflict = true })
      }
    })
  }

  // Column conflicts
  for (let c = 0; c < 9; c++) {
    const counts: Record<number, number[]> = {}
    for (let r = 0; r < 9; r++) {
      const val = grid.value[r][c].value
      if (val !== 0) {
        if (!counts[val]) counts[val] = []
        counts[val].push(r)
      }
    }
    Object.values(counts).forEach(indices => {
      if (indices.length > 1) {
        indices.forEach(r => { grid.value[r][c].isConflict = true })
      }
    })
  }

  // Box conflicts
  for (let b = 0; b < 9; b++) {
    const boxRow = Math.floor(b / 3) * 3
    const boxCol = (b % 3) * 3
    const counts: Record<number, {r: number, c: number}[]> = {}

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const currR = boxRow + r
        const currC = boxCol + c
        const val = grid.value[currR][currC].value
        if (val !== 0) {
          if (!counts[val]) counts[val] = []
          counts[val].push({ r: currR, c: currC })
        }
      }
    }

    Object.values(counts).forEach(cellsList => {
      if (cellsList.length > 1) {
        cellsList.forEach(cell => { grid.value[cell.r][cell.c].isConflict = true })
      }
    })
  }
}

// Timer
const startTimer = () => {
  stopTimer()
  timerInterval = setInterval(() => {
    if (timer.value < 9999) {
      timer.value++
    }
  }, 1000)
}

const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

// Select Cell
const selectCell = (row: number, col: number) => {
  if (gameStatus.value !== 'playing') return
  selectedCell.value = { row, col }
}

// Handle entering a number
const enterNumber = (num: number) => {
  if (gameStatus.value !== 'playing' || !selectedCell.value) return

  const { row, col } = selectedCell.value
  const cell = grid.value[row][col]

  if (cell.isClue) return

  if (notesMode.value) {
    // Notes/Pencil mode
    if (num === 0) {
      cell.notes = []
    } else {
      cell.value = 0 // Clear final value if entering notes
      const idx = cell.notes.indexOf(num)
      if (idx > -1) {
        cell.notes.splice(idx, 1) // Remove candidate
      } else {
        cell.notes.push(num) // Add candidate
        cell.notes.sort()
      }
    }
  } else {
    // Normal value mode
    if (num === 0) {
      cell.value = 0
      cell.notes = []
    } else {
      cell.value = num
      cell.notes = [] // Clear notes on entering value

      // Check if correct compared to solution
      if (num !== cell.solutionValue) {
        mistakes.value++
        // Flash selected cell in red momentarily or highlight conflict
        if (mistakes.value >= maxMistakes) {
          handleGameOver(false)
        }
      } else {
        checkWin()
      }
    }
    checkConflicts()
  }
}

// Hint button
const fillHint = () => {
  if (gameStatus.value !== 'playing' || !selectedCell.value) {
    emit('show-alert', { message: 'Veuillez sélectionner une case vide d\'abord.', title: 'Indice', type: 'warning' })
    return
  }

  const { row, col } = selectedCell.value
  const cell = grid.value[row][col]

  if (cell.isClue || cell.value === cell.solutionValue) return

  // Fill in correct value
  cell.value = cell.solutionValue
  cell.isClue = true // Lock it in as a clue/fixed cell
  cell.notes = []
  
  checkConflicts()
  checkWin()
}

// Auto-solve button
const solvePuzzle = () => {
  if (gameStatus.value !== 'playing') return

  // Auto fill all cells with solution
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = grid.value[r][c]
      if (!cell.isClue) {
        cell.value = cell.solutionValue
        cell.notes = []
      }
    }
  }
  
  checkConflicts()
  handleGameOver(true)
}

// Check Win Condition
const checkWin = () => {
  let won = true
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = grid.value[r][c]
      if (cell.value !== cell.solutionValue) {
        won = false
        break
      }
    }
  }

  if (won) {
    handleGameOver(true)
  }
}

// Handle Game Over
const handleGameOver = (won: boolean) => {
  stopTimer()
  if (won) {
    gameStatus.value = 'won'
    emit('show-alert', { message: 'Félicitations ! Vous avez résolu la grille avec succès !', title: 'Sudoku - Victoire', type: 'info' })
  } else {
    gameStatus.value = 'lost'
    emit('show-alert', { message: 'Dommage ! Vous avez commis 3 erreurs. Partie terminée.', title: 'Sudoku - Défaite', type: 'error' })
    
    // Fill correct values in red or show solution
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const cell = grid.value[r][c]
        if (cell.value === 0 || cell.value !== cell.solutionValue) {
          cell.value = cell.solutionValue
          cell.isConflict = true // Turns red as a visual guide
        }
      }
    }
  }
}

// Keyboard input listener
const handleKeyDown = (e: KeyboardEvent) => {
  if (gameStatus.value !== 'playing') return

  // Arrow navigation
  if (selectedCell.value) {
    const { row, col } = selectedCell.value
    if (e.key === 'ArrowUp' && row > 0) {
      selectedCell.value = { row: row - 1, col }
      e.preventDefault()
      return
    }
    if (e.key === 'ArrowDown' && row < 8) {
      selectedCell.value = { row: row + 1, col }
      e.preventDefault()
      return
    }
    if (e.key === 'ArrowLeft' && col > 0) {
      selectedCell.value = { row, col: col - 1 }
      e.preventDefault()
      return
    }
    if (e.key === 'ArrowRight' && col < 8) {
      selectedCell.value = { row, col: col + 1 }
      e.preventDefault()
      return
    }
  }

  // F2 restart
  if (e.key === 'F2') {
    e.preventDefault()
    generatePuzzle()
    return
  }

  // Numbers 1-9
  if (/^[1-9]$/.test(e.key)) {
    enterNumber(parseInt(e.key))
    e.preventDefault()
  }

  // Backspace, Delete or 0 to clear
  if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
    enterNumber(0)
    e.preventDefault()
  }
}

// Dropdowns
const toggleMenu = (menu: 'game' | 'help') => {
  if (activeMenu.value === menu) {
    activeMenu.value = null
  } else {
    activeMenu.value = menu
  }
}

const handleClickOutside = () => {
  activeMenu.value = null
}

const changeDifficulty = (diff: Difficulty) => {
  difficulty.value = diff
  activeMenu.value = null
  generatePuzzle()
}

const showRules = () => {
  activeMenu.value = null
  emit('show-alert', {
    message: "SUDOKU - RÈGLES :\n\n" +
      "1. Le but est de remplir la grille de 9x9 cases avec des chiffres de 1 à 9.\n\n" +
      "2. Chaque chiffre de 1 à 9 ne doit apparaître qu'UNE seule fois par ligne, par colonne, et par bloc de 3x3 cases.\n\n" +
      "3. Sélection: Cliquez sur une case pour la sélectionner, puis utilisez le clavier ou le pavé tactile pour entrer un chiffre.\n\n" +
      "4. Erreurs: Entrer un chiffre incorrect (ne correspondant pas à la solution unique) compte comme une erreur. À 3 erreurs, vous perdez la partie.\n\n" +
      "5. Mode Crayon (✏️): Saisit des notes de candidats dans la case sans affecter la solution.\n\n" +
      "6. Commandes clavier: Utilisez les touches fléchées pour naviguer, 1-9 pour remplir, et Retour arrière/Suppr pour effacer.",
    title: "Règles du Sudoku",
    type: "info"
  })
}

const showAbout = () => {
  activeMenu.value = null
  emit('show-alert', {
    message: "Sudoku Rétro - Édition Thomas OS\n\n" +
      "Propulsé par Vue 3 & XP.css.\n\n" +
      "Un jeu d'esprit et de réflexion classique avec résolveur intelligent.",
    title: "À propos du Sudoku",
    type: "info"
  })
}

const closeApp = () => {
  activeMenu.value = null
  emit('close-app')
}

onMounted(() => {
  generatePuzzle()
  window.addEventListener('keydown', handleKeyDown)
  document.addEventListener('click', handleClickOutside)
  
  // Resize window on mount
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
  <div class="sudoku-game flex flex-col h-full bg-[#c0c0c0] font-sans select-none text-black">
    <!-- Menu Bar -->
    <div class="menu-bar flex items-center bg-[#ece9d8] border-b border-[#808080] text-[11px] py-0.5 px-2 relative z-50">
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
          <div role="button" tabindex="0" class="group px-4 py-1 hover:bg-[#316ac5] hover:text-white cursor-pointer flex justify-between w-full text-left rounded-none font-medium text-[11px] outline-none" @click="generatePuzzle">
            <span>Nouveau</span>
            <span class="text-gray-400 group-hover:text-white">F2</span>
          </div>
          <div class="border-t border-gray-300 my-1"></div>
          <div role="button" tabindex="0" class="px-4 py-1 hover:bg-[#316ac5] hover:text-white cursor-pointer flex items-center gap-2 w-full text-left rounded-none font-medium text-[11px] outline-none" @click="changeDifficulty('beginner')">
            <span class="w-3 text-xs">{{ difficulty === 'beginner' ? '✓' : '' }}</span>
            <span>Débutant</span>
          </div>
          <div role="button" tabindex="0" class="px-4 py-1 hover:bg-[#316ac5] hover:text-white cursor-pointer flex items-center gap-2 w-full text-left rounded-none font-medium text-[11px] outline-none" @click="changeDifficulty('intermediate')">
            <span class="w-3 text-xs">{{ difficulty === 'intermediate' ? '✓' : '' }}</span>
            <span>Intermédiaire</span>
          </div>
          <div role="button" tabindex="0" class="px-4 py-1 hover:bg-[#316ac5] hover:text-white cursor-pointer flex items-center gap-2 w-full text-left rounded-none font-medium text-[11px] outline-none" @click="changeDifficulty('expert')">
            <span class="w-3 text-xs">{{ difficulty === 'expert' ? '✓' : '' }}</span>
            <span>Expert</span>
          </div>
          <div class="border-t border-gray-300 my-1"></div>
          <div role="button" tabindex="0" class="px-4 py-1 hover:bg-[#316ac5] hover:text-white cursor-pointer w-full text-left rounded-none font-medium text-[11px] outline-none" @click="closeApp">
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
          <div role="button" tabindex="0" class="px-4 py-1 hover:bg-[#316ac5] hover:text-white cursor-pointer w-full text-left rounded-none font-medium text-[11px] outline-none" @click="showRules">
            Comment jouer
          </div>
          <div role="button" tabindex="0" class="px-4 py-1 hover:bg-[#316ac5] hover:text-white cursor-pointer w-full text-left rounded-none font-medium text-[11px] outline-none" @click="showAbout">
            À propos du Sudoku
          </div>
        </div>
      </div>
    </div>

    <!-- Play Area Wrapper -->
    <div class="p-2 flex-1 flex flex-col items-center gap-3">
      <!-- Game Info Headers -->
      <div class="flex items-center justify-between w-[278px] text-xs font-bold px-1 select-none">
        <!-- Mistakes counter -->
        <div class="mistakes-count text-[#e74c3c]">
          Erreurs : {{ mistakes }} / {{ maxMistakes }}
        </div>

        <!-- Timer -->
        <div class="sudoku-timer font-mono text-[13px] bg-black text-[#ff0000] px-2 py-0.5 border-t border-l border-[#808080] border-b border-r border-white">
          {{ String(Math.floor(timer / 60)).padStart(2, '0') }}:{{ String(timer % 60).padStart(2, '0') }}
        </div>
      </div>

      <!-- Sudoku Board Frame -->
      <div class="board-border border-t-2 border-l-2 border-[#808080] border-b-2 border-r-2 border-[#fff] bg-[#808080] p-[1.5px]">
        <div class="sudoku-board flex flex-col bg-white">
          <div 
            v-for="(rowCells, rIndex) in grid" 
            :key="rIndex" 
            class="flex"
            :class="{ 
              'border-b border-gray-300': rIndex !== 8 && rIndex % 3 !== 2,
              'border-b-2 border-black': rIndex % 3 === 2 && rIndex !== 8
            }"
          >
            <div
              v-for="(cell, cIndex) in rowCells"
              :key="cIndex"
              class="sudoku-cell w-[30px] h-[30px] select-none flex items-center justify-center cursor-default transition-all relative font-sans"
              :class="[
                { 
                  'border-r border-gray-300': cIndex !== 8 && cIndex % 3 !== 2,
                  'border-r-2 border-black': cIndex % 3 === 2 && cIndex !== 8,
                  
                  // Selection & states highlights
                  'bg-[#3a78e4]/20': selectedCell && selectedCell.row === rIndex && selectedCell.col === cIndex,
                  'bg-[#fcf8e3]': selectedCell && (selectedCell.row === rIndex || selectedCell.col === cIndex) && !(selectedCell.row === rIndex && selectedCell.col === cIndex),
                  
                  // Text weights
                  'font-black text-black': cell.isClue,
                  'text-blue-600': !cell.isClue && cell.value !== 0,
                  
                  // Conflicts and errors
                  'bg-red-200 text-red-700': cell.isConflict
                }
              ]"
              @click="selectCell(cell.row, cell.col)"
            >
              <!-- Cell value -->
              <span v-if="cell.value !== 0" class="text-[15px]">{{ cell.value }}</span>

              <!-- Pencil marks grid (notes) -->
              <div 
                v-else-if="cell.notes.length > 0" 
                class="notes-grid grid grid-cols-3 w-full h-full p-[1px] leading-none"
              >
                <div 
                  v-for="n in 9" 
                  :key="n" 
                  class="text-[7.5px] font-bold text-gray-500 flex items-center justify-center"
                >
                  {{ cell.notes.includes(n) ? n : '' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons Row -->
      <div class="flex gap-2 justify-center w-[278px]">
        <!-- Pencil toggle button -->
        <button 
          class="flex-1 py-1 font-bold text-[11px] cursor-pointer flex items-center justify-center gap-1 border-radius-0 shadow-none"
          :class="notesMode ? 'active-border-inset bg-[#e5e5e5]' : ''"
          @click="notesMode = !notesMode"
        >
          <span>✏️</span> Crayon : {{ notesMode ? 'ON' : 'OFF' }}
        </button>

        <button 
          class="flex-1 py-1 font-bold text-[11px] cursor-pointer flex items-center justify-center gap-1 shadow-none"
          @click="fillHint"
        >
          💡 Indice
        </button>

        <button 
          class="flex-1 py-1 font-bold text-[11px] cursor-pointer flex items-center justify-center gap-1 shadow-none"
          @click="solvePuzzle"
        >
          🤖 Résoudre
        </button>
      </div>

      <!-- Input Numeric Keypad -->
      <div class="numeric-keypad grid grid-cols-5 gap-1.5 mt-1 bg-[#d9d9d9] p-1.5 border border-[#808080] shadow-inner">
        <button 
          v-for="n in 9" 
          :key="n" 
          class="w-10 h-7 text-xs font-bold flex items-center justify-center cursor-pointer p-0 rounded-none"
          @click="enterNumber(n)"
        >
          {{ n }}
        </button>
        <!-- Eraser -->
        <button 
          class="w-10 h-7 text-xs font-bold flex items-center justify-center cursor-pointer p-0 bg-[#e74c3c]/10 hover:bg-[#e74c3c]/20 rounded-none text-red-600"
          @click="enterNumber(0)"
        >
          ❌
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.sudoku-game {
  box-shadow: inset 1px 1px 0 #fff;
}

.sudoku-timer {
  border-top: 1.5px solid #808080;
  border-left: 1.5px solid #808080;
  border-right: 1.5px solid #fff;
  border-bottom: 1.5px solid #fff;
  width: 55px;
  text-align: center;
  height: 20px;
  line-height: 16px;
}

.sudoku-board {
  border: 1px solid #000;
}

.sudoku-cell {
  box-sizing: border-box;
}

.notes-grid {
  pointer-events: none;
}

.active-border-inset {
  border-top: 2px solid #808080;
  border-left: 2px solid #808080;
  border-right: 2px solid #fff;
  border-bottom: 2px solid #fff;
}

/* Keypad styling override to look retro */
button {
  background-color: #c0c0c0;
  border-top: 2.5px solid #fff;
  border-left: 2.5px solid #fff;
  border-right: 2.5px solid #808080;
  border-bottom: 2.5px solid #808080;
  border-radius: 0 !important;
  outline: none;
  min-width: 0 !important;
}
button:active:not(.active-border-inset) {
  border-top: 2.5px solid #808080;
  border-left: 2.5px solid #808080;
  border-right: 2.5px solid #fff;
  border-bottom: 2.5px solid #fff;
}
</style>
