<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Menu } from 'pixelarticons/fonts/vue/Menu'
import { X } from '@lucide/vue'
import { ChevronRight } from 'pixelarticons/fonts/vue/ChevronRight'

const isScrolled = ref(false)
const isMenuOpen = ref(false)
const isAtBottom = ref(false)

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
          class="text-xl font-bold tracking-tight relative z-[60] text-[var(--color-primary)]"
        >
          Thomas<span class="text-[var(--color-text-muted)]">.dev</span>
        </router-link>

        <!-- Menu Toggle Button -->
        <button 
          class="p-2 focus:outline-none relative z-[60] text-[var(--color-text)] hover:text-black transition-colors duration-300 cursor-pointer"
          @click="toggleMenu"
          aria-label="Menu"
        >
          <Menu viewBox="0 0 24 24" v-if="!isMenuOpen" class="w-6 h-6 fill-current" />
          <X v-else class="w-6 h-6" :stroke-width="2.5" />
        </button>
      </nav>
    </div>

    <!-- Full Screen Navigation Modal Overlay -->
    <transition name="menu-slide">
      <div 
        v-if="isMenuOpen"
        class="fixed inset-0 w-screen h-screen bg-[var(--color-background)] z-50 flex flex-col justify-between p-8 md:p-16 text-[var(--color-primary)]"
      >
        <!-- Top header spacer -->
        <div class="h-16"></div>

        <!-- Centered links list in screenshot layout -->
        <div class="flex-1 flex flex-col justify-center max-w-3xl mx-auto w-full px-4 md:px-6 my-auto">
          <div class="flex flex-col border-t border-black/10">
            <router-link 
              v-for="link in navLinks" 
              :key="link.name"
              :to="link.href"
              @click="closeMenu"
              class="group flex items-center justify-between py-5 px-4 -mx-4 rounded-xl border-b border-black/10 text-xl md:text-2xl font-medium tracking-tight text-black hover:text-[var(--color-primary)] hover:bg-black/[0.04] transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
            >
              <span>{{ link.name }}</span>
              <ChevronRight class="w-6 h-6 fill-current text-black/60 group-hover:text-black group-hover:translate-x-1 transition-all duration-200" />
            </router-link>
          </div>
        </div>

        <!-- Footer section with details -->
        <div class="w-full max-w-3xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 border-t border-black/10 pt-8 text-black/50 text-xs md:text-sm">
          <div class="flex items-center gap-8">
            <a href="mailto:hello@thomas.dev" class="hover:text-black transition-colors">lythomm@gmail.com</a>
            <span>+33 6 11 59 76 27</span>
          </div>
          <div>
            &copy; {{ new Date().getFullYear() }} Thomas.dev. Tous droits réservés.
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<style scoped>
/* Menu slide down transition */
.menu-slide-enter-active,
.menu-slide-leave-active {
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), 0.6s ease;
}

.menu-slide-enter-from,
.menu-slide-leave-to {
  transform: translateY(-100%);
}
</style>
