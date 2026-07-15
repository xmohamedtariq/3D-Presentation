# Remotely Operated Rescue Boat — FPV Water Rescue System

A cinematic, scroll-driven presentation for the graduation project
**"Design and Development of a Remotely Operated Rescue Boat with FPV
Camera System for Water Rescue Operations."**

Built with vanilla HTML5, CSS3, and ES6 JavaScript — **no frontend
framework** — using Three.js for the 3D scene and GSAP for every
animation. The entire boat is modeled procedurally out of Three.js
primitives, so the project has zero binary asset dependencies and runs
identically on any machine right after `npm install`.

## Running it locally in VS Code

```bash
npm install
npm run dev
```

Vite will start a dev server (default `http://localhost:5173`) and open
it automatically. Any edit to the `src/` files hot-reloads in the
browser.

To build a static, production-ready bundle:

```bash
npm run build
npm run preview   # serves the dist/ output locally to sanity-check it
```

## Using the presentation

| Action | How |
|---|---|
| Advance / go back | Scroll, mouse wheel, `↓` / `↑`, or the arrow buttons in the floating control bar |
| Jump to a section | Click a dot in the right-hand navigation rail |
| Assemble the boat | Section 08 — click **Assemble Boat** |
| Inspect a component | Click any glowing label on the boat, or any component button in Section 07/10–15 |
| Auto-advance the deck | Play icon in the control bar (advances every 7s) |
| Ambient audio | Speaker icon in the control bar (see *Audio* below) |
| Fullscreen | Expand icon in the control bar |
| Close an info card | `Esc`, the ✕ button, or click outside the card |

## Project structure

```
index.html                 Landing hero + all 18 presentation sections
src/
  style.css                 Full design system: tokens, layout, glassmorphism, HUD
  main.js                    Boot sequence + render loop; wires every module together
  scene.js                    Renderer, fog, animated water surface
  camera.js                   Camera presets, GSAP transitions, mouse parallax, orbit mode
  lighting.js                 Ambient / directional / spotlights / rescue-orange accent light
  animations.js                Landing intro timeline, scroll reveals, boat assembly timeline
  components/
    boatParts.js                Procedural geometry for all 9 boat subsystems
    infoData.js                 Copy + specs for each component's info card
    InfoCard.js                 Info card modal controller
    Labels.js                   3D → 2D projected component callouts
    Navigation.js                Dot rail, progress bar, wheel/keyboard paging, control bar
    LoadingScreen.js             Loading ring + percentage
    ParticleField.js             Ambient drifting particle field
    AudioManager.js              Optional ambient music / SFX with graceful fallback
    HUD.js                       Sonar-sweep signature navigation readout
  assets/
    models/   icons/   textures/   Reserved for future asset-based upgrades (see each README.txt)
public/
  audio/                        Drop ambient.mp3 / click.mp3 here to enable audio (optional)
package.json
vite.config.js
```

## Design language

The visual direction is a naval telemetry / FPV HUD aesthetic rather
than a generic dark-mode template: a near-black abyss base, signal-blue
as the operational accent (echoing the boat's own RF and camera
systems), and a rescue-orange accent reserved for safety-equipment
moments — the battery warning stripe, the assemble button, the ESC
heat-shrink. The signature element is the rotating sonar-sweep HUD in
the top-right corner, which doubles as the section progress readout.

Typefaces: **Space Grotesk** for display type, **Inter** for body copy,
and **JetBrains Mono** for telemetry-style data (specs, eyebrows, the
timer, the sonar readout).

## Notes on the 3D content

Every boat component — hull, deck, flight controller, ESCs, FPV camera,
RF receiver, rescue pump, battery, and twin thrusters — is built from
primitive Three.js geometry (boxes, capsules, cylinders, cones, tori)
rather than an imported model, so there is nothing to download or
license to get the assembly sequence working. `src/components/boatParts.js`
is intentionally the place to swap in real glTF models later if the
project moves from a concept presentation to production CAD assets.

## Browser support

Built and tested against current Chrome, Edge, Firefox, and Safari.
Requires WebGL2. Respects `prefers-reduced-motion`.
