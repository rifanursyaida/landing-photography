/* ============================================================
   MUAFI AS — Documentary Photographer Portfolio
   script.js
   ============================================================ */

'use strict';

/* ── THEME TOGGLE B/W ─────────────────────────────────────── */
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

// Load saved preference; default to dark
const savedTheme = localStorage.getItem('muafi-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('muafi-theme', next);
});

/* ── NAVBAR SCROLL STATE BIAR GAK TURUN ─────────────────────────────── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

/* ── SCROLL REVEAL ───────────────────────────────────── */
const fadeEls = document.querySelectorAll('.fade-up');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  }
);

fadeEls.forEach(el => observer.observe(el));

/* ── SMOOTH SCROLL for nav links ─────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 72; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── LAZY IMAGE LOAD BUAT ZOOM IN ─────────────────────────────────── */
// Add a subtle reveal shimmer as images load
document.querySelectorAll('img').forEach(img => {
  img.style.opacity = '0';
  img.style.transition = 'opacity .5s ease';
  if (img.complete) {
    img.style.opacity = '1';
  } else {
    img.addEventListener('load', () => { img.style.opacity = '1'; });
    img.addEventListener('error', () => { img.style.opacity = '0.3'; });
  }
});

/* ── GALLERY SCROLLER (buttons + drag) ─────────────────── */
const galleryScroller = document.getElementById('galleryScroller');
const galleryPrev = document.querySelector('.gallery-prev');
const galleryNext = document.querySelector('.gallery-next');

if (galleryScroller) {
  const scrollBy = () => Math.round(galleryScroller.clientWidth * 0.8);

  galleryPrev && galleryPrev.addEventListener('click', () => {
    galleryScroller.scrollBy({ left: -scrollBy(), behavior: 'smooth' });
  });
  galleryNext && galleryNext.addEventListener('click', () => {
    galleryScroller.scrollBy({ left: scrollBy(), behavior: 'smooth' });
  });

  // Pointer drag support
  let isDown = false, startX, scrollLeft;
  galleryScroller.addEventListener('pointerdown', (e) => {
    isDown = true; galleryScroller.setPointerCapture(e.pointerId);
    galleryScroller.classList.add('dragging');
    startX = e.clientX; scrollLeft = galleryScroller.scrollLeft;
  });
  window.addEventListener('pointerup', (e) => {
    if (!isDown) return; isDown = false; galleryScroller.classList.remove('dragging');
  });
  galleryScroller.addEventListener('pointermove', (e) => {
    if (!isDown) return;
    const x = e.clientX; const walk = (startX - x);
    galleryScroller.scrollLeft = scrollLeft + walk;
  });
}