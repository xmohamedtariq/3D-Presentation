import * as THREE from 'three';

/**
 * Builds the full lighting rig for the scene.
 *
 * The brief is intentionally cinematic: a low ambient fill so nothing is
 * ever pure black, a directional "sun" for soft shadow definition, two
 * blue rim/spot lights that give the hull its HDR-studio glow, and a
 * single warm rescue-orange accent light that keeps the palette from
 * reading as monochrome blue.
 *
 * @param {THREE.Scene} scene
 * @returns {{ update: (elapsed:number)=>void, lights: Record<string, THREE.Light> }}
 */
export function createLighting(scene) {
  const lights = {};

  // Soft ambient fill — keeps shadows from crushing to black.
  lights.ambient = new THREE.AmbientLight(0x2a3a55, 0.55);
  scene.add(lights.ambient);

  // Hemisphere light for a subtle sky/water colour split.
  lights.hemi = new THREE.HemisphereLight(0x3a6fae, 0x03060b, 0.6);
  scene.add(lights.hemi);

  // Directional "sun" — the primary shadow-casting light.
  lights.sun = new THREE.DirectionalLight(0xdfeeff, 1.4);
  lights.sun.position.set(6, 9, 4);
  lights.sun.castShadow = true;
  lights.sun.shadow.mapSize.set(2048, 2048);
  lights.sun.shadow.camera.near = 1;
  lights.sun.shadow.camera.far = 30;
  lights.sun.shadow.camera.left = -8;
  lights.sun.shadow.camera.right = 8;
  lights.sun.shadow.camera.top = 8;
  lights.sun.shadow.camera.bottom = -8;
  lights.sun.shadow.radius = 6;
  lights.sun.shadow.bias = -0.0015;
  scene.add(lights.sun);
  scene.add(lights.sun.target);

  // Blue key spotlight from camera-left, cinematic and tight.
  lights.spotBlueKey = new THREE.SpotLight(0x2fa7ff, 40, 24, Math.PI / 7, 0.5, 1.4);
  lights.spotBlueKey.position.set(-5, 6, 5);
  lights.spotBlueKey.castShadow = true;
  lights.spotBlueKey.shadow.mapSize.set(1024, 1024);
  lights.spotBlueKey.shadow.bias = -0.002;
  scene.add(lights.spotBlueKey);
  scene.add(lights.spotBlueKey.target);

  // Blue rim spotlight from behind, separates the hull from the background.
  lights.spotBlueRim = new THREE.SpotLight(0x6fc3ff, 30, 26, Math.PI / 6, 0.6, 1.6);
  lights.spotBlueRim.position.set(4, 5, -6);
  scene.add(lights.spotBlueRim);
  scene.add(lights.spotBlueRim.target);

  // Rescue-orange accent — a single warm point light for palette contrast.
  lights.accentOrange = new THREE.PointLight(0xff5a1f, 6, 10, 2);
  lights.accentOrange.position.set(1.4, 0.6, 1.2);
  scene.add(lights.accentOrange);

  function update(elapsed) {
    // Gentle breathing motion on the accent light keeps the scene alive
    // without distracting from the boat itself.
    lights.accentOrange.intensity = 5 + Math.sin(elapsed * 1.4) * 1.4;
    lights.spotBlueKey.intensity = 38 + Math.sin(elapsed * 0.6) * 4;
  }

  return { update, lights };
}
