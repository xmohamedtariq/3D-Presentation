import * as THREE from 'three';

/**
 * Builds every boat subsystem as an independent THREE.Group so it can be
 * animated into place during the assembly sequence, then clicked
 * individually to open its info card. No external models are loaded —
 * everything here is composed from primitive geometry, which keeps the
 * project dependency-free and guarantees it renders identically for
 * everyone who clones the repo.
 *
 * Each returned part has:
 *   id        — matches the data-component id used in index.html
 *   name      — display name
 *   object    — THREE.Group to add to the scene
 *   target    — { position, rotation } final assembled transform
 *   start     — { position, rotation } randomized "fly-in" origin
 *   glowMats  — materials to pulse during the snap-into-place beat
 */

const NAVY = 0x0b1626;
const NAVY_LIGHT = 0x18283f;
const HULL_COLOR = 0x0e2038;
const DECK_COLOR = 0xc7d8ea;
const BLUE_GLOW = 0x2fa7ff;
const ORANGE_GLOW = 0xff5a1f;
const DARK_METAL = 0x232b36;

function standardMat(color, opts = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    metalness: opts.metalness ?? 0.4,
    roughness: opts.roughness ?? 0.5,
    emissive: opts.emissive ?? 0x000000,
    emissiveIntensity: opts.emissiveIntensity ?? 0
  });
}

function randomStart(spread = 5) {
  return {
    position: new THREE.Vector3(
      (Math.random() - 0.5) * spread * 2,
      3.5 + Math.random() * 3,
      (Math.random() - 0.5) * spread * 2
    ),
    rotation: new THREE.Euler(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    )
  };
}

export function createBoatParts() {
  const parts = [];

  // ---- HULL: twin-pontoon catamaran base -----------------------------------
  {
    const group = new THREE.Group();
    const mat = standardMat(HULL_COLOR, { metalness: 0.55, roughness: 0.35 });
    const pontoonGeo = new THREE.CapsuleGeometry(0.1, 1.05, 6, 12);
    [-0.19, 0.19].forEach((x) => {
      const pontoon = new THREE.Mesh(pontoonGeo, mat);
      pontoon.rotation.x = Math.PI / 2;
      pontoon.position.set(x, 0, 0);
      pontoon.castShadow = true;
      pontoon.receiveShadow = true;
      group.add(pontoon);
    });
    // connecting keel bridge
    const bridge = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.05, 0.7),
      mat
    );
    bridge.position.set(0, 0.02, 0);
    bridge.castShadow = true;
    group.add(bridge);

    parts.push({
      id: 'hull',
      name: 'Hull & Pontoons',
      object: group,
      target: { position: new THREE.Vector3(0, 0, 0), rotation: new THREE.Euler(0, 0, 0) },
      start: randomStart(6),
      glowMats: [mat]
    });
  }

  // ---- DECK: sealed electronics deck plate ---------------------------------
  {
    const mat = standardMat(DECK_COLOR, { metalness: 0.2, roughness: 0.35 });
    const geo = new THREE.BoxGeometry(0.34, 0.035, 0.85);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    parts.push({
      id: 'deck',
      name: 'Electronics Deck',
      object: mesh,
      target: { position: new THREE.Vector3(0, 0.11, 0), rotation: new THREE.Euler(0, 0, 0) },
      start: randomStart(6),
      glowMats: [mat]
    });
  }

  // ---- FLIGHT CONTROLLER ----------------------------------------------------
  {
    const group = new THREE.Group();
    const bodyMat = standardMat(DARK_METAL, { metalness: 0.6, roughness: 0.3 });
    const ledMat = standardMat(BLUE_GLOW, { emissive: BLUE_GLOW, emissiveIntensity: 1.4, roughness: 0.2 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.03, 0.09), bodyMat);
    const led = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.01, 12), ledMat);
    led.rotation.x = Math.PI / 2;
    led.position.set(0, 0.02, 0);
    body.castShadow = true;
    group.add(body, led);

    parts.push({
      id: 'controller',
      name: 'Flight Controller',
      object: group,
      target: { position: new THREE.Vector3(-0.08, 0.15, 0.12), rotation: new THREE.Euler(0, 0, 0) },
      start: randomStart(5),
      glowMats: [ledMat]
    });
  }

  // ---- ESC PAIR ---------------------------------------------------------
  {
    const group = new THREE.Group();
    const mat = standardMat(ORANGE_GLOW, { emissive: ORANGE_GLOW, emissiveIntensity: 0.5, metalness: 0.3, roughness: 0.4 });
    [-0.17, 0.17].forEach((x) => {
      const esc = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.025, 0.09), mat);
      esc.position.set(x, 0, 0.2);
      esc.castShadow = true;
      group.add(esc);
    });

    parts.push({
      id: 'esc',
      name: 'ESC & Wiring',
      object: group,
      target: { position: new THREE.Vector3(0, 0.14, 0.25), rotation: new THREE.Euler(0, 0, 0) },
      start: randomStart(5),
      glowMats: [mat]
    });
  }

  // ---- FPV CAMERA ------------------------------------------------------
  {
    const group = new THREE.Group();
    const housingMat = standardMat(NAVY_LIGHT, { metalness: 0.6, roughness: 0.25 });
    const lensMat = new THREE.MeshPhysicalMaterial({
      color: 0x0a1a2e,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.85,
      thickness: 0.02,
      emissive: BLUE_GLOW,
      emissiveIntensity: 0.6
    });
    const housing = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), housingMat);
    const lens = new THREE.Mesh(new THREE.SphereGeometry(0.028, 16, 16), lensMat);
    lens.position.set(0, 0, 0.045);
    housing.castShadow = true;
    group.add(housing, lens);

    parts.push({
      id: 'fpv',
      name: 'FPV Camera',
      object: group,
      target: { position: new THREE.Vector3(0, 0.2, -0.62), rotation: new THREE.Euler(0, 0, 0) },
      start: randomStart(5),
      glowMats: [lensMat]
    });
  }

  // ---- RF RECEIVER + ANTENNA --------------------------------------------
  {
    const group = new THREE.Group();
    const bodyMat = standardMat(DARK_METAL, { metalness: 0.6, roughness: 0.3 });
    const whipMat = standardMat(BLUE_GLOW, { emissive: BLUE_GLOW, emissiveIntensity: 1.1, roughness: 0.2 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.02, 0.05), bodyMat);
    const whip = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.32, 8), whipMat);
    whip.position.set(0, 0.17, 0);
    body.castShadow = true;
    group.add(body, whip);

    parts.push({
      id: 'antenna',
      name: 'RF Receiver',
      object: group,
      target: { position: new THREE.Vector3(0.1, 0.16, 0.58), rotation: new THREE.Euler(0, 0, 0.12) },
      start: randomStart(5),
      glowMats: [whipMat]
    });
  }

  // ---- RESCUE PUMP -------------------------------------------------------
  {
    const mat = standardMat(NAVY_LIGHT, { metalness: 0.55, roughness: 0.35 });
    const geo = new THREE.CylinderGeometry(0.045, 0.045, 0.11, 16);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;

    parts.push({
      id: 'pump',
      name: 'Rescue Pump',
      object: mesh,
      target: { position: new THREE.Vector3(-0.12, 0.02, 0.5), rotation: new THREE.Euler(0, 0, Math.PI / 2) },
      start: randomStart(5),
      glowMats: [mat]
    });
  }

  // ---- BATTERY -------------------------------------------------------------
  {
    const group = new THREE.Group();
    const caseMat = standardMat(0x141b26, { metalness: 0.3, roughness: 0.55 });
    const stripeMat = standardMat(ORANGE_GLOW, { emissive: ORANGE_GLOW, emissiveIntensity: 0.9, roughness: 0.3 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.05, 0.24), caseMat);
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.145, 0.012, 0.06), stripeMat);
    stripe.position.set(0, 0.026, 0);
    body.castShadow = true;
    group.add(body, stripe);

    parts.push({
      id: 'battery',
      name: 'LiPo Battery',
      object: group,
      target: { position: new THREE.Vector3(0, 0.16, -0.05), rotation: new THREE.Euler(0, 0, 0) },
      start: randomStart(5),
      glowMats: [stripeMat]
    });
  }

  // ---- TWIN PROPULSION THRUSTERS -------------------------------------------
  {
    const group = new THREE.Group();
    const bodyMat = standardMat(DARK_METAL, { metalness: 0.7, roughness: 0.25 });
    const ringMat = standardMat(BLUE_GLOW, { emissive: BLUE_GLOW, emissiveIntensity: 1.2, roughness: 0.2, metalness: 0.1 });

    [-0.19, 0.19].forEach((x) => {
      const thruster = new THREE.Group();
      const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.09, 16), bodyMat);
      motor.rotation.x = Math.PI / 2;
      const guard = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.006, 8, 24), ringMat);
      guard.position.set(0, 0, 0.02);
      const propHub = new THREE.Mesh(new THREE.ConeGeometry(0.012, 0.03, 8), bodyMat);
      propHub.rotation.x = Math.PI / 2;
      propHub.position.set(0, 0, 0.04);
      motor.castShadow = true;
      thruster.add(motor, guard, propHub);
      thruster.position.set(x, -0.02, 0.62);
      group.add(thruster);
    });

    parts.push({
      id: 'thrusters',
      name: 'Propulsion Thrusters',
      object: group,
      target: { position: new THREE.Vector3(0, 0, 0), rotation: new THREE.Euler(0, 0, 0) },
      start: randomStart(6),
      glowMats: [ringMat]
    });
  }

  const rootGroup = new THREE.Group();
  rootGroup.name = 'boat-root';
  parts.forEach((p) => rootGroup.add(p.object));

  return { rootGroup, parts };
}
