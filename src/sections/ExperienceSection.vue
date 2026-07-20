<script setup>
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
</script>

<template>
  <section id="experience" class="py-24 bg-[var(--color-background)]">
    <div class="mx-section-default">
      
      <!-- Header -->
      <div class="text-center mb-24 flex flex-col items-center">
        <h2 class="text-xs uppercase tracking-widest text-[var(--color-text-muted)] font-mono mb-4">// 4 Parcours</h2>
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
          class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
        >
          <!-- Left Column -->
          <div class="flex flex-col justify-start">
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
              class="flex items-start gap-4 text-sm md:text-base text-[var(--color-text-muted)] leading-relaxed"
            >
              <span class="text-[var(--color-primary)] mt-1.5 text-[8px] select-none">▪</span>
              <span v-html="bullet"></span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
