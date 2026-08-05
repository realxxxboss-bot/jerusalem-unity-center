/* ============================================================
   INFO POP-UPS — one modal, many entries

   Every "tell me more" pop-up on the site (the seven categories,
   the six institutes, the five pathways, the footer items and the
   event families) is one entry in the JUC_INFO registry below.
   They all render through a single modal, so the look, the motion,
   the focus handling and the keyboard behaviour are identical
   everywhere and there is only ever one place to edit copy.

   ── Opening one ─────────────────────────────────────────────
   Any element on the page:

       <a href="#info/learn" class="js-info-open" data-info="learn">

   The href is the no-JS fallback and makes the pop-up linkable
   from another page: index.html#info/learn opens it on arrival.

   ── Adding one ──────────────────────────────────────────────
   Add an entry to JUC_INFO:

       key: {
         eyebrow: 'Learn',                 small gold line on top
         title:   'Awaken the Mind.',      serif headline
         body:    ['para one', 'para two'],
         icon:    'assets/…png'            OR  glyph: 'music'
         photo:   'assets/…jpg'            (banner instead of icon)
         listTitle: 'Examples',            optional bullet block
         list:    ['…', '…'],
         cta:     { label: 'Explore Learning', … one action … }
       }

   CTA actions — pick exactly one:
       scroll: '#events'        close and glide to that section
       info:   'otherKey'       open a different pop-up
       member: 'volunteer'      open Join the Movement, that interest
       topic:  'The Library'    open Join the Movement in interest-
                                registration mode, naming the subject
       notify: 'The Arts…'      open the Event Notification form,
                                preselecting that family of gatherings
       href:   'https://…'      ordinary link (external opens in a tab)
       click:  '.js-plan-open'  close and click that element — used to
                                hand off to the Story / Master Plan reels
   ============================================================ */
(function () {
  'use strict';

  /* Gold line-art glyphs on the same 24px grid as the site's other
     inline SVG, for entries with no artwork of their own. */
  var GLYPHS = {
    news:      '<path d="M4 5.5h11v13H4z"/><path d="M15 9h5v7.5a2 2 0 0 1-2 2H4"/><path d="M6.5 8.5h6M6.5 11.5h6M6.5 14.5h4"/>',
    media:     '<circle cx="12" cy="12" r="8.6"/><path d="M10.2 8.6 15.6 12l-5.4 3.4z"/>',
    donate:    '<path d="M12 20s-7.4-4.6-7.4-9.4A4.1 4.1 0 0 1 12 8a4.1 4.1 0 0 1 7.4 2.6C19.4 15.4 12 20 12 20z"/>',
    people:    '<circle cx="9" cy="8.4" r="3.1"/><path d="M3.6 19.4a5.4 5.4 0 0 1 10.8 0"/><path d="M16 5.6a3.1 3.1 0 0 1 0 5.9"/><path d="M17.2 14.6a5.4 5.4 0 0 1 3.2 4.8"/>',
    hands:     '<path d="M9 11.4V5.6a1.5 1.5 0 0 1 3 0v4.9"/><path d="M12 10.5V4.8a1.5 1.5 0 0 1 3 0v5.7"/><path d="M15 10.8V6.7a1.5 1.5 0 0 1 3 0v7.5a6 6 0 0 1-6 6h-.9a5 5 0 0 1-3.6-1.5l-2.7-2.8a1.6 1.6 0 0 1 2.3-2.3L9 15.1"/>',
    badge:     '<circle cx="12" cy="9.4" r="5.4"/><path d="m8.6 14.2-1.2 6 4.6-2.4 4.6 2.4-1.2-6"/>',
    pin:       '<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    rise:      '<path d="M4 19.4h16"/><path d="m5 15.6 5-5 3.4 3.4L20 7.4"/><polyline points="15.6 7.4 20 7.4 20 11.8"/>',
    music:     '<path d="M9.4 17.2V5.6l9-1.8v11.6"/><circle cx="7" cy="17.4" r="2.4"/><circle cx="16" cy="15.6" r="2.4"/>',
    dialogue:  '<path d="M4 5.6h11.6v8H8.4L4 17z"/><path d="M8.6 16.4h6L20 19.6V10h-2.6"/>',
    lotus:     '<circle cx="12" cy="7.6" r="3"/><path d="M12 10.8v9.4"/><path d="M12 20.2c-3.6 0-6.4-2.2-6.4-5 2.6 0 4.9 1.1 6.4 2.9 1.5-1.8 3.8-2.9 6.4-2.9 0 2.8-2.8 5-6.4 5z"/>',
    book:      '<path d="M4 5.4h5.4A2.6 2.6 0 0 1 12 8v11a2.2 2.2 0 0 0-2.2-2.2H4z"/><path d="M20 5.4h-5.4A2.6 2.6 0 0 0 12 8v11a2.2 2.2 0 0 1 2.2-2.2H20z"/>',
    compass:   '<circle cx="12" cy="12" r="8.6"/><path d="m15.2 8.8-2 4.4-4.4 2 2-4.4z"/>',
    mic:       '<rect x="9" y="3.2" width="6" height="10.6" rx="3"/><path d="M5.6 11.8a6.4 6.4 0 0 0 12.8 0"/><path d="M12 18.2v2.6"/><path d="M8.6 20.8h6.8"/>',
    gate:      '<path d="M3.6 20.4h16.8"/><path d="M6 20.4V9.4a6 6 0 0 1 12 0v11"/><path d="M12 20.4v-6.2"/><path d="M6 13.4h12"/>'
  };

  /* ==========================================================
     THE CONTENT — edit here, nothing else
     ========================================================== */
  var JUC_INFO = {

    /* ---- The seven categories (Section 2) ------------------- */

    learn: {
      eyebrow: 'Learn',
      title: 'Awaken the Mind. Transform the Life.',
      icon: 'assets/section2-learn-icon.png', iconClass: 'icon-learn',
      body: [
        'Learning at the Jerusalem Unity Center is a journey toward greater wisdom, self-understanding, and human flourishing. Our educational programs combine timeless insights with contemporary research, helping individuals cultivate moral leadership, expand consciousness, and live with greater purpose.',
        'Whether you are beginning your journey or deepening a lifelong pursuit of wisdom, our courses, pathways, and certificate programs provide practical tools for personal growth, professional development, and meaningful service to humanity.'
      ],
      cta: { label: 'Explore Learning', scroll: '#pathways' }
    },

    library: {
      eyebrow: 'Library',
      title: 'Humanity’s Living Library of Wisdom',
      icon: 'assets/section2-library-icon.png', iconClass: 'icon-library',
      body: [
        'Our Library is a growing collection of books, articles, lectures, videos, interviews, research, and historical resources that explore humanity’s enduring search for truth, meaning, and ethical living. Drawing from diverse cultures, philosophies, faith traditions, and modern scholarship, it serves as a place of discovery rather than doctrine.',
        'Browse timeless wisdom, contemporary research, and thought-provoking resources designed to inspire reflection, deepen understanding, and encourage lifelong learning.'
      ],
      cta: { label: 'Visit the Library', topic: 'The Library' }
    },

    community: {
      eyebrow: 'Community',
      title: 'A Global Community of Learners and Leaders',
      icon: 'assets/section2-community-icon.png', iconClass: 'icon-community',
      body: [
        'True transformation happens in relationship with others. The Jerusalem Unity Center brings together people from every nation, culture, and background who share a commitment to wisdom, ethical leadership, dialogue, and the flourishing of humanity.',
        'Participate in discussion circles, study groups, local gatherings, online communities, volunteer opportunities, and collaborative initiatives as we learn from one another and build lasting friendships across cultures and traditions.'
      ],
      cta: { label: 'Join the Community', member: 'member' }
    },

    events: {
      eyebrow: 'Events',
      title: 'Gather. Experience. Be Inspired.',
      icon: 'assets/section2-event-icon.png', iconClass: 'icon-event',
      body: [
        'Throughout the year, the Jerusalem Unity Center hosts conferences, workshops, retreats, lectures, cultural celebrations, and international gatherings that bring people together for learning, dialogue, and shared experience.',
        'Whether attending in Jerusalem or online, every event is designed to foster meaningful conversations, deepen understanding, and strengthen our shared commitment to building a more compassionate and united world.'
      ],
      cta: { label: 'View Events', scroll: '#events' }
    },

    institutes: {
      eyebrow: 'Institutes',
      title: 'Centers of Excellence for Humanity’s Future',
      icon: 'assets/section2-insitutes-icon.png', iconClass: 'icon-institutes',
      body: [
        'The Jerusalem Unity Center is home to a growing family of institutes dedicated to advancing knowledge in the fields of consciousness, ethics, education, peacebuilding, leadership, and human development. Each institute serves as a center for scholarship, research, dialogue, and practical application.',
        'Together, these institutes explore humanity’s greatest questions while developing educational resources and initiatives that inspire individuals and communities to reach their highest potential.'
      ],
      cta: { label: 'Explore the Institutes', scroll: '#institutes' }
    },

    research: {
      eyebrow: 'Research',
      title: 'Exploring Humanity’s Greatest Questions',
      icon: 'assets/section2-research-icon.png', iconClass: 'icon-research',
      body: [
        'Our interdisciplinary research brings together scholars, educators, practitioners, and thought leaders to explore the questions that shape our future: What enables human flourishing? How do we cultivate moral leadership? What is consciousness? How can diverse cultures cooperate for the common good?',
        'Through collaborative inquiry and evidence-informed exploration, we seek practical insights that contribute to a more peaceful, ethical, and compassionate world.'
      ],
      cta: { label: 'Explore Research', topic: 'Research at the Center' }
    },

    chapters: {
      eyebrow: 'Global Chapters',
      title: 'One Vision. Many Communities.',
      icon: 'assets/section2-global-chapters-icon.png', iconClass: 'icon-global',
      body: [
        'The Jerusalem Unity Center is building a worldwide network of local chapters that bring education, dialogue, service, and community engagement into cities around the globe. Each chapter reflects the unique character of its local community while remaining connected to our shared international vision.',
        'Whether you hope to participate, volunteer, or establish a chapter in your own region, you are invited to become part of a growing movement dedicated to wisdom, unity, and the flourishing of humanity.'
      ],
      cta: { label: 'Find or Start a Chapter', member: 'chapter' }
    },

    /* ---- The six institutes (Section 3) --------------------- */

    'inst-consciousness': {
      eyebrow: 'Institute of Consciousness',
      title: 'Understanding the Nature of Awareness',
      photo: 'assets/institute-consciousness.jpg',
      icon: 'assets/consciousnes-icon.png', iconClass: 'emblem-consciousness',
      body: [
        'Consciousness has been one of humanity’s greatest mysteries throughout history. The Institute of Consciousness explores the nature of awareness, perception, identity, and human potential through the integration of philosophy, psychology, neuroscience, contemplative traditions, and lived experience.',
        'Our goal is not simply to answer questions, but to cultivate deeper understanding of what it means to be fully human and how expanded awareness can transform individuals, communities, and civilization itself.'
      ],
      cta: { label: 'Explore the Institute', topic: 'Institute of Consciousness' }
    },

    'inst-spiritual': {
      eyebrow: 'Institute of Spiritual Intelligence',
      title: 'Wisdom Beyond Information',
      photo: 'assets/institute-spiritual-intelligence.jpg',
      icon: 'assets/sipritul-intelligence-icon.png', iconClass: 'emblem-spiritual',
      body: [
        'Spiritual Intelligence is the capacity to live with wisdom, purpose, compassion, and inner clarity. This institute explores how humanity’s great spiritual traditions, contemplative practices, and timeless insights can help individuals navigate life with greater resilience, meaning, and ethical responsibility.',
        'By cultivating the inner life, we develop the qualities necessary to lead ourselves and serve others with authenticity, humility, and love.'
      ],
      cta: { label: 'Discover Spiritual Intelligence', topic: 'Institute of Spiritual Intelligence' }
    },

    'inst-flourishing': {
      eyebrow: 'Institute of Human Flourishing',
      title: 'Helping Humanity Thrive',
      photo: 'assets/institute-human-flourishing.jpg',
      icon: 'assets/human-flourishing-icon.png', iconClass: 'emblem-human',
      body: [
        'What enables individuals, families, communities, and societies to truly flourish? This institute examines the conditions that support physical, emotional, intellectual, moral, social, and spiritual well-being while drawing upon positive psychology, education, public health, ethics, and human development.',
        'Together we explore practical pathways that empower people to live healthier, more meaningful, and more fulfilling lives.'
      ],
      cta: { label: 'Discover Human Flourishing', topic: 'Institute of Human Flourishing' }
    },

    'inst-moral': {
      eyebrow: 'Institute of Moral Leadership',
      title: 'Character That Shapes the Future',
      photo: 'assets/institute-moral-leadership.jpg',
      icon: 'assets/moral-leadership-icon.png', iconClass: 'emblem-moral',
      body: [
        'The challenges facing our world cannot be solved by knowledge alone—they require wisdom, integrity, courage, and moral responsibility. The Institute of Moral Leadership equips current and future leaders to navigate complexity with ethical clarity while placing the common good at the center of decision-making.',
        'Through education, dialogue, and practical leadership development, we seek to cultivate leaders who inspire trust, strengthen communities, and contribute to a more just and compassionate world.'
      ],
      cta: { label: 'Explore Moral Leadership', topic: 'Institute of Moral Leadership' }
    },

    'inst-dialogue': {
      eyebrow: 'Institute of Global Dialogue',
      title: 'Building Understanding Across Humanity',
      photo: 'assets/institute-global-dialogue.jpg',
      icon: 'assets/global-dialouge-icon.png', iconClass: 'emblem-global',
      body: [
        'Meaningful dialogue is one of humanity’s most powerful tools for overcoming division and building lasting peace. The Institute of Global Dialogue creates opportunities for respectful conversation across cultures, religions, disciplines, and worldviews, encouraging deeper listening and mutual understanding.',
        'By learning from one another rather than fearing our differences, we can cultivate relationships rooted in dignity, empathy, cooperation, and our shared humanity.'
      ],
      cta: { label: 'Join the Conversation', topic: 'Institute of Global Dialogue' }
    },

    'inst-science': {
      eyebrow: 'Institute of Science & Consciousness',
      title: 'Where Discovery Meets Wonder',
      photo: 'assets/institute-science-consciousness.jpg',
      icon: 'assets/science-consciousness -icon.png', iconClass: 'emblem-science',
      body: [
        'Some of humanity’s most profound questions lie at the intersection of scientific inquiry and human experience. This institute explores emerging research in neuroscience, psychology, physics, biology, complexity science, and consciousness studies alongside philosophical and contemplative perspectives.',
        'Our purpose is to encourage thoughtful exploration where rigorous investigation and open inquiry work together to expand our understanding of reality, human potential, and the future of civilization.'
      ],
      cta: { label: 'Explore Science & Consciousness', topic: 'Institute of Science & Consciousness' }
    },

    /* ---- The five pathways (Section 5) ---------------------- */

    'path-consciousness': {
      eyebrow: 'Pathway of Consciousness',
      title: 'Exploring the Nature of Human Awareness',
      icon: 'assets/consciousness-icon.png', iconClass: 'pw-consciousness', pathway: true,
      body: [
        'The Pathway of Consciousness invites you to explore one of humanity’s most profound questions: What does it mean to be Conscious? Through the study of awareness, perception, identity, human potential, and the nature of reality, participants examine insights from science, philosophy, psychology, and contemplative traditions.',
        'As understanding deepens, so does our capacity to live with greater clarity, compassion, wisdom, and purpose. This pathway encourages thoughtful inquiry while honoring both rigorous scholarship and personal experience.'
      ],
      cta: { label: 'Begin Exploring', topic: 'Pathway of Consciousness' }
    },

    'path-spiritual': {
      eyebrow: 'Pathway of Spiritual Development',
      title: 'Cultivating Wisdom, Purpose, and Inner Transformation',
      icon: 'assets/spiritual-development-icon.png', iconClass: 'pw-spiritual', pathway: true,
      body: [
        'Every culture has sought to understand life’s deepest questions and humanity’s relationship with the sacred. This pathway explores the practices, values, and experiences that nurture inner growth, resilience, compassion, and spiritual maturity without promoting any single religious tradition.',
        'Whether your journey is rooted in faith, philosophy, or personal exploration, this pathway provides opportunities to deepen self-understanding while discovering timeless principles that enrich everyday life.'
      ],
      cta: { label: 'Explore the Journey', topic: 'Pathway of Spiritual Development' }
    },

    'path-flourishing': {
      eyebrow: 'Pathway of Human Flourishing',
      title: 'Helping Individuals and Communities Thrive',
      icon: 'assets/human-flourishings-icon.png', iconClass: 'pw-human', pathway: true,
      body: [
        'Human flourishing is about more than success—it is about living a life of meaning, well-being, resilience, creativity, healthy relationships, and purposeful contribution. Drawing from positive psychology, education, ethics, neuroscience, and human development, this pathway explores the conditions that help people and societies reach their fullest potential.',
        'Participants discover practical tools for cultivating healthier lives while contributing to the flourishing of families, communities, workplaces, and future generations.'
      ],
      cta: { label: 'Discover Human Flourishing', topic: 'Pathway of Human Flourishing' }
    },

    'path-dialogue': {
      eyebrow: 'Pathway of Dialogue & Understanding',
      title: 'Building Bridges Across Humanity',
      icon: 'assets/dialogue-understanding-icon.png', iconClass: 'pw-dialogue', pathway: true,
      body: [
        'In a diverse world, understanding begins with listening. This pathway develops the skills of respectful dialogue, thoughtful communication, conflict transformation, and collaborative problem-solving across cultures, religions, disciplines, and perspectives.',
        'By learning to engage differences with curiosity rather than fear, we strengthen trust, deepen relationships, and help create communities where dignity, empathy, and cooperation can flourish.'
      ],
      cta: { label: 'Join the Dialogue', topic: 'Pathway of Dialogue & Understanding' }
    },

    'path-culture': {
      eyebrow: 'Pathway of Culture & Wisdom',
      title: 'Celebrating Humanity’s Shared Heritage',
      icon: 'assets/culture-wisdom-icon.png', iconClass: 'pw-culture', pathway: true,
      body: [
        'Every civilization has contributed unique insights into what it means to live well. This pathway explores the world’s cultures, philosophies, artistic traditions, literature, history, and wisdom teachings, revealing the richness of our shared human story.',
        'By appreciating both our diversity and our common aspirations, participants gain a broader perspective on humanity while discovering timeless ideas that continue to inspire creativity, understanding, and hope.'
      ],
      cta: { label: 'Explore Culture & Wisdom', topic: 'Pathway of Culture & Wisdom' }
    },

    /* ---- Footer › The Center -------------------------------- */

    about: {
      eyebrow: 'About Us',
      title: 'Sponsored by The Seventy Nations',
      icon: 'assets/the-seventy-nations-transparent-logo.png',
      iconClass: 'icon-seventy', mediaClass: 'info-media-seal',
      body: [
        'The Jerusalem Unity Center is an international educational and cultural initiative dedicated to advancing consciousness, wisdom, ethical leadership, and human flourishing. Rooted in Jerusalem’s unique place in human history, the Center welcomes people of every nation, culture, and tradition to explore what unites us.',
        'The Center is sponsored by The Seventy Nations (R.A.) Jerusalem, a registered Israeli nonprofit association whose work gathers the peoples of the world around the values they hold in common. Its sponsorship makes the Center’s programs, institutes, and gatherings possible.',
        'Visit seventynationsjerusalem.org to learn about the organization behind the Center and the wider work it carries out.'
      ],
      cta: { label: 'Visit The Seventy Nations', href: 'https://seventynationsjerusalem.org' }
    },

    vision: {
      eyebrow: 'Our Vision',
      title: 'A Gift to Jerusalem. A Gift to Humanity.',
      icon: 'assets/bird-icon.png', iconClass: 'icon-dove',
      body: [
        'We envision Jerusalem as a global center for education, dialogue, culture, and human development—a place where individuals from around the world gather to learn, grow, and work together for the flourishing of humanity and future generations.'
      ],
      cta: { label: 'Explore the Vision', scroll: '#vision' }
    },

    campus: {
      eyebrow: 'The Campus',
      title: 'A Living Center of Learning',
      photo: 'assets/section4-bg.png',
      body: [
        'The Jerusalem Unity Center is envisioned as an inspiring destination where education, research, dialogue, art, culture, and community come together. Every space is designed to encourage curiosity, reflection, creativity, and meaningful human connection.'
      ],
      cta: { label: 'View the Master Plan', click: '.js-plan-open' }
    },

    programs: {
      eyebrow: 'Programs',
      title: 'Learning for Every Stage of Life',
      icon: 'assets/section2-learn-icon.png', iconClass: 'icon-learn',
      body: [
        'Our educational programs include courses, certificates, workshops, retreats, public lectures, leadership development, and lifelong learning opportunities that encourage personal growth, ethical leadership, and the pursuit of wisdom.'
      ],
      cta: { label: 'Explore Programs', scroll: '#pathways' }
    },

    faculty: {
      eyebrow: 'Faculty',
      title: 'A Global Community of Teachers',
      icon: 'assets/section2-community-icon.png', iconClass: 'icon-community',
      body: [
        'The Jerusalem Unity Center brings together educators, researchers, artists, spiritual leaders, scientists, and practitioners from diverse backgrounds who are committed to advancing knowledge, dialogue, and human flourishing.'
      ],
      cta: { label: 'Meet Our Faculty', topic: 'Faculty' }
    },

    /* ---- Footer › Resources --------------------------------- */

    'f-library': {
      eyebrow: 'Library',
      title: 'A Living Collection of Human Wisdom',
      icon: 'assets/section2-library-icon.png', iconClass: 'icon-library',
      body: [
        'Explore books, articles, videos, lectures, interviews, and educational resources drawn from the world’s great traditions of knowledge, scholarship, and discovery.'
      ],
      cta: { label: 'Visit Library', topic: 'The Library' }
    },

    'f-events': {
      eyebrow: 'Events',
      title: 'Experiences That Bring People Together',
      icon: 'assets/section2-event-icon.png', iconClass: 'icon-event',
      body: [
        'Join conferences, workshops, concerts, exhibitions, retreats, lectures, and cultural gatherings designed to inspire learning, dialogue, creativity, and community.'
      ],
      cta: { label: 'View Events', scroll: '#events' }
    },

    'f-research': {
      eyebrow: 'Research',
      title: 'Advancing Knowledge for Humanity',
      icon: 'assets/section2-research-icon.png', iconClass: 'icon-research',
      body: [
        'Our interdisciplinary research explores consciousness, ethics, education, leadership, culture, and the conditions that enable individuals and societies to flourish.'
      ],
      cta: { label: 'Explore Research', topic: 'Research at the Center' }
    },

    news: {
      eyebrow: 'News',
      title: 'Follow Our Journey',
      glyph: 'news',
      body: [
        'Stay informed about new initiatives, partnerships, announcements, educational programs, and developments as the Jerusalem Unity Center continues to grow.'
      ],
      cta: { label: 'Latest News', topic: 'News & Announcements' }
    },

    media: {
      eyebrow: 'Media',
      title: 'Stories That Inspire',
      glyph: 'media',
      body: [
        'Watch videos, listen to podcasts, browse interviews, publications, photo galleries, and multimedia presentations that share the vision and work of the Jerusalem Unity Center.',
        'The first of these is already here: the Jerusalem Unity podcast, recorded in Jerusalem and free to listen to wherever you are.'
      ],
      cta: { label: 'Listen to the Podcast', info: 'podcast' }
    },

    /* ---- The podcast (Section 8) ---------------------------- */

    /* TO FEATURE A DIFFERENT EPISODE: change the copy here, and the
       episode id in embed.src and cta.href below (it is the last part
       of the Spotify share link). The card in index.html carries the
       title and runtime, so match those too. */
    podcast: {
      eyebrow: 'The Jerusalem Unity Podcast',
      title: 'For the Peace of Jerusalem',
      glyph: 'mic',
      body: [
        'The opening episode of the Jerusalem Unity podcast, recorded in Jerusalem: a welcome message, and an introduction to The Seventy Nations and the work of gathering the peoples of the world around what they hold in common.',
        'It runs twelve minutes — an unhurried place to begin if you are meeting the Center for the first time, and a short account of why a house of unity belongs in this city.',
        'New conversations join the series as they are recorded. They are free to listen to, wherever you are, and need no account of any kind.'
      ],
      embed: {
        src: 'https://open.spotify.com/embed/episode/3CiyDJXyQoddTnp0sofZAK?utm_source=generator&theme=0',
        title: 'Player — For the Peace of Jerusalem, from the Jerusalem Unity podcast',
        height: 152,
        note: 'Press play to listen here, or open the episode in your own app below.'
      },
      listTitle: 'In this episode',
      list: [
        'A welcome to the Jerusalem Unity Center',
        'Who The Seventy Nations are',
        'Why Jerusalem, and why now',
        'What it means to gather the nations',
        'How to take part from anywhere in the world'
      ],
      cta: { label: 'Listen on Spotify', href: 'https://open.spotify.com/episode/3CiyDJXyQoddTnp0sofZAK' }
    },

    /* ---- Visit Jerusalem (Section 9) ------------------------ */

    visit: {
      eyebrow: 'Visit Jerusalem',
      title: 'Experience the Center in the City That Inspires the World',
      glyph: 'gate',
      body: [
        'Discover upcoming educational experiences, cultural events, and opportunities to visit Jerusalem and participate in the life of the Center.',
        'Whether you are coming for an evening, a course, or a longer stay, tell us when you hope to be here and what draws you. A member of our team will write back with what is on while you are in the city, and help you plan the days around it.'
      ],
      cta: { label: 'Plan Your Visit', member: 'visit' }
    },

    /* ---- Footer › Get Involved ------------------------------ */

    donate: {
      eyebrow: 'Donate Now',
      title: 'Help Build Something That Serves Humanity',
      glyph: 'donate',
      body: [
        'Your generosity helps establish educational programs, research initiatives, scholarships, cultural experiences, and a global center dedicated to wisdom, dialogue, and human flourishing.',
        'Gifts are received by The Jerusalem Unity Center USA, a 501(c)(3) nonprofit foundation, and are tax-deductible for US taxpayers to the fullest extent allowed by law. Every donor receives a receipt by email.'
      ],
      cta: { label: 'Make a Donation', href: 'donate.html' }
    },

    join: {
      eyebrow: 'Join the Community',
      title: 'Become Part of the Journey',
      glyph: 'people',
      body: [
        'Membership connects you with a growing international community committed to learning, service, ethical leadership, and building a more compassionate world.'
      ],
      cta: { label: 'Become a Member', member: 'member' }
    },

    volunteer: {
      eyebrow: 'Volunteer',
      title: 'Share Your Time and Talents',
      glyph: 'hands',
      body: [
        'Whether locally or internationally, volunteers help welcome visitors, support programs, organize events, and strengthen the Jerusalem Unity Center’s mission.'
      ],
      cta: { label: 'Volunteer With Us', member: 'volunteer' }
    },

    ambassadors: {
      eyebrow: 'Ambassadors',
      title: 'Represent the Vision',
      glyph: 'badge',
      body: [
        'Jerusalem Unity Center Ambassadors help introduce the Center within their communities, organize local gatherings, build partnerships, and encourage global participation.'
      ],
      cta: { label: 'Become an Ambassador', member: 'ambassador' }
    },

    chapter: {
      eyebrow: 'Start a Chapter',
      title: 'Bring the Vision to Your Community',
      glyph: 'pin',
      body: [
        'Help establish a local Jerusalem Unity Center Chapter that fosters education, dialogue, cultural exchange, and community service while remaining connected to our international network.'
      ],
      cta: { label: 'Start a Chapter', member: 'chapter' }
    },

    support: {
      eyebrow: 'Support the Vision',
      title: 'Every Contribution Makes a Difference',
      glyph: 'rise',
      body: [
        'Beyond financial support, you can contribute through partnerships, expertise, educational collaboration, sponsorships, advocacy, and volunteer leadership as we build this vision together.'
      ],
      cta: { label: 'Support the Vision', scroll: '#support' }
    },

    /* ---- The three event families (Section 7) --------------- */

    'ev-arts': {
      eyebrow: 'The Arts of Humanity',
      title: 'Music • Arts • Film • Culture',
      glyph: 'music',
      body: [
        'Experience the beauty of humanity through music, visual arts, film, storytelling, dance, literature, and cultural expression from around the world.',
        'The Jerusalem Unity Center celebrates the creative spirit as a universal language that transcends borders, beliefs, and backgrounds. These multimedia experiences invite people to discover the beauty of diverse cultures while recognizing our shared humanity.'
      ],
      listTitle: 'Examples',
      list: [
        'International Music Series',
        'World Cinema',
        'Sacred Music Festival',
        'Artists in Residence',
        'Photography & Cultural Exhibitions',
        'Poetry Evenings',
        'Storytelling Nights'
      ],
      cta: { label: 'Explore Cultural Events', notify: 'The Arts of Humanity' }
    },

    'ev-voices': {
      eyebrow: 'Voices of the Nations',
      title: 'Dialogue • Leadership • Peacebuilding',
      glyph: 'dialogue',
      body: [
        'Meaningful conversations that bring together leaders, scholars, faith communities, educators, and citizens to explore the future of humanity through respectful dialogue and shared wisdom.',
        'These gatherings create space for listening, collaboration, and practical solutions while strengthening relationships across cultures, religions, disciplines, and generations.'
      ],
      listTitle: 'Examples',
      list: [
        'Interfaith Conversations',
        'Global Leadership Forums',
        'Peacebuilding Dialogues',
        'Women of Wisdom Series',
        'Youth Leadership Summits',
        'International Roundtables',
        'Jerusalem Conversations'
      ],
      cta: { label: 'Join the Conversation', notify: 'Voices of the Nations' }
    },

    'ev-journey': {
      eyebrow: 'The Journey of Self-Actualization',
      title: 'Consciousness • Wisdom • Human Flourishing',
      glyph: 'lotus',
      body: [
        'The deepest journey is the one within.',
        'Through immersive experiences, workshops, retreats, lectures, contemplative practices, and educational programs, participants explore consciousness, human development, spiritual growth, moral leadership, and the lifelong pursuit of wisdom.',
        'Every experience is designed to help individuals awaken their highest potential while contributing to the flourishing of humanity.'
      ],
      listTitle: 'Examples',
      list: [
        'School of Consciousness',
        'Meditation & Reflection',
        'Wisdom Lectures',
        'Human Flourishing Workshops',
        'Spiritual Development Retreats',
        'Moral Leadership Intensives',
        'Personal Transformation Programs'
      ],
      cta: { label: 'Begin Your Journey', notify: 'The Journey of Self-Actualization' }
    }

  };

  window.JUC_INFO = JUC_INFO;

  /* ==========================================================
     THE MODAL — shell, rendering, focus, keyboard, hash routing
     Nothing below needs editing to add or change a pop-up.
     ========================================================== */

  var overlay, modal, closeBtn, mediaEl, eyebrowEl, titleEl, bodyEl,
      embedEl, listWrap, listTitleEl, listEl, ctaEl;
  var lastFocus = null;
  var currentKey = '';

  function buildShell() {
    overlay = document.createElement('div');
    overlay.className = 'info-overlay';
    overlay.id = 'info-modal';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'info-modal-title');

    overlay.innerHTML =
      '<div class="info-modal">' +
        '<button class="info-close" type="button" aria-label="Close">&times;</button>' +
        '<div class="info-media" id="info-modal-media" aria-hidden="true"></div>' +
        '<p class="info-eyebrow" id="info-modal-eyebrow"></p>' +
        '<h3 class="info-title" id="info-modal-title"></h3>' +
        '<div class="info-body" id="info-modal-body"></div>' +
        /* An optional player (see entry.embed). Built on open and torn
           down on close, so nothing keeps playing behind the page. */
        '<div class="info-embed" hidden></div>' +
        '<div class="info-examples" hidden>' +
          '<p class="info-examples-title"></p>' +
          '<ul class="info-list"></ul>' +
        '</div>' +
        /* No href and hidden until render() fills it in, so the idle
           shell never presents an empty link to a crawler. */
        '<a class="btn btn-primary info-cta" hidden>' +
          '<span class="info-cta-label"></span>' +
          '<svg class="icon-arrow" viewBox="0 0 26 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
            '<line x1="1" y1="6" x2="24" y2="6"></line><polyline points="19 1 24 6 19 11"></polyline>' +
          '</svg>' +
        '</a>' +
      '</div>';

    document.body.appendChild(overlay);

    modal       = overlay.querySelector('.info-modal');
    closeBtn    = overlay.querySelector('.info-close');
    mediaEl     = overlay.querySelector('.info-media');
    eyebrowEl   = overlay.querySelector('.info-eyebrow');
    titleEl     = overlay.querySelector('.info-title');
    bodyEl      = overlay.querySelector('.info-body');
    embedEl     = overlay.querySelector('.info-embed');
    listWrap    = overlay.querySelector('.info-examples');
    listTitleEl = overlay.querySelector('.info-examples-title');
    listEl      = overlay.querySelector('.info-list');
    ctaEl       = overlay.querySelector('.info-cta');
  }

  function glyph(name) {
    return '<svg class="info-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
           'stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
           (GLYPHS[name] || '') + '</svg>';
  }

  /* An embedded player, as asked for by entry.embed:
       { src, title, height, note }
     The frame keeps the pop-up's own dark ground, so a Spotify or
     YouTube player reads as part of the panel rather than as a
     borrowed widget sitting on the page. */
  function renderEmbed(embed) {
    if (!embedEl) return;

    if (!embed || !embed.src) {
      embedEl.innerHTML = '';
      embedEl.hidden = true;
      return;
    }

    var frame = document.createElement('iframe');
    frame.className = 'info-frame';
    frame.src = embed.src;
    frame.title = embed.title || 'Player';
    frame.height = embed.height || 152;
    frame.setAttribute('frameborder', '0');
    frame.setAttribute('loading', 'lazy');
    frame.setAttribute('allow', 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture');
    frame.setAttribute('allowfullscreen', '');

    embedEl.innerHTML = '';
    embedEl.appendChild(frame);

    if (embed.note) {
      var note = document.createElement('p');
      note.className = 'info-frame-note';
      note.textContent = embed.note;
      embedEl.appendChild(note);
    }

    embedEl.hidden = false;
  }

  function render(entry) {
    /* --- artwork ---------------------------------------------
       Icons carry the same class they wear in the section they
       came from (.icon-learn, .emblem-moral, .pw-culture …), so
       the per-file ring normalization in style.css applies here
       too and the art matches the page pixel for pixel. */
    mediaEl.className = 'info-media';
    if (entry.photo) {
      mediaEl.classList.add('info-media-photo');
      mediaEl.innerHTML = '<img src="' + entry.photo + '" alt="">';
      /* An emblem alongside a photo repeats the institute card's own
         composition — the ring sitting over the foot of the image. */
      if (entry.icon) {
        mediaEl.classList.add('info-media-emblem');
        mediaEl.innerHTML += '<span class="info-emblem">' +
          '<img class="' + (entry.iconClass || '') + '" src="' + entry.icon + '" alt="">' +
          '</span>';
      }
    } else if (entry.icon) {
      mediaEl.classList.add(entry.pathway ? 'info-media-pathway' : 'info-media-icon');
      mediaEl.innerHTML = '<img class="' + (entry.iconClass || '') + '" src="' + entry.icon + '" alt="">';
    } else if (entry.glyph) {
      mediaEl.classList.add('info-media-glyph');
      mediaEl.innerHTML = glyph(entry.glyph);
    } else {
      mediaEl.innerHTML = '';
    }
    /* An entry may ask for one extra class when its artwork does not
       sit happily in the standard box — see .info-media-seal. */
    if (entry.mediaClass) mediaEl.classList.add(entry.mediaClass);

    eyebrowEl.textContent = entry.eyebrow || '';
    eyebrowEl.hidden = !entry.eyebrow;
    titleEl.textContent = entry.title || '';

    bodyEl.innerHTML = '';
    (entry.body || []).forEach(function (para) {
      var p = document.createElement('p');
      p.textContent = para;
      bodyEl.appendChild(p);
    });

    /* --- an optional player ----------------------------------
       Built fresh every time the pop-up opens (and emptied again
       by close()), so a player never runs on in the background
       and nothing loads for the pop-ups that have none. */
    renderEmbed(entry.embed);

    if (entry.list && entry.list.length) {
      listTitleEl.textContent = entry.listTitle || 'Examples';
      listEl.innerHTML = '';
      entry.list.forEach(function (item) {
        var li = document.createElement('li');
        li.textContent = item;
        listEl.appendChild(li);
      });
      listWrap.hidden = false;
    } else {
      listWrap.hidden = true;
    }

    /* --- the action button ---------------------------------- */
    var cta = entry.cta;
    if (!cta || !cta.label) {
      ctaEl.hidden = true;
      return;
    }

    ctaEl.hidden = false;
    ctaEl.querySelector('.info-cta-label').textContent = cta.label;
    ctaEl.removeAttribute('target');
    ctaEl.removeAttribute('rel');

    /* The href is the no-JS fallback for every action, so the button
       still goes somewhere sensible with scripting turned off. */
    if (cta.href) {
      ctaEl.href = cta.href;
      if (/^https?:/i.test(cta.href)) {
        ctaEl.target = '_blank';
        ctaEl.rel = 'noopener';
      }
    } else if (cta.scroll) {
      ctaEl.href = cta.scroll;
    } else if (cta.info) {
      ctaEl.href = '#info/' + cta.info;
    } else if (cta.member || cta.topic) {
      ctaEl.href = '#join-modal' + (cta.member ? '/' + cta.member : '');
    } else if (cta.notify) {
      ctaEl.href = 'index.html#notify-modal';
    } else if (cta.click) {
      /* Borrow the destination of the element we are about to click,
         so this button is never a dead end without scripting. */
      var target = document.querySelector(cta.click);
      var borrowed = target && target.getAttribute('href');
      ctaEl.href = borrowed || '#';
    } else {
      ctaEl.href = '#';
    }
  }

  /* Hands the visitor on to whatever the button promised. */
  function runCta(entry) {
    var cta = entry && entry.cta;
    if (!cta) return false;

    if (cta.href) return false;                  /* let the link do its job */

    if (cta.info && JUC_INFO[cta.info]) {
      open(cta.info);
      return true;
    }

    /* The pop-ups are reachable from the policy and master-plan
       pages too, where the section or trigger a button wants may
       not exist. In that case we send the visitor to the home page
       at the right place rather than doing nothing. */

    if (cta.notify) {
      close();
      if (window.JUC_NOTIFY && window.JUC_NOTIFY.open) {
        window.JUC_NOTIFY.open(cta.notify);
      } else {
        window.location.href = 'index.html#notify-modal';
      }
      return true;
    }

    if (cta.member || cta.topic) {
      close();
      if (window.JUC_MEMBER && window.JUC_MEMBER.open) {
        window.JUC_MEMBER.open({ interest: cta.member || '', topic: cta.topic || '' });
      } else {
        window.location.href = 'index.html#join-modal' + (cta.member ? '/' + cta.member : '');
      }
      return true;
    }

    if (cta.click) {
      var el = document.querySelector(cta.click);
      close();
      if (el) el.click();
      else window.location.href = ctaEl.getAttribute('href') || 'index.html';
      return true;
    }

    if (cta.scroll) {
      var target = document.querySelector(cta.scroll);
      close();
      if (target && target.scrollIntoView) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.location.href = 'index.html' + cta.scroll;
      }
      return true;
    }

    return false;
  }

  function open(key) {
    var entry = JUC_INFO[key];
    if (!entry) return;

    /* Reopening from inside (cta.info) must not lose the original
       opener as the element focus returns to on close. */
    if (!isOpen()) lastFocus = document.activeElement;

    currentKey = key;
    render(entry);
    overlay.classList.add('is-open');
    document.body.classList.add('modal-open');
    modal.scrollTop = 0;
    closeBtn.focus();
  }

  function close() {
    if (!isOpen()) return;
    overlay.classList.remove('is-open');
    currentKey = '';

    /* Take the player out of the document, or it would keep playing
       to a closed pop-up. render() rebuilds it on the way back in. */
    renderEmbed(null);

    /* Another lightbox may still be open underneath — only give the
       page its scrollbar back when nothing is left on top. */
    if (!document.querySelector('.member-overlay.is-open, .story-overlay.is-open, .plan-overlay.is-open')) {
      document.body.classList.remove('modal-open');
    }

    /* Leaving #info/<key> in the address bar would reopen the pop-up
       on the next hashchange, so clear it. */
    if (window.location.hash.indexOf('#info/') === 0) {
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      } else {
        window.location.hash = '';
      }
    }

    if (lastFocus && lastFocus.focus) lastFocus.focus();
    lastFocus = null;
  }

  function isOpen() {
    return overlay.classList.contains('is-open');
  }

  function bind() {
    /* Openers anywhere on the page, including ones added later by
       the events renderer — hence the delegated listener. */
    document.addEventListener('click', function (e) {
      var trigger = e.target.closest && e.target.closest('.js-info-open');
      if (!trigger) return;
      var key = trigger.getAttribute('data-info');
      if (!key || !JUC_INFO[key]) return;
      e.preventDefault();
      open(key);
    });

    closeBtn.addEventListener('click', close);

    /* Backdrop click closes; a drag that starts inside the panel and
       ends outside must not, hence mousedown on the overlay itself. */
    overlay.addEventListener('mousedown', function (e) {
      if (e.target === overlay) close();
    });

    ctaEl.addEventListener('click', function (e) {
      if (runCta(JUC_INFO[currentKey])) e.preventDefault();
    });

    document.addEventListener('keydown', function (e) {
      if (!isOpen()) return;

      if (e.key === 'Escape') {
        close();
        return;
      }

      if (e.key !== 'Tab') return;

      /* Focus trap — Tab must not escape into the page behind. */
      var focusable = Array.prototype.filter.call(
        modal.querySelectorAll('a[href], button:not([disabled])'),
        function (el) { return el.offsetParent !== null; }
      );
      if (!focusable.length) return;

      var first = focusable[0];
      var last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    /* index.html#info/learn opens that pop-up on arrival, so every
       pop-up is linkable from the other pages of the site. */
    function fromHash() {
      var hash = window.location.hash;
      if (hash.indexOf('#info/') !== 0) return;
      var key = hash.slice(6);
      if (JUC_INFO[key]) open(key);
    }

    window.addEventListener('hashchange', fromHash);
    fromHash();
  }

  /* ==========================================================
     SEARCH — the header magnifier

     The site is a single page, so there is nothing to query on a
     server. What there is, is this registry: every category,
     institute, pathway, footer subject and event family, each with
     a title and its full text. The magnifier searches that, plus
     the page's own sections and its standalone pages, and takes
     you straight to whatever matches.
     ========================================================== */

  /* Destinations that are not pop-ups but should still be findable. */
  var EXTRA_TARGETS = [
    { label: 'Upcoming Events',        hint: 'The next gatherings at the Center',        href: 'index.html#events',   terms: 'events gatherings calendar diary upcoming reserve' },
    { label: 'A Future Gathering Place', hint: 'The vision for the campus',              href: 'index.html#vision',   terms: 'vision campus future gathering place humanity' },
    { label: 'The Master Plan',        hint: 'The campus, chapter by chapter',           href: 'master-plan.html',    terms: 'master plan campus architecture building drawings download' },
    { label: 'Donate',                 hint: 'Give to the Center',                       href: 'donate.html',         terms: 'donate donation give giving gift contribute support money monthly tax deductible 501c3 receipt legacy bequest sponsor' },
    { label: 'Support Our Mission',    hint: 'How giving to the Center works',           href: 'index.html#support',  terms: 'support nonprofit tax deductible 501c giving mission' },
    { label: 'The Jerusalem Unity Podcast', hint: 'Listen to the Center',                href: 'index.html#podcast',  terms: 'podcast listen audio spotify episode show radio interview' },
    { label: 'Visit Jerusalem',        hint: 'Plan a visit to the Center',               href: 'index.html#visit',    terms: 'visit visiting travel trip tour jerusalem come plan stay in person' },
    { label: 'Privacy Policy',         hint: 'How we handle your information',           href: 'privacy-policy.html', terms: 'privacy policy data information cookies gdpr legal' },
    { label: 'Non-Discrimination Policy', hint: 'Our commitment to equal treatment',     href: 'non-discrimination-policy.html', terms: 'non discrimination equal opportunity inclusion legal policy' }
  ];

  var searchOverlay, searchInput, searchResults, searchEmpty, searchLast;

  /* Flattens one registry entry into the text the query runs against. */
  function haystack(entry) {
    return ((entry.eyebrow || '') + ' ' + (entry.title || '') + ' ' +
            (entry.body || []).join(' ') + ' ' + (entry.list || []).join(' ') + ' ' +
            ((entry.cta && entry.cta.label) || '')).toLowerCase();
  }

  /* Scores every destination against the query. Title and eyebrow
     matches outrank body matches so "library" finds the Library
     before the pages that merely mention one. */
  function searchFor(query) {
    var q = query.trim().toLowerCase();
    if (q.length < 2) return [];

    var words = q.split(/\s+/);
    var hits = [];

    Object.keys(JUC_INFO).forEach(function (key) {
      var entry = JUC_INFO[key];
      var head = ((entry.eyebrow || '') + ' ' + (entry.title || '')).toLowerCase();
      var all = haystack(entry);
      var score = 0;

      words.forEach(function (w) {
        if (head.indexOf(w) !== -1) score += 10;
        else if (all.indexOf(w) !== -1) score += 3;
      });

      if (head.indexOf(q) === 0) score += 8;      /* prefix match wins ties */
      if (score) hits.push({ score: score, key: key, label: entry.eyebrow || entry.title, hint: entry.title });
    });

    EXTRA_TARGETS.forEach(function (t) {
      var all = (t.label + ' ' + t.hint + ' ' + t.terms).toLowerCase();
      var score = 0;
      words.forEach(function (w) { if (all.indexOf(w) !== -1) score += 6; });
      if (score) hits.push({ score: score, href: t.href, label: t.label, hint: t.hint });
    });

    hits.sort(function (a, b) { return b.score - a.score || a.label.localeCompare(b.label); });

    /* Once something matches by name, the entries that merely
       mention the word somewhere in a paragraph are noise — drop
       them rather than padding the list out to eight. */
    if (hits.length && hits[0].score >= 10) {
      hits = hits.filter(function (hit) { return hit.score >= 6; });
    }

    /* A few subjects appear twice in the registry — Library, Events
       and Research each have a category entry and a footer entry with
       different copy. Show the better-matching one only, so the list
       never repeats itself back at the visitor. */
    var seen = {};
    return hits.filter(function (hit) {
      var name = hit.label.toLowerCase();
      if (seen[name]) return false;
      seen[name] = true;
      return true;
    }).slice(0, 8);
  }

  function buildSearch() {
    searchOverlay = document.createElement('div');
    searchOverlay.className = 'search-overlay';
    searchOverlay.id = 'search-modal';
    searchOverlay.setAttribute('role', 'dialog');
    searchOverlay.setAttribute('aria-modal', 'true');
    searchOverlay.setAttribute('aria-label', 'Search the Jerusalem Unity Center');

    searchOverlay.innerHTML =
      '<div class="search-panel">' +
        '<div class="search-field">' +
          '<svg class="search-field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">' +
            '<circle cx="10.5" cy="10.5" r="6.5"></circle><line x1="15.4" y1="15.4" x2="21" y2="21"></line>' +
          '</svg>' +
          '<input class="search-input" type="search" autocomplete="off" spellcheck="false" ' +
                 'placeholder="Search the Center — institutes, pathways, events…" aria-label="Search">' +
          '<button class="search-cancel" type="button" aria-label="Close search">Esc</button>' +
        '</div>' +
        '<ul class="search-results" role="listbox" aria-label="Results"></ul>' +
        '<p class="search-empty" hidden></p>' +
      '</div>';

    document.body.appendChild(searchOverlay);
    searchInput = searchOverlay.querySelector('.search-input');
    searchResults = searchOverlay.querySelector('.search-results');
    searchEmpty = searchOverlay.querySelector('.search-empty');
  }

  function renderResults(query) {
    var hits = searchFor(query);
    searchResults.innerHTML = '';

    if (query.trim().length < 2) {
      searchEmpty.hidden = false;
      searchEmpty.textContent = 'Type to search the Center.';
      return;
    }

    if (!hits.length) {
      searchEmpty.hidden = false;
      searchEmpty.textContent = 'Nothing matched “' + query.trim() + '”. Try “institutes”, “events”, “volunteer” or “master plan”.';
      return;
    }

    searchEmpty.hidden = true;

    hits.forEach(function (hit) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.className = 'search-hit';
      a.href = hit.key ? '#info/' + hit.key : hit.href;
      if (hit.key) a.setAttribute('data-info-key', hit.key);

      var label = document.createElement('span');
      label.className = 'search-hit-label';
      label.textContent = hit.label;

      var hint = document.createElement('span');
      hint.className = 'search-hit-hint';
      hint.textContent = hit.hint;

      a.appendChild(label);
      a.appendChild(hint);
      li.appendChild(a);
      searchResults.appendChild(li);
    });
  }

  /* Below 1105px the whole .header-actions block is hidden and only
     the Support CTA is cloned into the dropdown, which left the
     magnifier unreachable on every tablet and phone. This puts a
     search row in the dropdown alongside it. */
  function addMobileSearchRow() {
    var nav = document.getElementById('primary-nav');
    if (!nav || nav.querySelector('.nav-search')) return;

    var row = document.createElement('button');
    row.type = 'button';
    row.className = 'search-btn nav-search';
    row.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">' +
        '<circle cx="10.5" cy="10.5" r="6.5"></circle><line x1="15.4" y1="15.4" x2="21" y2="21"></line>' +
      '</svg><span>Search</span>';

    /* Above the cloned Support button, which belongs at the foot of
       the list as the one coloured call to action. */
    var support = nav.querySelector('.nav-support');
    if (support) nav.insertBefore(row, support);
    else nav.appendChild(row);
  }

  function openSearch() {
    /* The dropdown would otherwise stay open behind the overlay. */
    var header = document.querySelector('.site-header');
    if (header && header.classList.contains('nav-open')) {
      header.classList.remove('nav-open');
      var toggle = header.querySelector('.nav-toggle');
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
      }
    }

    searchLast = document.activeElement;
    searchOverlay.classList.add('is-open');
    document.body.classList.add('modal-open');
    searchInput.value = '';
    renderResults('');
    searchInput.focus();
  }

  function closeSearch() {
    if (!searchOverlay.classList.contains('is-open')) return;
    searchOverlay.classList.remove('is-open');
    if (!document.querySelector('.info-overlay.is-open, .member-overlay.is-open, .story-overlay.is-open, .plan-overlay.is-open')) {
      document.body.classList.remove('modal-open');
    }
    if (searchLast && searchLast.focus) searchLast.focus();
    searchLast = null;
  }

  function bindSearch() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('.search-btn');
      if (btn) {
        e.preventDefault();
        openSearch();
        return;
      }

      if (e.target.closest && e.target.closest('.search-cancel')) {
        closeSearch();
        return;
      }

      /* A result that is a pop-up on THIS page opens it in place;
         one that lives elsewhere is left to navigate normally. */
      var hit = e.target.closest && e.target.closest('.search-hit');
      if (hit) {
        var key = hit.getAttribute('data-info-key');
        if (key && JUC_INFO[key]) {
          e.preventDefault();
          closeSearch();
          open(key);
        }
      }
    });

    searchOverlay.addEventListener('mousedown', function (e) {
      if (e.target === searchOverlay) closeSearch();
    });

    searchInput.addEventListener('input', function () {
      renderResults(searchInput.value);
    });

    /* Enter takes the first result; the arrows walk the list. */
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        var first = searchResults.querySelector('.search-hit');
        if (first) {
          e.preventDefault();
          first.click();
        }
      } else if (e.key === 'ArrowDown') {
        var next = searchResults.querySelector('.search-hit');
        if (next) {
          e.preventDefault();
          next.focus();
        }
      }
    });

    document.addEventListener('keydown', function (e) {
      if (!searchOverlay.classList.contains('is-open')) return;

      if (e.key === 'Escape') {
        closeSearch();
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        var items = Array.prototype.slice.call(searchResults.querySelectorAll('.search-hit'));
        var at = items.indexOf(document.activeElement);
        if (at === -1) return;
        e.preventDefault();
        var to = e.key === 'ArrowDown' ? at + 1 : at - 1;
        if (to < 0) searchInput.focus();
        else if (items[to]) items[to].focus();
      }
    });
  }

  /* ==========================================================
     DONATE-INTENT SIGNAL

     Every "Donate Now" on the site carries .js-donate-cta and a
     data-donate-source saying which one it was. Clicking one
     pushes an event onto the Google dataLayer.

     The conversion that actually counts is the completed
     donation, recorded on donate-thank-you.html — this is the
     secondary signal, and it is what tells the Center which
     button on which page is doing the work.

     This lives here rather than in donate.js because info.js is
     the one script every page of the site loads. It no-ops
     harmlessly until a Google tag is installed.
     ========================================================== */
  function bindDonateSignal() {
    window.dataLayer = window.dataLayer || [];

    document.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('.js-donate-cta');
      if (!btn) return;
      window.dataLayer.push({
        event: 'donate_intent',
        donate_source: btn.getAttribute('data-donate-source') || 'unknown'
      });
    });
  }

  function init() {
    buildShell();
    bind();
    buildSearch();
    bindSearch();
    addMobileSearchRow();
    bindDonateSignal();
    window.JUC_INFO_MODAL = { open: open, close: close };
    window.JUC_SEARCH = { open: openSearch, close: closeSearch };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
