<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ShaderMount, halftoneDotsFragmentShader, getShaderColorFromString } from '@paper-design/shaders'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const experiences = [
  {
    phase: 'Bases & Apprentissages',
    period: '2018 - 2021',
    bullets: [
      "<strong>DUT & Licence Informatique</strong> (2018 - 2021) : Apprentissage des bases algorithmiques et de l'ingénierie des systèmes à Toulouse (IUT & IPST-CNAM).",
      "<strong>Développeur Frontend @ Lexidia</strong> (2020 - 2021) : Conception UI pour une application d'aide à l'orthophonie et traduction des besoins cliniques en solutions techniques."
    ]
  },
  {
    phase: "Entrée dans l'Industrie",
    period: '2021 - 2023',
    bullets: [
      "<strong>Développeur Fullstack @ iologo</strong> (2021 - 2022) : Implémentation de fonctionnalités de bout en bout (UI, Logique, API), transition technique post-fusion Lexidia et création d'un back-office autonome.",
      "<strong>Diplôme d'Ingénieur AISL</strong> (2021 - 2023) : Spécialité Architecture et Ingénierie des Systèmes et Logiciels à l'IPST-CNAM Toulouse."
    ]
  },
  {
    phase: "Aujourd'hui & Freelance",
    period: '2022 - 2026',
    bullets: [
      "<strong>Développeur Fullstack @ BedBoat</strong> (2022 - 2026) : Audit technique, restructuration globale de la plateforme pour la performance/scalabilité et développement du système de réservation Stripe.",
      "Optimisation opérationnelle via des automatisations <strong>Make</strong> et introduction structurante de la culture <strong>Agile</strong> (Sprints, Daily, Rétrospectives)."
    ]
  }
]

const shaderContainerRef = ref(null)
const rowRefs = ref([])
let shaderMount = null
let scrollCtx = null

onMounted(() => {
  // ── Entrance text animations ──
  scrollCtx = gsap.context(() => {
    rowRefs.value.forEach((row) => {
      if (!row) return
      
      const leftCol = row.querySelector('.exp-left')
      const bullets = row.querySelectorAll('.exp-bullet')

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: row,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      })

      tl.fromTo(leftCol,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' }
      )

      tl.fromTo(bullets,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out' },
        '-=0.5'
      )
    })
    // ── Image Sweep Reveal (splits from center/ends towards edges/center) ──
    gsap.fromTo(['.exp-image-curtain-left', '.exp-image-curtain-right'],
      { scaleX: 1 },
      {
        scaleX: 0,
        duration: 2.2,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: '.exp-image-curtain-left',
          start: 'top 60%',
          toggleActions: 'play none none none'
        }
      }
    )
  })

  // ── Halftone Shader ──
  if (!shaderContainerRef.value) return

  const img = new Image()
  img.src = '/images/touching-hands.png'
  img.onload = () => {
    try {
      shaderMount = new ShaderMount(
        shaderContainerRef.value,
        halftoneDotsFragmentShader,
        {
          u_image: img,
          u_colorFront: getShaderColorFromString('#121212'),
          u_colorBack: getShaderColorFromString('#f4f4f3'),
          u_size: 0.7,
          u_grid: 0,
          u_radius: 1.5,
          u_contrast: 0.8,
          u_originalColors: false,
          u_inverted: false,
          u_grainMixer: 0,
          u_grainOverlay: 0,
          u_grainSize: 0.1,
          u_type: 0,
          u_fit: 2,
          u_scale: 1.0,
          u_rotation: 0.0,
          u_offsetX: 0.0,
          u_offsetY: 0.0
        },
        undefined,
        0
      )
    } catch (e) {
      console.error('Failed to initialize halftone shader:', e)
    }
  }
})

onUnmounted(() => {
  if (scrollCtx) scrollCtx.revert()
  if (shaderMount) {
    if (typeof shaderMount.dispose === 'function') shaderMount.dispose()
    else if (typeof shaderMount.destroy === 'function') shaderMount.destroy()
  }
})
</script>

<template>
  <section id="experience" class="pt-24 bg-[var(--color-background)]">
    <div class="mx-section-default">
      
      <!-- Header -->
      <div class="text-center mb-24 flex flex-col items-center">
        <h2 class="text-xs uppercase tracking-widest text-[var(--color-text-muted)] font-mono mb-4">// Parcours</h2>
        <h3 class="text-4xl md:text-6xl font-extrabold uppercase font-display text-[var(--color-text)] tracking-[0.05em] leading-none mb-6">
          Moments Clés
        </h3>
        <p class="text-base md:text-lg text-[var(--color-text-muted)] max-w-xl font-sans leading-relaxed">
          Moments clés, projets et rôles qui ont façonné mon parcours et mon approche du dev au fil des ans.
        </p>
      </div>

      <!-- Highlights List -->
      <div class="w-full flex flex-col space-y-16 md:space-y-24">
        <div 
          v-for="(item, index) in experiences" 
          :key="index"
          ref="rowRefs"
          class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
        >
          <!-- Left Column -->
          <div class="flex flex-col justify-start exp-left opacity-0">
            <h4 class="text-xl md:text-2xl font-bold font-display text-[var(--color-primary)] tracking-tight leading-tight">
              {{ item.phase }}
            </h4>
            <span class="text-xs font-mono text-[var(--color-text-muted)] uppercase tracking-wider mt-2">
              {{ item.period }}
            </span>
          </div>

          <!-- Right Column -->
          <div class="flex flex-col space-y-4 md:space-y-6">
            <div 
              v-for="(bullet, bIndex) in item.bullets" 
              :key="bIndex"
              class="flex items-start gap-4 text-sm md:text-base text-[var(--color-text-muted)] leading-relaxed exp-bullet opacity-0"
            >
              <span class="text-[var(--color-primary)] mt-1.5 text-[8px] select-none">▪</span>
              <span v-html="bullet"></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Halftone Image (full-width) -->
    <div class="w-full relative aspect-[2/1] overflow-hidden">
      <div ref="shaderContainerRef" class="absolute inset-0 w-full h-full"></div>
      
      <!-- Sweep Reveal Curtains (splitting from sides to center) -->
      <div class="absolute inset-0 z-10 flex pointer-events-none">
        <div class="exp-image-curtain-left w-1/2 h-full bg-[var(--color-background)] origin-right"></div>
        <div class="exp-image-curtain-right w-1/2 h-full bg-[var(--color-background)] origin-left"></div>
      </div>

      <!-- Fallback -->
      <img 
        src="/images/touching-hands.png" 
        alt="Touching hands" 
        class="absolute inset-0 w-full h-full object-cover grayscale contrast-[1.05] brightness-90 pointer-events-none"
        style="z-index:-1"
      />
    </div>
  </section>
</template>
