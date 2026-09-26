/* ═══════════════════════════════════════════════════
   ZYNO · Main Script (v2 — Fixed animations)
   GSAP-powered scroll pinning, Three.js floating can,
   ambient bubbles, and interactive elements
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // Lock scroll during loading
  document.body.classList.add('loading');

  // Wait for GSAP + fonts
  Promise.all([
    document.fonts.ready,
    new Promise(resolve => {
      const check = setInterval(() => {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
          clearInterval(check);
          resolve();
        }
      }, 50);
    })
  ]).then(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    initLoader();
  });
});

/* ═══════════════════════════════════════════════════
   LOADING ANIMATION
   ═══════════════════════════════════════════════════ */
function initLoader() {
  const loader = document.getElementById('loader');
  const letters = loader.querySelectorAll('[data-letter]');
  const capsules = loader.querySelectorAll('.loader__capsule');

  // Force scroll to top
  window.scrollTo(0, 0);

  // Create floating bubbles in loader
  createLoaderBubbles();

  const tl = gsap.timeline({
    onComplete: () => {
      // Fade out loader
      gsap.to(loader, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => {
          loader.classList.add('hide');
          loader.style.display = 'none';
          document.body.classList.remove('loading');
          document.documentElement.classList.remove('loading');
          // NOW init the site after loader is fully gone
          initSite();
        }
      });
    }
  });

  // Letter pop-in animation
  tl.to(letters, {
    opacity: 1,
    y: 0,
    rotation: 0,
    scale: 1,
    duration: 0.6,
    stagger: 0.08,
    ease: 'back.out(1.7)'
  })
  .to(capsules, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.6,
    stagger: 0.15,
    ease: 'back.out(1.5)'
  }, '-=0.2')
  .to({}, { duration: 0.4 }); // Pause before dismiss
}

function createLoaderBubbles() {
  const container = document.querySelector('.loader__bubbles');
  if (!container) return;

  // Add bubble rise keyframes
  if (!document.getElementById('bubble-keyframes')) {
    const style = document.createElement('style');
    style.id = 'bubble-keyframes';
    style.textContent = `
      @keyframes bubbleRise {
        0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
        10% { opacity: 0.3; }
        90% { opacity: 0.05; }
        100% { transform: translateY(-110vh) translateX(20px) scale(0.5); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  const colors = ['#C8B6E2', '#E8C9A0', '#A8D5BA'];
  for (let i = 0; i < 25; i++) {
    const bubble = document.createElement('div');
    const size = Math.random() * 14 + 4;
    const color = colors[Math.floor(Math.random() * colors.length)];
    Object.assign(bubble.style, {
      position: 'absolute',
      width: size + 'px',
      height: size + 'px',
      borderRadius: '50%',
      background: color,
      opacity: '0',
      left: Math.random() * 100 + '%',
      bottom: '-20px',
      animation: `bubbleRise ${Math.random() * 5 + 4}s linear infinite`,
      animationDelay: Math.random() * 3 + 's'
    });
    container.appendChild(bubble);
  }
}

/* ═══════════════════════════════════════════════════
   SITE INIT (after loader)
   ═══════════════════════════════════════════════════ */
function initSite() {
  // Force scroll to top after loader
  window.scrollTo(0, 0);

  // Small delay to let layout settle
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      initHeroAnimation();
      initNavigation();
      initScrollSequence();
      initProductCards();
      initIngredientTabs();
      initAboutValues();
      initShopInteractions();
      initAmbientBubbles();
      initCursorGlow();
      initMobileMenu();
      initNewsletterForm();
      initSmoothScrollLinks();
      initFloatingCan();

      // Refresh all ScrollTriggers after everything is set up
      ScrollTrigger.refresh();
    });
  });
}

/* ═══════════════════════════════════════════════════
   HERO ANIMATION
   — First you see "ZYNO." on bone background
   — Scroll PINS the hero, drives the circle reveal
   — Foreground fades, dark bg expands, 3D can appears
   — Text info slides in on the left
   ═══════════════════════════════════════════════════ */
function initHeroAnimation() {
  const heroLetters = document.querySelectorAll('[data-hero-letter]');
  const tagline = document.querySelector('.hero__tagline');
  const scrollHint = document.querySelector('.hero__scroll-hint');
  const heroSub = document.querySelector('.hero__sub');
  const heroFg = document.getElementById('hero-fg');
  const heroReveal = document.getElementById('hero-reveal');
  const heroBgContent = document.getElementById('hero-bg-content');

  // ── Step 1: Entrance animation (letters pop in) ──
  const entrance = gsap.timeline();
  entrance
    .to(heroLetters, {
      opacity: 1,
      duration: 0.5,
      stagger: 0.07,
      ease: 'power2.out'
    })
    .to([tagline, heroSub], {
      opacity: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out'
    }, '-=0.2');

  // ── Step 2: Scroll-driven hero transition (PINNED) ──
  // This pins the hero section in place and uses scroll to drive:
  //  - foreground fades out
  //  - dark circle reveal expands
  //  - bg content fades in
  //  - 3D can becomes visible

  const heroTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: '+=200%',     // 2x viewport of scroll distance
      scrub: 1,
      pin: true,          // PIN the hero in place
      pinSpacing: true,   // Add space below for smooth flow
      anticipatePin: 1,
    }
  });

  // Phase 1 (0–40%): Foreground fades, letters drift up
  heroTl
    .to(heroLetters, {
      y: -60,
      opacity: 0,
      stagger: 0.02,
      duration: 0.3,
      ease: 'power2.in'
    }, 0)
    .to([tagline, heroSub, scrollHint], {
      opacity: 0,
      y: -20,
      duration: 0.2,
      ease: 'power2.in'
    }, 0)
    .to(heroFg, {
      opacity: 0,
      duration: 0.35,
      ease: 'power2.in'
    }, 0.05);

  // Phase 2 (20–70%): Circle reveal expands
  heroTl.to(heroReveal, {
    clipPath: 'circle(150% at 50% 48%)',
    duration: 0.5,
    ease: 'power2.inOut'
  }, 0.15);

  // Phase 3 (50–100%): Background content fades in
  heroTl.to(heroBgContent, {
    opacity: 1,
    duration: 0.35,
    ease: 'power2.out'
  }, 0.45);

  // Animate the bg content children staggered
  heroTl.from('.hero__bg-label', {
    opacity: 0, y: 20, duration: 0.15, ease: 'power2.out'
  }, 0.5);
  heroTl.from('.hero__bg-heading', {
    opacity: 0, y: 30, duration: 0.2, ease: 'power2.out'
  }, 0.55);
  heroTl.from('.hero__bg-rule', {
    scaleX: 0, duration: 0.15, ease: 'power2.out', transformOrigin: 'left'
  }, 0.6);
  heroTl.from('.hero__bg-desc', {
    opacity: 0, y: 20, duration: 0.15, ease: 'power2.out'
  }, 0.65);
  heroTl.from('.hero__bg-stats', {
    opacity: 0, y: 15, duration: 0.1, ease: 'power2.out'
  }, 0.7);
}

/* ═══════════════════════════════════════════════════
   NAVIGATION (hide/show on scroll direction)
   ═══════════════════════════════════════════════════ */
function initNavigation() {
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 50);
    nav.classList.toggle('hide-nav', y > lastScroll && y > 300);
    lastScroll = y;
  }, { passive: true });
}

/* ═══════════════════════════════════════════════════
   SCROLL SEQUENCE — Pinned frame-by-frame section
   Uses GSAP pin + progress-based frame switching.
   ═══════════════════════════════════════════════════ */
function initScrollSequence() {
  const wrapper = document.getElementById('scroll-sequence');
  if (!wrapper) return;

  const sticky = wrapper.querySelector('.scroll-sequence__sticky');
  const frames = wrapper.querySelectorAll('.scroll-sequence__frame');
  const totalFrames = frames.length;

  // Set initial states — all hidden except first
  frames.forEach((f, i) => {
    const h = f.querySelector('.scroll-sequence__heading');
    const d = f.querySelector('.scroll-sequence__desc');
    if (i === 0) {
      gsap.set(f, { opacity: 1 });
      gsap.set(h, { opacity: 1, y: 0 });
      gsap.set(d, { opacity: 1, y: 0 });
    } else {
      gsap.set(f, { opacity: 0 });
      gsap.set(h, { opacity: 0, y: 40 });
      gsap.set(d, { opacity: 0, y: 30 });
    }
  });

  let currentFrame = 0;

  ScrollTrigger.create({
    trigger: wrapper,
    start: 'top top',
    end: `+=${totalFrames * 100}%`,  // 300vh of scroll
    pin: sticky,                       // Pin the visible container
    pinSpacing: true,
    scrub: 0.5,
    onUpdate: (self) => {
      const progress = self.progress;
      const newFrame = Math.min(
        Math.floor(progress * totalFrames),
        totalFrames - 1
      );

      if (newFrame !== currentFrame) {
        // Fade out old frame
        const oldH = frames[currentFrame].querySelector('.scroll-sequence__heading');
        const oldD = frames[currentFrame].querySelector('.scroll-sequence__desc');
        gsap.to(frames[currentFrame], { opacity: 0, duration: 0.3 });
        gsap.to(oldH, { opacity: 0, y: -30, duration: 0.25 });
        gsap.to(oldD, { opacity: 0, y: -20, duration: 0.25 });

        // Fade in new frame
        const newH = frames[newFrame].querySelector('.scroll-sequence__heading');
        const newD = frames[newFrame].querySelector('.scroll-sequence__desc');
        gsap.to(frames[newFrame], { opacity: 1, duration: 0.3 });
        gsap.to(newH, { opacity: 1, y: 0, duration: 0.4, delay: 0.1, ease: 'power2.out' });
        gsap.to(newD, { opacity: 1, y: 0, duration: 0.4, delay: 0.15, ease: 'power2.out' });

        currentFrame = newFrame;
      }
    }
  });
}

/* ═══════════════════════════════════════════════════
   PRODUCT CARDS (staggered scroll reveal)
   ═══════════════════════════════════════════════════ */
function initProductCards() {
  const cards = document.querySelectorAll('.product-card');

  cards.forEach((card, i) => {
    gsap.from(card, {
      opacity: 0,
      y: 60,
      scale: 0.9,
      duration: 0.8,
      delay: i * 0.15,
      ease: 'back.out(1.4)',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Products section header
  const header = document.querySelector('.products__header');
  if (header) {
    gsap.from(header.children, {
      opacity: 0,
      y: 40,
      scale: 0.9,
      duration: 0.7,
      stagger: 0.1,
      ease: 'back.out(1.4)',
      scrollTrigger: {
        trigger: header,
        start: 'top 80%'
      }
    });
  }
}

/* ═══════════════════════════════════════════════════
   INGREDIENT TABS
   ═══════════════════════════════════════════════════ */
function initIngredientTabs() {
  const tabs = document.querySelectorAll('.ingredients__tab');
  const panels = document.querySelectorAll('.ingredients__panel');

  const bgColors = {
    'glutathione-tab': '#E8DDF5', // lavender-soft
    'acv-tab': '#F5E6D0',         // peach-soft
    'electrolytes-tab': '#D4EDE0' // mint-soft
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.tab;
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      panels.forEach(p => p.classList.remove('active'));
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) targetPanel.classList.add('active');

      // Change background color of ingredients section
      gsap.to('.ingredients', {
        backgroundColor: bgColors[targetId] || '#D4EDE0',
        duration: 0.8,
        ease: 'power2.inOut'
      });
    });
  });

  // Set initial background color based on active tab
  const activeTab = document.querySelector('.ingredients__tab.active');
  if (activeTab) {
    document.querySelector('.ingredients').style.backgroundColor = bgColors[activeTab.dataset.tab];
  }

  gsap.from('.ingredients__header', {
    opacity: 0, y: 50, duration: 0.7, ease: 'back.out(1.4)',
    scrollTrigger: { trigger: '.ingredients', start: 'top 70%' }
  });

  gsap.from('.ingredients__tabs', {
    opacity: 0, y: 40, duration: 0.5, delay: 0.2, ease: 'back.out(1.4)',
    scrollTrigger: { trigger: '.ingredients', start: 'top 70%' }
  });
}

/* ═══════════════════════════════════════════════════
   ABOUT VALUES (staggered reveal)
   ═══════════════════════════════════════════════════ */
function initAboutValues() {
  const values = document.querySelectorAll('[data-value]');
  values.forEach((val, i) => {
    ScrollTrigger.create({
      trigger: val,
      start: 'top 85%',
      onEnter: () => setTimeout(() => val.classList.add('visible'), i * 150)
    });
  });

  gsap.from('.about__title', {
    opacity: 0, y: 50, duration: 0.8, ease: 'power2.out',
    scrollTrigger: { trigger: '.about__header', start: 'top 75%' }
  });

  gsap.from('.about__image-wrap', {
    opacity: 0, scale: 0.95, duration: 1, ease: 'power2.out',
    scrollTrigger: { trigger: '.about__image-wrap', start: 'top 80%' }
  });
}

/* ═══════════════════════════════════════════════════
   SHOP INTERACTIONS
   ═══════════════════════════════════════════════════ */
function initShopInteractions() {
  // Quantity +/-
  document.querySelectorAll('[data-qty-plus]').forEach(btn => {
    btn.addEventListener('click', () => {
      const display = btn.parentElement.querySelector('[data-qty-val]');
      let val = parseInt(display.textContent);
      if (val < 99) {
        display.textContent = val + 1;
        gsap.fromTo(display, { scale: 1.3 }, { scale: 1, duration: 0.3, ease: 'back.out(1.7)' });
      }
    });
  });

  document.querySelectorAll('[data-qty-minus]').forEach(btn => {
    btn.addEventListener('click', () => {
      const display = btn.parentElement.querySelector('[data-qty-val]');
      let val = parseInt(display.textContent);
      if (val > 1) {
        display.textContent = val - 1;
        gsap.fromTo(display, { scale: 0.7 }, { scale: 1, duration: 0.3, ease: 'back.out(1.7)' });
      }
    });
  });

  // Shop card reveals
  document.querySelectorAll('[data-shop-card]').forEach((card, i) => {
    gsap.from(card, {
      opacity: 0, y: 80, scale: 0.9, duration: 0.7, delay: i * 0.1, ease: 'back.out(1.4)',
      scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none none' }
    });
  });

  // Bundle
  gsap.from('.shop__bundle', {
    opacity: 0, y: 60, scale: 0.95, duration: 0.8, ease: 'back.out(1.4)',
    scrollTrigger: { trigger: '.shop__bundle', start: 'top 85%' }
  });

  // Add to cart buttons (product cards)
  document.querySelectorAll('[data-add-cart]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const span = btn.querySelector('span:first-child');
      const orig = span.textContent;
      span.textContent = 'Added!';
      btn.style.background = '#C8B6E2';
      btn.style.color = '#301736';
      setTimeout(() => { span.textContent = orig; btn.style.background = ''; btn.style.color = ''; }, 1500);
    });
  });

  // Shop buy buttons
  document.querySelectorAll('.shop__card-buy').forEach(btn => {
    btn.addEventListener('click', () => {
      const orig = btn.textContent;
      btn.textContent = 'Added!';
      btn.style.background = '#C8B6E2';
      btn.style.color = '#301736';
      setTimeout(() => { btn.textContent = orig; btn.style.background = ''; btn.style.color = ''; }, 1500);
    });
  });
}

/* ═══════════════════════════════════════════════════
   AMBIENT BUBBLES (subtle bg canvas)
   ═══════════════════════════════════════════════════ */
function initAmbientBubbles() {
  const canvas = document.getElementById('bubbles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let bubbles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const palettes = [
    { r: 200, g: 182, b: 226 },
    { r: 232, g: 201, b: 160 },
    { r: 168, g: 213, b: 186 },
  ];

  for (let i = 0; i < 30; i++) {
    const c = palettes[Math.floor(Math.random() * palettes.length)];
    bubbles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 4 + 1,
      vy: -(Math.random() * 0.3 + 0.1),
      vx: (Math.random() - 0.5) * 0.2,
      o: Math.random() * 0.15 + 0.05,
      c, phase: Math.random() * Math.PI * 2
    });
  }

  (function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bubbles.forEach(b => {
      b.y += b.vy;
      b.x += Math.sin(b.phase) * 0.3;
      b.phase += 0.01;
      if (b.y < -20) { b.y = canvas.height + 20; b.x = Math.random() * canvas.width; }
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${b.c.r},${b.c.g},${b.c.b},${b.o})`;
      ctx.fill();
    });
    requestAnimationFrame(loop);
  })();
}

/* ═══════════════════════════════════════════════════
   CURSOR GLOW
   ═══════════════════════════════════════════════════ */
function initCursorGlow() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);
  let mx = -500, my = -500, gx = -500, gy = -500;
  document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
  (function upd() {
    gx += (mx - gx) * 0.08; gy += (my - gy) * 0.08;
    glow.style.left = gx + 'px'; glow.style.top = gy + 'px';
    requestAnimationFrame(upd);
  })();
}

/* ═══════════════════════════════════════════════════
   MOBILE MENU
   ═══════════════════════════════════════════════════ */
function initMobileMenu() {
  const burger = document.getElementById('nav-burger');
  const closeBtn = document.getElementById('mobile-close');
  const menu = document.getElementById('mobile-menu');
  const links = menu.querySelectorAll('.mobile-menu__link');
  burger.addEventListener('click', () => { menu.classList.add('open'); document.body.style.overflow = 'hidden'; });
  closeBtn.addEventListener('click', () => { menu.classList.remove('open'); document.body.style.overflow = ''; });
  links.forEach(l => l.addEventListener('click', () => { menu.classList.remove('open'); document.body.style.overflow = ''; }));
}

/* ═══════════════════════════════════════════════════
   NEWSLETTER FORM
   ═══════════════════════════════════════════════════ */
function initNewsletterForm() {
  const form = document.getElementById('cta-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.cta__submit');
    const orig = btn.textContent;
    btn.textContent = "You're in!";
    btn.style.background = '#A8D5BA';
    setTimeout(() => { btn.textContent = orig; btn.style.background = ''; form.reset(); }, 2500);
  });
}

/* ═══════════════════════════════════════════════════
   SMOOTH SCROLL ANCHOR LINKS
   ═══════════════════════════════════════════════════ */
function initSmoothScrollLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        gsap.to(window, { scrollTo: { y: target, offsetY: 80 }, duration: 1, ease: 'power2.inOut' });
      }
    });
  });
}

/* ═══════════════════════════════════════════════════
   THREE.JS FLOATING CAN
   ═══════════════════════════════════════════════════ */
function initFloatingCan() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  // Premium lighting setup
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();
  scene.environment = pmremGenerator.fromScene(new THREE.Scene()).texture; // basic env

  // Can body
  const canGeo = new THREE.CylinderGeometry(0.55, 0.55, 1.6, 64);
  const canMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.2,
    roughness: 0.3,
    clearcoat: 0.8,
    clearcoatRoughness: 0.2,
    reflectivity: 0.8,
    envMapIntensity: 1.2
  });

  // Load textures
  const texLoader = new THREE.TextureLoader();
  const textures = [
    texLoader.load('assets/images/can-glutathione.jpg'),
    texLoader.load('assets/images/can-acv.jpg'),
    texLoader.load('assets/images/can-electrolytes.jpg')
  ];
  
  // Set default texture to repeat and offset properly so it wraps around
  textures.forEach(tex => {
    tex.colorSpace = THREE.SRGBColorSpace;
  });
  canMat.map = textures[0];
  
  const can = new THREE.Mesh(canGeo, canMat);
  can.rotation.set(0.1, Math.PI, 0.15); // Rotate so the front of the image is visible
  scene.add(can);
  
  window.switchCanTexture = (index) => {
    canMat.map = textures[index];
    canMat.needsUpdate = true;
  };

  // Lids
  const lidGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.05, 32);
  const lidMat = new THREE.MeshPhysicalMaterial({ color: 0xD4D4D4, metalness: 0.8, roughness: 0.2 });
  const topLid = new THREE.Mesh(lidGeo, lidMat);
  topLid.position.y = 0.825;
  can.add(topLid);
  const bottomLid = new THREE.Mesh(lidGeo, lidMat);
  bottomLid.position.y = -0.825;
  can.add(bottomLid);

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const dl = new THREE.DirectionalLight(0xffffff, 0.8);
  dl.position.set(5, 5, 5);
  scene.add(dl);
  const fl = new THREE.DirectionalLight(0xC8B6E2, 0.3);
  fl.position.set(-3, 2, -5);
  scene.add(fl);
  const rl = new THREE.DirectionalLight(0xA8D5BA, 0.2);
  rl.position.set(0, -3, 3);
  scene.add(rl);

  // Create circular texture for bubbles
  const circleCanvas = document.createElement('canvas');
  circleCanvas.width = 64;
  circleCanvas.height = 64;
  const ctx = circleCanvas.getContext('2d');
  ctx.beginPath();
  ctx.arc(32, 32, 30, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  const circleTexture = new THREE.CanvasTexture(circleCanvas);

  // Floating particles (round bubbles)
  const pCount = 80;
  const pGeo = new THREE.BufferGeometry();
  const pos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 6;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const pMat = new THREE.PointsMaterial({ 
    color: 0xC8B6E2, 
    size: 0.08, 
    map: circleTexture,
    transparent: true, 
    opacity: 0.6,
    alphaTest: 0.1,
    sizeAttenuation: true 
  });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // Mouse parallax and dragging
  let mx = 0, my = 0;
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let baseRotationY = 0;
  
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    
    mx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    my = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(can);
    
    if (
      e.clientX >= rect.left && e.clientX <= rect.right &&
      e.clientY >= rect.top && e.clientY <= rect.bottom
    ) {
      if (intersects.length > 0) {
        canvas.style.cursor = isDragging ? 'grabbing' : 'grab';
      } else {
        canvas.style.cursor = isDragging ? 'grabbing' : 'default';
      }
    }
  });

  // Drag controls for canvas
  const handleDragStart = (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(can);
    
    if (intersects.length > 0) {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
      canvas.style.cursor = 'grabbing';
    }
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - previousMousePosition.x;
    baseRotationY += deltaX * 0.01;
    previousMousePosition.x = e.clientX;
  };

  const handleDragEnd = () => {
    isDragging = false;
  };

  canvas.addEventListener('pointerdown', handleDragStart);
  window.addEventListener('pointermove', handleDragMove);
  window.addEventListener('pointerup', handleDragEnd);
  window.addEventListener('pointercancel', handleDragEnd);

  let t = 0;
  (function animate() {
    t += 0.008;

    // Determine target X position based on screen width
    const isDesktop = window.innerWidth >= 1024;
    const targetX = isDesktop ? 1.0 : 0;
    
    // Smoothly interpolate current X position towards target
    if (typeof can.userData.currentX === 'undefined') {
      can.userData.currentX = 0;
    }
    can.userData.currentX += (targetX - can.userData.currentX) * 0.05;

    can.position.y = Math.sin(t * 1.2) * 0.15;
    can.position.x = can.userData.currentX + Math.sin(t * 0.8) * 0.08;
    
    if (!isDragging) {
      baseRotationY += 0.004; // Auto rotate
    }
    can.rotation.y = baseRotationY + mx * 0.2 + Math.PI; // +Math.PI ensures the front of texture faces camera
    
    can.rotation.x = 0.1 + Math.sin(t) * 0.05 + my * 0.1;
    can.rotation.z = 0.15 + Math.cos(t * 0.7) * 0.05;
    particles.rotation.y = t * 0.1;
    particles.rotation.x = t * 0.05;

    const p = pGeo.attributes.position.array;
    for (let i = 0; i < pCount; i++) {
      p[i * 3 + 1] += 0.003;
      p[i * 3] += Math.sin(t + i) * 0.001;
      if (p[i * 3 + 1] > 3) p[i * 3 + 1] = -3;
    }
    pGeo.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  })();

  window.addEventListener('resize', () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  });

  // Arrow controls
  let currentCanIndex = 0;
  const prevBtn = document.getElementById('can-arrow-prev');
  const nextBtn = document.getElementById('can-arrow-next');
  
  const heroBgColors = [
    '#E8DDF5', // Glutathione (lavender)
    '#F5E6D0', // ACV (peach)
    '#D4EDE0'  // Electrolytes (mint)
  ];

  const updateHeroVisuals = (index) => {
    if (window.switchCanTexture) window.switchCanTexture(index);
    gsap.to('.hero__reveal', {
      backgroundColor: heroBgColors[index],
      duration: 0.8,
      ease: 'power2.inOut'
    });
  };

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      currentCanIndex = (currentCanIndex - 1 + textures.length) % textures.length;
      updateHeroVisuals(currentCanIndex);
    });
    
    nextBtn.addEventListener('click', () => {
      currentCanIndex = (currentCanIndex + 1) % textures.length;
      updateHeroVisuals(currentCanIndex);
    });
  }
}
