# Conception de l'effet Écran Cathodique (CRT) avec Distorsion en Barillet

Ce document détaille les choix de conception et d'implémentation pour l'ajout d'un effet visuel rétro CRT sur le portfolio Thomas OS (style Windows XP).

## Synthèse de compréhension

*   **Quoi** : Ajout d'un effet visuel complet de moniteur cathodique (CRT) avec distorsion en barillet (effet d'écran bombé), lignes de balayage (scanlines) animées, scintillement (flicker) subtil, effet de vignette sombre sur les bords et légère aberration chromatique.
*   **Pourquoi** : Pour renforcer l'immersion rétro et nostalgique du portfolio Windows XP.
*   **Pour qui** : Les visiteurs du portfolio, sur ordinateur comme sur mobile.
*   **Contrôle utilisateur** : L'effet sera activé par défaut à l'ouverture du site. L'utilisateur pourra le désactiver/réactiver facilement via deux raccourcis : un bouton dans la zone de notification de la barre des tâches (System Tray, près de l'horloge) et une option dans le menu Démarrer.
*   **Non-objectifs explicites** : Il ne s'agit pas de modifier les comportements ou les contenus existants des fenêtres ou applications de votre portfolio, mais de superposer une couche de rendu esthétique globale.

## Hypothèses techniques

*   **Compatibilité** : L'effet sera activé par défaut sur toutes les tailles d'écran. En cas de ralentissement sur appareil mobile ou machine ancienne, l'utilisateur a la possibilité de le désactiver manuellement.
*   **Mémorisation** : La préférence de l'utilisateur (CRT activé/désactivé) sera persistée dans le `localStorage` pour être conservée lors des visites ultérieures.

## Journal des Décisions (Decision Log)

*   **Décision 1 : Choix de l'Option 1 (Filtre SVG et couches CSS superposées)**
    *   *Raison* : L'utilisateur souhaite un effet d'écran bombé très fidèle et immersif avec distorsion physique du contenu (barrel distortion).
*   **Décision 2 : Raccourcis d'activation**
    *   *Raison* : Intégration naturelle dans l'esthétique Windows XP (System Tray près de l'horloge et option dans le menu Démarrer) pour allier ergonomie et cohérence graphique.
*   **Décision 3 : Activation universelle avec option manuelle**
    *   *Raison* : Privilégier un effet visuel marquant ("Wow effect") dès la première visite, tout en laissant l'utilisateur maître de ses performances s'il dispose d'une configuration légère.

## Conception Finale

### 1. Gestion de l'état global (`App.vue`)

Un état réactif `isCrtActive` (booléen) sera déclaré dans `App.vue` et partagé/passé en props aux composants enfants (`Taskbar.vue`, `StartMenu.vue`).
La classe CSS `.crt-enabled` sera ajoutée au conteneur principal lorsque `isCrtActive` est vrai.

### 2. Distorsion en barillet (SVG Filter)

Un filtre SVG personnalisé sera injecté dans le template principal pour déformer les coordonnées de rendu (effet d'optique sphérique).

```html
<svg class="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
  <filter id="crt-warp">
    <!-- Cartographie de distorsion -->
    <feTurbulence type="fractalNoise" baseFrequency="0.00001" numOctaves="1" result="noise" />
    <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" xChannelSelector="R" yChannelSelector="G" />
  </filter>
</svg>
```

### 3. Effets de surface (CSS)

Dans `style.css`, l'effet CRT comprendra :
*   Un pseudo-élément de type `::after` sur le wrapper global contenant des rayures horizontales sombres semi-transparentes (lignes de balayage ou *scanlines*).
*   Une animation de scintillement d'opacité (flicker) oscillant très rapidement entre `0.99` et `1.0`.
*   Un dégradé radial (vignette) assombrissant les coins extérieurs de l'écran pour accentuer l'aspect tubulaire.
*   Une légère aberration chromatique via des effets de décalage de texte/ombres.
