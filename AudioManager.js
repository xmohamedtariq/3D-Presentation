/**
 * Optional audio layer. The presentation ships without bundled audio
 * files (no royalty-free asset was included in this repo), so this
 * manager is written to degrade gracefully: if /audio/ambient.mp3 or
 * /audio/click.mp3 are missing, the toggle button simply stays inert
 * instead of throwing — drop matching files into /public/audio/ to
 * activate it, no code changes required.
 */
export function createAudioManager() {
  const ambient = new Audio('/audio/ambient.mp3');
  ambient.loop = true;
  ambient.volume = 0.35;
  ambient.preload = 'none';

  const click = new Audio('/audio/click.mp3');
  click.volume = 0.4;

  let available = true;
  let playing = false;

  ambient.addEventListener('error', () => {
    available = false;
  });

  function toggle() {
    if (!available) return false;
    if (playing) {
      ambient.pause();
      playing = false;
      return false;
    }
    const p = ambient.play();
    if (p && typeof p.catch === 'function') {
      p.then(() => {
        playing = true;
      }).catch(() => {
        // Autoplay blocked or file missing — fail silently, UI stays inert.
        available = false;
      });
    } else {
      playing = true;
    }
    return playing;
  }

  function playClick() {
    if (!available) return;
    try {
      const node = click.cloneNode();
      node.volume = 0.4;
      const p = node.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    } catch {
      /* no-op — sound effects are a nice-to-have, never fatal */
    }
  }

  function isPlaying() {
    return playing;
  }

  return { toggle, playClick, isPlaying };
}
