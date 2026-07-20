<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import heroBg from '../assets/hero-bg.png'
import BaseButton from '../components/ui/BaseButton.vue'
import { ChevronRight } from 'pixelarticons/fonts/vue/ChevronRight'
import { Brackets as Code } from 'pixelarticons/fonts/vue/Brackets'
import { User } from 'pixelarticons/fonts/vue/User'
import { Mail } from 'pixelarticons/fonts/vue/Mail'

const heroRef = ref(null)
const bgRef = ref(null)
const headlineRef = ref(null)
const ctaRef = ref(null)
const connectRef = ref(null)
const mouseX = ref(0)
const mouseY = ref(0)

let ctx // GSAP context for cleanup

const handleMouseMove = (e) => {
  if (!heroRef.value) return
  const rect = heroRef.value.getBoundingClientRect()
  mouseX.value = (e.clientX - rect.left) / rect.width - 0.5
  mouseY.value = (e.clientY - rect.top) / rect.height - 0.5
}

const handleMouseLeave = () => {
  mouseX.value = 0
  mouseY.value = 0
}

const bgStyle = computed(() => {
  const tx = mouseX.value * -20
  const ty = mouseY.value * -20
  return {
    backgroundImage: `url(${heroBg})`,
    transform: `translate3d(${tx}px, ${ty}px, 0) scale(1.05)`,
    transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
  }
})

const playEntrance = () => {
  ctx = gsap.context(() => {
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
    })

    // ── 1. Background reveal ───────────────────────────────
    tl.fromTo(
      bgRef.value,
      { opacity: 0, scale: 1.15 },
      { opacity: 0.2, scale: 1.05, duration: 1.6, ease: 'power2.out' },
      0
    )

    // ── 2. Headline — split into words, cascade in ─────────
    if (headlineRef.value) {
      const text = headlineRef.value.textContent
      const words = text.split(/\s+/).filter(Boolean)
      headlineRef.value.innerHTML = words
        .map(w => `<span class="hero-word" style="display:inline-block;overflow:hidden"><span class="hero-word-inner" style="display:inline-block">${w}</span>&nbsp;</span>`)
        .join('')
      headlineRef.value.style.opacity = '1'

      const wordInners = headlineRef.value.querySelectorAll('.hero-word-inner')
      tl.fromTo(
        wordInners,
        { yPercent: 120, opacity: 0, rotateX: -40 },
        {
          yPercent: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.9,
          stagger: 0.07,
          ease: 'back.out(1.4)',
        },
        0.3
      )
    }

    // ── 3. CTA buttons — spring pop ────────────────────────
    if (ctaRef.value) {
      const buttons = ctaRef.value.children
      tl.fromTo(
        buttons,
        { y: 30, opacity: 0, scale: 0.92 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: 'elastic.out(1, 0.6)',
        },
        '-=0.3'
      )
    }

    // ── 4. Connect bar — slide up with stagger ─────────────
    if (connectRef.value) {
      const links = connectRef.value.children
      tl.fromTo(
        links,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.out',
        },
        '-=0.3'
      )
    }
  }, heroRef.value)
}

onMounted(() => {
  if (!document.getElementById('preloader')) {
    playEntrance()
  } else {
    window.addEventListener('preloader-complete', playEntrance, { once: true })
  }
})

onUnmounted(() => {
  window.removeEventListener('preloader-complete', playEntrance)
  ctx && ctx.revert()
})
</script>

<template>
  <section 
    id="top" 
    ref="heroRef"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
    class="relative min-h-screen flex items-center justify-center overflow-hidden"
  >
    <!-- Solid Background Color -->
    <div class="absolute inset-0 -z-30 bg-[var(--color-background)]"></div>

    <!-- Parallax Halftone Background Image -->
    <div 
      ref="bgRef"
      :style="bgStyle"
      class="absolute inset-0 -z-20 bg-cover bg-center select-none opacity-0"
    ></div>

    <div class="mx-section-default w-full z-10 flex flex-col items-center text-center space-y-16">
      
      <!-- Headline -->
      <h1 ref="headlineRef" class="text-5xl md:text-6xl font-extrabold uppercase text-[var(--color-text)] max-w-6xl opacity-0">
        Concevoir des solutions ancrées pour les besoins utilisateurs.
      </h1>
      
      <!-- Call to actions -->
      <div ref="ctaRef" class="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
        <BaseButton href="#projects" variant="primary" class="group flex items-center gap-2 w-full sm:w-auto opacity-0">
          Découvrir mon travail
          <ChevronRight viewBox="0 0 24 24" class="w-6 h-6 fill-current group-hover:translate-x-1 transition-transform" />
        </BaseButton>
        
        <a href="#contact" class="group relative py-2 text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors opacity-0">
          Me contacter
          <span class="absolute bottom-0 left-0 w-full h-[1.5px] bg-[var(--color-text)] scale-x-0 group-hover:scale-x-100 origin-center transition-transform duration-300"></span>
        </a>
      </div>

      
    </div>
    <!-- Connect Section -->
    <div ref="connectRef" class="absolute bottom-8 w-full max-w-3xl flex flex-wrap justify-center items-center gap-8 text-xs text-[var(--color-text-muted)] font-mono uppercase tracking-wider">
      <span class="opacity-0">// Connect :</span>
      <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="hover:text-[var(--color-text)] transition-colors flex items-center gap-1.5 opacity-0">
        <Code viewBox="0 0 24 24" class="w-6 h-6 fill-current" /> GitHub
      </a>
      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="hover:text-[var(--color-text)] transition-colors flex items-center gap-1.5 opacity-0">
        <User viewBox="0 0 24 24" class="w-6 h-6 fill-current" /> LinkedIn
      </a>
      <a href="mailto:contact@thomas.dev" class="hover:text-[var(--color-text)] transition-colors flex items-center gap-1.5 opacity-0">
        <Mail viewBox="0 0 24 24" class="w-6 h-6 fill-current" /> E-mail
      </a>
    </div>
  </section>
</template>

<style scoped>
/* Word split animation perspective */
:deep(.hero-word) {
  perspective: 600px;
}
</style>
