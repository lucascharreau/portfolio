# Portfolio & CV — Lucas

Site one-page à trois vues (Accueil / Portfolio / CV), design « Agence Créative
Premium » : thème clair ultra-lumineux, accent dégradé sunset orangé, cartes
arrondies, ombres douces. Écran d'entrée avec choix Portfolio ou CV, bascule
instantanée via le toggle du header (transitions View Transitions API + repli),
CV bilingue FR/EN. 100 % statique (HTML / CSS / JS vanilla) — aucun build,
aucune dépendance.

## Structure

```
Site/
├── index.html          → les 3 vues : écran d'entrée, portfolio, CV (+ header partagé)
├── css/style.css       → design du portfolio (variables CSS, grid, accordéons, responsive)
├── css/app.css         → écran d'entrée, header partagé (switch, marque roulante), composants CV, transitions
├── js/main.js          → accordéons Ads, apparitions au scroll, pause auto des vidéos
├── js/app.js           → contenu du CV (FR/EN, à éditer ici), routeur de vues, transitions
├── assets/
│   ├── videos/         → fichiers .mp4
│   └── posters/        → miniatures .jpg affichées avant lecture
└── README.md
```

## Modifier le CV

Tout le contenu du CV (expériences, formation, compétences, langues,
international) est dans `js/app.js`, en français et en anglais — même principe
que l'ancien site CV : modifier les textes dans les tableaux de données suffit.

## Ajouter tes vidéos

1. Dépose tes fichiers dans `assets/videos/` en respectant les noms utilisés
   dans `index.html` (ou adapte les `src` dans le HTML) :
   - `showreel.mp4` — le montage d'accueil (autoplay, muet, en boucle)
   - `projet-01.mp4` … `projet-03.mp4` — formats longs 16:9
   - `projet-0X-ad-<nom>.mp4` — déclinaisons ads, **jusqu'à 6 par projet**
     (hook, preuve, cta, story, carre, banniere, teaser…). Dans le HTML,
     ajoute la classe `ratio-carre` (1:1) ou `ratio-paysage` (16:9) sur
     un `.clip` pour les formats non verticaux.
   - `reel-01.mp4` … `reel-04.mp4` — reels 9:16
   - `perso-*.mp4` — projets personnels
2. Ajoute une miniature `.jpg` du même nom dans `assets/posters/`
   (une capture d'écran de la vidéo suffit). C'est elle qui s'affiche
   avant la lecture — indispensable pour un rendu propre.

### Conseils de poids (important pour GitHub)

GitHub refuse les fichiers **> 100 Mo** et un site lent tue un portfolio.

- Exporte en **H.264 / MP4**, 1080p max, débit ~5–8 Mbit/s (HandBrake fait ça très bien).
- Vise **< 20 Mo** par vidéo de démonstration.
- Pour les formats longs lourds, préfère **YouTube (non répertorié) ou Vimeo** :
  chaque carte du HTML contient un commentaire montrant comment remplacer
  la balise `<video>` par une `<iframe>` d'intégration.

## Déployer sur GitHub Pages

```bash
cd ~/Desktop/Site
git init
git add .
git commit -m "Portfolio vidéo"
git branch -M main
git remote add origin https://github.com/TON-PSEUDO/TON-REPO.git
git push -u origin main
```

Puis sur GitHub : **Settings → Pages → Source : Deploy from a branch →
Branch : `main` / `(root)` → Save.**

Le site sera en ligne quelques minutes plus tard sur
`https://TON-PSEUDO.github.io/TON-REPO/`.

## Personnaliser

- **Couleurs, polices, espacements** : tout est dans les variables en tête
  de `css/style.css` (`--bg`, `--grad`, `--radius`…).
- **Textes** : titres, descriptions et tags sont directement dans `index.html`,
  chaque section est délimitée par un commentaire.
- **Contact** : l'email et le lien LinkedIn sont dans la section `#contact`.
