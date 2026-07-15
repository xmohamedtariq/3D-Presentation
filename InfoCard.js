import { componentInfo } from './infoData.js';

/**
 * Wires up the modal info card that appears when a component label or
 * component-tag button is clicked. Content comes from infoData.js;
 * this module only owns DOM state (open/close/populate).
 */
export function createInfoCard() {
  const overlay = document.getElementById('info-card-overlay');
  const card = document.getElementById('info-card');
  const closeBtn = document.getElementById('info-card-close');
  const eyebrowEl = document.getElementById('info-card-eyebrow');
  const titleEl = document.getElementById('info-card-title');
  const descEl = document.getElementById('info-card-desc');
  const specsEl = document.getElementById('info-card-specs');

  function open(componentId) {
    const data = componentInfo[componentId];
    if (!data) return;

    eyebrowEl.textContent = data.eyebrow;
    titleEl.textContent = data.title;
    descEl.textContent = data.desc;
    specsEl.innerHTML = '';

    data.specs.forEach(([label, value]) => {
      const row = document.createElement('div');
      row.className = 'info-card-spec-row';
      const l = document.createElement('span');
      l.textContent = label;
      const v = document.createElement('span');
      v.textContent = value;
      row.append(l, v);
      specsEl.appendChild(row);
    });

    overlay.classList.add('visible');
    overlay.setAttribute('aria-hidden', 'false');
  }

  function close() {
    overlay.classList.remove('visible');
    overlay.setAttribute('aria-hidden', 'true');
  }

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('visible')) close();
  });
  card.addEventListener('click', (e) => e.stopPropagation());

  // Any element in the document tagged with data-component opens the card.
  document.querySelectorAll('[data-component]').forEach((el) => {
    el.addEventListener('click', () => open(el.dataset.component));
  });

  return { open, close };
}
