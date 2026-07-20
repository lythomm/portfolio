<script setup>
import { ref, computed } from 'vue'
import heroBg from '../assets/hero-bg.png'
import BaseButton from '../components/ui/BaseButton.vue'
import { ChevronRight } from 'pixelarticons/fonts/vue/ChevronRight'
import { Brackets as Code } from 'pixelarticons/fonts/vue/Brackets'
import { User } from 'pixelarticons/fonts/vue/User'
import { Mail } from 'pixelarticons/fonts/vue/Mail'

const heroRef = ref(null)
const mouseX = ref(0)
const mouseY = ref(0)

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
    opacity: 0.2
  }
})
</script>

<template>
  <section 
    id="top" 
    ref="heroRef"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
    class="relative min-h-screen flex items-center justify-center overflow-hidden animate-[fadeIn_0.8s_ease-out]"
  >
    <!-- Solid Background Color -->
    <div class="absolute inset-0 -z-30 bg-[var(--color-background)]"></div>

    <!-- Parallax Halftone Background Image -->
    <div 
      :style="bgStyle"
      class="absolute inset-0 -z-20 bg-cover bg-center select-none"
    ></div>

    <div class="mx-section-default w-full z-10 flex flex-col items-center text-center space-y-16">
      
      <!-- Headline -->
      <h1 class="text-5xl md:text-6xl font-extrabold uppercase text-[var(--color-text)] max-w-6xl">
        Concevoir des solutions ancrées pour les <i>besoins utilisateurs</i>.
      </h1>
      
      <!-- Call to actions -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 animate-[fadeIn_1.2s_ease-out]">
        <BaseButton href="#projects" variant="primary" class="group flex items-center gap-2 w-full sm:w-auto">
          Découvrir mon travail
          <ChevronRight viewBox="0 0 24 24" class="w-6 h-6 fill-current group-hover:translate-x-1 transition-transform" />
        </BaseButton>
        
        <a href="#contact" class="group relative py-2 text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
          Me contacter
          <span class="absolute bottom-0 left-0 w-full h-[1.5px] bg-[var(--color-text)] scale-x-0 group-hover:scale-x-100 origin-center transition-transform duration-300"></span>
        </a>
      </div>

      
    </div>
    <!-- Connect Section -->
    <div class="absolute bottom-8 w-full max-w-3xl flex flex-wrap justify-center items-center gap-8 text-xs text-[var(--color-text-muted)] font-mono uppercase tracking-wider animate-[fadeIn_1.4s_ease-out]">
      <span>// Connect :</span>
      <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="hover:text-[var(--color-text)] transition-colors flex items-center gap-1.5">
        <Code viewBox="0 0 24 24" class="w-6 h-6 fill-current" /> GitHub
      </a>
      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="hover:text-[var(--color-text)] transition-colors flex items-center gap-1.5">
        <User viewBox="0 0 24 24" class="w-6 h-6 fill-current" /> LinkedIn
      </a>
      <a href="mailto:contact@thomas.dev" class="hover:text-[var(--color-text)] transition-colors flex items-center gap-1.5">
        <Mail viewBox="0 0 24 24" class="w-6 h-6 fill-current" /> E-mail
      </a>
    </div>
  </section>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.97);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
