<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { projects } from '../data/projects'
import { ArrowLeft } from 'pixelarticons/fonts/vue/ArrowLeft'
import { ChevronRight } from 'pixelarticons/fonts/vue/ChevronRight'
import BaseButton from '../components/ui/BaseButton.vue'

const route = useRoute()
const router = useRouter()

const project = computed(() => {
  return projects.find(p => p.id === route.params.id) || null
})

// Find previous and next projects to cycle through them
const prevProject = computed(() => {
  if (!project.value) return null
  const currentIndex = projects.findIndex(p => p.id === project.value.id)
  const prevIndex = (currentIndex - 1 + projects.length) % projects.length
  return projects[prevIndex]
})

const nextProject = computed(() => {
  if (!project.value) return null
  const currentIndex = projects.findIndex(p => p.id === project.value.id)
  const nextIndex = (currentIndex + 1) % projects.length
  return projects[nextIndex]
})

const goBack = () => {
  router.push('/#projects')
}

const navigateToProject = (id) => {
  router.push(`/project/${id}`)
  // Scroll to top of the page
  if (window.lenis) {
    window.lenis.scrollTo(0, { immediate: true })
  } else {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }
}

onMounted(() => {
  // Ensure we start at the top of the page
  if (window.lenis) {
    window.lenis.scrollTo(0, { immediate: true })
  } else {
    window.scrollTo(0, 0)
  }
})
</script>

<template>
  <div v-if="project" class="min-h-screen pt-32 pb-24 bg-[var(--color-background)] text-[var(--color-text)] transition-colors duration-500">
    <div class="max-w-7xl mx-auto px-4 md:px-8">
      
      <!-- Back Button -->
      <button 
        @click="goBack" 
        class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer mb-8 group"
      >
        <ArrowLeft viewBox="0 0 24 24" class="w-5 h-5 fill-current transform group-hover:-translate-x-1 transition-transform shrink-0" />
        Retour aux projets
      </button>

      <!-- Project Header -->
      <header class="mb-12 md:mb-24 text-center">
        <h1 class="text-2xl md:text-7xl font-bold font-display uppercase tracking-tight text-[var(--color-primary)] mb-6">
          {{ project.title }}
        </h1>
        <p class="text-md md:text-xl font-light text-[var(--color-text-muted)] max-w-3xl mx-auto leading-relaxed">
          {{ project.description }}
        </p>
      </header>

      <!-- Main Showcase Image -->
      <div class="w-full mx-auto aspect-square overflow-hidden bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-border)] shadow-2xl relative mb-24">
        <img 
          :src="project.image" 
          :alt="project.title" 
          class="w-full h-full object-cover select-none" 
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"></div>
      </div>

      <!-- Layout Rows matching the screenshot format -->
      <div class="space-y-0">
        
        <!-- Row 1: Overview -->
        <div class="pb-12 md:pb-16 grid grid-cols-1 md:grid-cols-12 gap-8">
          <div class="md:col-span-6">
            <span class="text-xl md:text-2xl font-bold! font-display! tracking-tight text-[var(--color-primary)] !margin-0 !justify-start">
              Présentation
            </span>
          </div>
          <div class="md:col-span-6 space-y-6">
            <p class="text-base md:text-lg text-[var(--color-text-muted)] font-normal leading-relaxed">
              {{ project.presentation }}
            </p>
            <div class="pt-2">
              <BaseButton 
                :href="project.projectUrl" 
                target="_blank" 
                rel="noopener noreferrer"
                variant="primary"
                class="group flex items-center gap-2 w-fit"
              >
                Voir le projet
                <ChevronRight viewBox="0 0 24 24" class="w-6 h-6 fill-current group-hover:translate-x-1 transition-transform" />
              </BaseButton>
            </div>
          </div>
        </div>

        <!-- Row 2: Disciplines (Technologies) -->
        <div class="border-t border-[var(--color-border)] py-12 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-8">
          <div class="md:col-span-6">
            <span class="text-xl md:text-2xl font-bold! font-display! tracking-tight text-[var(--color-primary)] !margin-0 !justify-start">
              Technologies
            </span>
          </div>
          <div class="md:col-span-6">
            <ul class="space-y-2 text-base md:text-lg text-[var(--color-text-muted)] font-normal">
              <li v-for="tech in project.technologies" :key="tech">
                {{ tech }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Row 3: Problems Solved -->
        <div class="border-t border-[var(--color-border)] py-12 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-8">
          <div class="md:col-span-6">
            <span class="text-xl md:text-2xl font-bold! font-display! tracking-tight text-[var(--color-primary)] !margin-0 !justify-start">
              Problématiques
            </span>
          </div>
          <div class="md:col-span-6">
            <p class="text-base md:text-lg text-[var(--color-text-muted)] font-normal leading-relaxed">
              {{ project.problemsSolved }}
            </p>
          </div>
        </div>

      </div>

      <!-- Gallery section ("Suite d'images") -->
      <section class="pt-16 mb-24">
        <!-- 2 columns responsive Grid for the screenshots -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          <div 
            v-for="(img, idx) in project.gallery" 
            :key="idx" 
            class="group w-full overflow-hidden bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-border)] shadow-lg relative aspect-[4/3]"
          >
            <img 
              :src="img" 
              :alt="project.title + ' detail ' + idx" 
              class="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 select-none" 
            />
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 pointer-events-none"></div>
          </div>
        </div>
      </section>

      <!-- Quick Navigation Panel at the bottom -->
      <div class="border-t border-[var(--color-border)] pt-12 flex justify-between items-center gap-4">
        <!-- Prev Project Button -->
        <button 
          v-if="prevProject"
          @click="navigateToProject(prevProject.id)"
          class="flex flex-col items-start gap-1.5 text-left group cursor-pointer"
        >
          <span class="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] font-bold font-mono">// Précédent</span>
          <span class="text-lg md:text-xl font-bold font-display uppercase tracking-tight text-[var(--color-primary)] group-hover:text-[var(--color-text-muted)] transition-colors">
            &larr; {{ prevProject.title }}
          </span>
        </button>
        <div v-else></div>

        <!-- Next Project Button -->
        <button 
          v-if="nextProject"
          @click="navigateToProject(nextProject.id)"
          class="flex flex-col items-end gap-1.5 text-right group cursor-pointer"
        >
          <span class="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] font-bold font-mono">// Suivant</span>
          <span class="text-lg md:text-xl font-bold font-display uppercase tracking-tight text-[var(--color-primary)] group-hover:text-[var(--color-text-muted)] transition-colors">
            {{ nextProject.title }} &rarr;
          </span>
        </button>
      </div>

    </div>
  </div>

  <div v-else class="min-h-screen flex flex-col items-center justify-center bg-[var(--color-background)] text-[var(--color-text)]">
    <div class="text-center space-y-4">
      <h2 class="text-2xl font-bold font-display uppercase text-[var(--color-primary)]">Projet Introuvable</h2>
      <button @click="router.push('/')" class="px-6 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-full hover:bg-[var(--color-primary-hover)] transition-colors">
        Retour à l'accueil
      </button>
    </div>
  </div>
</template>
