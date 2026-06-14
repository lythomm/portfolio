<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  portfolioEmail?: string
}>()

const emit = defineEmits<{
  (e: 'close-app'): void
  (e: 'show-alert', payload: { message: string; title: string; type: 'info' | 'warning' | 'error' }): void
}>()

// Default recipient from props or portfolio JSON
const defaultTo = props.portfolioEmail || 'lythomm@gmail.com'

const to = ref(defaultTo)
const cc = ref('')
const subject = ref('')
const body = ref('')
const statusText = ref('Prêt')

// Actions
const sendMail = () => {
  if (!subject.value.trim() && !body.value.trim()) {
    emit('show-alert', {
      message: "Veuillez entrer un objet ou un corps de message avant d'envoyer.",
      title: "Outlook Express",
      type: "warning"
    })
    return
  }

  statusText.value = "Ouverture du client de messagerie..."

  // Construct mailto link
  let mailtoUrl = `mailto:${encodeURIComponent(to.value)}?`
  const params: string[] = []

  if (cc.value.trim()) {
    params.push(`cc=${encodeURIComponent(cc.value.trim())}`)
  }
  if (subject.value.trim()) {
    params.push(`subject=${encodeURIComponent(subject.value.trim())}`)
  }
  if (body.value.trim()) {
    params.push(`body=${encodeURIComponent(body.value.trim())}`)
  }

  mailtoUrl += params.join('&')

  // Redirect to mailto URL
  window.location.href = mailtoUrl

  // Show status indicator and close window after brief timeout
  setTimeout(() => {
    statusText.value = "Prêt"
    emit('show-alert', {
      message: "Votre client de messagerie par défaut a été ouvert pour envoyer votre message.",
      title: "Message envoyé",
      type: "info"
    })
    emit('close-app')
  }, 1000)
}

const handleAction = (actionName: string) => {
  emit('show-alert', {
    message: `L'action "${actionName}" est factice dans cette version de démonstration d'Outlook Express.`,
    title: "Outlook Express",
    type: "info"
  })
}

// Focus on subject field on mount
const subjectInputRef = ref<HTMLInputElement | null>(null)
onMounted(() => {
  if (subjectInputRef.value) {
    subjectInputRef.value.focus()
  }
})
</script>

<template>
  <div class="outlook-express-container flex flex-col h-full bg-[#ece9d8] select-none text-xs font-sans text-black">
    <!-- Compose Info Fields (To, CC, Subject) -->
    <div class="fields-container grid grid-cols-[60px_1fr] items-center gap-y-1.5 p-3 border-b border-[#a0a0a0] bg-[#ece9d8]">
      <!-- Field: To -->
      <label for="mail-to" class="text-right pr-3 font-semibold text-[#555]"><u>À</u> :</label>
      <div class="flex items-center gap-1">
        <input 
          id="mail-to" 
          v-model="to" 
          type="text" 
          class="flex-1 bg-white border border-gray-400 px-1 py-0.5 text-xs font-sans shadow-inner outline-none focus:border-blue-500" 
        />
        <span class="cursor-pointer text-gray-500 hover:text-black pr-1" title="Choisir dans les contacts" @click="handleAction('Contacts')">👤</span>
      </div>

      <!-- Field: CC -->
      <label for="mail-cc" class="text-right pr-3 font-semibold text-[#555]"><u>C</u>c :</label>
      <input 
        id="mail-cc" 
        v-model="cc" 
        type="text" 
        class="bg-white border border-gray-400 px-1 py-0.5 text-xs font-sans shadow-inner outline-none focus:border-blue-500" 
      />

      <!-- Field: Subject -->
      <label for="mail-subject" class="text-right pr-3 font-semibold text-[#555]"><u>O</u>bjet :</label>
      <input 
        id="mail-subject" 
        ref="subjectInputRef"
        v-model="subject" 
        type="text" 
        class="bg-white border border-gray-400 px-1 py-0.5 text-xs font-sans shadow-inner outline-none focus:border-blue-500" 
        placeholder="Entrez le sujet de votre message"
      />
    </div>

    <!-- Mail Text Body -->
    <div class="flex-1 bg-white p-1 relative flex flex-col">
      <textarea 
        v-model="body" 
        class="flex-1 w-full h-full p-2 border border-[#a0a0a0] shadow-inner text-xs font-sans outline-none resize-none leading-relaxed select-text"
        placeholder="Rédigez votre message ici..."
      ></textarea>
    </div>

    <!-- Action buttons row -->
    <div class="flex justify-end gap-2 pt-2 bg-[#ece9d8] border-t border-[#a0a0a0]">
      <button class="px-5 py-1 font-bold font-sans cursor-pointer min-w-[75px]" @click="sendMail">Envoyer</button>
      <button class="px-5 py-1 font-sans cursor-pointer min-w-[75px]" @click="emit('close-app')">Annuler</button>
    </div>
  </div>
</template>

<style scoped>
.outlook-express-container {
  height: 100%;
}
input, textarea {
  border-radius: 0;
  box-sizing: border-box;
}
</style>
