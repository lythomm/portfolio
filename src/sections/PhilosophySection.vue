<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ShaderMount, halftoneDotsFragmentShader, getShaderColorFromString } from '@paper-design/shaders'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const principles = [
  {
    title: 'Simplicité par design',
    subtitle: 'Principe YAGNI',
    image: '/images/philosophy/simplicity.png',
    description: 'Fuir la sur-ingénierie pour bâtir une architecture légère, rapide et adaptée aux besoins réels. Ce code épuré garantit un développement rapide, moins de bugs et une maintenance simplifiée et économique.'
  },
  {
    title: 'Alignement business',
    subtitle: 'Impact & Vision',
    image: '/images/philosophy/business.png',
    description: 'Comprendre le « Pourquoi » d\'abord pour s\'aligner sur les objectifs commerciaux et les utilisateurs. Une approche de partenaire technique qui maximise la valeur et optimise l\'investissement.'
  },
  {
    title: 'Méthode scientifique',
    subtitle: 'Rigueur & Autonomie',
    image: '/images/philosophy/science.png',
    description: 'Résoudre les défis complexes par une méthode rigoureuse : isolation, hypothèses et validation méthodique. Une approche autonome et rassurante qui élimine le stress face aux imprévus.'
  }
]

const containerRefs = ref([])
const shaderMounts = []
const imagesLoaded = ref(false)
let ctx = null

onMounted(async () => {
  // Preload images to ensure they are loaded before initializing ShaderMount
  const loadedImages = await Promise.all(
    principles.map(p => {
      return new Promise((resolve) => {
        const img = new Image()
        img.src = p.image
        img.onload = () => resolve(img)
        img.onerror = () => resolve(null)
      })
    })
  )

  imagesLoaded.value = true

  // Initialize halftone shaders
  containerRefs.value.forEach((container, index) => {
    const img = loadedImages[index]
    if (!container || !img) return

    try {
      const mount = new ShaderMount(
        container,
        halftoneDotsFragmentShader,
        {
          u_image: img,
          u_colorFront: getShaderColorFromString('#121212'),
          u_colorBack: getShaderColorFromString('#f4f4f3'),
          u_size: 0.4,
          u_grid: 0, // square grid
          u_radius: 1.5,
          u_contrast: 0.8,
          u_originalColors: false,
          u_inverted: false,
          u_grainMixer: 0.05,
          u_grainOverlay: 0.05,
          u_grainSize: 0.1,
          u_type: 0, // classic dots
          u_fit: 2, // cover
          u_scale: 1.0,
          u_rotation: 0.0,
          u_offsetX: 0.0,
          u_offsetY: 0.0
        },
        undefined, // webGlContextAttributes
        0 // static (no animation time movement)
      )
      shaderMounts.push(mount)
    } catch (e) {
      console.error('Failed to initialize halftone dots shader:', e)
    }
  })

  // Create GSAP Context for easy cleanup
  ctx = gsap.context(() => {
    // ── Entrance Animation for the 3 blocks (staggered curtain reveal) ──
    const curtains = gsap.utils.toArray('#philosophy .philosophy-curtain')
    gsap.fromTo(curtains,
      {
        scaleY: 1
      },
      {
        scaleY: 0,
        duration: 1.4,
        stagger: 0.3, // Stagger delay: one after another
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: '#philosophy .grid',
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    )

    // ── Parallax effect on shaders ──
    containerRefs.value.forEach((container) => {
      if (!container) return

      gsap.fromTo(container, 
        {
          yPercent: -12
        },
        {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: container.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      )
    })
  })
})

onUnmounted(() => {
  if (ctx) {
    ctx.revert() // clean up GSAP animations and ScrollTriggers
  }
  
  shaderMounts.forEach(mount => {
    if (typeof mount.dispose === 'function') {
      mount.dispose()
    } else if (typeof mount.destroy === 'function') {
      mount.destroy()
    }
  })
})
</script>

<template>
  <section id="philosophy" class="py-24 bg-[var(--color-background)] border-t border-[var(--color-border)]">
    <div class="mx-section-default">
      <!-- Section Header -->
      <div class="text-center mx-auto mb-16 max-w-3xl">
        <h2>// Philosophie</h2>
        <h3 class="text-3xl md:text-4xl font-bold mt-2 mb-4">
          Comment je conçois mes projets
        </h3>
        <p class="text-lg text-[var(--color-text-muted)]">
          Mes principes directeurs pour concevoir, coder et livrer des expériences numériques exceptionnelles et pérennes.
        </p>
      </div>

      <!-- Principles Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="(principle, index) in principles" 
          :key="index"
          class="relative h-[620px] overflow-hidden bg-[var(--color-surface)] group"
        >
          <!-- Canvas Shader Container (Taller than card, offset for parallax) -->
          <div 
            ref="containerRefs" 
            class="absolute w-full h-[120%] -top-[10%] will-change-transform"
          ></div>

          <!-- Fallback Image while loading or WebGL fail -->
          <img 
            v-if="!imagesLoaded"
            :src="principle.image" 
            :alt="principle.title" 
            class="absolute inset-0 w-full h-full object-cover grayscale contrast-[1.05] brightness-90"
          />

          <!-- Overlay gradient to ensure visibility at the bottom -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-70 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"></div>

          <!-- Curtain reveal overlay -->
          <div class="philosophy-curtain absolute inset-0 bg-[var(--color-primary)] origin-top z-10 pointer-events-none"></div>

          <!-- Bottom sliding panel -->
          <div 
            class="absolute bottom-0 left-0 right-0 bg-[var(--color-surface)] p-6 transition-transform duration-500 ease-out translate-y-[calc(100%-80px)] group-hover:translate-y-0 flex flex-col justify-start border-t border-[var(--color-border)] max-h-full overflow-y-auto"
          >
            <!-- Panel Header (Always visible at the top of the panel) -->
            <div class="mb-4 flex flex-col justify-center">
              <span class="text-xs uppercase font-semibold tracking-wider text-[var(--color-text-muted)] leading-none mb-1">
                {{ principle.subtitle }}
              </span>
              <h4 class="text-lg font-bold text-[var(--color-text)] leading-none">
                {{ principle.title }}
              </h4>
            </div>

              <p class="text-xs text-[var(--color-text-muted)] leading-relaxed">
                {{ principle.description }}
              </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Custom scrollbar styling for the sliding panel on hover, just in case content overflows slightly */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 2px;
}
</style>
