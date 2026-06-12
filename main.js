/**
 * ============================================================
 * HRISHIKESH DESHMUKH — PORTFOLIO
 * File: js/main.js
 * Covers:
 *  1. Theme toggle (dark/light)
 *  2. Navbar scroll behaviour
 *  3. Mobile menu
 *  4. Typed headline animation
 *  5. Scroll-reveal (IntersectionObserver)
 *  6. Skill bar animation
 *  7. Active nav link highlighting
 *  8. Back-to-top button
 *  9. Contact form handling
 * 10. Skill filter tabs
 * ============================================================
 */

/* ============================================================
   1. THEME TOGGLE
   ============================================================ */
const themeBtn   = document.getElementById('theme-btn');
const themeIcon  = document.getElementById('theme-icon');
const root       = document.documentElement;

/**
 * Apply a theme and persist it to localStorage.
 * @param {'dark'|'light'} theme
 */
function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  // Swap icon: moon for dark, sun for light
  themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
}

// Load saved preference or system preference
const savedTheme = localStorage.getItem('theme');
const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(savedTheme || (systemDark ? 'dark' : 'light'));

themeBtn.addEventListener('click', () => {
  const current = root.getAttribute('data-theme') || 'dark';
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

/* ============================================================
   2. NAVBAR — SCROLL SHADOW
   ============================================================ */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  // Add shadow class once user scrolls more than 20px
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ============================================================
   3. MOBILE MENU
   ============================================================ */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open', open);
  // Lock body scroll when menu is open
  document.body.style.overflow = open ? 'hidden' : '';
});

// Close menu when a link is clicked
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ============================================================
   4. TYPED HEADLINE ANIMATION
   ============================================================ */
const typedEl    = document.getElementById('typed-text');
const typedCursor = document.getElementById('typed-cursor');

// Roles to cycle through
const roles = [
  'Java Developer',
  'Spring Boot Engineer',
  'Full Stack Developer',
  'Microservices Architect',
  'Backend Specialist',
];

let roleIndex    = 0;
let charIndex    = 0;
let isDeleting   = false;
const typeSpeed  = 85;   // ms per character when typing
const deleteSpeed = 45;  // ms per character when deleting
const holdTime   = 2000; // ms to hold completed word

/**
 * Recursive typing animation — types, holds, deletes, moves to next role.
 */
function typeLoop() {
  const currentRole = roles[roleIndex];

  if (!isDeleting) {
    // Add one character
    typedEl.textContent = currentRole.slice(0, charIndex + 1);
    charIndex++;

    if (charIndex === currentRole.length) {
      // Finished typing: hold, then start deleting
      isDeleting = true;
      setTimeout(typeLoop, holdTime);
      return;
    }
    setTimeout(typeLoop, typeSpeed);
  } else {
    // Remove one character
    typedEl.textContent = currentRole.slice(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      // Finished deleting: move to next role
      isDeleting = false;
      roleIndex  = (roleIndex + 1) % roles.length;
    }
    setTimeout(typeLoop, deleteSpeed);
  }
}

// Kick off after a short delay so page has settled
setTimeout(typeLoop, 600);

/* ============================================================
   5. SCROLL-REVEAL (IntersectionObserver)
   ============================================================ */

/**
 * Observe all .reveal and .reveal-stagger elements.
 * When they enter the viewport, add .visible to trigger CSS transitions.
 */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve after reveal so we don't toggle it back
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
  revealObserver.observe(el);
});

/* ============================================================
   6. SKILL BAR ANIMATION
   ============================================================ */

/**
 * When a skill card enters the viewport, add .in-view
 * which triggers the CSS scaleX transition on .skill-bar.
 */
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

document.querySelectorAll('.skill-card').forEach(card => {
  skillObserver.observe(card);
});

/* ============================================================
   7. ACTIVE NAV LINK — SCROLL SPY
   ============================================================ */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a, .mobile-menu a');

const spyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${id}`
          );
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach(section => spyObserver.observe(section));

/* ============================================================
   8. BACK-TO-TOP BUTTON
   ============================================================ */
const backTopBtn = document.getElementById('back-top');

window.addEventListener('scroll', () => {
  // Show after scrolling 500px
  backTopBtn.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });

backTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================================
   9. CONTACT FORM HANDLING
   ============================================================ */
const contactForm   = document.getElementById('contact-form');
const formStatus    = document.getElementById('form-status');
const submitBtn     = document.getElementById('submit-btn');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Basic validation
  const name    = contactForm.querySelector('[name="name"]').value.trim();
  const email   = contactForm.querySelector('[name="email"]').value.trim();
  const message = contactForm.querySelector('[name="message"]').value.trim();

  if (!name || !email || !message) {
    showStatus('Please fill in all fields.', 'error');
    return;
  }
  if (!isValidEmail(email)) {
    showStatus('Please enter a valid email address.', 'error');
    return;
  }

  // Simulate sending (replace with real API endpoint)
  submitBtn.textContent = 'Sending…';
  submitBtn.disabled = true;

  try {
    // ⚠️ Replace this URL with your Formspree/EmailJS/backend endpoint
    // await fetch('https://formspree.io/f/YOUR_ID', { method: 'POST', body: new FormData(contactForm) });
    await fakeDelay(1200); // Remove this line when using a real endpoint
    showStatus('Message sent! I\'ll get back to you soon.', 'success');
    contactForm.reset();
  } catch {
    showStatus('Something went wrong. Try emailing me directly.', 'error');
  } finally {
    submitBtn.textContent = 'Send Message';
    submitBtn.disabled = false;
  }
});

/** Display a status message below the form. */
function showStatus(msg, type) {
  formStatus.textContent = msg;
  formStatus.className   = `form-status ${type}`;
  // Auto-hide after 5 seconds
  setTimeout(() => {
    formStatus.className = 'form-status';
  }, 5000);
}

/** Basic email format check. */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Simulated async delay — remove when using a real API. */
function fakeDelay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ============================================================
   10. SKILL FILTER TABS
   ============================================================ */
const skillTabs  = document.querySelectorAll('.skill-tab');
const skillCards = document.querySelectorAll('.skill-card');

skillTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Update active tab
    skillTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const filter = tab.dataset.filter;

    skillCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;

      if (match) {
        // Show with small stagger
        card.style.display = '';
        // Re-trigger appear animation
        card.style.animation = 'none';
        // Force reflow
        void card.offsetWidth;
        card.style.animation = '';
      } else {
        card.style.display = 'none';
      }
    });

    // Re-observe newly visible cards for skill bar animation
    document.querySelectorAll('.skill-card:not([style*="none"])').forEach(card => {
      card.classList.remove('in-view');
      skillObserver.observe(card);
    });
  });
});

/* ============================================================
   INIT — Trigger hero reveal immediately (no scroll needed)
   ============================================================ */
document.querySelectorAll('.hero .reveal').forEach(el => {
  el.classList.add('visible');
});
