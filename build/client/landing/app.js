(() => {
  'use strict';

  const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
  const COUNTUP_DURATION_MS = 1400;
  const STICKY_SCROLL_OFFSET = 8;

  const state = {
    reducedMotion: window.matchMedia(REDUCED_MOTION_QUERY).matches,
    observers: []
  };

  function isLowPowerDevice() {
    const cores = Number(navigator.hardwareConcurrency || 4);
    const mem = Number(navigator.deviceMemory || 4);
    return cores <= 4 || mem <= 4 || window.innerWidth < 900;
  }

  function setScrollProgress() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
    document.documentElement.style.setProperty('--scroll-progress', `${Math.max(0, Math.min(100, progress))}%`);
  }

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

        if (entry.target.classList.contains('step-flow')) {
          const nodes = entry.target.querySelectorAll('[data-step-node]');
          nodes.forEach((node, i) => {
            setTimeout(() => node.classList.add('node-pulse'), i * 180);
          });
        }

        obs.unobserve(entry.target);
      });
    }, { threshold: 0.22, rootMargin: '0px 0px -10% 0px' });

    revealEls.forEach((el) => obs.observe(el));
    document.querySelectorAll('[data-countup]').forEach((el) => obs.observe(el));
    const stepFlow = document.querySelector('.step-flow');
    if (stepFlow) obs.observe(stepFlow);
    state.observers.push(obs);
  }

  function resetMarquee(track) {
    if (!track.dataset.base) {
      track.dataset.base = track.innerHTML;
    }
    track.innerHTML = track.dataset.base;
    track.classList.remove('is-marquee-ready');
    track.style.removeProperty('--marquee-loop-width');
    track.style.removeProperty('--marquee-duration');

    if (state.reducedMotion) return;

    const baseNodes = Array.from(track.children);
    if (!baseNodes.length) return;

    const viewport = track.parentElement ? track.parentElement.clientWidth : window.innerWidth;
    let guard = 0;

    while (track.scrollWidth < viewport * 2.2 && guard < 8) {
      baseNodes.forEach((n) => {
        const clone = n.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      });
      guard += 1;
    }

    const loopWidth = track.scrollWidth / 2;
    const pxPerSecond = 72;
    const duration = Math.max(18, Math.round(loopWidth / pxPerSecond));

    track.style.setProperty('--marquee-loop-width', `${loopWidth}px`);
    track.style.setProperty('--marquee-duration', `${duration}s`);
    track.classList.add('is-marquee-ready');
  }

  function initMarquees() {
    document.querySelectorAll('[data-marquee]').forEach((track) => resetMarquee(track));
  }

  function resetProofTrack(track) {
    if (!track.dataset.base) track.dataset.base = track.innerHTML;
    track.innerHTML = track.dataset.base;
    track.classList.remove('is-ready');
    track.style.removeProperty('--proof-loop');
    track.style.removeProperty('--proof-duration');

    if (state.reducedMotion) return;

    track.innerHTML += track.dataset.base + track.dataset.base;
    const loop = track.scrollHeight / 3;
    const duration = Math.max(24, Math.round(loop / 22));
    track.style.setProperty('--proof-loop', `${loop}px`);
    track.style.setProperty('--proof-duration', `${duration}s`);
    track.classList.add('is-ready');
  }

  function initProofMarquee() {
    document.querySelectorAll('[data-proof-track]').forEach((track) => resetProofTrack(track));
  }

  function initSparklesText() {
    const nodes = document.querySelectorAll('[data-sparkles-text]');
    if (!nodes.length) return;

    nodes.forEach((node) => {
      const count = Math.max(6, Math.min(24, Number(node.getAttribute('data-sparkle-count') || 12)));
      node.querySelectorAll('.sparkle').forEach((el) => el.remove());

      for (let i = 0; i < count; i += 1) {
        const s = document.createElement('span');
        s.className = 'sparkle';
        s.style.left = `${Math.random() * 100}%`;
        s.style.top = `${Math.random() * 100}%`;
        s.style.animationDelay = `${(Math.random() * 2.2).toFixed(2)}s`;
        s.style.animationDuration = `${(0.72 + Math.random() * 0.65).toFixed(2)}s`;
        const size = 8 + Math.random() * 8;
        s.style.width = `${size}px`;
        s.style.height = `${size}px`;
        node.appendChild(s);
      }
    });
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

  function initHowStepFlip() {
    const triggers = Array.from(document.querySelectorAll('.how-trigger[data-how-step]'));
    const card = document.getElementById('howFlipCard');
    const tagEl = document.getElementById('howFlipTag');
    const titleEl = document.getElementById('howFlipTitle');
    const bodyEl = document.getElementById('howFlipBody');
    const stage = document.querySelector('.how-flip-stage');
    const head = document.querySelector('.how-sticky-head');
    if (!triggers.length || !card || !tagEl || !titleEl || !bodyEl || !stage || !head) return;

    let activeIdx = 0;

    const syncAlignment = () => {
      if (window.matchMedia('(max-width: 1024px)').matches) {
        stage.style.removeProperty('--how-align-offset');
        return;
      }
      const heading = head.querySelector('h2');
      const targetRect = heading ? heading.getBoundingClientRect() : head.getBoundingClientRect();
      const targetCenter = targetRect.top + targetRect.height * 0.5;
      const viewportCenter = window.innerHeight * 0.5;
      const delta = targetCenter - viewportCenter;
      stage.style.setProperty('--how-align-offset', `${Math.round(delta)}px`);
    };

    const hydrate = (idx, animate) => {
      const source = triggers[idx];
      if (!source) return;

      triggers.forEach((node, i) => node.classList.toggle('is-active', i === idx));

      const nextTag = source.getAttribute('data-tag') || '';
      const nextTitle = source.getAttribute('data-title') || '';
      const nextBody = source.getAttribute('data-body') || '';

      if (!animate || state.reducedMotion) {
        tagEl.textContent = nextTag;
        titleEl.textContent = nextTitle;
        bodyEl.textContent = nextBody;
        activeIdx = idx;
        return;
      }

      const directionClass = idx > activeIdx ? 'flip-next' : 'flip-prev';
      card.classList.remove('flip-next', 'flip-prev');
      void card.offsetWidth;
      card.classList.add(directionClass);
      tagEl.textContent = nextTag;
      titleEl.textContent = nextTitle;
      bodyEl.textContent = nextBody;
      setTimeout(() => card.classList.remove(directionClass), 440);
      activeIdx = idx;
    };

    if (state.reducedMotion || window.matchMedia('(max-width: 1024px)').matches) {
      hydrate(0, false);
      syncAlignment();
      return;
    }

    const pickNearest = () => {
      const midY = window.innerHeight * 0.5;
      let bestIdx = 0;
      let bestDistance = Infinity;
      triggers.forEach((item, idx) => {
        const rect = item.getBoundingClientRect();
        const center = rect.top + rect.height * 0.5;
        const distance = Math.abs(center - midY);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestIdx = idx;
        }
      });
      if (bestIdx !== activeIdx) hydrate(bestIdx, true);
      syncAlignment();
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        pickNearest();
        ticking = false;
      });
    };

    hydrate(0, false);
    pickNearest();
    syncAlignment();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
      pickNearest();
      syncAlignment();
    }, { passive: true });
  }

  function initFooterWordmark() {
    const svg = document.getElementById('coodra-footer-wordmark');
    const wrap = svg ? svg.closest('.footer-wordmark-wrap') : null;
    if (!svg || !wrap) return;

    const reveal = svg.querySelector('#coodraFooterReveal');
    if (!reveal) return;

    const setMaskFromPoint = (clientX, clientY) => {
      const rect = svg.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const cx = ((clientX - rect.left) / rect.width) * 100;
      const cy = ((clientY - rect.top) / rect.height) * 100;
      reveal.setAttribute('cx', `${Math.max(0, Math.min(100, cx)).toFixed(2)}%`);
      reveal.setAttribute('cy', `${Math.max(0, Math.min(100, cy)).toFixed(2)}%`);
    };

    const centerMask = () => {
      reveal.setAttribute('cx', '50%');
      reveal.setAttribute('cy', '50%');
    };

    svg.addEventListener('mouseenter', () => wrap.classList.add('is-hovered'));
    svg.addEventListener('mouseleave', () => {
      wrap.classList.remove('is-hovered');
      centerMask();
    });
    svg.addEventListener('mousemove', (e) => setMaskFromPoint(e.clientX, e.clientY));
    svg.addEventListener('touchstart', () => wrap.classList.add('is-hovered'), { passive: true });
    svg.addEventListener('touchmove', (e) => {
      if (!e.touches || !e.touches[0]) return;
      setMaskFromPoint(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    svg.addEventListener('touchend', () => {
      wrap.classList.remove('is-hovered');
      centerMask();
    }, { passive: true });
  }

  function initScrollExpandMedia() {
    const section = document.getElementById('media-expand');
    if (!section) return;

    const update = () => {
      if (state.reducedMotion) {
        section.style.setProperty('--media-progress', '1');
        return;
      }

      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const start = viewport * 0.75;
      const end = -Math.max(1, rect.height - viewport * 0.35);
      const raw = (start - rect.top) / (start - end);
      const progress = Math.max(0, Math.min(1, raw));
      section.style.setProperty('--media-progress', progress.toFixed(4));
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update, { passive: true });
  }

  function initStickyHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const onScroll = () => {
      header.classList.toggle('is-sticky', window.scrollY > STICKY_SCROLL_OFFSET);
      setScrollProgress();
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  async function initHeroGlobe() {
    const canvas = document.getElementById('coodra-globe');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      canvas.style.opacity = '1';
      return;
    }

    const markers = [
      { lat: 37.78, lng: -122.42, label: 'SF' },
      { lat: 51.51, lng: -0.13, label: 'LDN' },
      { lat: 35.68, lng: 139.69, label: 'TYO' },
      { lat: -33.87, lng: 151.21, label: 'SYD' },
      { lat: 1.35, lng: 103.82, label: 'SG' },
      { lat: 28.61, lng: 77.21, label: 'DEL' },
      { lat: 45.50, lng: -73.57, label: 'MTL' },
      { lat: 36.19, lng: 44.01, label: 'ERB' }
    ];

    const connections = [
      { from: [37.78, -122.42], to: [51.51, -0.13] },
      { from: [51.51, -0.13], to: [35.68, 139.69] },
      { from: [35.68, 139.69], to: [-33.87, 151.21] },
      { from: [37.78, -122.42], to: [1.35, 103.82] },
      { from: [51.51, -0.13], to: [28.61, 77.21] },
      { from: [1.35, 103.82], to: [45.50, -73.57] },
      { from: [28.61, 77.21], to: [36.19, 44.01] },
      { from: [45.50, -73.57], to: [37.78, -122.42] }
    ];

    let rotY = 0.44;
    let rotX = 0.28;
    let width = 0;
    let height = 0;
    let dpr = Math.max(1, Math.min(1.7, window.devicePixelRatio || 1));
    let rafId = null;
    let time = 0;
    let lastRenderTs = 0;
    const lowPower = isLowPowerDevice();
    let active = !document.hidden;
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let startRotY = 0;
    let startRotX = 0;

    const dotCloud = [];
    const dotCount = lowPower ? 760 : 1100;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    for (let i = 0; i < dotCount; i += 1) {
      const theta = (2 * Math.PI * i) / goldenRatio;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / dotCount);
      dotCloud.push([
        Math.cos(theta) * Math.sin(phi),
        Math.cos(phi),
        Math.sin(theta) * Math.sin(phi)
      ]);
    }

    const latLngToXYZ = (lat, lng, radius) => {
      const phi = ((90 - lat) * Math.PI) / 180;
      const theta = ((lng + 180) * Math.PI) / 180;
      return [
        -(radius * Math.sin(phi) * Math.cos(theta)),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      ];
    };

    const rotatePoint = (x, y, z) => {
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      let rx = x * cosY + z * sinY;
      let rz = -x * sinY + z * cosY;

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const ry = y * cosX - rz * sinX;
      rz = y * sinX + rz * cosX;

      return [rx, ry, rz];
    };

    const project = (x, y, z, cx, cy, fov) => {
      const scale = fov / (fov + z);
      return [x * scale + cx, y * scale + cy, z, scale];
    };

    const setCanvasSize = () => {
      width = Math.max(300, canvas.clientWidth || 520);
      height = Math.max(300, canvas.clientHeight || 520);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (ts = performance.now()) => {
      if (!active) {
        rafId = requestAnimationFrame(draw);
        return;
      }
      if (lowPower && ts - lastRenderTs < 33) {
        rafId = requestAnimationFrame(draw);
        return;
      }
      lastRenderTs = ts;
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.39;
      // Tighter FOV increases near/far separation for stronger 3D depth.
      const fov = 540;
      const isLightTheme = document.documentElement.getAttribute('data-theme') === 'light';

      if (!state.reducedMotion && !dragging) rotY += 0.0026;
      time += lowPower ? 0.013 : 0.016;

      ctx.clearRect(0, 0, width, height);

      // Intentionally no outer glow pass to avoid a halo ring around the globe.

      if (!isLightTheme) {
        const sphereFill = ctx.createRadialGradient(
          cx - radius * 0.22,
          cy - radius * 0.24,
          radius * 0.22,
          cx,
          cy,
          radius * 1.02
        );
        sphereFill.addColorStop(0, 'rgba(22,64,122,0.66)');
        sphereFill.addColorStop(0.45, 'rgba(12,36,76,0.86)');
        sphereFill.addColorStop(1, 'rgba(5,14,30,0.97)');
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fillStyle = sphereFill;
        ctx.fill();
      }

      // A slowly moving light source gives the sphere a day/night terminator.
      const lightYaw = time * 0.22 + 0.64;
      const lightDir = [Math.cos(lightYaw) * 0.9, -0.28, Math.sin(lightYaw) * 0.9];
      const lightLen = Math.hypot(lightDir[0], lightDir[1], lightDir[2]) || 1;
      lightDir[0] /= lightLen;
      lightDir[1] /= lightLen;
      lightDir[2] /= lightLen;

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.clip();

      for (let i = 0; i < dotCloud.length; i += 1) {
        let [x, y, z] = dotCloud[i];
        x *= radius;
        y *= radius;
        z *= radius;
        [x, y, z] = rotatePoint(x, y, z);
        if (z > 0) continue;
        const [sx, sy, sz, scale] = project(x, y, z, cx, cy, fov);
        const nx = x / radius;
        const ny = y / radius;
        const nz = z / radius;
        const lambert = nx * lightDir[0] + ny * lightDir[1] + nz * lightDir[2];
        const lit = Math.max(0, lambert);
        const shade = Math.max(0, -lambert);
        const depthAlpha = Math.max(0.16, 1 - (sz + radius) / (2 * radius));
        const alpha = depthAlpha * (0.64 + lit * 0.6) * (1 - shade * 0.3);
        const dotSize = (0.72 + depthAlpha * 1.02) * (0.88 + scale * 0.26);
        ctx.beginPath();
        ctx.arc(sx, sy, dotSize, 0, Math.PI * 2);
        if (isLightTheme) {
          const r = Math.round(44 + lit * 26);
          const g = Math.round(108 + lit * 42);
          const b = Math.round(186 + lit * 36);
          ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(0.86, alpha * 0.58).toFixed(3)})`;
        } else {
          const r = Math.round(128 + lit * 60);
          const g = Math.round(196 + lit * 34);
          const b = Math.round(232 + lit * 16);
          ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(0.96, alpha * 0.86).toFixed(3)})`;
        }
        ctx.fill();
      }

      connections.forEach((conn, idx) => {
        let [x1, y1, z1] = latLngToXYZ(conn.from[0], conn.from[1], radius);
        let [x2, y2, z2] = latLngToXYZ(conn.to[0], conn.to[1], radius);
        [x1, y1, z1] = rotatePoint(x1, y1, z1);
        [x2, y2, z2] = rotatePoint(x2, y2, z2);
        // Keep more routes visible so the network reads through the sphere center.
        if (z1 > radius * 0.55 && z2 > radius * 0.55) return;

        const [sx1, sy1] = project(x1, y1, z1, cx, cy, fov);
        const [sx2, sy2] = project(x2, y2, z2, cx, cy, fov);

        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        const midZ = (z1 + z2) / 2;
        const len = Math.sqrt(midX * midX + midY * midY + midZ * midZ) || 1;
        const arcLift = radius * 1.03;
        const cx3d = (midX / len) * arcLift;
        const cy3d = (midY / len) * arcLift;
        const cz3d = (midZ / len) * arcLift;
        let [scx, scy] = project(cx3d, cy3d, cz3d, cx, cy, fov);
        // Pull control points toward globe center to avoid bottom-heavy connector clustering.
        scx = scx * 0.48 + cx * 0.52;
        scy = scy * 0.42 + cy * 0.58;

        const depth = 1 - Math.min(1, Math.max((z1 + z2) / (2 * radius), -1));
        ctx.strokeStyle = isLightTheme
          ? `rgba(62,142,219,${(0.06 + depth * 0.10).toFixed(3)})`
          : `rgba(86,173,236,${(0.08 + depth * 0.16).toFixed(3)})`;
        ctx.lineWidth = 1.05;
        ctx.beginPath();
        ctx.moveTo(sx1, sy1);
        ctx.quadraticCurveTo(scx, scy, sx2, sy2);
        ctx.stroke();

        const t = (Math.sin(time * 1.25 + idx * 0.9) + 1) / 2;
        const tx = (1 - t) * (1 - t) * sx1 + 2 * (1 - t) * t * scx + t * t * sx2;
        const ty = (1 - t) * (1 - t) * sy1 + 2 * (1 - t) * t * scy + t * t * sy2;
        ctx.beginPath();
        ctx.arc(tx, ty, 1.9, 0, Math.PI * 2);
        ctx.fillStyle = isLightTheme ? 'rgba(30,182,160,0.68)' : 'rgba(47,196,171,0.82)';
        ctx.fill();
      });

      markers.forEach((marker, idx) => {
        let [x, y, z] = latLngToXYZ(marker.lat, marker.lng, radius);
        [x, y, z] = rotatePoint(x, y, z);
        if (z > radius * 0.2) return;
        const [sx, sy] = project(x, y, z, cx, cy, fov);

        const pulse = Math.sin(time * 2 + idx * 0.75) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(sx, sy, 3.4 + pulse * 4.4, 0, Math.PI * 2);
        ctx.strokeStyle = isLightTheme
          ? `rgba(30,182,160,${(0.10 + pulse * 0.12).toFixed(3)})`
          : `rgba(50,194,170,${(0.14 + pulse * 0.16).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(sx, sy, 2.4, 0, Math.PI * 2);
        ctx.fillStyle = isLightTheme ? 'rgba(28,164,148,0.72)' : 'rgba(48,196,170,0.86)';
        ctx.fill();

        if (marker.label && !state.reducedMotion) {
          ctx.font = '11px "Space Grotesk", system-ui, sans-serif';
          ctx.fillStyle = isLightTheme ? 'rgba(78,126,182,0.45)' : 'rgba(132,188,224,0.46)';
          ctx.fillText(marker.label, sx + 7, sy + 4);
        }
      });

      const nightShade = ctx.createRadialGradient(
        cx - lightDir[0] * radius * 0.52,
        cy - lightDir[1] * radius * 0.48,
        radius * 0.3,
        cx - lightDir[0] * radius * 0.16,
        cy - lightDir[1] * radius * 0.16,
        radius * 1.08
      );
      if (isLightTheme) {
        nightShade.addColorStop(0, 'rgba(11,39,74,0)');
        nightShade.addColorStop(0.58, 'rgba(11,39,74,0.08)');
        nightShade.addColorStop(1, 'rgba(11,39,74,0.24)');
      } else {
        nightShade.addColorStop(0, 'rgba(8,20,43,0)');
        nightShade.addColorStop(0.58, 'rgba(8,20,43,0.12)');
        nightShade.addColorStop(1, 'rgba(8,20,43,0.34)');
      }
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = nightShade;
      ctx.fill();

      ctx.restore();

      if (isLightTheme) {
        // Subtle inner depth without creating a visible ring/disk.
        const centerShadow = ctx.createRadialGradient(
          cx,
          cy + radius * 0.08,
          radius * 0.03,
          cx,
          cy + radius * 0.1,
          radius * 0.44
        );
        centerShadow.addColorStop(0, 'rgba(28, 52, 88, 0.12)');
        centerShadow.addColorStop(0.55, 'rgba(28, 52, 88, 0.04)');
        centerShadow.addColorStop(1, 'rgba(28, 52, 88, 0)');
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.68, 0, Math.PI * 2);
        ctx.fillStyle = centerShadow;
        ctx.fill();
      }

      if (!isLightTheme) {
        const rim = ctx.createLinearGradient(cx, cy - radius, cx, cy + radius);
        rim.addColorStop(0, 'rgba(129,196,235,0.13)');
        rim.addColorStop(1, 'rgba(63,127,196,0.08)');
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = rim;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      rafId = requestAnimationFrame(draw);
    };

    const onPointerDown = (e) => {
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startRotY = rotY;
      startRotX = rotX;
      canvas.style.cursor = 'grabbing';
      canvas.setPointerCapture?.(e.pointerId);
    };

    const onPointerMove = (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      rotY = startRotY + dx * 0.005;
      rotX = Math.max(-1, Math.min(1, startRotX + dy * 0.0048));
    };

    const onPointerUp = (e) => {
      dragging = false;
      canvas.style.cursor = 'grab';
      if (e && e.pointerId !== undefined) {
        try { canvas.releasePointerCapture?.(e.pointerId); } catch (_) {}
      }
    };

    setCanvasSize();
    canvas.classList.add('is-ready');
    canvas.closest('.hero-globe-wrap')?.classList.add('is-rendered');
    draw();

    window.addEventListener('resize', setCanvasSize, { passive: true });
    document.addEventListener('visibilitychange', () => {
      active = !document.hidden;
    });
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointerleave', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);
    window.addEventListener('beforeunload', () => {
      if (rafId) cancelAnimationFrame(rafId);
    }, { once: true });
  }

  function initHeroParticles() {
    const canvas = document.getElementById('hero-particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.max(1, Math.min(1.5, window.devicePixelRatio || 1));
    let rafId = null;
    let lastRenderTs = 0;
    const lowPower = isLowPowerDevice();
    let active = !document.hidden;
    const particles = [];

    const palette = ['rgba(92, 225, 255, 0.75)', 'rgba(70, 165, 255, 0.68)', 'rgba(52, 216, 175, 0.72)'];

    const resize = () => {
      width = canvas.clientWidth || 800;
      height = canvas.clientHeight || 120;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = Math.round(Math.max(12, Math.min(lowPower ? 28 : 40, width / 30)));
      particles.length = 0;
      for (let i = 0; i < target; i += 1) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.12,
          r: 0.7 + Math.random() * 1.6,
          c: palette[Math.floor(Math.random() * palette.length)]
        });
      }
    };

    const step = (ts = performance.now()) => {
      if (!active) {
        rafId = requestAnimationFrame(step);
        return;
      }
      if (lowPower && ts - lastRenderTs < 33) {
        rafId = requestAnimationFrame(step);
        return;
      }
      lastRenderTs = ts;
      ctx.clearRect(0, 0, width, height);

      if (!state.reducedMotion) {
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < -8) p.x = width + 8;
          if (p.x > width + 8) p.x = -8;
          if (p.y < -8) p.y = height + 8;
          if (p.y > height + 8) p.y = -8;
        });
      }

      for (let i = 0; i < particles.length; i += 1) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j += 1) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = lowPower ? 78 : 92;
          if (dist > maxDist) continue;
          const alpha = (1 - dist / maxDist) * (lowPower ? 0.14 : 0.18);
          ctx.strokeStyle = `rgba(94, 194, 255, ${alpha.toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.fillStyle = p.c;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      rafId = requestAnimationFrame(step);
    };

    resize();
    step();
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', () => {
      active = !document.hidden;
    });
    window.addEventListener('beforeunload', () => {
      if (rafId) cancelAnimationFrame(rafId);
    }, { once: true });
  }

  function init() {
    document.documentElement.classList.add('reveal-ready');
    initButtons();
    initStickyHeader();
    initRevealObservers();
    initMarquees();
    initProofMarquee();
    initSparklesText();
    initHeroGlobe();
    initHeroParticles();
    initHowStepFlip();
    initScrollExpandMedia();
    initFooterWordmark();
    setScrollProgress();

    let resizeTimer = 0;
    window.addEventListener('resize', () => {
      if (resizeTimer) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        initMarquees();
        initProofMarquee();
        initSparklesText();
        setScrollProgress();
      }, 120);
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
