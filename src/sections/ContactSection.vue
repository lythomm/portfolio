<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { MapPin } from 'pixelarticons/fonts/vue/MapPin'
import { Mail } from 'pixelarticons/fonts/vue/Mail'
import { Phone } from 'pixelarticons/fonts/vue/Phone'
import { ChevronRight } from 'pixelarticons/fonts/vue/ChevronRight'
import { ShaderMount, meshGradientFragmentShader, getShaderColorFromString } from '@paper-design/shaders'

const navLinks = [
  { name: 'Accueil', href: '/#top' },
  { name: 'À propos', href: '/#about' },
  { name: 'Projets', href: '/#projects' },
  { name: 'Services', href: '/#services' },
  { name: 'Parcours', href: '/#experience' },
  { name: 'Contact', href: '/#contact' }
]

const shaderCanvasContainer = ref(null)
let shaderMount = null

onMounted(() => {
  if (shaderCanvasContainer.value) {
    const colors = ['#f3f3f2', '#121212', '#262626', '#121212'].map(getShaderColorFromString)
    
    shaderMount = new ShaderMount(
      shaderCanvasContainer.value, 
      meshGradientFragmentShader, 
      {
        u_colors: colors,
        u_colorsCount: colors.length,
        u_distortion: 0.80,
        u_swirl: 0.47,
        u_grainMixer: 0.22,
        u_grainOverlay: 1.00,
        u_scale: 1.36,
        u_rotation: 292,
        u_offsetX: 0.00,
        u_offsetY: 0.00
      },
      undefined, // webGlContextAttributes
      0.48       // speed
    )
  }
})

onUnmounted(() => {
  if (shaderMount) {
    if (typeof shaderMount.dispose === 'function') {
      shaderMount.dispose()
    } else if (typeof shaderMount.destroy === 'function') {
      shaderMount.destroy()
    }
  }
})
</script>
<template>
  <footer id="contact" class="bg-[var(--color-primary)] pt-16 md:pt-12 pb-12 md:pb-8 relative overflow-hidden md:h-screen md:flex md:flex-col md:justify-between">
    <!-- Mesh Gradient Background Shader -->
    <div ref="shaderCanvasContainer" class="footer-shader-container"></div>
    
    <!-- 1. The Centered Content Row (Grid) -->
    <div class="mx-section-default relative z-10 md:my-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        <!-- Contact Info -->
        <div class="text-white flex flex-col justify-center space-y-10!">
          <h3 class="text-3xl md:text-5xl font-bold mb-4">
            Travaillons ensemble
          </h3>
          <p class="text-white text-base md:text-lg mb-6 md:mb-4 lg:mb-6 max-w-md leading-relaxed">
            Je suis actuellement disponible pour des projets en freelance ou des opportunités à temps plein. Créons quelque chose d'exceptionnel.
          </p>
          
          <div class="space-y-4 md:space-y-3 lg:space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                <Mail viewBox="0 0 24 24" class="w-5 h-5 fill-current text-white" />
              </div>
              <div>
                <p class="text-[11px] text-white font-medium">E-mail</p>
                <a href="mailto:hello@thomas.dev" class="text-base hover:text-white transition-colors">lythomm@gmail.com</a>
              </div>
            </div>
            
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                <Phone viewBox="0 0 24 24" class="w-5 h-5 fill-current text-white" />
              </div>
              <div>
                <p class="text-[11px] text-white font-medium">Téléphone</p>
                <p class="text-base">+33 6 11 59 76 27</p>
              </div>
            </div>
            
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                <MapPin viewBox="0 0 24 24" class="w-5 h-5 fill-current text-zinc-300" />
              </div>
              <div>
                <p class="text-[11px] text-white font-medium">Localisation</p>
                <p class="text-base">Toulouse, France</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Menu -->
        <div class="flex flex-col justify-center">
          <div class="flex flex-col border-t border-white/10">
            <router-link 
              v-for="link in navLinks" 
              :key="link.name"
              :to="link.href"
              class="group flex items-center justify-between py-5 px-4 -mx-4 rounded-xl border-b border-white/10 text-xl md:text-2xl font-medium tracking-tight text-white hover:text-zinc-300 hover:bg-white/[0.06] transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
            >
              <span>{{ link.name }}</span>
              <ChevronRight class="w-6 h-6 fill-current text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. The Bottom Copyright Bar (Placed outside vertical centering) -->
    <div class="mx-section-default relative z-10 pb-4 md:pb-0">
      <div class="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-white text-sm">
          &copy; {{ new Date().getFullYear() }} Thomas.dev. Tous droits réservés.
        </p>
        <div class="flex items-center gap-6">
          <a href="#" class="text-white hover:text-zinc-300 text-sm transition-colors">Politique de confidentialité</a>
          <a href="#" class="text-white hover:text-zinc-300 text-sm transition-colors">Conditions d'utilisation</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-shader-container {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  opacity: 0.65;
}

.footer-shader-container :deep(canvas) {
  position: absolute !important;
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
  display: block !important;
  z-index: -1 !important;
}
</style>
