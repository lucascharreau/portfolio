/* ============================================================
   PORTFOLIO VIDÉO — main.js
   JS minimal, sans dépendance. Trois responsabilités :
   1. Accordéons "déclinaisons Ads"
   2. Apparition douce des blocs au scroll
   3. Gestion intelligente de la lecture vidéo (perf/batterie)
   ============================================================ */

/* ------------------------------------------------------------
   1. ACCORDÉONS — révèle les déclinaisons Ads d'un projet.
   L'animation est faite en CSS (grid-template-rows 0fr → 1fr) ;
   ici on ne gère que l'état (classe .open + ARIA).
   ------------------------------------------------------------ */
document.querySelectorAll('.ads-toggle').forEach((btn) => {
  btn.addEventListener('click', () => {
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    const isOpen = btn.getAttribute('aria-expanded') === 'true';

    btn.setAttribute('aria-expanded', String(!isOpen));
    panel.classList.toggle('open', !isOpen);
    btn.querySelector('.label').textContent = isOpen
      ? 'Voir les déclinaisons Ads'
      : 'Masquer les déclinaisons';

    // À la fermeture, on met en pause les vidéos du panneau
    if (isOpen) panel.querySelectorAll('video').forEach((v) => v.pause());
  });
});

/* ------------------------------------------------------------
   2. APPARITION AU SCROLL — ajoute .visible aux éléments .reveal
   quand ils entrent dans le viewport (une seule fois).
   ------------------------------------------------------------ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

/* ------------------------------------------------------------
   3. VIDÉOS & VIEWPORT —
   - le showreel (data-autoplay) se met en pause hors écran
     et reprend quand il redevient visible ;
   - toute autre vidéo en cours de lecture est mise en pause
     quand elle sort de l'écran.
   ------------------------------------------------------------ */
const videoObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const video = entry.target;
      const isShowreel = video.hasAttribute('data-autoplay');

      if (entry.isIntersecting) {
        // Reprise du showreel uniquement (les autres restent au choix de l'utilisateur)
        if (isShowreel) video.play().catch(() => {});
      } else if (!video.paused) {
        video.pause();
      }
    });
  },
  { threshold: 0.25 }
);
document.querySelectorAll('video').forEach((v) => videoObserver.observe(v));

/* ------------------------------------------------------------
   Bonus : quand une vidéo démarre, on met en pause toutes les
   autres (évite deux bandes-son simultanées). Le showreel muet
   n'est pas concerné.
   ------------------------------------------------------------ */
document.addEventListener(
  'play',
  (event) => {
    const current = event.target;
    if (!(current instanceof HTMLVideoElement) || current.muted) return;

    document.querySelectorAll('video').forEach((v) => {
      if (v !== current && !v.muted && !v.paused) v.pause();
    });
  },
  true // capture : l'événement "play" ne remonte pas en bubbling
);
