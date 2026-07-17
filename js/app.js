/* ============================================================
   PORTFOLIO + CV — app.js
   Couche « application », sans dépendance :
   1. Données du CV (FR/EN) — reprises du CV d'origine
   2. Rendu du CV (textes, lignes, compétences, international)
   3. Interactions CV (lignes dépliables, rotateur, langue)
   4. Routeur de vues (landing / portfolio / cv) + hash
   5. Transitions : balayage « wipe », glissement (View
      Transitions API + repli WAAPI), zoom retour accueil
   ============================================================ */

(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================
     1. DONNÉES — textes d'interface (FR/EN)
     ============================================================ */
  var CV_I18N = {
    fr: {
      nav_exp: 'Expérience', nav_edu: 'Formation', nav_skills: 'Compétences',
      nav_langs: 'Langues', nav_intl: 'International', nav_contact: 'Contact',
      b_dispo: 'Disponible pour opportunités',
      b_master: 'Master 2 Management International et Marketing — IAE Angers',
      b_lang: 'FR · EN (TOEIC 910/990) · ES',
      h1a: 'Marketing international,',
      h1b: 'création de contenu.',
      rot: ['Marketing international', 'Production audiovisuelle', 'Imagerie drone', 'Analyse de marché'],
      bio: '<strong>Chargé de Marketing opérationnel chez <a href="https://weenat.com" target="_blank" rel="noopener">Weenat</a> (AgTech).</strong><br>' +
           'Étudiant en Master 2 Management International et Marketing à l’IAE d’Angers, je traduis la technique en histoires simples — en plusieurs langues, à travers l’Europe.',
      loc: 'Nantes / Angers, France',
      cta1: 'Parcourir l’expérience',
      cta2: 'Voir le portfolio →',
      s1e: '01 — Expérience', s1t: 'Parcours professionnel',
      s1p: 'De l’AgTech à la banque : cliquez sur une expérience pour le détail des missions.',
      s2e: '02 — Formation', s2t: 'Formation académique',
      s3e: '03 — Compétences', s3t: 'Compétences clés',
      s3p: 'Du terrain à l’analyse : produire le contenu, et savoir pourquoi on le produit.',
      s4e: '04 — Langues', s4t: 'Langues parlées',
      s5e: '05 — International', s5t: 'Expérience internationale',
      s5p: 'Un an en Nouvelle-Zélande, un semestre en Finlande, des tournages à travers l’Europe.',
      s6e: '06 — Contact',
      s6t: 'Un poste, une mission&nbsp;?<br><span class="grad-text">Parlons-en.</span>',
      s6p: 'Flexible - Réponse rapide',
      c_mail: 'Écrivez-moi', c_line: 'ou directement :',
      foot: '© 2026 Lucas Charreau — Création vidéo · Imagerie drone · Callisthénie',
      foot_top: 'Retour en haut ↑'
    },
    en: {
      nav_exp: 'Experience', nav_edu: 'Education', nav_skills: 'Skills',
      nav_langs: 'Languages', nav_intl: 'International', nav_contact: 'Contact',
      b_dispo: 'Open to opportunities',
      b_master: 'MSc International Management & Marketing — IAE Angers',
      b_lang: 'FR · EN (TOEIC 910/990) · ES',
      h1a: 'International marketing,',
      h1b: 'content creation.',
      rot: ['International marketing', 'Video production', 'Drone imagery', 'Market analysis'],
      bio: '<strong>Operational Marketing Officer at <a href="https://weenat.com" target="_blank" rel="noopener">Weenat</a> (AgTech).</strong><br>' +
           'Master’s student in International Management & Marketing at IAE Angers, I turn technical products into simple stories — in several languages, across Europe.',
      loc: 'Nantes / Angers, France',
      cta1: 'Browse my experience',
      cta2: 'View the portfolio →',
      s1e: '01 — Experience', s1t: 'Professional journey',
      s1p: 'From AgTech to banking: click any role to see the missions in detail.',
      s2e: '02 — Education', s2t: 'Academic background',
      s3e: '03 — Skills', s3t: 'Core skills',
      s3p: 'From the field to the analysis: producing content — and knowing why it’s produced.',
      s4e: '04 — Languages', s4t: 'Spoken languages',
      s5e: '05 — International', s5t: 'International experience',
      s5p: 'A year in New Zealand, a semester in Finland, shoots across Europe.',
      s6e: '06 — Contact',
      s6t: 'A role, a mission?<br><span class="grad-text">Let’s talk.</span>',
      s6p: 'Flexible — quick to reply',
      c_mail: 'Email me', c_line: 'or directly:',
      foot: '© 2026 Lucas Charreau — Video making · Drone imagery · Calisthenics',
      foot_top: 'Back to top ↑'
    }
  };

  /* ============================================================
     1bis. DONNÉES — contenu du CV (FR/EN)
     ============================================================ */
  var EXPERIENCES = [
    {
      fr: {
        when: 'Mars 2026 — auj.', title: 'Chargé de Marketing opérationnel', org: 'Weenat · Nantes',
        bullets: [
          'Tournages terrain dans 5 pays (France, Portugal, Suisse, Espagne, Allemagne), au cœur des exploitations agricoles.',
          'Banque de contenus multiculturelle : captation des capteurs agro-météo, interviews clients en plusieurs langues.',
          'Formats longs pour le site et les réseaux sociaux, formats courts optimisés pour les campagnes Ads.',
          'Traduction des enjeux agricoles techniques en discours orienté bénéfices.',
          'Développement du contenu du site internet en plusieurs langues.'
        ]
      },
      en: {
        when: 'Mar 2026 — now', title: 'Operational Marketing Officer', org: 'Weenat · Nantes',
        bullets: [
          'Field shoots in 5 countries (France, Portugal, Switzerland, Spain, Germany), on-site at farms.',
          'Multicultural content library: agro-weather sensor footage, customer interviews in several languages.',
          'Long-form content for the website and social media, short-form cuts optimised for ad campaigns.',
          'Turned technical agricultural challenges into benefit-driven messaging.',
          'Developed multilingual website content.'
        ]
      }
    },
    {
      fr: {
        when: 'Nov 2024 — Fév 2025', title: 'Préparateur de véhicules', org: 'Spaceships · Christchurch, NZ',
        bullets: [
          'Gestion du planning de nettoyage et du stationnement de la flotte.',
          'Travail 100 % en anglais, dans le cadre d’un PVT d’un an en Nouvelle-Zélande.'
        ]
      },
      en: {
        when: 'Nov 2024 — Feb 2025', title: 'Car Groomer', org: 'Spaceships · Christchurch, NZ',
        bullets: [
          'Managed the cleaning schedule and fleet parking.',
          'Worked fully in English, during a one-year Working Holiday in New Zealand.'
        ]
      }
    },
    {
      fr: {
        when: 'Avr — Juin 2023', title: 'Stagiaire Achats & Analyse de données', org: 'SavoirsPlus · Brissac-Quincé',
        bullets: [
          'Benchmarking et veille concurrentielle sur le marché des fournitures.',
          'Étude de marché quantitative et mapping des prix.',
          'Recommandations stratégiques de prix d’achat pour les négociations fournisseurs N+1.'
        ]
      },
      en: {
        when: 'Apr — Jun 2023', title: 'Purchasing & Data Analysis Intern', org: 'SavoirsPlus · Brissac-Quincé',
        bullets: [
          'Benchmarking and competitive intelligence in the supplies market.',
          'Quantitative market study and price mapping.',
          'Strategic purchasing-price recommendations for next-year supplier negotiations.'
        ]
      }
    },
    {
      fr: {
        when: 'Avr — Juin 2022', title: 'Stagiaire en agence bancaire', org: 'Crédit Mutuel · Angers',
        bullets: [
          'Accueil des clients et participation aux rendez-vous conseillers.',
          'Action commerciale ciblant les clients inactifs.'
        ]
      },
      en: {
        when: 'Apr — Jun 2022', title: 'Bank Branch Intern', org: 'Crédit Mutuel · Angers',
        bullets: [
          'Welcomed customers and joined advisor meetings.',
          'Sales initiative targeting inactive customers.'
        ]
      }
    },
    {
      fr: {
        when: 'Mai — Juin 2021', title: 'Stagiaire vente', org: 'BUT · Angers',
        bullets: ['Conseil client, merchandising et gestion opérationnelle du magasin.']
      },
      en: {
        when: 'May — Jun 2021', title: 'Sales Intern', org: 'BUT · Angers',
        bullets: ['Customer advice, merchandising and store operations.']
      }
    },
    {
      fr: {
        when: '2021 — 2023', title: 'Jobs étudiants', org: 'Tommy’s Diner · McDonald’s',
        bullets: ['En parallèle des études : rigueur, gestion du stress, polyvalence et esprit d’équipe.']
      },
      en: {
        when: '2021 — 2023', title: 'Student jobs', org: 'Tommy’s Diner · McDonald’s',
        bullets: ['Alongside my studies: rigour, stress management, versatility and teamwork.']
      }
    }
  ];

  var EDUCATION = [
    {
      fr: { when: '2025 — 2026', title: 'Master 2 Management International et Marketing', org: 'IAE Angers', note: 'Stratégie marketing internationale, gestion de projets à l’international, ventes à l’export.' },
      en: { when: '2025 — 2026', title: 'MSc International Management & Marketing', org: 'IAE Angers', note: 'International marketing strategy, international project management, export sales.' }
    },
    {
      fr: { when: 'Août — Déc 2025', title: 'Échange Erasmus', org: 'Haaga-Helia · Helsinki, Finlande', note: 'Semestre de niveau master en commerce international, en anglais.' },
      en: { when: 'Aug — Dec 2025', title: 'Erasmus Exchange', org: 'Haaga-Helia · Helsinki, Finland', note: 'Master-level semester in international business, in English.' }
    },
    {
      fr: { when: '2022 — 2024', title: 'Licence 3 & Master 1 Management International', org: 'IAE Angers', note: 'Management des organisations, finance et stratégie, travail d’équipe multiculturel.' },
      en: { when: '2022 — 2024', title: 'BSc 3 & MSc 1 International Management', org: 'IAE Angers', note: 'Organisational management, finance & strategy, multicultural teamwork.' }
    },
    {
      fr: { when: '2020 — 2022', title: 'DUT Techniques de Commercialisation', org: 'IUT de Laval', note: 'Marketing opérationnel, gestion commerciale, études de marché.' },
      en: { when: '2020 — 2022', title: 'Two-year degree in Marketing Techniques', org: 'IUT de Laval', note: 'Operational marketing, sales management, market research.' }
    }
  ];

  var SKILLS = [
    {
      fr: { name: 'Marketing & contenu', items: ['Marketing opérationnel', 'Production audiovisuelle', 'Vidéographie par drone', 'Stratégie de contenu', 'Campagnes Ads', 'WordPress'] },
      en: { name: 'Marketing & content', items: ['Operational marketing', 'Video production', 'Drone videography', 'Content strategy', 'Ad campaigns', 'WordPress'] }
    },
    {
      fr: { name: 'Analyse & stratégie', items: ['Études de marché', 'Veille concurrentielle', 'Analyse de données', 'Mapping prix', 'Plan marketing'] },
      en: { name: 'Analysis & strategy', items: ['Market research', 'Competitive intelligence', 'Data analysis', 'Price mapping', 'Marketing plan'] }
    },
    {
      fr: { name: 'Outils', items: ['Excel (avancé)', 'DaVinci Resolve', 'Canva', 'IBM SPSS', 'Suite Office'] },
      en: { name: 'Tools', items: ['Excel (advanced)', 'DaVinci Resolve', 'Canva', 'IBM SPSS', 'Office Suite'] }
    }
  ];

  var LANGUAGES = [
    { fr: { when: 'Maternelle', title: 'Français' }, en: { when: 'Native', title: 'French' } },
    { fr: { when: 'Professionnel · <strong>TOEIC 910/990</strong>', title: 'Anglais' }, en: { when: 'Full professional · <strong>TOEIC 910/990</strong>', title: 'English' } },
    { fr: { when: 'Notions', title: 'Espagnol' }, en: { when: 'Elementary', title: 'Spanish' } }
  ];

  var INTL = [
    {
      fr: { when: 'Sept 2024 — Juil 2025', title: 'Nouvelle-Zélande', org: 'Programme Vacances-Travail', note: 'Un an d’immersion linguistique et culturelle, expériences professionnelles variées.' },
      en: { when: 'Sep 2024 — Jul 2025', title: 'New Zealand', org: 'Working Holiday Visa', note: 'One year of language and cultural immersion, varied work experiences.' }
    },
    {
      fr: { when: 'Août — Déc 2025', title: 'Finlande', org: 'Erasmus · Haaga-Helia', note: 'Semestre d’échange à Helsinki, études en anglais.' },
      en: { when: 'Aug — Dec 2025', title: 'Finland', org: 'Erasmus · Haaga-Helia', note: 'Exchange semester in Helsinki, studies in English.' }
    },
    {
      fr: { when: '2026', title: 'Europe', org: 'Tournages Weenat', note: 'Déplacements en France, Portugal, Suisse, Espagne et Allemagne.' },
      en: { when: '2026', title: 'Europe', org: 'Weenat shoots', note: 'Business travel across France, Portugal, Switzerland, Spain and Germany.' }
    }
  ];

  /* ============================================================
     2. RENDU DU CV
     ============================================================ */
  var cvLang = localStorage.getItem('cv-lang') || 'fr';
  var viewCv = document.getElementById('view-cv');

  function expandableRow(d) {
    return '<div class="cv-row expandable">' +
      '<div class="cv-when">' + d.when + '</div>' +
      '<div class="cv-main">' +
        '<button type="button" class="cv-row-head" aria-expanded="false">' +
          '<span class="cv-title">' + d.title + '</span>' +
          '<span class="cv-toggle" aria-hidden="true">+</span>' +
        '</button>' +
        '<div class="cv-org">' + d.org + '</div>' +
        '<div class="cv-details"><div><ul>' +
          d.bullets.map(function (b) { return '<li>' + b + '</li>'; }).join('') +
        '</ul></div></div>' +
      '</div>' +
    '</div>';
  }

  function simpleRow(d) {
    return '<div class="cv-row">' +
      '<div class="cv-when">' + d.when + '</div>' +
      '<div class="cv-main">' +
        '<span class="cv-row-head"><span class="cv-title">' + d.title + '</span></span>' +
        (d.org ? '<div class="cv-org">' + d.org + '</div>' : '') +
        (d.note ? '<div class="cv-note">' + d.note + '</div>' : '') +
      '</div>' +
    '</div>';
  }

  function renderCv() {
    var t = CV_I18N[cvLang];

    /* Textes statiques marqués data-cv */
    document.querySelectorAll('[data-cv]').forEach(function (el) {
      var v = t[el.dataset.cv];
      if (v !== undefined) el.innerHTML = v;
    });

    /* Lignes et grilles */
    document.getElementById('cv-exp-rows').innerHTML =
      EXPERIENCES.map(function (e) { return expandableRow(e[cvLang]); }).join('');
    document.getElementById('cv-edu-rows').innerHTML =
      EDUCATION.map(function (e) { return simpleRow(e[cvLang]); }).join('');
    document.getElementById('cv-lang-rows').innerHTML =
      LANGUAGES.map(function (l) { return simpleRow(l[cvLang]); }).join('');

    document.getElementById('cv-skills').innerHTML = SKILLS.map(function (s) {
      var d = s[cvLang];
      return '<div class="skill-card reveal">' +
        '<div class="skill-label">' + d.name + '</div>' +
        '<div class="chips">' +
          d.items.map(function (i) { return '<span class="chip">' + i + '</span>'; }).join('') +
        '</div>' +
      '</div>';
    }).join('');

    document.getElementById('cv-intl').innerHTML = INTL.map(function (i) {
      var d = i[cvLang];
      return '<div class="intl-card reveal">' +
        '<div class="intl-when">' + d.when + '</div>' +
        '<div class="intl-title">' + d.title + '</div>' +
        '<div class="intl-org">' + d.org + '</div>' +
        '<div class="intl-note">' + d.note + '</div>' +
      '</div>';
    }).join('');

    viewCv.setAttribute('lang', cvLang);
    document.getElementById('cv-lang-btn').textContent = cvLang === 'fr' ? 'EN' : 'FR';
    document.getElementById('cv-lang-btn').setAttribute('aria-label',
      cvLang === 'fr' ? 'Switch to English' : 'Passer en français');

    observeCvReveals();
  }

  /* Apparition au scroll des éléments injectés dynamiquement */
  var cvObserver;
  function observeCvReveals() {
    if (cvObserver) cvObserver.disconnect();
    cvObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          cvObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    viewCv.querySelectorAll('.reveal:not(.visible)').forEach(function (el) {
      cvObserver.observe(el);
    });
  }

  /* ============================================================
     3. INTERACTIONS CV
     ============================================================ */

  /* Lignes dépliables (délégation : survit aux re-rendus) */
  viewCv.addEventListener('click', function (e) {
    var head = e.target.closest('button.cv-row-head');
    if (!head) return;
    var row = head.closest('.cv-row');
    var open = row.classList.toggle('open');
    head.setAttribute('aria-expanded', String(open));
  });

  /* Mots tournants du hero CV */
  var rotTimer;
  function startRotator() {
    clearTimeout(rotTimer);
    var el = document.getElementById('cv-rotator');
    var words = CV_I18N[cvLang].rot;
    var i = 0;
    el.textContent = words[0];
    el.classList.remove('out');
    if (reducedMotion) return;
    (function next() {
      rotTimer = setTimeout(function () {
        el.classList.add('out');
        setTimeout(function () {
          i = (i + 1) % words.length;
          el.textContent = words[i];
          el.classList.remove('out');
          next();
        }, 420);
      }, 2600);
    })();
  }

  /* Bascule FR / EN */
  document.getElementById('cv-lang-btn').addEventListener('click', function () {
    cvLang = cvLang === 'fr' ? 'en' : 'fr';
    localStorage.setItem('cv-lang', cvLang);
    renderCv();
    startRotator();
  });

  /* ============================================================
     4. ROUTEUR DE VUES
     ============================================================ */
  var P_SECTIONS = ['top', 'realisations', 'reels', 'copywriting', 'projets', 'apropos', 'contact'];
  var gate = document.getElementById('view-landing');
  var wipe = document.querySelector('.wipe');
  var wipeWord = document.querySelector('.wipe-word');
  var current = document.body.dataset.view || 'landing';
  var scrollMem = { landing: 0, portfolio: 0, cv: 0 };
  var busy = false;

  function viewEl(v) {
    return v === 'landing' ? gate : document.getElementById('view-' + v);
  }

  function viewForHash(h) {
    if (h === 'portfolio' || P_SECTIONS.indexOf(h) !== -1) return 'portfolio';
    if (h === 'cv' || h.indexOf('cv-') === 0) return 'cv';
    return 'landing';
  }

  /* Défilement immédiat, sans le smooth-scroll global du site */
  function instantScroll(y) {
    var html = document.documentElement;
    var prev = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';
    window.scrollTo(0, y);
    html.style.scrollBehavior = prev;
  }

  function replayGateEnter() {
    gate.classList.remove('enter');
    void gate.offsetWidth; /* force le redémarrage des animations */
    gate.classList.add('enter');
  }

  /* Bascule le DOM d'une vue à l'autre (cœur commun des transitions) */
  function swapTo(view) {
    scrollMem[current] = window.scrollY;
    document.body.dataset.view = view;
    syncSwitch(view);
    instantScroll(view === 'landing' ? 0 : (scrollMem[view] || 0));
    if (view === 'landing') replayGateEnter();
    current = view;
  }

  function syncSwitch(view) {
    document.querySelectorAll('.switch-btn').forEach(function (b) {
      b.setAttribute('aria-current', String(b.dataset.goto === view));
    });
  }

  function pushHash(view) {
    var hash = '#' + (view === 'landing' ? 'accueil' : view);
    if (location.hash !== hash) history.pushState(null, '', hash);
  }

  /* ============================================================
     5. TRANSITIONS
     ============================================================ */

  /* Balayage façon montage vidéo (entrée depuis l'accueil) */
  function wipeTo(view, label) {
    busy = true;
    wipeWord.textContent = label || (view === 'cv' ? 'CV' : 'Portfolio');
    wipe.classList.add('run');
    setTimeout(function () { swapTo(view); }, 520);
    var back = wipe.querySelector('.wipe-slab-back');
    back.addEventListener('animationend', function done() {
      back.removeEventListener('animationend', done);
      wipe.classList.remove('run');
      busy = false;
    });
    /* filet de sécurité si l'animation est interrompue */
    setTimeout(function () { wipe.classList.remove('run'); busy = false; }, 1600);
  }

  /* Glissement directionnel (toggle) ou zoom (retour accueil) */
  function morphTo(view, dir) {
    busy = true;
    var html = document.documentElement;

    if (document.startViewTransition) {
      html.dataset.vt = dir;
      var vt = document.startViewTransition(function () { swapTo(view); });
      vt.finished.finally(function () {
        delete html.dataset.vt;
        busy = false;
      });
      return;
    }

    /* Repli sans View Transitions API : WAAPI sur les conteneurs de vue */
    var outEl = viewEl(current);
    var dx = dir === 'cv' ? -36 : (dir === 'portfolio' ? 36 : 0);
    var outKf = dir === 'home'
      ? [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(0.985)' }]
      : [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateX(' + dx + 'px)' }];
    var anim = outEl.animate(outKf, { duration: 200, easing: 'cubic-bezier(0.4, 0, 1, 1)' });
    anim.onfinish = function () {
      swapTo(view);
      var inEl = viewEl(view);
      var inKf = dir === 'home'
        ? [{ opacity: 0, transform: 'scale(1.02)' }, { opacity: 1, transform: 'none' }]
        : [{ opacity: 0, transform: 'translateX(' + (-dx) + 'px)' }, { opacity: 1, transform: 'none' }];
      inEl.animate(inKf, { duration: 280, easing: 'cubic-bezier(0, 0, 0.2, 1)' });
      busy = false;
    };
  }

  function goTo(view, opts) {
    opts = opts || {};
    if (busy || view === current) return;

    if (reducedMotion) {
      swapTo(view);
    } else if (opts.mode === 'wipe') {
      wipeTo(view, opts.label);
    } else {
      morphTo(view, view === 'landing' ? 'home' : view);
    }
    if (opts.push !== false) pushHash(view);
  }

  /* ============================================================
     6. LIAISONS
     ============================================================ */

  /* Tout élément [data-goto] déclenche un changement de vue */
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-goto]');
    if (!trigger) return;
    e.preventDefault();
    var dest = trigger.dataset.goto;
    if (dest === current) {
      if (dest !== 'landing') instantScroll(0);
      return;
    }
    goTo(dest, {
      mode: trigger.dataset.wipe !== undefined ? 'wipe' : 'morph',
      label: trigger.dataset.wipe
    });
  });

  /* Boutons précédent / suivant du navigateur */
  window.addEventListener('popstate', function () {
    var v = viewForHash(location.hash.replace('#', ''));
    if (v !== current && !busy) goTo(v, { push: false });
  });

  /* ============================================================
     7. INITIALISATION
     ============================================================ */
  renderCv();
  startRotator();
  syncSwitch(current);

  if (current === 'landing') {
    replayGateEnter();
  } else {
    /* Lien profond vers une section (#realisations, #cv-experience…) */
    var target = document.getElementById(location.hash.replace('#', ''));
    if (target) {
      requestAnimationFrame(function () {
        var y = target.getBoundingClientRect().top + window.scrollY - 84;
        instantScroll(Math.max(0, y));
      });
    }
  }
})();
