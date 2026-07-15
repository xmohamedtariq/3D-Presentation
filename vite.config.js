import { defineConfig } from 'vite';

// Vite configuration for the Rescue Boat FPV presentation.
// Kept intentionally minimal: this is a static, dependency-light
// Three.js + GSAP build with no framework and no server-side code.
export default defineConfig({
  root: '.',
  publicDir: 'public',
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    target: 'es2020'
  }
});
