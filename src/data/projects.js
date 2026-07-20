export const projects = [
  {
    id: 'horizon',
    title: 'Horizon',
    subtitle: 'Outil de productivité pour les créateurs',
    description: 'Un outil de productivité minimaliste tout-en-un conçu spécifiquement pour les créateurs de contenu indépendants.',
    image: '/project-horizon.png',
    presentation: 'Horizon centralise la planification de contenu, la gestion des tâches et le suivi analytique dans un tableau de bord épuré. Il élimine le bruit pour permettre aux créateurs de se concentrer sur ce qui compte vraiment : la création de valeur et le développement de leur audience sans s\'éparpiller.',
    technologies: ['Vue.js 3', 'Vite', 'Tailwind CSS', 'Pinia', 'Supabase'],
    problemsSolved: 'Les créateurs de contenu perdent en moyenne 30% de leur temps à naviguer entre différentes applications (calendrier, gestionnaire de tâches, outils d\'analyse). Horizon résout ce problème en unifiant le workflow créatif au sein d\'un seul espace cohérent, doté d\'une prévisualisation en temps réel des posts planifiés.',
    gallery: [
      '/project-horizon-detail.png',
      '/project-horizon.png'
    ]
  },
  {
    id: 'vitalo',
    title: 'Vitalo',
    subtitle: 'Template de coaching personnel & fitness',
    description: 'Une plateforme moderne et interactive de coaching de fitness et de nutrition personnalisés.',
    image: '/project-vitalo.png',
    presentation: 'Vitalo aide les coachs sportifs à proposer des programmes de fitness et des plans de nutrition interactifs et sur mesure à leurs clients. La plateforme intègre un suivi des performances en temps réel et un planificateur de repas dynamique.',
    technologies: ['Vue.js 3', 'Tailwind CSS', 'Firebase', 'Chart.js', 'Lenis'],
    problemsSolved: 'Suivre l\'adhérence des clients aux programmes de fitness à distance est un défi majeur pour les coachs. Vitalo résout cela avec un tableau de bord synchronisé en temps réel, permettant aux coachs d\'ajuster instantanément les charges d\'entraînement et les apports caloriques en fonction des retours d\'effort de l\'utilisateur.',
    gallery: [
      '/project-vitalo-detail.png',
      '/project-vitalo.png'
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
