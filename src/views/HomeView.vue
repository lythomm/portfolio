<script setup>
import { onMounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import HeroSection from '../sections/HeroSection.vue'
import AboutSection from '../sections/AboutSection.vue'
import ProjectsSection from '../sections/ProjectsSection.vue'
import ServicesSection from '../sections/ServicesSection.vue'
import ExperienceSection from '../sections/ExperienceSection.vue'

const route = useRoute()

const scrollToHash = (hash) => {
  if (!hash) return
  if (hash === '#top') {
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo(0, 0)
    }
    return
  }
  const target = document.querySelector(hash)
  if (target) {
    if (window.lenis) {
      window.lenis.scrollTo(target, { offset: 0 })
    } else {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }
}

onMounted(() => {
  nextTick(() => {
    if (route.hash) {
      // Wait for DOM + Lenis to be ready after cross-page navigation
      setTimeout(() => {
        scrollToHash(route.hash)
      }, 200)
    } else {
      // No hash = navigated to "/" without anchor, scroll to top
      if (window.lenis) {
        window.lenis.scrollTo(0, { immediate: true })
      } else {
        window.scrollTo(0, 0)
      }
    }
  })
})

// Watch for hash changes when navigating while already on HomeView
watch(
  () => route.hash,
  (newHash) => {
    scrollToHash(newHash)
  }
)
</script>

<template>
  <div>
    <HeroSection />
    <AboutSection />
    <ProjectsSection />
    <ServicesSection />
    <ExperienceSection />
  </div>
</template>
