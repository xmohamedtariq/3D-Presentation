import * as THREE from 'three';
import { gsap } from 'gsap';

/**
 * Named camera presets used throughout the presentation. Every section
 * declares a `data-camera` attribute in index.html that maps to one of
 * these keys, so scrolling through the deck reads as a single continuous
 * cinematic camera move rather than independent shots.
 */
const PRESETS = {
  landing: {
    position: new THREE.Vector3(0, 1.6, 7.5),
    target: new THREE.Vector3(0, 0.2, 0)
  },
  'orbit-wide': {
    position: new THREE.Vector3(3.6, 2.4, 5.4),
    target: new THREE.Vector3(0, 0.1, 0)
  },
  'orbit-close': {
    position: new THREE.Vector3(1.8, 1.1, 2.6),
    target: new THREE.Vector3(0, 0.05, 0)
  },
  assembly: {
    position: new THREE.Vector3(0, 2.6, 4.4),
    target: new THREE.Vector3(0, 0, 0)
  }
};

export function createCameraRig() {
  const camera = new THREE.PerspectiveCamera(
    42,
    window.innerWidth / window.innerHeight,
    0.1,
    200
  );

  const basePosition = PRESETS.landing.position.clone();
  const target = PRESETS.landing.target.clone();
  camera.position.copy(basePosition);
  camera.lookAt(target);

  // Mouse parallax offset — small, layered on top of whatever the base
  // camera position currently is, never fights the GSAP-driven moves.
  const mouse = { x: 0, y: 0 };
  const parallax = new THREE.Vector3();

  window.addEventListener('pointermove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
  });

  let orbitAngle = null; // when set, camera auto-orbits the boat
  let orbitRadius = 4.2;
  let orbitHeight = 1.8;
  let orbiting = false;

  function moveTo(presetName, { duration = 2.2, ease = 'power3.inOut', onComplete } = {}) {
    const preset = PRESETS[presetName] || PRESETS['orbit-wide'];
    orbiting = false;
    gsap.killTweensOf(basePosition);
    gsap.killTweensOf(target);
    gsap.to(basePosition, {
      x: preset.position.x,
      y: preset.position.y,
      z: preset.position.z,
      duration,
      ease,
      onComplete
    });
    gsap.to(target, {
      x: preset.target.x,
      y: preset.target.y,
      z: preset.target.z,
      duration,
      ease
    });
  }

  function startOrbit(radius = 4.2, height = 1.8, speed = 0.12) {
    orbiting = true;
    orbitRadius = radius;
    orbitHeight = height;
    orbitAngle = orbitAngle ?? 0;
    startOrbit.speed = speed;
  }
  startOrbit.speed = 0.12;

  function stopOrbit() {
    orbiting = false;
  }

  function update(elapsed, delta) {
    if (orbiting) {
      orbitAngle += delta * startOrbit.speed;
      basePosition.x = Math.sin(orbitAngle) * orbitRadius;
      basePosition.z = Math.cos(orbitAngle) * orbitRadius;
      basePosition.y = orbitHeight;
    }

    // Smoothly ease the parallax offset toward the current mouse position.
    parallax.x += (mouse.x * 0.35 - parallax.x) * 0.04;
    parallax.y += (-mouse.y * 0.2 - parallax.y) * 0.04;

    camera.position.set(
      basePosition.x + parallax.x,
      basePosition.y + parallax.y,
      basePosition.z
    );
    camera.lookAt(target);
  }

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', onResize);

  return { camera, moveTo, startOrbit, stopOrbit, update, target, basePosition };
}
