<script setup>
const experiences = [
  {
    type: 'work',
    period: '2022 - Présent',
    role: 'Développeur Frontend Senior',
    organization: 'Tech Innovations Inc.',
    description: 'Encadrement d\'une équipe de 4 développeurs frontend. Architecture et refonte de la plateforme SaaS principale avec Vue 3 et Tailwind, améliorant le temps de chargement de 40 %.'
  },
  {
    type: 'work',
    period: '2019 - 2022',
    role: 'Développeur Frontend',
    organization: 'Creative Digital Agency',
    description: 'Développement de plus de 20 sites web interactifs pour des clients de premier plan. Intégration d\'animations complexes et designs adaptatifs.'
  },
  {
    type: 'education',
    period: '2015 - 2019',
    role: 'Licence en Informatique',
    organization: 'University of Technology',
    description: 'Spécialisation dans les principes du génie logiciel, les algorithmes et l\'interaction homme-machine.'
  }
]
</script>

<template>
  <section id="experience" class="py-24 bg-[var(--color-background)]">
    <div class="mx-section-default">
      <div class="text-center mb-16">
        <h2>// 4 Parcours</h2>
        <h3 class="text-3xl md:text-5xl font-bold mt-2 mb-4">
          Parcours & Formations
        </h3>
        <p class="text-lg text-[var(--color-text-muted)]">
          Mon parcours professionnel et mon cursus académique.
        </p>
      </div>

      <!-- Experience Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div
          v-for="(item, index) in experiences"
          :key="index"
          class="group relative p-7 md:p-9 rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/20 transition-all duration-300 cursor-default"
          :class="index === 0 ? 'md:col-span-2' : ''"
        >
          <!-- Top row: tag + period -->
          <div class="flex items-center justify-between mb-6">
            <span class="text-[11px] font-medium uppercase tracking-widest px-3 py-1 rounded-full border"
              :class="item.type === 'work'
                ? 'border-[var(--color-primary)]/20 text-[var(--color-primary)]'
                : 'border-[var(--color-text-muted)]/30 text-[var(--color-text-muted)]'"
            >
              {{ item.type === 'work' ? 'Expérience' : 'Formation' }}
            </span>
            <span class="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
              {{ item.period }}
            </span>
          </div>

          <!-- Role -->
          <h4 class="text-2xl md:text-3xl font-bold text-[var(--color-primary)] leading-tight mb-2 group-hover:tracking-[-0.01em] transition-all duration-300">
            {{ item.role }}
          </h4>

          <!-- Organization -->
          <p class="text-sm font-medium text-[var(--color-text-muted)] mb-4">
            {{ item.organization }}
          </p>

          <!-- Description -->
          <p class="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-xl">
            {{ item.description }}
          </p>

          <!-- Decorative index -->
          <span class="absolute bottom-5 right-7 md:bottom-7 md:right-9 text-[80px] md:text-[100px] font-bold leading-none text-[var(--color-primary)]/[0.03] group-hover:text-[var(--color-primary)]/[0.07] transition-all duration-500 select-none pointer-events-none">
            {{ String(index + 1).padStart(2, '0') }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
