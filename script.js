/* ============================================================
   MISE & MARGIN — JavaScript
   Interactions, form handling, scroll effects
   ============================================================ */

'use strict';

// ── DOM READY ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollAnimations();
  initForm();
  initYear();
});

// ── NAV ───────────────────────────────────────────────────
function initNav() {
  const nav       = document.getElementById('nav');
  const toggle    = document.getElementById('navToggle');
  const links     = document.getElementById('navLinks');
  const navAnchors = links.querySelectorAll('a');

  // Sticky background on scroll
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu toggle
  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.toggle('open');
    links.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    toggle.setAttribute('aria-expanded', isOpen);
  });

  // Close menu on link click
  navAnchors.forEach(anchor => {
    anchor.addEventListener('click', () => {
      toggle.classList.remove('open');
      links.classList.remove('open');
      document.body.style.overflow = '';
      toggle.setAttribute('aria-expanded', false);
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (links.classList.contains('open') && !nav.contains(e.target)) {
      toggle.classList.remove('open');
      links.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // Smooth section highlight on scroll
  const sections = document.querySelectorAll('section[id]');
  const highlight = () => {
    const scrollY = window.scrollY + window.innerHeight / 3;
    sections.forEach(section => {
      const { top, bottom } = section.getBoundingClientRect();
      const absTop = top + window.scrollY;
      const absBot = bottom + window.scrollY;
      const link   = links.querySelector(`a[href="#${section.id}"]`);
      if (link) {
        link.style.color = scrollY >= absTop && scrollY < absBot
          ? 'var(--clr-text)'
          : '';
      }
    });
  };
  window.addEventListener('scroll', highlight, { passive: true });
}

// ── SCROLL ANIMATIONS ─────────────────────────────────────
function initScrollAnimations() {
  // Add fade-up to key elements
  const targets = [
    '.about__left',
    '.about__right',
    '.service-card',
    '.process-step',
    '.contact__left',
    '.contact__right',
    '.stat',
  ];

  targets.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('fade-up');
      el.style.transitionDelay = `${i * 80}ms`;
    });
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

// ── FORM ──────────────────────────────────────────────────
function initForm() {
  const form       = document.getElementById('contactForm');
  const submitBtn  = document.getElementById('submitBtn');
  const successMsg = document.getElementById('formSuccess');

  if (!form) return;

  // Live validation
  const fields = {
    firstName:  { required: true, label: 'First name' },
    lastName:   { required: true, label: 'Last name' },
    email:      { required: true, label: 'Email', type: 'email' },
    restaurant: { required: true, label: 'Restaurant name' },
  };

  Object.keys(fields).forEach(id => {
    const input  = document.getElementById(id);
    const errBox = document.getElementById(`${id}Error`);
    if (!input || !errBox) return;

    input.addEventListener('blur', () => validate(input, errBox, fields[id]));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        clearError(input, errBox);
      }
    });
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Validate all required fields
    let valid = true;
    Object.keys(fields).forEach(id => {
      const input  = document.getElementById(id);
      const errBox = document.getElementById(`${id}Error`);
      if (!input || !errBox) return;
      if (!validate(input, errBox, fields[id])) valid = false;
    });

    if (!valid) return;

    // Simulate async submission
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
      // Collect form data
      const data = new FormData(form);
      const payload = Object.fromEntries(data.entries());

      // --- Replace this block with your actual API call ---
      await simulateSubmit(payload);
      // ---------------------------------------------------

      // Success state
      form.style.opacity = '0';
      form.style.transition = 'opacity 0.3s ease';
      setTimeout(() => {
        form.style.display = 'none';
        successMsg.classList.add('visible');
      }, 300);

    } catch (err) {
      console.error('Form submission error:', err);
      showGenericError(submitBtn);
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });
}

function validate(input, errBox, config) {
  const val = input.value.trim();

  if (config.required && !val) {
    setError(input, errBox, `${config.label} is required.`);
    return false;
  }
  if (config.type === 'email' && val && !isValidEmail(val)) {
    setError(input, errBox, 'Please enter a valid email address.');
    return false;
  }

  clearError(input, errBox);
  return true;
}

function setError(input, errBox, msg) {
  input.classList.add('error');
  errBox.textContent = msg;
}

function clearError(input, errBox) {
  input.classList.remove('error');
  errBox.textContent = '';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showGenericError(btn) {
  const orig = btn.querySelector('.btn__text').textContent;
  btn.querySelector('.btn__text').textContent = 'Something went wrong — try again';
  btn.style.background = '#e05252';
  setTimeout(() => {
    btn.querySelector('.btn__text').textContent = orig;
    btn.style.background = '';
  }, 3500);
}

// Simulated async delay — replace with real fetch() call in production
function simulateSubmit(payload) {
  console.log('Form payload:', payload);
  return new Promise(resolve => setTimeout(resolve, 1500));
}

// ── YEAR ──────────────────────────────────────────────────
function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}
