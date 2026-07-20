<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const bioText = "De la conception à la réalisation, je crée des solutions réfléchies qui résolvent de vrais problèmes. Mon approche combine stratégie, design et une attention constante aux détails."

const techList = [
  'Vue 3', 'React', 'Tailwind 4', 'JavaScript', 'TypeScript', 'Vite', 'Next.js', 
  'Node.js', 'PostgreSQL', 'Docker', 'Git', 'Vercel', 'Stripe', 'Resend', 'Twilio', 
  'Convex', 'Supabase', 'n8n', 'Make'
]

const words = bioText.split(' ')
const paragraphProgress = ref(0)

const updateParagraphReveal = () => {
  const container = document.querySelector('.scroll-reveal-container')
  if (!container) return
  
  const rect = container.getBoundingClientRect()
  const viewHeight = window.innerHeight
  
  // Custom reveal thresholds:
  // Starts when the top of the element is at 80% of the viewport height.
  // Ends when the element is at 30% of the viewport height.
  const start = viewHeight * 0.7
  const end = viewHeight * 0.15
  
  const p = (start - rect.top) / (start - end)
  paragraphProgress.value = Math.min(1, Math.max(0, p))
}

const getWordStyle = (index) => {
  const N = words.length
  const p = paragraphProgress.value
  
  // Overlap window config to make it smooth.
  const wordDuration = 8 / N // overlap factor
  const start = (index / N) * (1 - wordDuration)
  const end = start + wordDuration
  
  const progress = (p - start) / (end - start)
  const clamped = Math.min(1, Math.max(0, progress))
  
  return {
    color: `color-mix(in srgb, var(--color-text) ${clamped * 100}%, rgba(18, 18, 18, 0.2))`
  }
}

onMounted(() => {
  window.addEventListener('scroll', updateParagraphReveal)
  window.addEventListener('resize', updateParagraphReveal)
  setTimeout(updateParagraphReveal, 100)
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateParagraphReveal)
  window.removeEventListener('resize', updateParagraphReveal)
})
</script>

<template>
  <section id="about" class="py-24 bg-[var(--color-surface)]">
    <div class="mx-section-default text-center flex flex-col items-center">
      <h2>// À propos</h2>
      <div class="text-4xl md:text-7xl tracking-[-0.03em] text-[var(--color-text-muted)] leading-[1] scroll-reveal-container font-display">
        <p>
          <template v-for="(word, index) in words" :key="index">
            <span 
              :style="getWordStyle(index)"
              class="transition-colors duration-150"
            >{{ word }}</span>
            {{ ' ' }}
          </template>
        </p>
      </div>

      <!-- Infinite Tech Marquee -->
      <div class="mt-24 w-full overflow-hidden relative py-8">
        <!-- Thin Fading Top Line -->
        <div class="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent"></div>
        
        <!-- Optional side fades for depth -->
        <div class="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[var(--color-surface)] to-transparent z-10 pointer-events-none"></div>
        <div class="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[var(--color-surface)] to-transparent z-10 pointer-events-none"></div>

        <div class="marquee-track flex whitespace-nowrap gap-12 text-lg md:text-xl font-mono uppercase tracking-wider font-semibold text-[var(--color-text-muted)] select-none">
          <!-- First set of items -->
          <div class="marquee-content flex items-center gap-12 animate-marquee shrink-0">
            <template v-for="tech in techList" :key="tech">
              <span>{{ tech }}</span>
              <span class="text-[var(--color-primary)] font-bold">■</span>
            </template>
          </div>
          <!-- Duplicated set for seamless loop -->
          <div class="marquee-content flex items-center gap-12 animate-marquee shrink-0" aria-hidden="true">
            <template v-for="tech in techList" :key="'dup-' + tech">
              <span>{{ tech }}</span>
              <span class="text-[var(--color-primary)] font-bold">■</span>
            </template>
          </div>
        </div>

        <!-- Thin Fading Bottom Line -->
        <div class="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent"></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.marquee-track {
  width: max-content;
}

.animate-marquee {
  animation: marquee 90s linear infinite;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>
