const NS = 'http://www.w3.org/2000/svg';

/**
 * The sonar HUD is this presentation's signature visual element: a
 * radar-style sweep with one blip per section, echoing both the boat's
 * own sonar/RF systems and an FPV telemetry overlay. This module injects
 * the gradient definition once and renders the blips based on the
 * section count discovered in the DOM.
 */
export function createHUD(totalSections) {
  const hud = document.getElementById('sonar-hud');
  const svg = document.getElementById('sonar-svg');
  const blipsGroup = document.getElementById('sonar-blips');
  const readoutValue = document.getElementById('sonar-readout-value');

  // Inject the radial gradient used by the sweep wedge.
  const defs = document.createElementNS(NS, 'defs');
  defs.innerHTML = `
    <radialGradient id="sonar-gradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(100 100) scale(96)">
      <stop offset="0%" stop-color="#2FA7FF" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#2FA7FF" stop-opacity="0" />
    </radialGradient>
  `;
  svg.insertBefore(defs, svg.firstChild);

  const blips = [];
  for (let i = 0; i < totalSections; i++) {
    const angle = (i / totalSections) * Math.PI * 2 - Math.PI / 2;
    const r = 70;
    const cx = 100 + Math.cos(angle) * r;
    const cy = 100 + Math.sin(angle) * r;
    const circle = document.createElementNS(NS, 'circle');
    circle.setAttribute('cx', cx.toFixed(2));
    circle.setAttribute('cy', cy.toFixed(2));
    circle.setAttribute('r', '2.6');
    circle.setAttribute('class', 'sonar-blip');
    blipsGroup.appendChild(circle);
    blips.push(circle);
  }

  function show() {
    hud.classList.add('visible');
  }

  function setActive(index) {
    // index is 1-based section number, 0 = landing/none active
    blips.forEach((b, i) => {
      b.classList.toggle('active', i === index - 1);
    });
    readoutValue.textContent = String(index).padStart(2, '0');
  }

  return { show, setActive };
}
