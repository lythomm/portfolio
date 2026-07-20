<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Brackets as Code2 } from 'pixelarticons/fonts/vue/Brackets'
import { Monitor } from 'pixelarticons/fonts/vue/Monitor'
import { Zap } from 'pixelarticons/fonts/vue/Zap'
import { Smartphone } from 'pixelarticons/fonts/vue/Smartphone'
import { Search } from 'pixelarticons/fonts/vue/Search'
import { SpeedFast } from 'pixelarticons/fonts/vue/SpeedFast'
import { CloudServer } from 'pixelarticons/fonts/vue/CloudServer'
import { ChevronRight } from 'pixelarticons/fonts/vue/ChevronRight'

gsap.registerPlugin(ScrollTrigger)

const services = [
  {
    icon: Code2,
    title: 'Développement Web',
    description: 'Applications web sur mesure et performantes développées avec des frameworks JavaScript modernes. Architecture propre et code évolutif.',
    tools: [
      { name: 'JavaScript', iconUrl: '/icons/javascript.svg' },
      { name: 'TypeScript', iconUrl: '/icons/typescript.svg' },
      { name: 'Vue.js', iconUrl: '/icons/vue.svg' },
      { name: 'React', iconUrl: '/icons/react.svg' },
      { name: 'Next.js', iconUrl: '/icons/nextjs-icon.svg' },
      { name: 'Stripe', iconUrl: '/icons/stripe-icon.svg' },
      { name: 'Antigravity', iconUrl: '/icons/antigravity.google-logo.webp' },
      { name: 'Supabase', iconUrl: '/icons/supabase-icon.svg' },
      { name: 'Convex', iconUrl: '/icons/convex.dev-logo.webp' }
    ]
  },
  {
    icon: Smartphone,
    title: 'Développement Mobile',
    description: 'Conception et développement d\'applications mobiles réactives et intuitives pour iOS et Android avec des technologies cross-platform modernes.',
    tools: [
      { name: 'React Native', iconUrl: '/icons/reactnative.dev-logo.webp' },
      { name: 'TypeScript', iconUrl: '/icons/typescript.svg' },
      { name: 'Expo', iconUrl: '/icons/expo.dev-logo.webp' },
      { name: 'Stripe', iconUrl: '/icons/stripe-icon.svg' },
      { name: 'Antigravity', iconUrl: '/icons/antigravity.google-logo.webp' }
    ]
  },
  {
    icon: Monitor,
    title: 'Intégration UI/UX',
    description: 'Traduction de maquettes Figma complexes en composants réactifs et fidèles au pixel près, avec une gestion claire de l\'information.',
    tools: [
      { name: 'Figma', iconUrl: '/icons/figma-icon.svg' },
      { name: 'Notion', iconUrl: '/icons/notion.com-logo.webp' }
    ]
  },
  {
    icon: SpeedFast,
    title: 'Optimisation Performance & SEO',
    description: 'Amélioration des Core Web Vitals, réduction des temps de chargement, rendu côté serveur (SSR) et structuration SEO technique pour un référencement maximal.',
    tools: [
      { name: 'Lighthouse', iconUrl: '/icons/lighthouse.svg' },
      { name: 'PageSpeed Insights', iconUrl: '/icons/google-pagespeed-insights-icon-2021-.svg' },
      { name: 'Search Console', iconUrl: '/icons/search.google.com-logo.webp' },
    ]
  },
  {
    icon: CloudServer,
    title: 'DevOps & CI/CD',
    description: 'Automatisation des processus de build et déploiement, configuration d\'infrastructures cloud modernes et mise en place de monitoring applicatif.',
    tools: [
      { name: 'Vercel', iconUrl: '/icons/vercel.com-logo.webp' },
      { name: 'Docker', iconUrl: '/icons/docker.com-logo.webp' },
      { name: 'GitHub Actions', iconUrl: '/icons/github.com-logo.webp' },
    ]
  },
  {
    icon: Zap,
    title: 'Automatisation IA & Workflow',
    description: 'Création de scénarios d\'automatisation complexes pour connecter vos applications et optimiser la productivité de vos équipes.',
    tools: [
      { name: 'n8n', iconUrl: '/icons/n8n.com-logo.webp' },
      { name: 'Make', iconUrl: '/icons/make.com-logo.webp' },
      { name: 'Hermes', iconUrl: '/icons/nousresearch.com-logo.webp' }
    ]
  },
  {
    icon: Search,
    title: 'Audit Technique & Consultation',
    description: 'Analyse approfondie de la qualité du code, de la sécurité et des performances de vos applications. Recommandations stratégiques et accompagnement d\'architecture.',
    tools: [
      { name: 'Lighthouse', iconUrl: '/icons/lighthouse.svg' },
      { name: 'GitHub', iconUrl: '/icons/github.com-logo.webp' },
      { name: 'Notion', iconUrl: '/icons/notion.com-logo.webp' }
    ]
  }
]

const activeIndexes = ref([])
const serviceRefs = ref([])
const textRefs = ref([])
const tagsContainerRefs = ref([])

let scrollCtx = null

const isOpen = (index) => activeIndexes.value.includes(index)

const toggleService = async (index) => {
  if (isOpen(index)) {
    activeIndexes.value = activeIndexes.value.filter(i => i !== index)
  } else {
    activeIndexes.value.push(index)
    await nextTick()
    animateServiceOpen(index)
  }
  
  // Refresh Lenis & ScrollTrigger after accordion transition finishes
  setTimeout(() => {
    if (window.lenis) window.lenis.resize()
    ScrollTrigger.refresh()
  }, 400)
}

const animateServiceOpen = (index) => {
  const textEl = textRefs.value[index]
  const tagsContainer = tagsContainerRefs.value[index]
  
  if (textEl && tagsContainer) {
    // Animate description sliding from left
    gsap.fromTo(textEl,
      { opacity: 0, x: -15 },
      { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }
    )

    // Animate tags staggered pop scale
    const tags = tagsContainer.children
    if (tags.length) {
      gsap.fromTo(tags,
        { scale: 0.8, opacity: 0, y: 10 },
        { 
          scale: 1, 
          opacity: 1, 
          y: 0, 
          duration: 0.45, 
          stagger: 0.05, 
          ease: 'back.out(1.7)',
          delay: 0.1
        }
      )
    }
  }
}

onMounted(() => {
  scrollCtx = gsap.context(() => {
    // Entrance animation for accordion rows
    gsap.fromTo(serviceRefs.value,
      {
        opacity: 0,
        y: 40
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#services .w-full',
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    )
  })
})

onUnmounted(() => {
  if (scrollCtx) scrollCtx.revert()
})
</script>

<template>
  <section id="services" class="py-24 bg-[var(--color-surface)]">
    <div class="mx-section-default">
      <div class="text-center mx-auto mb-16">
        <h2>// Services</h2>
        <h3 class="text-3xl md:text-4xl font-bold mt-2 mb-4">
          Ce que je peux faire pour vous
        </h3>
        <p class="text-lg text-[var(--color-text-muted)]">
          Des services complets de développement pour donner vie à vos idées ou vos besoins.
        </p>
      </div>

      <!-- FAQ Accordion List Layout -->
      <div class="w-full border-t border-black/10">
        <div 
          v-for="(service, index) in services" 
          :key="index" 
          ref="serviceRefs"
          class="border-b border-black/10 opacity-0"
        >
          <!-- Accordion Header Button -->
          <button 
            @click="toggleService(index)"
            class="w-full flex items-center justify-between py-8 md:py-10 text-left focus:outline-none cursor-pointer group"
          >
            <div class="flex items-center gap-4">
              <!-- Service Icon -->
              <div class="size-11 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] flex items-center justify-center ">
                <component 
                  :is="service.icon" 
                  viewBox="0 0 24 24" 
                  class="size-6 fill-current text-[var(--color-primary)]" 
                />
              </div>
              <span class="text-xl md:text-2xl font-bold text-[var(--color-primary)] transition-colors duration-200">
                {{ service.title }}
              </span>
            </div>
            
            <!-- Chevron Right (Rotated when active) -->
            <ChevronRight 
              class="w-6 h-6 fill-current text-black/60 group-hover:text-black transition-transform duration-300"
              :class="[isOpen(index) ? 'rotate-90 text-[var(--color-primary)]' : '']"
            />
          </button>
          
          <!-- Accordion Content (Animated height using CSS Grid) -->
          <div 
            class="grid transition-[grid-template-rows] duration-350 ease-in-out"
            :class="[isOpen(index) ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]']"
          >
            <div class="overflow-hidden">
              <div class="pb-8 md:pb-10 pl-14 text-base md:text-lg text-[var(--color-text-muted)] leading-relaxed">
                <p ref="textRefs" class="mb-6 opacity-0">{{ service.description }}</p>
                
                <!-- Tools Row -->
                <div ref="tagsContainerRefs" class="flex flex-wrap gap-3">
                  <div 
                    v-for="(tool, tIndex) in service.tools" 
                    :key="tIndex"
                    class="flex items-center gap-2.5 px-4 py-3 rounded-lg bg-[var(--color-background)] text-sm font-medium text-[var(--color-primary)] opacity-0"
                  >
                    <!-- Tool Icon Wrapper -->
                    <div class="w-5 h-5 flex items-center justify-center">
                      <img :src="tool.iconUrl" :alt="tool.name" class="w-full h-full object-contain" />
                    </div>
                    <span>{{ tool.name }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

