export const projects = [
  {
    id: 'bailconnect',
    title: 'BailConnect',
    subtitle: 'Plateforme SaaS de gestion locative automatisée',
    description: 'Une plateforme SaaS qui permet aux propriétaires bailleurs de centraliser, trier et automatiser le traitement des candidatures de locataires pour leurs biens en location.',
    image: '/project-bailconnect.png',
    presentation: 'BailConnect démocratise les outils de gestion locative professionnels en offrant aux propriétaires particuliers une solution moderne et abordable. Créez des campagnes de location (manuellement ou par scraping IA d\'annonces existantes), recevez les candidatures sur une page publique dédiée, gérez les visites avec réservation automatisée, et suivez tout depuis un dashboard interactif — de la publication de l\'annonce à la signature du bail.',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS v4', 'Convex', 'Stripe', 'Firecrawl', 'Twilio', 'Resend', 'Playwright'],
    problemsSolved: 'En France, les candidatures locatives arrivent de partout (emails, plateformes, SMS) sans centralisation, le tri se fait manuellement par tableur, et l\'organisation des visites est un casse-tête logistique. BailConnect résout ces problèmes avec une page de candidature unique par annonce, un tableau interactif avec filtres et tri, des créneaux de visite en ligne avec réservation automatisée, du scraping IA pour extraire les annonces, et des notifications automatiques (email + SMS) avec digest quotidien paramétrable. Modèle freemium accessible dès 0 €.',
    gallery: [
      '/bailconnect-dashboard.png',
      '/bailconnect-calendar.png'
    ],
    projectUrl: 'https://www.bailconnect.fr/'
  },
  {
    id: 'scriblio',
    title: 'Scriblio',
    subtitle: 'App de productivité vocale pilotée par l\'IA',
    description: 'Une application web de productivité personnelle qui transforme la voix en notes structurées et mind maps en temps réel grâce à l\'intelligence artificielle.',
    image: '/project-scriblio.png',
    projectUrl: 'https://scriblio-ai.vercel.app/',
    presentation: 'Scriblio transforme la voix en connaissance structurée : notes, mind maps, et mémoire interrogeable. Tout cela, en temps réel et sans friction. Enregistrez un audio : l\'IA transcrit, nettoie, synthétise et catégorise automatiquement. Parlez naturellement et une mind map se construit en direct sur un canvas interactif infini. Interrogez tout votre historique en langage naturel grâce à la recherche sémantique vectorielle (RAG).',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS v4', 'Convex', 'React Flow', 'Gemini Live (WebRTC)', 'Groq Whisper', 'Groq LLM (Llama)', 'RAG / Vector Search'],
    problemsSolved: 'Capturer une idée au moment où elle surgit reste un point de friction majeur : taper crée une barrière cognitive et les mémos vocaux classiques stockent un audio brut inutilisable. Scriblio élimine la friction du clavier en transformant la voix en contenu structuré instantanément, construit des mind maps vocales en temps réel pour ne rien perdre du brainstorming, et permet de retrouver n\'importe quelle information passée via recherche sémantique en langage naturel (RAG). L\'architecture WebRTC + Gemini Live offre une latence < 800ms pour une expérience conversationnelle fluide.',
    gallery: [
      '/scriblio-RAG.png',
      '/scriblio-notes.png'
    ]
  },
  {
    id: 'flowpath',
    title: 'Flowpath',
    subtitle: 'Template d\'automatisation par IA',
    description: 'Un constructeur de workflows visuels pour automatiser les tâches complexes grâce à l\'intelligence artificielle.',
    image: '/project-flowpath.png',
    presentation: 'Flowpath permet de connecter des services tiers à des modèles d\'IA pour automatiser des processus métier complexes sans écrire une ligne de code. Grâce à une interface intuitive en drag-and-drop, configurez et déployez des agents autonomes en quelques minutes.',
    technologies: ['Vue.js 3', 'Tailwind CSS', 'Vue Flow', 'OpenAI API', 'Express.js'],
    problemsSolved: 'L\'intégration de pipelines d\'IA avancés requiert normalement de lourdes compétences en backend et en architecture de données. Flowpath démocratise cet usage en proposant un outil visuel complet pour concevoir, tester et exécuter des flux de travail complexes avec gestion d\'états.',
    gallery: [
      '/project-flowpath-detail.png',
      '/project-flowpath.png'
    ]
  }
]
