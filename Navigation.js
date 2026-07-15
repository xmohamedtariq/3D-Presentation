import { gsap } from 'gsap';

/**
 * Owns all page-to-page navigation: the side dot rail, the top progress
 * bar, mouse-wheel / keyboard paging, the floating control bar (prev,
 * next, timer, autoplay, audio, fullscreen), and broadcasts a single
 * `onNavigate(stop)` callback that main.js uses to drive the camera and
 * the sonar HUD.
 */
export function createNavigation({ onNavigate, audioManager }) {
  const landing = document.getElementById('landing');
  const slideEls = Array.from(document.querySelectorAll('.slide'));
  const sideNav = document.getElementById('side-nav');
  const controlBar = document.getElementById('control-bar');
  const progressFill = document.getElementById('progress-fill');
  const timerEl = document.getElementById('presentation-timer');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnAutoplay = document.getElementById('btn-autoplay');
  const btnAudio = document.getElementById('btn-audio');
  const btnFullscreen = document.getElementById('btn-fullscreen');
  const startBtn = document.getElementById('start-btn');

  // stops[0] is the landing hero; stops[1..18] are the numbered sections.
  const stops = [{ el: landing, title: 'Start', camera: 'landing', index: 0 }].concat(
    slideEls.map((el) => ({
      el,
      title: el.dataset.title,
      camera: el.dataset.camera || 'orbit-wide',
      index: Number(el.dataset.index)
    }))
  );

  let current = 0;
  let locked = false;
  let autoplay = false;
  let autoplayTimer = null;
  let started = false;
  let elapsedSeconds = 0;
  let timerInterval = null;

  // ---- side dot rail --------------------------------------------------------
  stops.slice(1).forEach((stop, i) => {
    const dot = document.createElement('button');
    dot.className = 'nav-dot';
    dot.dataset.label = `${String(stop.index).padStart(2, '0')} — ${stop.title}`;
    dot.setAttribute('aria-label', `Go to ${stop.title}`);
    dot.addEventListener('click', () => goTo(i + 1));
    sideNav.appendChild(dot);
  });
  const dots = Array.from(sideNav.children);

  function updateDots() {
    dots.forEach((d, i) => d.classList.toggle('active', i === current - 1));
  }

  function updateProgress() {
    const pct = (current / (stops.length - 1)) * 100;
    progressFill.style.width = `${Math.max(0, pct)}%`;
  }

  // ---- core paging ------------------------------------------------------

  function goTo(index, { silent = false } = {}) {
    index = Math.max(0, Math.min(stops.length - 1, index));
    if (locked) return;
    locked = true;
    current = index;

    const target = stops[index].el;
    const targetY = target.getBoundingClientRect().top + window.scrollY;

    gsap.to(document.scrollingElement || document.documentElement, {
      scrollTop: targetY,
      duration: 1.35,
      ease: 'power3.inOut',
      onComplete: () => {
        locked = false;
      }
    });

    updateDots();
    updateProgress();

    if (!silent && onNavigate) onNavigate(stops[index]);

    if (index > 0 && !started) startTimer();
  }

  function next() {
    if (current < stops.length - 1) goTo(current + 1);
  }
  function prev() {
    if (current > 0) goTo(current - 1);
  }

  // ---- wheel navigation (debounced, one section per gesture) ------------
  let wheelCooldown = false;
  window.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      if (wheelCooldown || locked) return;
      if (Math.abs(e.deltaY) < 12) return;
      wheelCooldown = true;
      if (e.deltaY > 0) next();
      else prev();
      setTimeout(() => {
        wheelCooldown = false;
      }, 900);
    },
    { passive: false }
  );

  // ---- keyboard navigation ------------------------------------------------
  window.addEventListener('keydown', (e) => {
    if (['ArrowDown', 'PageDown'].includes(e.key)) {
      e.preventDefault();
      next();
    } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
      e.preventDefault();
      prev();
    }
  });

  btnPrev.addEventListener('click', prev);
  btnNext.addEventListener('click', next);

  // ---- fallback: keep dots/progress honest during free trackpad scroll ---
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.55 && !locked) {
          const idx = stops.findIndex((s) => s.el === entry.target);
          if (idx !== -1 && idx !== current) {
            current = idx;
            updateDots();
            updateProgress();
            if (onNavigate) onNavigate(stops[idx]);
          }
        }
      });
    },
    { threshold: [0.55] }
  );
  stops.forEach((s) => io.observe(s.el));

  // ---- start button ---------------------------------------------------------
  startBtn.addEventListener('click', () => goTo(1));

  // ---- timer -----------------------------------------------------------
  function startTimer() {
    started = true;
    timerInterval = setInterval(() => {
      elapsedSeconds += 1;
      const m = String(Math.floor(elapsedSeconds / 60)).padStart(2, '0');
      const s = String(elapsedSeconds % 60).padStart(2, '0');
      timerEl.textContent = `${m}:${s}`;
    }, 1000);
  }

  // ---- autoplay ----------------------------------------------------------
  function scheduleAutoplay() {
    clearTimeout(autoplayTimer);
    if (!autoplay) return;
    autoplayTimer = setTimeout(() => {
      if (current >= stops.length - 1) goTo(0);
      else next();
      scheduleAutoplay();
    }, 7000);
  }

  btnAutoplay.addEventListener('click', () => {
    autoplay = !autoplay;
    btnAutoplay.classList.toggle('active', autoplay);
    if (autoplay) scheduleAutoplay();
    else clearTimeout(autoplayTimer);
  });

  // ---- audio ---------------------------------------------------------------
  btnAudio.addEventListener('click', () => {
    const nowPlaying = audioManager.toggle();
    btnAudio.classList.toggle('active', nowPlaying);
  });

  // ---- fullscreen ------------------------------------------------------
  btnFullscreen.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
      btnFullscreen.classList.add('active');
    } else {
      document.exitFullscreen?.();
      btnFullscreen.classList.remove('active');
    }
  });

  function reveal() {
    sideNav.classList.add('visible');
    controlBar.classList.add('visible');
  }

  return { goTo, next, prev, reveal, stops, get current() { return current; } };
}
