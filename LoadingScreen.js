import { gsap } from 'gsap';

const RING_CIRCUMFERENCE = 2 * Math.PI * 52; // matches r=52 in index.html

/**
 * Drives the loading screen. Because this project loads no external
 * textures or models (every asset is procedural Three.js geometry), the
 * "loading" progress represents scene construction and warm-up rather
 * than network fetches — but it is driven by real milestones passed in
 * by main.js, not a fake timer.
 */
export function createLoadingScreen() {
  const screen = document.getElementById('loading-screen');
  const ringFill = document.getElementById('loading-ring-fill');
  const percentLabel = document.getElementById('loading-percent');

  ringFill.style.strokeDasharray = String(RING_CIRCUMFERENCE);
  ringFill.style.strokeDashoffset = String(RING_CIRCUMFERENCE);

  let current = 0;
  const proxy = { value: 0 };

  function setProgress(target) {
    gsap.to(proxy, {
      value: target,
      duration: 0.5,
      ease: 'power2.out',
      onUpdate: () => {
        current = proxy.value;
        const offset = RING_CIRCUMFERENCE * (1 - current / 100);
        ringFill.style.strokeDashoffset = String(offset);
        percentLabel.textContent = `${Math.round(current)}%`;
      }
    });
  }

  function finish(onComplete) {
    setProgress(100);
    gsap.to(screen, {
      opacity: 0,
      duration: 0.9,
      delay: 0.45,
      ease: 'power2.out',
      onStart: () => screen.classList.add('hidden'),
      onComplete
    });
  }

  return { setProgress, finish };
}
