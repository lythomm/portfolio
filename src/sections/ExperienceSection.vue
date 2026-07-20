<script setup>
const experiences = [
  {
    phase: 'Bases & Apprentissages',
    period: '2015 - 2019',
    bullets: [
      "Développement d'un intérêt marqué pour le <strong>storytelling visuel</strong> et l'<strong>expérience utilisateur</strong>, menant à mes premiers projets en freelance.",
      "Étude des <strong>principes UI/UX</strong>, de la <strong>typographie</strong> et du <strong>design d'interaction</strong> lors de ma Licence en Informatique, axée sur les expériences numériques centrées sur l'humain."
    ]
  },
  {
    phase: "Entrée dans l'Industrie",
    period: '2019 - 2022',
    bullets: [
      "Collaboration étroite avec des <strong>startups et entrepreneurs</strong> au sein de Creative Digital Agency pour aider les marques à bâtir une présence en ligne convaincante.",
      "Direction du <strong>rebranding</strong> et de la <strong>refonte de sites web</strong> pour des entreprises souhaitant moderniser et optimiser leur empreinte numérique.",
      "Développement d'une expertise approfondie en <strong>JavaScript, Figma et intégration d'animations complexes</strong> pour concevoir des interfaces performantes et fluides."
    ]
  },
  {
    phase: "Collaborations d'Envergure",
    period: '2022 - Présent',
    bullets: [
      "Partenariat direct avec des <strong>agences, startups et marques d'envergure</strong> chez Tech Innovations Inc., livrant des solutions de conception à travers diverses industries.",
      "Conception et développement de <strong>sites web axés sur la conversion</strong> et d'<strong>expériences UI/UX intuitives</strong> pour des plateformes SaaS, marques e-commerce et produits digitaux.",
      "Encadrement d'une <strong>équipe de 4 développeurs frontend</strong> et optimisation des performances (temps de chargement amélioré de 40% sur la plateforme principale)."
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
          Moments clés, projets et rôles qui ont façonné mon parcours et mon approche du design au fil des ans.
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
