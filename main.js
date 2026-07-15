import * as THREE from 'three';
import { gsap } from 'gsap';

import { createScene } from './scene.js';
import { createCameraRig } from './camera.js';
import { createLighting } from './lighting.js';
import { assembleBoat, initSlideReveals, playLandingIntro } from './animations.js';

import { createBoatParts } from './components/boatParts.js';
import { createLabels } from './components/Labels.js';
import { createInfoCard } from './components/InfoCard.js';
import { createNavigation } from './components/Navigation.js';
import { createLoadingScreen } from './components/LoadingScreen.js';
import { createParticleField } from './components/ParticleField.js';
import { createAudioManager } from './components/AudioManager.js';
import { createHUD } from './components/HUD.js';

const loading = createLoadingScreen();
loading.setProgress(8);

// ---------------------------------------------------------------------------
// 1. Scene, camera, lighting
// ---------------------------------------------------------------------------
const canvas = document.getElementById('scene-canvas');
const { scene, renderer, updateWater } = createScene(canvas);
loading.setProgress(28);

const cameraRig = createCameraRig();
loading.setProgress(42);

const lighting = createLighting(scene);
loading.setProgress(58);

// ---------------------------------------------------------------------------
// 2. Boat components (built, added to scene, hidden until assembly)
// ---------------------------------------------------------------------------
const { rootGroup, parts } = createBoatParts();
rootGroup.position.y = 0.02;
parts.forEach((p) => p.object.scale.setScalar(0)); // hidden until assembled
scene.add(rootGroup);
loading.setProgress(74);

const particleField = createParticleField(scene);
loading.setProgress(86);

// ---------------------------------------------------------------------------
// 3. UI layers
// ---------------------------------------------------------------------------
const infoCard = createInfoCard();
const labels = createLabels(parts, cameraRig.camera, rootGroup);
const audioManager = createAudioManager();
const totalSections = document.querySelectorAll('.slide').length;
const hud = createHUD(totalSections);

let assembled = false;
let assembling = false;

function revealBoatInstant() {
  parts.forEach((part) => {
    part.object.position.copy(part.target.position);
    part.object.rotation.copy(part.target.rotation);
    part.object.scale.setScalar(1);
  });
  assembled = true;
  cameraRig.startOrbit(4.4, 1.9, 0.09);
  labels.show();
}

function runAssemblySequence() {
  if (assembling || assembled) return;
  assembling = true;
  const label = document.getElementById('assemble-btn-label');
  if (label) label.textContent = 'Assembling…';

  assembleBoat(parts, {
    onComplete: () => {
      assembling = false;
      assembled = true;
      if (label) label.textContent = 'Assembled ✓';
      cameraRig.startOrbit(4.4, 1.9, 0.09);
      labels.show();
    }
  });
}

document.getElementById('btn-assemble').addEventListener('click', runAssemblySequence);

// ---------------------------------------------------------------------------
// 4. Navigation — drives camera + HUD + assembly fallback per section
// ---------------------------------------------------------------------------
const navigation = createNavigation({
  audioManager,
  onNavigate(stop) {
    hud.setActive(stop.index);

    // Reaching the assembly section or anything beyond it should guarantee
    // a boat exists — if the visitor jumped here directly via the dot
    // rail or keyboard, snap-assemble instantly instead of leaving an
    // empty ocean behind an "Assemble" button that was never clicked.
    if (stop.index >= 9 && !assembled && !assembling) {
      revealBoatInstant();
    }

    if (!assembled) {
      cameraRig.moveTo(stop.camera, { duration: 2.0 });
    }
  }
});

initSlideReveals();

// ---------------------------------------------------------------------------
// 5. Boot sequence — finish loading, play landing intro, reveal chrome
// ---------------------------------------------------------------------------
loading.setProgress(100);
loading.finish(() => {
  playLandingIntro();
  navigation.reveal();
  hud.show();
});

// ---------------------------------------------------------------------------
// 6. Render loop
// ---------------------------------------------------------------------------
const clock = new THREE.Clock();

function tick() {
  const delta = Math.min(clock.getDelta(), 0.05);
  const elapsed = clock.getElapsedTime();

  updateWater(elapsed);
  lighting.update(elapsed);
  particleField.update(elapsed, delta);
  cameraRig.update(elapsed, delta);

  renderer.render(scene, cameraRig.camera);
  labels.update();

  requestAnimationFrame(tick);
}
tick();
