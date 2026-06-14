<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'

const props = defineProps<{
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
  minWidth?: number
  minHeight?: number
}>()

const emit = defineEmits<{
  (e: 'focus', id: string): void
  (e: 'close', id: string): void
  (e: 'minimize', id: string): void
  (e: 'maximize', id: string): void
  (e: 'move', payload: { id: string; x: number; y: number }): void
  (e: 'resize', payload: { id: string; x: number; y: number; width: number; height: number }): void
}>()

const isDragging = ref(false)
let startX = 0
let startY = 0
let startWindowX = 0
let startWindowY = 0

const onHeaderMouseDown = (e: MouseEvent) => {
  // Only drag on left click and not on action buttons
  if (e.button !== 0 || (e.target as HTMLElement).closest('.title-bar-controls')) {
    return
  }

  // Focus the window
  emit('focus', props.id)

  if (props.isMaximized) return

  isDragging.value = true
  startX = e.clientX
  startY = e.clientY
  startWindowX = props.x
  startWindowY = props.y

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

const onMouseMove = (e: MouseEvent) => {
  if (!isDragging.value) return

  const dx = e.clientX - startX
  const dy = e.clientY - startY

  let newX = startWindowX + dx
  let newY = startWindowY + dy

  // Boundary checks: Keep at least a part of the title bar visible
  const minVisibleWidth = 100
  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight

  if (newX < -props.width + minVisibleWidth) newX = -props.width + minVisibleWidth
  if (newX > screenWidth - minVisibleWidth) newX = screenWidth - minVisibleWidth
  if (newY < 0) newY = 0 // Do not allow dragging above header
  if (newY > screenHeight - 40) newY = screenHeight - 40 // Taskbar height approx

  emit('move', { id: props.id, x: newX, y: newY })
}

const onMouseUp = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
}

const handleWindowClick = () => {
  emit('focus', props.id)
}

// Resizing logic
const isResizing = ref(false)
let resizeDir = ''
let startWidth = 0
let startHeight = 0
let startXMouse = 0
let startYMouse = 0
let startWindowXVal = 0
let startWindowYVal = 0

const startResize = (e: MouseEvent, direction: string) => {
  if (e.button !== 0 || props.isMaximized) return

  emit('focus', props.id)

  isResizing.value = true
  resizeDir = direction
  startXMouse = e.clientX
  startYMouse = e.clientY
  startWidth = props.width
  startHeight = props.height
  startWindowXVal = props.x
  startWindowYVal = props.y

  document.addEventListener('mousemove', handleResizeMove)
  document.addEventListener('mouseup', handleResizeUp)
}

const handleResizeMove = (e: MouseEvent) => {
  if (!isResizing.value) return

  const dx = e.clientX - startXMouse
  const dy = e.clientY - startYMouse

  let newWidth = startWidth
  let newHeight = startHeight
  let newX = startWindowXVal
  let newY = startWindowYVal

  const minW = props.minWidth || 300
  const minH = props.minHeight || 200

  // Horizontal Resizing
  if (resizeDir.includes('e')) {
    newWidth = startWidth + dx
    if (newWidth < minW) newWidth = minW
  } else if (resizeDir.includes('w')) {
    newWidth = startWidth - dx
    if (newWidth < minW) {
      newWidth = minW
      newX = startWindowXVal + (startWidth - minW)
    } else {
      newX = startWindowXVal + dx
    }
  }

  // Vertical Resizing
  if (resizeDir.includes('s')) {
    newHeight = startHeight + dy
    if (newHeight < minH) newHeight = minH
  } else if (resizeDir.includes('n')) {
    newHeight = startHeight - dy
    if (newHeight < minH) {
      newHeight = minH
      newY = startWindowYVal + (startHeight - minH)
    } else {
      newY = startWindowYVal + dy
    }
  }

  // Bound check for header Y position
  if (newY < 0) {
    if (resizeDir.includes('n')) {
      const allowedDy = -startWindowYVal
      newHeight = startHeight - allowedDy
      newY = 0
    } else {
      newY = 0
    }
  }

  emit('resize', {
    id: props.id,
    x: newX,
    y: newY,
    width: newWidth,
    height: newHeight
  })
}

const handleResizeUp = () => {
  isResizing.value = false
  document.removeEventListener('mousemove', handleResizeMove)
  document.removeEventListener('mouseup', handleResizeUp)
}

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
  document.removeEventListener('mousemove', handleResizeMove)
  document.removeEventListener('mouseup', handleResizeUp)
})
</script>

<template>
  <div
    class="window select-none transition-shadow duration-100"
    :class="[
      isMaximized ? 'w-full h-[calc(100vh-40px)] !translate-x-0 !translate-y-0 !top-0 !left-0' : '',
      isDragging ? 'shadow-2xl' : 'shadow-md'
    ]"
    :style="!isMaximized ? {
      zIndex: zIndex,
      transform: `translate(${x}px, ${y}px)`,
      width: width ? `${width}px` : 'auto',
      height: height ? `${height}px` : 'auto',
      display: isMinimized ? 'none' : 'flex',
      overflow: 'hidden'
    } : {
      zIndex: zIndex,
      display: isMinimized ? 'none' : 'flex',
      overflow: 'hidden'
    }"
    @mousedown="handleWindowClick"
  >
    <!-- Resize Handles (rendered only if not maximized) -->
    <template v-if="!isMaximized">
      <!-- Borders -->
      <div class="resize-handle n" @mousedown.stop.prevent="startResize($event, 'n')"></div>
      <div class="resize-handle s" @mousedown.stop.prevent="startResize($event, 's')"></div>
      <div class="resize-handle e" @mousedown.stop.prevent="startResize($event, 'e')"></div>
      <div class="resize-handle w" @mousedown.stop.prevent="startResize($event, 'w')"></div>
      
      <!-- Corners -->
      <div class="resize-handle nw" @mousedown.stop.prevent="startResize($event, 'nw')"></div>
      <div class="resize-handle ne" @mousedown.stop.prevent="startResize($event, 'ne')"></div>
      <div class="resize-handle sw" @mousedown.stop.prevent="startResize($event, 'sw')"></div>
      <div class="resize-handle se" @mousedown.stop.prevent="startResize($event, 'se')"></div>
    </template>

    <!-- Title Bar -->
    <div 
      class="title-bar cursor-default"
      :class="isDragging ? 'grabbing' : 'grab'"
      @mousedown="onHeaderMouseDown"
      @dblclick="emit('maximize', id)"
    >
      <div class="title-bar-text select-none flex items-center gap-1.5 font-bold">
        <slot name="icon"></slot>
        {{ title }}
      </div>
      <div class="title-bar-controls">
        <button aria-label="Minimize" @click.stop="emit('minimize', id)"></button>
        <button aria-label="Maximize" @click.stop="emit('maximize', id)"></button>
        <button aria-label="Close" @click.stop="emit('close', id)"></button>
      </div>
    </div>

    <!-- Window Body -->
    <div class="window-body bg-white flex flex-col overflow-hidden" style="overflow: hidden !important;">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.window {
  position: absolute;
  top: 0;
  left: 0;
}
.title-bar {
  user-select: none;
}

/* Resize Handles styles */
.resize-handle {
  position: absolute;
  z-index: 1000;
}

/* Borders */
.resize-handle.n {
  top: -3px;
  left: 4px;
  right: 4px;
  height: 6px;
  cursor: ns-resize;
}
.resize-handle.s {
  bottom: -3px;
  left: 4px;
  right: 4px;
  height: 6px;
  cursor: ns-resize;
}
.resize-handle.e {
  right: -3px;
  top: 4px;
  bottom: 4px;
  width: 6px;
  cursor: ew-resize;
}
.resize-handle.w {
  left: -3px;
  top: 4px;
  bottom: 4px;
  width: 6px;
  cursor: ew-resize;
}

/* Corners */
.resize-handle.nw {
  top: -4px;
  left: -4px;
  width: 8px;
  height: 8px;
  cursor: nwse-resize;
}
.resize-handle.ne {
  top: -4px;
  right: -4px;
  width: 8px;
  height: 8px;
  cursor: nesw-resize;
}
.resize-handle.sw {
  bottom: -4px;
  left: -4px;
  width: 8px;
  height: 8px;
  cursor: nesw-resize;
}
.resize-handle.se {
  bottom: -4px;
  right: -4px;
  width: 8px;
  height: 8px;
  cursor: nwse-resize;
}
</style>
