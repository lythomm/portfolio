---
name: Portfolio Thomas
description: Portfolio personnel brutaliste élégant, cinétique et interactif
colors:
  primary: "#121212"
  primary-hover: "#262626"
  neutral-bg: "#f4f4f3"
  surface: "#ffffff"
  text-muted: "#5a5a5a"
  border: "#e0e0df"
typography:
  display:
    fontFamily: "Syne, sans-serif"
    fontSize: "clamp(2.5rem, 7vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.03em"
  body:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    letterSpacing: "0.15em"
rounded:
  sm: "4px"
  base: "6px"
  lg: "8px"
  xl: "12px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.base}"
    padding: "10px 24px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.surface}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.base}"
  button-secondary-hover:
    backgroundColor: "{colors.border}"
---

# Design System: Portfolio Thomas

## 1. Overview

**Creative North Star: "Le Brutisme Élégant"**

Ce système de design allie la force graphique du brutisme (polices massives et imposantes, contrastes marqués, structure industrielle évidente) à une esthétique épurée, cinétique et interactive. Les mises en page exploitent de grands espaces vides pour structurer les contenus et attirer le regard sur des détails de réalisation soignés. Le mouvement n'est pas un artifice décoratif mais un guide de lecture (révélation de texte progressive au défilement, transitions fluides Lenis).

### Key Characteristics:
- Typographies massives en Syne pour les titres et éléments forts.
- Trame géométrique et bordures fines pour découper l'espace sans l'alourdir.
- Mouvement cinétique fluide intégré aux interactions clés (parallaxe, scroll-reveal).

## 2. Colors

La palette de couleurs est délibérément restreinte et contrastée pour laisser s'exprimer les projets présentés.

### Primary
- **Charcoal** (#121212): Couleur maîtresse du projet. Utilisée pour le texte courant, les boutons principaux et les titres massifs. Donne son caractère brut et affirmé au site.
- **Charcoal Hover** (#262626): Utilisé pour l'état actif et de survol des éléments Charcoal.

### Neutral
- **Warm Chalk** (#f4f4f3): Couleur d'arrière-plan principale. Apporte une sensation naturelle et reposante de papier, évitant la sécheresse d'un blanc pur.
- **Clean Paper** (#ffffff): Utilisé pour les surfaces de conteneur, créant un contraste doux mais net avec le fond Warm Chalk.
- **Clay Gray** (#5a5a5a): Utilisé pour le texte secondaire ou atténué (ex: sous-titres, labels techniques).
- **Clay Border** (#e0e0df): Gris clair neutre utilisé exclusivement pour les lignes et bordures géométriques découpant l'interface.

### Named Rules
**The Restrained Contrast Rule.** Les couleurs d'accentuation vives sont proscrites. L'impact visuel repose entièrement sur les contrastes forts entre Charcoal et Warm Chalk/Clean Paper.

## 3. Typography

La typographie repose sur un contraste d'échelle extrême entre une police display forte et un caractère sans-serif géométrique très lisible.

**Display Font:** Syne (avec fallback sans-serif)
**Body Font:** DM Sans (avec fallback sans-serif)
**Label/Mono Font:** Monospace (pour les indications techniques et kicker labels)

### Hierarchy
- **Display** (Extra Bold (800), clamp(2.5rem, 7vw, 4.5rem), 1.0): Utilisé exclusivement pour les titres de hero et les phrases clés d'introduction à fort impact.
- **Headline** (Extra Bold (800), 2rem, 1.2): Titres de sections ou de projets principaux.
- **Body** (Regular (400), 1rem (16px), 1.5): Texte de description et de paragraphe. Longueur de ligne limitée à 65ch pour une lecture optimale.
- **Label** (Medium (500), 0.75rem, letter-spacing: 0.15em): Utilisé pour les kickers, métadonnées techniques et étiquettes. Toujours écrit en lettres capitales.

### Named Rules
**The Display Letter-Spacing Rule.** Les titres massifs en Syne doivent conserver un ajustement serré sans pour autant chevaucher les lettres. L'espacement (`letter-spacing`) ne doit pas descendre sous -0.03em pour conserver une lisibilité impeccable.

## 4. Elevation

Ce système de design est essentiellement plat. La profondeur est créée par les contrastes de teintes de fond et les bordures géométriques, plutôt que par des jeux d'ombres.

### Named Rules
**The Flat-By-Default Rule.** Les ombres portées douces ou floues à but décoratif sont interdites. Les cartes et conteneurs reposent sur des aplats Clean Paper entourés d'une bordure fine de 1px en Clay Border. Une ombre discrète et courte (`--shadow-card`) est autorisée uniquement pour marquer le relief au survol ou sur les boutons interactifs principaux.

## 5. Components

### Buttons
- **Shape:** Coins légèrement adoucis (6px radius).
- **Primary:** Fond Charcoal (#121212), texte Clean Paper (#ffffff). Padding de 10px en hauteur et 24px en largeur.
- **Hover / Focus:** Transition rapide (200ms). Survol : passage au fond Charcoal Hover (#262626). Focus : anneau de contour Charcoal de 2px avec décalage de 2px.
- **Secondary:** Fond Clean Paper (#ffffff), texte Charcoal (#121212). Devient Clay Border (#e0e0df) au survol.

### Cards / Containers
- **Corner Style:** Coins légèrement arrondis (12px radius, `var(--radius-xl)`).
- **Background:** Clean Paper (#ffffff) pour se détacher proprement du fond de la page.
- **Border:** Liseré fin de 1px Clay Border (#e0e0df).
- **Internal Padding:** Remplissage confortable (24px, `var(--spacing-lg)`).

### Navigation
- **Style:** En-tête fixe avec effet de flou d'arrière-plan en verre (`backdrop-blur-md`) blanc translucide sur le conteneur principal. Liens de navigation avec une transition d'état au survol fluide (200ms) et un soulignement cinétique se déployant depuis le centre.

## 6. Do's and Don'ts

### Do:
- **Do** limiter l'utilisation de la police Syne aux grands titres et slogans à fort impact visuel.
- **Do** séparer les sections à l'aide de bordures géométriques de 1px (#e0e0df) pour affirmer le style industriel structuré.
- **Do** animer les révélations de texte de manière progressive et naturelle via le défilement.

### Don't:
- **Don't** utiliser des dégradés de couleurs néons ou multicolores (violet, rose, cyan) typiques des designs AI standard.
- **Don't** utiliser des arrondis disproportionnés (radius > 16px) sur les grands blocs ou cartes pour éviter l'effet enfantin.
- **Don't** combiner bordure physique et ombre portée diffuse large (ghost-card) sur un même élément.
