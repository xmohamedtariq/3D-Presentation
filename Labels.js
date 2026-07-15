import * as THREE from 'three';
import { gsap } from 'gsap';

/**
 * Renders one floating HTML callout per boat component, each one a small
 * glass pill with a glowing dot that acts as the "arrow tip" pointing at
 * its component in 3D space. Positions are recomputed every frame by
 * projecting the part's world position through the active camera, so the
 * labels track the boat through the orbit and through window resizes.
 */
export function createLabels(parts, camera, rootGroup) {
  const layer = document.getElementById('label-layer');
  const entries = [];

  parts.forEach((part) => {
    const el = document.createElement('div');
    el.className = 'part-label';
    el.innerHTML = `<span class="dot"></span><span>${part.name}</span>`;
    el.dataset.component = part.id;
    layer.appendChild(el);
    entries.push({ part, el });
  });

  // Reuse the existing info-card click wiring by dispatching through the
  // same data-component attribute convention used elsewhere in the DOM.
  entries.forEach(({ el }) => {
    el.addEventListener('click', () => {
      el.dispatchEvent(new Event('click', { bubbles: true }));
    });
  });

  const worldPos = new THREE.Vector3();
  let visible = false;

  function show() {
    visible = true;
    entries.forEach(({ el }, i) => {
      gsap.to(el, { opacity: 1, duration: 0.6, delay: i * 0.06, ease: 'power2.out' });
    });
  }

  function hide() {
    visible = false;
    entries.forEach(({ el }) => gsap.to(el, { opacity: 0, duration: 0.3 }));
  }

  function update() {
    if (!visible) return;
    entries.forEach(({ part, el }) => {
      worldPos.setFromMatrixPosition(part.object.matrixWorld);
      const projected = worldPos.clone().project(camera);

      const behindCamera = projected.z > 1;
      const x = (projected.x * 0.5 + 0.5) * window.innerWidth;
      const y = (-projected.y * 0.5 + 0.5) * window.innerHeight;

      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.display = behindCamera ? 'none' : 'flex';
    });
  }

  return { show, hide, update };
}
