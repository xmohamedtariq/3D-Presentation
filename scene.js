import * as THREE from 'three';

/**
 * Creates the renderer, scene graph root, and the animated water surface
 * that sits beneath the boat for the entire presentation.
 *
 * @param {HTMLCanvasElement} canvas
 */
export function createScene(canvas) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x05070b);
  scene.fog = new THREE.FogExp2(0x05070b, 0.045);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  // ---- Animated water plane -------------------------------------------------
  const waterGeometry = new THREE.PlaneGeometry(120, 120, 140, 140);
  waterGeometry.rotateX(-Math.PI / 2);

  const basePositions = waterGeometry.attributes.position.array.slice();

  const waterMaterial = new THREE.MeshStandardMaterial({
    color: 0x08213b,
    metalness: 0.65,
    roughness: 0.28,
    emissive: 0x03101f,
    emissiveIntensity: 0.4
  });

  const water = new THREE.Mesh(waterGeometry, waterMaterial);
  water.receiveShadow = true;
  water.position.y = -0.65;
  scene.add(water);

  // A faint secondary grid plane just under the water surface reinforces
  // the "telemetry / sonar depth chart" reading of the scene.
  const grid = new THREE.GridHelper(120, 60, 0x2fa7ff, 0x0c2036);
  grid.position.y = -0.64;
  grid.material.transparent = true;
  grid.material.opacity = 0.12;
  scene.add(grid);

  function updateWater(elapsed) {
    const pos = waterGeometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const ix = i * 3;
      const x = basePositions[ix];
      const z = basePositions[ix + 2];
      const y =
        Math.sin(x * 0.35 + elapsed * 0.9) * 0.09 +
        Math.cos(z * 0.28 + elapsed * 0.7) * 0.09 +
        Math.sin((x + z) * 0.15 + elapsed * 0.4) * 0.06;
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
    waterGeometry.computeVertexNormals();
  }

  function onResize() {
    const { innerWidth, innerHeight } = window;
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
  window.addEventListener('resize', onResize);

  return { scene, renderer, updateWater, water };
}
