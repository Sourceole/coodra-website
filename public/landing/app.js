(() => {
  'use strict';

  const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
  const COUNTUP_DURATION_MS = 1400;

  const state = {
    reducedMotion: window.matchMedia(REDUCED_MOTION_QUERY).matches,
  };

  function parseCounter(el) {
    const raw = (el.getAttribute('data-countup') || '').trim();
    const target = Number(raw) || 0;
    const text = (el.textContent || '').trim();
    const suffix = text.replace(/^-?\d+(?:\.\d+)?/, '');
    return { target, suffix };
  }

  function animateCounter(el) {
    if (el.dataset.done === '1') return;

    const { target, suffix } = parseCounter(el);
    if (state.reducedMotion) {
      el.textContent = `${target.toLocaleString()}${suffix}`;
      el.dataset.done = '1';
      return;
    }

    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / COUNTUP_DURATION_MS);
      const eased = 1 - Math.pow(1 - p, 3);
      const value = Math.round(target * eased);
      el.textContent = `${value.toLocaleString()}${suffix}`;
      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        el.dataset.done = '1';
      }
    };

    requestAnimationFrame(tick);
  }

  function initRevealObservers() {
    const revealEls = Array.from(document.querySelectorAll('[data-reveal], [data-stagger]'));
    if (!revealEls.length) return;

    if (state.reducedMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach((el) => el.classList.add('is-visible'));
      document.querySelectorAll('[data-countup]').forEach((el) => animateCounter(el));
      return;
    }

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('is-visible');
        entry.target.querySelectorAll('[data-countup]').forEach((el) => animateCounter(el));
        if (entry.target.matches('[data-countup]')) animateCounter(entry.target);

        obs.unobserve(entry.target);
      });
    }, { threshold: 0.22, rootMargin: '0px 0px -10% 0px' });

    revealEls.forEach((el) => obs.observe(el));
    document.querySelectorAll('[data-countup]').forEach((el) => obs.observe(el));
  }

  function initButtons() {
    document.querySelectorAll('.btn').forEach((btn) => {
      let frame = 0;
      let nextMx = 50;
      let nextMy = 50;

      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        nextMx = ((e.clientX - r.left) / r.width) * 100;
        nextMy = ((e.clientY - r.top) / r.height) * 100;

        if (frame) return;
        frame = requestAnimationFrame(() => {
          btn.style.setProperty('--mx', `${nextMx}%`);
          btn.style.setProperty('--my', `${nextMy}%`);
          frame = 0;
        });
      });
    });
  }

  function init() {
    document.documentElement.classList.add('reveal-ready');
    initButtons();
    initRevealObservers();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
