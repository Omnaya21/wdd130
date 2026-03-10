/* =====================================================
   main.js — Shared JS for Digital Resume Site
   ===================================================== */

/* ─── Nav Scroll Effect ─── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

/* ─── Active Nav Link ─── */
(function setActiveLink() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href') || '';
    a.classList.toggle('active', href === page || (page === '' && href === 'index.html'));
  });
})();

/* ─── Mobile Hamburger ─── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger?.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});
// Close on outside click
document.addEventListener('click', e => {
  if (!nav?.contains(e.target)) {
    mobileMenu?.classList.remove('open');
    hamburger?.classList.remove('open');
  }
});

/* ─── Scroll-Reveal (IntersectionObserver) ─── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
  revealObserver.observe(el);
});

/* ─── Portfolio Filter ─── */
const filterBtns = document.querySelectorAll('.chip-filter');
const projectCards = document.querySelectorAll('[data-category]');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.filter;
    projectCards.forEach(card => {
      const show = cat === 'all' || card.dataset.category?.includes(cat);
      card.style.opacity = show ? '1' : '0';
      card.style.transform = show ? 'scale(1)' : 'scale(0.95)';
      card.style.pointerEvents = show ? 'auto' : 'none';
      card.style.transition = 'opacity 300ms ease, transform 300ms ease';
      setTimeout(() => { card.style.display = show ? '' : 'none'; }, show ? 0 : 300);
      if (show) requestAnimationFrame(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; });
    });
  });
});

/* ─── Contact Form ─── */
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

function validateField(input) {
  const errorEl = document.getElementById(input.id + '-error');
  let msg = '';
  if (!input.value.trim()) {
    msg = 'This field is required.';
  } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
    msg = 'Please enter a valid email address.';
  }
  input.classList.toggle('error', !!msg);
  if (errorEl) { errorEl.textContent = msg; errorEl.classList.toggle('visible', !!msg); }
  return !msg;
}

contactForm?.querySelectorAll('.form-input, .form-textarea').forEach(input => {
  input.addEventListener('blur', () => validateField(input));
  input.addEventListener('input', () => {
    if (input.classList.contains('error')) validateField(input);
  });
});

contactForm?.addEventListener('submit', e => {
  e.preventDefault();
  const fields = contactForm.querySelectorAll('.form-input, .form-textarea');
  const allValid = [...fields].map(validateField).every(Boolean);
  if (!allValid) return;

  const submitBtn = contactForm.querySelector('[type=submit]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  // Simulate async send — replace with fetch() to Formspree or your backend
  setTimeout(() => {
    contactForm.style.display = 'none';
    formSuccess?.classList.add('visible');
  }, 1200);
});
