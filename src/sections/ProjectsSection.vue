<script setup>
import { CornerUpRight } from 'pixelarticons/fonts/vue/CornerUpRight'
import { projects } from '../data/projects'
</script>

<template>
  <section id="projects" class="py-24 bg-zinc-950 text-white transition-colors duration-500">
    <div class="mx-section-default">
      
      <!-- Section Header -->
      <div class="mb-16 text-center">
        <h2 class="text-zinc-500 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] mb-4">
          // Projets récents
        </h2>
        <h3 class="text-2xl md:text-5xl font-bold font-display uppercase tracking-tight text-white">
          Projets sélectionnés
        </h3>
      </div>

      <!-- Static Grid: 3 columns on PC/tablet, 1 on mobile -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 w-full">
        <router-link 
          v-for="(project, index) in projects" 
          :key="project.id"
          :to="`/project/${project.id}`"
          class="flex flex-col group cursor-pointer text-left"
        >
          <!-- Mockup Image Container (square aspect ratio) -->
          <div class="w-full aspect-square overflow-hidden bg-zinc-900 rounded-md border border-zinc-800/80 shadow-2xl relative">
            <img 
              :src="project.image" 
              :alt="project.title" 
              class="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700" 
            />
            <!-- Glowing outline bottom-to-top on hover -->
            <div class="border-glow z-20"></div>
          </div>
          
          <!-- Details Below Image -->
          <div class="mt-6 flex flex-col gap-3">
            <span class="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              // 0{{ index + 1 }}
            </span>
            
            <div class="flex items-start justify-between">
              <div class="flex flex-col gap-1">
                <h4 class="text-xl md:text-2xl font-bold font-display uppercase tracking-tight text-white group-hover:text-zinc-300 transition-colors duration-300">
                  {{ project.title }}
                </h4>
                <p class="text-sm text-zinc-400 font-light leading-relaxed">
                  {{ project.subtitle }}
                </p>
              </div>
              
              <CornerUpRight viewBox="0 0 24 24" class="w-6 h-6 fill-current text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 shrink-0 mt-1" />
            </div>
          </div>
        </router-link>
      </div>


    </div>
  </section>
</template>

<style scoped>
.border-glow {
  position: absolute;
  inset: 0;
  border-radius: 0.5rem; /* 8px matching rounded-lg */
  padding: 1.5px;
  background: linear-gradient(
    135deg, 
    transparent 0%, 
    rgba(255, 255, 255, 0) 35%, 
    rgba(255, 255, 255, 0.85) 50%, 
    rgba(255, 255, 255, 0) 65%, 
    transparent 100%
  );
  background-size: 300% 300%;
  background-position: 0% 0%;
  background-repeat: no-repeat;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.group:hover .border-glow {
  opacity: 1;
  animation: border-sweep 2.8s linear infinite;
}

@keyframes border-sweep {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 100% 100%;
  }
}
</style>
