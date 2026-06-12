/**
 * ================================================================
 * JAVA FULL STACK DEVELOPER — PORTFOLIO
 * js/main.js
 *
 * Sections:
 *  1. Theme Toggle
 *  2. Navbar Scroll Behaviour
 *  3. Mobile Menu
 *  4. Typed Role Animation
 *  5. Scroll Reveal (IntersectionObserver)
 *  6. Skill Bar Animation
 *  7. Skill Filter Tabs
 *  8. Active Nav Link (Scroll Spy)
 *  9. Back-to-Top Button
 * 10. Contact Form Validation & Submit
 * ================================================================
 */

'use strict';

/* ================================================================
   1. THEME TOGGLE
   Reads saved preference → applies immediately → toggles on click
   ================================================================ */
const themeBtn  = document.getElementById('theme-btn');
const themeIcon = document.getElementById('theme-icon');
const root      = document.documentElement;

function setTheme(t) {
  root.setAttribute('data-theme', t);
  localStorage.setItem('theme', t);
  // Moon = dark mode, Sun = light mode
  themeIcon.textContent = t === 'dark' ? '🌙' : '☀️';
}

// On load: respect saved preference or OS setting
const saved  = localStorage.getItem('theme');
const osDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
setTheme(saved || (osDark ? 'dark' : 'light'));

themeBtn.addEventListener('click', () => {
  const current = root.getAttribute('data-theme') || 'dark';
  setTheme(current === 'dark' ? 'light' : 'dark');
});


/* ================================================================
   2. NAVBAR SCROLL BEHAVIOUR
   Adds .scrolled class once page scrolls past 20px
   ================================================================ */
const navbar = document.getElementById('nav');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });


/* ================================================================
   3. MOBILE MENU
   Toggles the full-screen overlay and locks body scroll
   ================================================================ */
const hamburger = document.getElementById('hamburger');
const mobMenu   = document.getElementById('mob-menu');

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  mobMenu.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

// Close when any link is clicked
mobMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});


/* ================================================================
   4. TYPED ROLE ANIMATION
   Cycles through an array of roles with a blinking cursor
   ================================================================ */
const typedEl  = document.getElementById('typed');
const roles    = [
  'Java Full Stack Developer',
  'Spring Boot Architect',
  'Microservices Engineer',
  'Backend Specialist',
  'Cloud-Native Developer',
];

let ri = 0;   // role index
let ci = 0;   // character index
let del = false; // currently deleting?

const TYPE_SPEED   = 80;   // ms per char when typing
const DELETE_SPEED = 40;   // ms per char when deleting
const HOLD         = 1900; // ms to hold completed word

function type() {
  const role = roles[ri];

  if (!del) {
    // Add next character
    typedEl.textContent = role.slice(0, ++ci);
    if (ci === role.length) {
      // Word complete — pause, then start deleting
      del = true;
      setTimeout(type, HOLD);
      return;
    }
  } else {
    // Remove last character
    typedEl.textContent = role.slice(0, --ci);
    if (ci === 0) {
      // All deleted — move to next role
      del = false;
      ri  = (ri + 1) % roles.length;
    }
  }

  setTimeout(type, del ? DELETE_SPEED : TYPE_SPEED);
}

setTimeout(type, 500); // slight delay before starting


/* ================================================================
   5. SCROLL REVEAL
   Adds .on to .reveal and .stagger elements when they enter viewport
   ================================================================ */
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('on');
        revealObserver.unobserve(e.target); // only fire once
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal, .stagger').forEach(el => {
  revealObserver.observe(el);
});


/* ================================================================
   6. SKILL BAR ANIMATION
   Adds .seen when card enters viewport → CSS animates scaleX
   ================================================================ */
const barObserver = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('seen');
        barObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.35 }
);

document.querySelectorAll('.sk-card').forEach(c => barObserver.observe(c));


/* ================================================================
   7. SKILL FILTER TABS
   Shows/hides skill cards by data-category attribute
   ================================================================ */
const tabs   = document.querySelectorAll('.sk-tab');
const skCards = document.querySelectorAll('.sk-card');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {

    // 1. Update active tab
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const filter = tab.dataset.filter;

    // 2. Show / hide cards
    skCards.forEach(card => {
      const match = filter === 'all' || card.dataset.cat === filter;
      card.style.display = match ? '' : 'none';

      if (match) {
        // Re-trigger the appear animation
        card.style.animation = 'none';
        void card.offsetWidth; // force reflow
        card.style.animation = '';
        // Re-observe for bar animation
        card.classList.remove('seen');
        barObserver.observe(card);
      }
    });
  });
});


/* ================================================================
   8. ACTIVE NAV LINK — SCROLL SPY
   Highlights the nav link whose section is currently in view
   ================================================================ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a, .mob-menu a');

const spyObserver = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach(s => spyObserver.observe(s));


/* ================================================================
   9. BACK-TO-TOP BUTTON
   Appears after scrolling 500px; smooth-scrolls to top on click
   ================================================================ */
const topBtn = document.getElementById('back-top');

window.addEventListener('scroll', () => {
  topBtn.classList.toggle('on', window.scrollY > 500);
}, { passive: true });

topBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ================================================================
   10. CONTACT FORM — VALIDATION & SUBMIT
   ================================================================ */
const form     = document.getElementById('c-form');
const status   = document.getElementById('f-status');
const submitBtn = document.getElementById('submit-btn');

form.addEventListener('submit', async e => {
  e.preventDefault();

  const name    = form.name.value.trim();
  const email   = form.email.value.trim();
  const subject = form.subject.value.trim();
  const message = form.message.value.trim();

  // ── Validation ──
  if (!name || !email || !message) {
    showStatus('Please fill in all required fields.', 'err');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showStatus('Please enter a valid email address.', 'err');
    return;
  }

  // ── Submit ──
  submitBtn.textContent = 'Sending…';
  submitBtn.disabled    = true;

  try {
    /**
     * Replace the fakeSubmit call with a real endpoint:
     *
     * Option A — Formspree (free tier, easy):
     *   await fetch('https://formspree.io/f/YOUR_FORM_ID', {
     *     method: 'POST',
     *     headers: { 'Content-Type': 'application/json' },
     *     body: JSON.stringify({ name, email, subject, message })
     *   });
     *
     * Option B — EmailJS:
     *   await emailjs.send('SERVICE_ID', 'TEMPLATE_ID', { name, email, message });
     */
    await fakeSubmit();

    showStatus("Message sent! I'll get back to you within 24 hours.", 'ok');
    form.reset();
  } catch {
    showStatus('Something went wrong. Please email me directly.', 'err');
  } finally {
    submitBtn.textContent = 'Send Message →';
    submitBtn.disabled    = false;
  }
});

/** Displays a status message for 5 seconds then clears it */
function showStatus(msg, type) {
  status.textContent  = msg;
  status.className    = `f-status ${type}`;
  setTimeout(() => { status.className = 'f-status'; }, 5000);
}

/** Simulates a 1.2s async request — DELETE when using a real API */
function fakeSubmit() {
  return new Promise(res => setTimeout(res, 1200));
}
