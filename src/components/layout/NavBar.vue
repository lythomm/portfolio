<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { Menu } from 'pixelarticons/fonts/vue/Menu'
import { X } from '@lucide/vue'
import { ChevronRight } from 'pixelarticons/fonts/vue/ChevronRight'
import { gsap } from 'gsap'

const isScrolled = ref(false)
const isMenuOpen = ref(false)
const isAtBottom = ref(false)

const menuOverlayRef = ref(null)
const linksContainerRef = ref(null)
const linkItemRefs = ref([])
const linkTextRefs = ref([])
const linkArrowRefs = ref([])
const footerItemRefs = ref([])

const route = useRoute()
const isHeroVisible = computed(() => route.path === '/' && !isScrolled.value)

const navLinks = [
  { name: 'Accueil', href: '/#top' },
  { name: 'À propos', href: '/#about' },
  { name: 'Projets', href: '/#projects' },
  { name: 'Services', href: '/#services' },
  { name: 'Parcours', href: '/#experience' },
  { name: 'Contact', href: '/#contact' }
]

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
  isAtBottom.value = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 50)
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  if (isMenuOpen.value) {
    window.lenis?.stop()
  } else {
    window.lenis?.start()
  }
}

const closeMenu = () => {
  isMenuOpen.value = false
  window.lenis?.start()
}

// GSAP Animations on transition hooks
const onBeforeEnter = (el) => {
  // Reset refs arrays
  linkItemRefs.value = []
  linkTextRefs.value = []
  linkArrowRefs.value = []
  footerItemRefs.value = []

  // Pre-set initial states for high-performance GPU animation
  gsap.set(el, { yPercent: -100, opacity: 1 })
}

const onEnter = (el, done) => {
  const tl = gsap.timeline({ onComplete: done })

  // 1. Slide down modal overlay background smoothly
  tl.to(el, {
    yPercent: 0,
    duration: 0.55,
    ease: 'power4.out'
  })

  // 2. Animate Main Border
  if (linksContainerRef.value) {
    tl.fromTo(linksContainerRef.value,
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: 0.5, ease: 'power3.out' },
      '-=0.3'
    )
  }

  // 3. Stagger Link Items (Containers + Text + Icons)
  const validLinkItems = linkItemRefs.value.filter(Boolean)
  const validTexts = linkTextRefs.value.filter(Boolean)
  const validArrows = linkArrowRefs.value.filter(Boolean)

  if (validLinkItems.length) {
    // Reveal item row borders & background slot
    tl.fromTo(validLinkItems, 
      { y: 50, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.55, 
        stagger: 0.06, 
        ease: 'power3.out' 
      },
      '-=0.35'
    )
  }

  if (validTexts.length) {
    // Kinetic text pop
    tl.fromTo(validTexts,
      { yPercent: 100, opacity: 0, rotateX: -30 },
      {
        yPercent: 0,
        opacity: 1,
        rotateX: 0,
        duration: 0.6,
        stagger: 0.06,
        ease: 'back.out(1.4)'
      },
      '<' // Sync with link item rows
    )
  }

  if (validArrows.length) {
    // Arrow bounce & slide in
    tl.fromTo(validArrows,
      { x: -15, opacity: 0, scale: 0.6 },
      {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.06,
        ease: 'back.out(1.8)'
      },
      '<=0.05'
    )
  }

  // 4. Stagger Footer Elements
  const validFooterItems = footerItemRefs.value.filter(Boolean)
  if (validFooterItems.length) {
    tl.fromTo(validFooterItems,
      { y: 25, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.45,
        stagger: 0.08,
        ease: 'power2.out'
      },
      '-=0.25'
    )
  }
}

const onLeave = (el, done) => {
  gsap.to(el, {
    yPercent: -100,
    duration: 0.4,
    ease: 'power3.in',
    onComplete: done
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.lenis?.start()
})
</script>

<template>
  <header 
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
    :class="[
      isScrolled ? 'py-4' : 'py-6',
      isAtBottom && !isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
    ]"
  >
    <div class="mx-section-default">
      <!-- Glass Navbar -->
      <nav 
        class="flex items-center justify-between rounded-[var(--radius-xl)] px-6 py-4 transition-all duration-300 border"
        :class="[
          isMenuOpen
            ? 'bg-transparent border-transparent'
            : isScrolled
              ? 'bg-white/80 backdrop-blur-md shadow-[var(--shadow-card)] border-[var(--color-border)]'
              : 'bg-transparent border-transparent'
        ]"
      >
        <!-- Logo -->
        <router-link 
          to="/#top" 
          @click="closeMenu"
          class="text-xl font-bold tracking-tight relative z-[60] transition-colors duration-300"
          :class="isMenuOpen ? 'text-black' : isHeroVisible ? 'text-white' : 'text-[var(--color-primary)]'"
        >
          Thomas.dev
        </router-link>

        <!-- Menu Toggle Button -->
        <button 
          class="p-2 focus:outline-none relative z-[60] transition-colors duration-300 cursor-pointer"
          :class="isMenuOpen ? 'text-black' : isHeroVisible ? 'text-white hover:text-white/80' : 'text-[var(--color-text)] hover:text-black'"
          @click="toggleMenu"
          aria-label="Menu"
        >
          <Menu viewBox="0 0 24 24" v-if="!isMenuOpen" class="w-6 h-6 fill-current" />
          <X v-else class="w-6 h-6" :stroke-width="2.5" />
        </button>
      </nav>
    </div>

    <!-- Full Screen Navigation Modal Overlay -->
    <transition 
      :css="false"
      @before-enter="onBeforeEnter"
      @enter="onEnter"
      @leave="onLeave"
    >
      <div 
        v-if="isMenuOpen"
        ref="menuOverlayRef"
        class="fixed inset-0 w-screen h-screen bg-[var(--color-background)] z-50 flex flex-col justify-between p-8 md:p-16 text-[var(--color-primary)]"
      >
        <!-- Top header spacer -->
        <div class="h-16"></div>

        <!-- Centered links list -->
        <div class="flex-1 flex flex-col justify-center max-w-6xl mx-auto w-full px-4 md:px-6 my-auto">
          <div ref="linksContainerRef" class="flex flex-col border-t border-black/10 origin-left">
            <router-link 
              v-for="(link, index) in navLinks" 
              :key="link.name"
              :ref="el => linkItemRefs[index] = el ? el.$el || el : null"
              :to="link.href"
              @click="closeMenu"
              class="group flex items-center justify-between py-5 px-4 -mx-4 rounded-xl border-b border-black/10 text-xl md:text-2xl font-medium tracking-tight text-black hover:text-[var(--color-primary)] hover:bg-black/[0.04] transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] overflow-hidden"
            >
              <span 
                :ref="el => linkTextRefs[index] = el"
                class="inline-block transform-gpu"
              >
                {{ link.name }}
              </span>
              <div 
                :ref="el => linkArrowRefs[index] = el ? el.$el || el : null"
                class="inline-block transform-gpu"
              >
                <ChevronRight class="w-6 h-6 fill-current text-black/60 group-hover:text-black group-hover:translate-x-1 transition-all duration-200" />
              </div>
            </router-link>
          </div>
        </div>

        <!-- Footer section with details -->
        <div class="w-full max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 border-t border-black/10 pt-8 text-black/50 text-xs md:text-sm">
          <div :ref="el => footerItemRefs[0] = el" class="flex items-center gap-8">
            <a href="mailto:lythomm@gmail.com" class="hover:text-black transition-colors">lythomm@gmail.com</a>
            <span>+33 6 11 59 76 27</span>
          </div>
          <div :ref="el => footerItemRefs[1] = el">
            &copy; {{ new Date().getFullYear() }} Thomas.dev. Tous droits réservés.
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>
