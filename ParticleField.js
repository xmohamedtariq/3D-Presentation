import * as THREE from 'three';

/**
 * A soft field of drifting particles (fine sea spray / bubbles) that give
 * the background depth and a sense of motion without competing for
 * attention with the boat itself.
 */
export function createParticleField(scene, count = 260) {
  const positions = new Float32Array(count * 3);
  const speeds = new Float32Array(count);
  const drifts = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 1] = Math.random() * 12 - 3;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
    speeds[i] = 0.05 + Math.random() * 0.12;
    drifts[i] = Math.random() * Math.PI * 2;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0x8fbcff,
    size: 0.028,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  function update(elapsed, delta) {
    const pos = geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      let y = pos.getY(i) + speeds[i] * delta;
      if (y > 9) y = -3;
      const x = pos.getX(i) + Math.sin(elapsed * 0.3 + drifts[i]) * 0.0025;
      pos.setY(i, y);
      pos.setX(i, x);
    }
    pos.needsUpdate = true;
  }

  return { points, update };
}
