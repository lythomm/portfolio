<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import Lenis from 'lenis'

// Layout
import NavBar from './components/layout/NavBar.vue'
import ContactSection from './sections/ContactSection.vue'

let lenis
const route = useRoute()

onMounted(() => {
  // Initialize Lenis for smooth scrolling
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  })

  // Store lenis globally so views can trigger scrolls
  window.lenis = lenis

  function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }

  requestAnimationFrame(raf)
})

// Reset scroll instantly on page change and refresh GSAP ScrollTriggers
watch(() => route.path, () => {
  if (window.lenis) {
    window.lenis.scrollTo(0, { immediate: true })
  }
  
  // Wait for the slide-up page transition (1.5s) to fully finish, then refresh ScrollTrigger & Lenis sizes
  setTimeout(() => {
    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      ScrollTrigger.refresh()
    })
    if (window.lenis) {
      window.lenis.resize()
    }
  }, 1600)
})

onUnmounted(() => {
  if (lenis) {
    lenis.destroy()
    window.lenis = null
  }
})
</script>

<template>
  <div class="relative w-full min-h-screen selection:bg-[var(--color-primary)] selection:text-white font-sans bg-black">
    <NavBar />
    
    <main class="relative z-20 bg-[var(--color-background)] shadow-[0_10px_30px_rgba(0,0,0,0.3)] mb-0 md:mb-[100vh] overflow-hidden">
      <router-view v-slot="{ Component }">
        <transition name="slide-up" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <ContactSection class="relative md:fixed md:bottom-0 md:left-0 w-full md:h-screen z-10" />
  </div>
</template>

<style scoped>
/* Page slide-up transition */
.slide-up-enter-active {
  transition: transform 1.5s cubic-bezier(0.19, 1, 0.22, 1);
}

.slide-up-enter-from {
  transform: translateY(100vh);
}

/* Make leaving page disappear instantly to avoid delay */
.slide-up-leave-active {
  transition: none;
}
</style>
