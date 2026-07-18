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
      bio: '<strong>Diplômé d’un Master en Management &amp; Marketing International</strong><br>' +
           'Formé à l’IAE d’Angers, je traduis la technique en histoires simples — en plusieurs langues, à travers l’Europe.',
      loc: 'Canada, France',
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
      bio: '<strong>Master’s Graduate in Management &amp; International Marketing | Video Content Creator</strong><br>' +
           'Trained at IAE Angers, I turn technical products into simple stories — in several languages, across Europe.',
      loc: 'Canada, France',
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
     1ter. DONNÉES — textes du portfolio (FR/EN), marqués data-pf
     ============================================================ */
  var PF_I18N = {
    fr: {
      pnav_real: 'Réalisations', pnav_reels: 'Déclinaisons', pnav_copy: 'Articles',
      pnav_perso: 'Projets persos', pnav_about: 'À propos', pnav_contact: 'Contact',
      p_b_dispo: 'Disponible pour projets',
      p_b_role: 'Montage Vidéo & Création de Contenu Axé Marketing',
      p_b_copy: 'Copywriting',
      p_b_drone: 'Vidéo drone',
      p_h1: 'Du contenu qui raconte votre marque.<br><span class="grad-text">Création, stratégie.</span>',
      p_pitch: '<strong>Créateur de contenu, monteur vidéo orienté marketing et pilote de drone.</strong><br>' +
               'Je traduis l’identité d’une marque en images percutantes, du storytelling de fond aux formats publicitaires - optimisés pour les réseaux sociaux et la conversion.',
      p_cta1: 'Voir mes réalisations',
      p_cta2: 'Me contacter',
      p_reel_label: 'Showreel — 2026',
      p_about_e: 'À propos', p_about_t: 'Mon profil',
      p_about_bio: 'Créateur de contenu et monteur vidéo, formé au marketing international (Master 2 Management International et Marketing). ' +
                   'Je conçois chaque vidéo comme un outil de conversion — du storytelling au format publicitaire — et je tourne aussi au drone, en France comme à l’étranger.',
      p_trust: 'Ils m’ont fait confiance',
      p_s1e: '01 — Réalisations', p_s1t: 'Formats organiques',
      p_s1p: 'Le format organique installe la confiance et pose le récit. Chaque projet est ensuite décliné en formats courts pensés pour l’acquisition — à retrouver dans la section Déclinaisons.',
      p_w1tag: 'Témoignage client · 2026', p_w1t: 'Titre du projet 01',
      p_w2tag: 'Film de marque · 2026',    p_w2t: 'Titre du projet 02',
      p_w3tag: 'Interview fondateur · 2026', p_w3t: 'Titre du projet 03',
      p_wp: 'Une phrase de contexte : l’objectif marketing, l’angle choisi, le résultat.',
      p_more: 'Et bien plus',
      p_ml4: 'Projet 04 ↗', p_ml5: 'Projet 05 ↗', p_ml6: 'Projet 06 ↗', p_ml7: 'Projet 07 ↗',
      p_s2e: '02 — Déclinaisons', p_s2t: 'Formats courts',
      p_s2p: 'Pensés pour le feed : un hook dans les trois premières secondes, un rythme serré, un message par vidéo.',
      p_rctx: 'Une phrase de contexte : le sujet, l’angle, le résultat.',
      p_s3e: '03 — Copywriting', p_s3t: 'Articles &amp; Stratégie',
      p_s3p: 'Parce qu’une belle image ne suffit pas si le message de fond n’accroche pas. J’utilise mes compétences en commerce international et marketing pour écrire des textes orientés vers l’objectif. Retrouvez mes articles sur le copywriting et la stratégie vidéo.',
      p_a_tag: 'À venir · 2026', p_a_t: 'À venir', p_a_p: 'Description à venir.',
      p_a_btn: 'Lire l’article ↗',
      p_s4e: '04 — En plus', p_s4t: 'Projets personnels',
      p_s4p: 'Ce que je filme quand personne ne me le demande. Drone, expérimentations, créations libres.',
      p_p1tag: 'Nouvelle-Zélande', p_p1p: 'Plans aériens, littoral, forêt, paysages.',
      p_p2tag: 'Espagne Agricole',  p_p2p: 'Plans aériens, cultures agricoles.',
      p_pv_tag: 'À venir', p_pv_p: 'À venir.',
      p_s5e: '05 — Contact',
      p_c_t: 'Un projet en tête&nbsp;?<br><span class="grad-text">Parlons-en.</span>',
      p_c_p: 'Flexible - Réponse rapide',
      p_c_mail: 'Écrivez-moi', p_c_line: 'ou directement :',
      p_foot: '© 2026 Lucas Charreau — Créateur de contenu &amp; monteur vidéo',
      p_foot_top: 'Retour en haut ↑'
    },
    en: {
      pnav_real: 'Work', pnav_reels: 'Short cuts', pnav_copy: 'Articles',
      pnav_perso: 'Side projects', pnav_about: 'About', pnav_contact: 'Contact',
      p_b_dispo: 'Available for projects',
      p_b_role: 'Video Editing & Marketing-Driven Content Creation',
      p_b_copy: 'Copywriting',
      p_b_drone: 'Drone videography',
      p_h1: 'Content that tells your brand’s story.<br><span class="grad-text">Creation, strategy.</span>',
      p_pitch: '<strong>Content creator, marketing-driven video editor and drone pilot.</strong><br>' +
               'I turn a brand’s identity into striking visuals — from long-form storytelling to ad formats, optimised for social media and conversion.',
      p_cta1: 'See my work',
      p_cta2: 'Contact me',
      p_reel_label: 'Showreel — 2026',
      p_about_e: 'About', p_about_t: 'My profile',
      p_about_bio: 'Content creator and video editor with an international marketing background (MSc International Management & Marketing). ' +
                   'I design every video as a conversion tool — from storytelling to ad formats — and I also shoot with a drone, in France and abroad.',
      p_trust: 'They trusted me',
      p_s1e: '01 — Work', p_s1t: 'Organic formats',
      p_s1p: 'Organic content builds trust and sets the story. Each project is then declined into short formats built for acquisition — see the Short cuts section.',
      p_w1tag: 'Client testimonial · 2026', p_w1t: 'Project 01 title',
      p_w2tag: 'Brand film · 2026',         p_w2t: 'Project 02 title',
      p_w3tag: 'Founder interview · 2026',  p_w3t: 'Project 03 title',
      p_wp: 'One line of context: the marketing goal, the chosen angle, the result.',
      p_more: 'And much more',
      p_ml4: 'Project 04 ↗', p_ml5: 'Project 05 ↗', p_ml6: 'Project 06 ↗', p_ml7: 'Project 07 ↗',
      p_s2e: '02 — Short cuts', p_s2t: 'Short formats',
      p_s2p: 'Built for the feed: a hook in the first three seconds, a tight pace, one message per video.',
      p_rctx: 'One line of context: the topic, the angle, the result.',
      p_s3e: '03 — Copywriting', p_s3t: 'Articles &amp; Strategy',
      p_s3p: 'Because a beautiful image is not enough if the underlying message does not land. I use my international business and marketing background to write goal-driven copy. Read my articles on copywriting and video strategy.',
      p_a_tag: 'Coming soon · 2026', p_a_t: 'Coming soon', p_a_p: 'Description coming soon.',
      p_a_btn: 'Read the article ↗',
      p_s4e: '04 — Extras', p_s4t: 'Personal projects',
      p_s4p: 'What I film when nobody asks me to. Drone, experiments, free creations.',
      p_p1tag: 'New Zealand', p_p1p: 'Aerial shots, coastline, forest, landscapes.',
      p_p2tag: 'Agricultural Spain', p_p2p: 'Aerial shots, farmland.',
      p_pv_tag: 'Coming soon', p_pv_p: 'Coming soon.',
      p_s5e: '05 — Contact',
      p_c_t: 'Got a project in mind?<br><span class="grad-text">Let’s talk.</span>',
      p_c_p: 'Flexible — quick to reply',
      p_c_mail: 'Email me', p_c_line: 'or directly:',
      p_foot: '© 2026 Lucas Charreau — Content creator &amp; video editor',
      p_foot_top: 'Back to top ↑'
    }
  };

  /* ============================================================
     1quater. DONNÉES — textes de l'écran d'accueil (FR/EN), marqués data-gate
     ============================================================ */
  var GATE_I18N = {
    fr: {
      brand_sub: 'Diplômé Master Management &amp; Marketing International' +
                 '<i class="sep" aria-hidden="true"></i>Canada / France',
      welcome_e: 'Accueil',
      welcome_t: 'Mon <span class="grad-text">parcours et portfolio</span>',
      welcome_p: 'Master Management International et Marketing, expériences en vidéo. ' +
                 'Découvrez mes réalisations et mon parcours professionnel.',
      pf_e: 'Créations &amp; vidéos',
      pf_d: 'Réalisations clients, formats courts, articles &amp; projets drone.',
      pf_m: '<span>Montage vidéo</span><span>Drone</span><span>Réseaux sociaux</span><span>Rédaction</span>',
      cv_e: 'Parcours &amp; compétences',
      cv_d: 'Expérience, formation, langues &amp; parcours international.',
      cv_m: '<span>Marketing International</span><span>Stages</span><span>Expériences pro</span>',
      cta: 'Entrer <span class="gate-arrow" aria-hidden="true">→</span>',
      or: 'ou',
      foot: 'Vous pourrez basculer de l\'un à l\'autre à tout moment.'
    },
    en: {
      brand_sub: 'MSc International Management &amp; Marketing graduate' +
                 '<i class="sep" aria-hidden="true"></i>Canada / France',
      welcome_e: 'Home',
      welcome_t: 'My journey and <span class="grad-text">portfolio</span>',
      welcome_p: 'MSc International Management & Marketing, experience in video. ' +
                 'Discover my work and my professional background.',
      pf_e: 'Creations &amp; videos',
      pf_d: 'Client work, short formats, articles &amp; drone projects.',
      pf_m: '<span>Video editing</span><span>Drone</span><span>Social media</span><span>Copywriting</span>',
      cv_e: 'Background &amp; skills',
      cv_d: 'Experience, education, languages &amp; international background.',
      cv_m: '<span>International Marketing</span><span>Internships</span><span>Prof. experiences</span>',
      cta: 'Enter <span class="gate-arrow" aria-hidden="true">→</span>',
      or: 'or',
      foot: 'You can switch between the two at any time.'
    }
  };

  /* ============================================================
     1bis. DONNÉES — contenu du CV (FR/EN)
     ============================================================ */
  /* Logos : déposer les fichiers PNG (fond transparent de préférence)
     dans assets/logos/ avec exactement ces noms. Un logo manquant
     est simplement masqué (pas d'image cassée). */
  var EXPERIENCES = [
    {
      logo: 'assets/logos/weenat.png',
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
      logo: 'assets/logos/spaceships.png',
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
      logo: 'assets/logos/savoirsplus.png',
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
      logo: 'assets/logos/credit-mutuel.png',
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
      logo: 'assets/logos/but.png',
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
      logos: ['assets/logos/tommys-diner.png', 'assets/logos/mcdonalds.png'],
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
      logo: 'assets/logos/iae.png',
      fr: { when: '2025 — 2026', title: 'Master 2 Management International et Marketing', org: 'IAE Angers', note: 'Stratégie marketing internationale, gestion de projets à l’international, ventes à l’export.' },
      en: { when: '2025 — 2026', title: 'MSc International Management & Marketing', org: 'IAE Angers', note: 'International marketing strategy, international project management, export sales.' }
    },
    {
      logo: 'assets/logos/haaga-helia.png',
      fr: { when: 'Août — Déc 2025', title: 'Échange Erasmus', org: 'Haaga-Helia · Helsinki, Finlande', note: 'Semestre de niveau master en commerce international, en anglais.' },
      en: { when: 'Aug — Dec 2025', title: 'Erasmus Exchange', org: 'Haaga-Helia · Helsinki, Finland', note: 'Master-level semester in international business, in English.' }
    },
    {
      logo: 'assets/logos/iae.png',
      fr: { when: '2022 — 2024', title: 'Licence 3 & Master 1 Management International', org: 'IAE Angers', note: 'Management des organisations, finance et stratégie, travail d’équipe multiculturel.' },
      en: { when: '2022 — 2024', title: 'BSc 3 & MSc 1 International Management', org: 'IAE Angers', note: 'Organisational management, finance & strategy, multicultural teamwork.' }
    },
    {
      logo: 'assets/logos/iut-laval.png',
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
      fr: { name: 'Outils', items: ['Excel (avancé)', 'DaVinci Resolve', 'Capcut', 'Suite Adobe', 'Canva', 'IBM SPSS', 'Suite Office'] },
      en: { name: 'Tools', items: ['Excel (advanced)', 'DaVinci Resolve', 'Capcut', 'Adobe Suite', 'Canva', 'IBM SPSS', 'Office Suite'] }
    }
  ];

  var LANGUAGES = [
    { flag: 'fr', fr: { when: 'Maternelle', title: 'Français' }, en: { when: 'Native', title: 'French' } },
    { flag: 'gb', fr: { when: 'Professionnel · <strong>TOEIC 910/990</strong>', title: 'Anglais' }, en: { when: 'Full professional · <strong>TOEIC 910/990</strong>', title: 'English' } },
    { flag: 'es', fr: { when: 'Notions', title: 'Espagnol' }, en: { when: 'Elementary', title: 'Spanish' } }
  ];

  var INTL = [
    {
      flag: 'nz',
      fr: { when: 'Sept 2024 — Juil 2025', title: 'Nouvelle-Zélande', org: 'Programme Vacances-Travail', note: 'Un an d’immersion linguistique et culturelle, expériences professionnelles variées.' },
      en: { when: 'Sep 2024 — Jul 2025', title: 'New Zealand', org: 'Working Holiday Visa', note: 'One year of language and cultural immersion, varied work experiences.' }
    },
    {
      flag: 'fi',
      fr: { when: 'Août — Déc 2025', title: 'Finlande', org: 'Erasmus · Haaga-Helia', note: 'Semestre d’échange à Helsinki, études en anglais.' },
      en: { when: 'Aug — Dec 2025', title: 'Finland', org: 'Erasmus · Haaga-Helia', note: 'Exchange semester in Helsinki, studies in English.' }
    },
    {
      flag: 'eu',
      fr: { when: '2026', title: 'Europe', org: 'Tournages Weenat', note: 'Déplacements en France, Portugal, Suisse, Espagne et Allemagne.' },
      en: { when: '2026', title: 'Europe', org: 'Weenat shoots', note: 'Business travel across France, Portugal, Switzerland, Spain and Germany.' }
    },
    {
      flag: 'ca',
      fr: { when: 'Sept 2026 — Sept 2028', title: 'Canada', org: 'Programme Vacances-Travail', note: 'Expériences à venir.' },
      en: { when: 'Sep 2026 — Sep 2028', title: 'Canada', org: 'Working Holiday Visa', note: 'Experiences to come.' }
    }
  ];

  /* ============================================================
     2. RENDU DU CV + PORTFOLIO (langue partagée FR/EN)
     ============================================================ */
  /* Langue : préférence enregistrée, sinon langue du navigateur (fr → français, sinon anglais) */
  var siteLang = localStorage.getItem('site-lang') || localStorage.getItem('cv-lang');
  if (!siteLang) {
    var navLang = (navigator.language || (navigator.languages && navigator.languages[0]) || 'fr');
    siteLang = /^fr/i.test(navLang) ? 'fr' : 'en';
  }
  var viewCv = document.getElementById('view-cv');

  /* Petit drapeau (servi par flagcdn.com — même logique que les
     polices Google : nécessite d'être en ligne, dégrade proprement) */
  function flagImg(code) {
    return '<img class="flag" src="https://flagcdn.com/h40/' + code + '.png" alt="" ' +
      'loading="lazy" onerror="this.style.display=\'none\'">';
  }

  /* Colonne logo d'une ligne du CV (accepte logo unique ou liste) */
  function logoCell(entry) {
    var list = entry.logos || (entry.logo ? [entry.logo] : []);
    if (!list.length) return '';
    return '<div class="cv-logo-cell">' + list.map(function (src) {
      return '<img class="cv-logo" src="' + src + '" alt="" loading="lazy" ' +
        'onerror="this.style.display=\'none\'">';
    }).join('') + '</div>';
  }

  function expandableRow(d, entry) {
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
      logoCell(entry) +
    '</div>';
  }

  function simpleRow(d, entry) {
    return '<div class="cv-row">' +
      '<div class="cv-when">' + d.when + '</div>' +
      '<div class="cv-main">' +
        '<span class="cv-row-head">' +
          (entry.flag ? flagImg(entry.flag) : '') +
          '<span class="cv-title">' + d.title + '</span>' +
        '</span>' +
        (d.org ? '<div class="cv-org">' + d.org + '</div>' : '') +
        (d.note ? '<div class="cv-note">' + d.note + '</div>' : '') +
      '</div>' +
      logoCell(entry) +
    '</div>';
  }

  function renderCv() {
    var t = CV_I18N[siteLang];

    /* Textes statiques marqués data-cv */
    document.querySelectorAll('[data-cv]').forEach(function (el) {
      var v = t[el.dataset.cv];
      if (v !== undefined) el.innerHTML = v;
    });

    /* Lignes et grilles */
    document.getElementById('cv-exp-rows').innerHTML =
      EXPERIENCES.map(function (e) { return expandableRow(e[siteLang], e); }).join('');
    document.getElementById('cv-edu-rows').innerHTML =
      EDUCATION.map(function (e) { return simpleRow(e[siteLang], e); }).join('');
    document.getElementById('cv-lang-rows').innerHTML =
      LANGUAGES.map(function (l) { return simpleRow(l[siteLang], l); }).join('');

    document.getElementById('cv-skills').innerHTML = SKILLS.map(function (s) {
      var d = s[siteLang];
      return '<div class="skill-card reveal">' +
        '<div class="skill-label">' + d.name + '</div>' +
        '<div class="chips">' +
          d.items.map(function (i) { return '<span class="chip">' + i + '</span>'; }).join('') +
        '</div>' +
      '</div>';
    }).join('');

    document.getElementById('cv-intl').innerHTML = INTL.map(function (i) {
      var d = i[siteLang];
      return '<div class="intl-card reveal">' +
        '<div class="intl-when">' + d.when + '</div>' +
        '<div class="intl-title-row">' +
          '<span class="intl-title">' + d.title + '</span>' +
          (i.flag ? flagImg(i.flag) : '') +
        '</div>' +
        '<div class="intl-org">' + d.org + '</div>' +
        '<div class="intl-note">' + d.note + '</div>' +
      '</div>';
    }).join('');

    viewCv.setAttribute('lang', siteLang);
    updateLangBtn(document.getElementById('cv-lang-btn'));

    observeCvReveals();
  }

  /* Drapeaux SVG inline (les emojis drapeaux ne s'affichent pas partout) */
  var FLAG_GB = '<svg class="flag" viewBox="0 0 60 30" aria-hidden="true">' +
    '<rect width="60" height="30" fill="#012169"/>' +
    '<path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFF" stroke-width="6"/>' +
    '<path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" stroke-width="3.6"/>' +
    '<path d="M30,0 V30 M0,15 H60" stroke="#FFF" stroke-width="10"/>' +
    '<path d="M30,0 V30 M0,15 H60" stroke="#C8102E" stroke-width="6"/></svg>';
  var FLAG_FR = '<svg class="flag" viewBox="0 0 60 30" aria-hidden="true">' +
    '<rect width="20" height="30" fill="#002395"/>' +
    '<rect x="20" width="20" height="30" fill="#FFF"/>' +
    '<rect x="40" width="20" height="30" fill="#ED2939"/></svg>';

  /* Le bouton montre la langue vers laquelle on bascule, drapeau inclus */
  function updateLangBtn(b) {
    if (!b) return;
    b.innerHTML = siteLang === 'fr' ? FLAG_GB + '<span>EN</span>' : FLAG_FR + '<span>FR</span>';
    b.setAttribute('aria-label', siteLang === 'fr' ? 'Switch to English' : 'Passer en français');
  }

  /* Textes du portfolio marqués data-pf */
  function renderPf() {
    var t = PF_I18N[siteLang];
    document.querySelectorAll('[data-pf]').forEach(function (el) {
      var v = t[el.dataset.pf];
      if (v !== undefined) el.innerHTML = v;
    });
    document.getElementById('view-portfolio').setAttribute('lang', siteLang);
  }

  /* Textes de l'écran d'accueil marqués data-gate */
  function renderGate() {
    var t = GATE_I18N[siteLang];
    document.querySelectorAll('[data-gate]').forEach(function (el) {
      var v = t[el.dataset.gate];
      if (v !== undefined) el.innerHTML = v;
    });
    document.getElementById('view-landing').setAttribute('lang', siteLang);
    updateLangBtn(document.getElementById('gate-lang-btn'));
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
    var words = CV_I18N[siteLang].rot;
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

  /* Bascule FR / EN — s'applique à l'accueil, au CV et au portfolio */
  function toggleLang() {
    siteLang = siteLang === 'fr' ? 'en' : 'fr';
    localStorage.setItem('site-lang', siteLang);
    renderGate();
    renderCv();
    renderPf();
    startRotator();
  }
  document.getElementById('cv-lang-btn').addEventListener('click', toggleLang);
  document.getElementById('gate-lang-btn').addEventListener('click', toggleLang);

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
  renderGate();
  renderCv();
  renderPf();
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
