import { createApp } from 'vue'
import { gsap } from 'gsap'
import './assets/css/main.css'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')

// ── Preloader animation (raw DOM, no Vue dependency) ──────
const preloader = document.getElementById('preloader')
const counter = document.getElementById('preloader-counter')
const bar = document.getElementById('preloader-bar')

if (preloader && counter && bar) {
  const obj = { v: 0 }
  const tl = gsap.timeline({
    onComplete: () => {
      preloader.remove()
      window.dispatchEvent(new CustomEvent('preloader-complete'))
    },
  })

  tl.to(obj, {
    v: 100,
    duration: 2,
    ease: 'power2.inOut',
    snap: { v: 1 },
    onUpdate: () => { counter.textContent = Math.round(obj.v) },
  }, 0)

  tl.to(bar, {
    scaleX: 1,
    duration: 2,
    ease: 'power2.inOut',
  }, 0)

  tl.to({}, { duration: 0.2 })

  tl.to(preloader, {
    yPercent: -100,
    duration: 0.8,
    ease: 'power4.inOut',
  })
}
