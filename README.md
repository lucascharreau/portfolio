# Portfolio vidéo — Lucas

Site portfolio one-page, design « Agence Créative Premium » : thème clair
ultra-lumineux, accent dégradé sunset orangé, cartes arrondies, ombres douces.
100 % statique (HTML / CSS / JS vanilla) — aucun build, aucune dépendance.

## Structure

```
Site/
├── index.html          → structure de la page (hero, formats longs, reels, projets persos, contact)
├── css/style.css       → design complet (variables CSS, grid, accordéons, responsive)
├── js/main.js          → accordéons Ads, apparitions au scroll, pause auto des vidéos
├── assets/
│   ├── videos/         → fichiers .mp4
│   └── posters/        → miniatures .jpg affichées avant lecture
└── README.md
```

## Ajouter tes vidéos

1. Dépose tes fichiers dans `assets/videos/` en respectant les noms utilisés
   dans `index.html` (ou adapte les `src` dans le HTML) :
   - `showreel.mp4` — le montage d'accueil (autoplay, muet, en boucle)
   - `projet-01.mp4` … `projet-03.mp4` — formats longs 16:9
   - `projet-01-ad-hook.mp4` etc. — déclinaisons verticales 9:16
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
