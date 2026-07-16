/* ============================================================
   PORTFOLIO VIDÉO — main.js (design v3 « Agence Créative Premium »)
   JS minimal, sans dépendance. Trois responsabilités :
   1. Tiroir des déclinaisons Ads (un seul ouvert à la fois)
   2. Apparition des blocs au scroll
   3. Gestion de la lecture vidéo (perf / batterie / audio)
   ============================================================ */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------
   1. TIROIR DES DÉCLINAISONS — chaque bouton ouvre son panneau
   pleine largeur sous la grille ; ouvrir un projet ferme l'autre.
   La hauteur est animée en JS : 0 → hauteur mesurée → auto.
   ------------------------------------------------------------ */
const adsButtons = document.querySelectorAll('.ads-btn');

/* Anime la hauteur d'un panneau entre deux valeurs (easeInOutQuad). */
function animateHeight(set, from, to, onDone) {
  if (reducedMotion) {
    set.style.height = to === 0 ? '0px' : 'auto';
    if (onDone) onDone();
    return;
  }
  const duration = 450;
  const start = performance.now();
  const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2);

  (function step(now) {
    const p = Math.min((now - start) / duration, 1);
    set.style.height = from + (to - from) * ease(p) + 'px';
    if (p < 1) requestAnimationFrame(step);
    else if (onDone) onDone();
  })(start);
}

function collapseSet(set) {
  set.querySelectorAll('video').forEach((v) => v.pause());
  set.classList.remove('open');
  set.style.visibility = 'visible'; // reste visible le temps de la fermeture
  animateHeight(set, set.getBoundingClientRect().height, 0, () => {
    set.style.visibility = ''; // la règle CSS (hidden) reprend la main
  });
}

function expandSet(set) {
  set.classList.add('open');
  animateHeight(set, set.getBoundingClientRect().height, set.scrollHeight, () => {
    set.style.height = 'auto'; // suit ensuite les redimensionnements
  });
}

adsButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.getAttribute('aria-controls'));
    const wasOpen = btn.getAttribute('aria-expanded') === 'true';

    // On ferme tout (panneaux + états des boutons)…
    document.querySelectorAll('.ads-set.open').forEach(collapseSet);
    adsButtons.forEach((b) => {
      b.setAttribute('aria-expanded', 'false');
      b.querySelector('.sign').textContent = '+';
    });

    // …puis on ouvre le panneau demandé (sauf si on vient de le fermer)
    if (!wasOpen) {
      btn.setAttribute('aria-expanded', 'true');
      btn.querySelector('.sign').textContent = '−';
      expandSet(target);
      // Amène le tiroir dans le viewport une fois la transition lancée
      setTimeout(() => {
        target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'nearest' });
      }, 250);
    }
  });
});

/* ------------------------------------------------------------
   2. APPARITION AU SCROLL — ajoute .visible aux .reveal
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
   - toute autre vidéo en lecture est mise en pause hors écran.
   ------------------------------------------------------------ */
const videoObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const video = entry.target;
      if (entry.isIntersecting) {
        if (video.hasAttribute('data-autoplay')) video.play().catch(() => {});
      } else if (!video.paused) {
        video.pause();
      }
    });
  },
  { threshold: 0.25 }
);
document.querySelectorAll('video').forEach((v) => videoObserver.observe(v));

/* Quand une vidéo sonore démarre, on met les autres en pause
   (évite deux bandes-son simultanées). */
document.addEventListener(
  'play',
  (event) => {
    const current = event.target;
    if (!(current instanceof HTMLVideoElement) || current.muted) return;
    document.querySelectorAll('video').forEach((v) => {
      if (v !== current && !v.muted && !v.paused) v.pause();
    });
  },
  true // capture : « play » ne remonte pas en bubbling
);
