<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
// import { ShaderMount, perlinNoiseFragmentShader, getShaderColorFromString } from '@paper-design/shaders'
import { ShaderMount, godRaysFragmentShader, getShaderColorFromString, getShaderNoiseTexture } from '@paper-design/shaders'
import BaseButton from '../components/ui/BaseButton.vue'
import { ChevronRight } from 'pixelarticons/fonts/vue/ChevronRight'
import { Brackets as Code } from 'pixelarticons/fonts/vue/Brackets'
import { User } from 'pixelarticons/fonts/vue/User'
import { Mail } from 'pixelarticons/fonts/vue/Mail'

const heroRef = ref(null)
const shaderContainerRef = ref(null)
let shaderMount = null
const headlineRef = ref(null)
const ctaRef = ref(null)
const connectRef = ref(null)

let ctx // GSAP context for cleanup

const initShader = async () => {
  if (!shaderContainerRef.value) return
  try {
    const noiseImg = getShaderNoiseTexture()
    if (noiseImg && !noiseImg.complete) {
      await new Promise((resolve) => { noiseImg.onload = resolve; noiseImg.onerror = resolve })
    }
    shaderMount = new ShaderMount(
      shaderContainerRef.value,
      godRaysFragmentShader,
      {
        u_colorBack: getShaderColorFromString('#000000'),
        u_colorBloom: getShaderColorFromString('#0000ff'),
        u_colors: [
          getShaderColorFromString('#a600ff6e'),
          getShaderColorFromString('#6200fff0'),
          getShaderColorFromString('#ffffff'),
          getShaderColorFromString('#33fff5'),
        ],
        u_colorsCount: 4,
        u_bloom: 0.40,
        u_intensity: 0.80,
        u_density: 0.30,
        u_spotty: 0.30,
        u_midSize: 0.20,
        u_midIntensity: 0.40,
        u_scale: 1.0,
        u_rotation: 0,
        u_offsetX: 0.0,
        u_offsetY: -0.55,
        u_fit: 2, // cover
        u_noiseTexture: noiseImg,
      },
      undefined,
      0.75 // speed
    )
  } catch (e) {
    console.error('Failed to initialize god rays shader:', e)
  }
}

const playEntrance = () => {
  ctx = gsap.context(() => {
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
    })


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
  initShader()
  if (!document.getElementById('preloader')) {
    playEntrance()
  } else {
    window.addEventListener('preloader-complete', playEntrance, { once: true })
  }
})

onUnmounted(() => {
  window.removeEventListener('preloader-complete', playEntrance)
  ctx && ctx.revert()
  shaderMount && shaderMount.dispose()
})
</script>

<template>
  <section 
    id="top" 
    ref="heroRef"
    class="relative min-h-screen flex items-center justify-center overflow-hidden"
  >
    <!-- Solid Background Color -->
    <div class="absolute inset-0 -z-30 bg-[var(--color-background)]"></div>

    <!-- Dithering Shader Background -->
    <div 
      ref="shaderContainerRef"
      class="absolute inset-0 -z-20 select-none"
    ></div>

    <div class="mx-section-default w-full z-10 flex flex-col items-center text-center space-y-16">
      
      <!-- Headline -->
      <h1 ref="headlineRef" class="text-2xl md:text-6xl font-extrabold uppercase text-white max-w-6xl opacity-0">
        Concevoir des solutions ancrées pour les besoins utilisateurs.
      </h1>
      
      <!-- Call to actions -->
      <div ref="ctaRef" class="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
        <BaseButton href="#projects" variant="primary" class="group flex items-center gap-2 w-full sm:w-auto opacity-0 text-white">
          Découvrir mon travail
          <ChevronRight viewBox="0 0 24 24" class="w-6 h-6 fill-current group-hover:translate-x-1 transition-transform" />
        </BaseButton>
        
        <a href="#contact" class="group relative py-2 text-sm font-semibold text-white opacity-0">
          Me contacter
          <span class="absolute bottom-0 left-0 w-full h-[1.5px] bg-white scale-x-0 group-hover:scale-x-100 origin-center transition-transform duration-300"></span>
        </a>
      </div>

      
    </div>
    <!-- Connect Section -->
    <div ref="connectRef" class="absolute bottom-8 w-full max-w-3xl flex flex-wrap justify-center items-center gap-8 text-xs text-white font-mono uppercase tracking-wider">
      <span class="opacity-0 hidden md:block">// Connect :</span>
      <a href="https://github.com" target="_blank" rel="noopener noreferrer" class=" flex items-center gap-1.5 opacity-0">
        <Code viewBox="0 0 24 24" class="w-6 h-6 fill-current" /> GitHub
      </a>
      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class=" flex items-center gap-1.5 opacity-0">
        <User viewBox="0 0 24 24" class="w-6 h-6 fill-current" /> LinkedIn
      </a>
      <a href="mailto:contact@thomas.dev" class=" flex items-center gap-1.5 opacity-0">
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
