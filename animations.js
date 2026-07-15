import { gsap } from 'gsap';

/**
 * Plays the landing hero's entrance choreography once the loading screen
 * has finished. Kept as a single timeline so every element commits to
 * the same easing language — this is the first thing a viewer sees, so
 * it has to feel deliberate.
 */
export function playLandingIntro() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.set('.landing-title .line', { yPercent: 130, opacity: 0 })
    .set(['.landing-eyebrow', '.landing-subtitle', '.start-btn', '.landing-scroll-hint'], { opacity: 0, y: 18 })
    .to('.landing-eyebrow', { opacity: 1, y: 0, duration: 0.8 }, 0.1)
    .to('.landing-title .line', { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.12 }, 0.25)
    .to('.landing-subtitle', { opacity: 1, y: 0, duration: 0.9 }, 0.75)
    .to('.start-btn', { opacity: 1, y: 0, duration: 0.8 }, 0.95)
    .to('.landing-scroll-hint', { opacity: 1, y: 0, duration: 0.8 }, 1.1);

  return tl;
}

/**
 * Sets up an IntersectionObserver that fades + lifts each slide's glass
 * panel into view the first time it crosses into the viewport. Runs once
 * per slide; scrolling back up does not replay it, which keeps repeated
 * navigation feeling calm rather than gimmicky.
 */
export function initSlideReveals() {
  const targets = document.querySelectorAll('.slide-inner');
  targets.forEach((el) => {
    gsap.set(el, { opacity: 0, y: 40, scale: 0.98 });
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          gsap.to(entry.target, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.1,
            ease: 'power3.out'
          });
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  targets.forEach((el) => io.observe(el));
}

/**
 * Builds and plays the boat assembly timeline: every part flies in from
 * its randomized start transform, tumbles into orientation, snaps into
 * its final position, and pulses an emissive "confirmation" glow. Parts
 * are staggered so the boat visibly builds itself piece by piece rather
 * than all arriving at once.
 *
 * @param {Array} parts     output of createBoatParts().parts
 * @param {Function} onEachPart  called after each part settles (index, part)
 * @param {Function} onComplete  called once the full timeline finishes
 */
export function assembleBoat(parts, { onEachPart, onComplete } = {}) {
  const tl = gsap.timeline({ onComplete });

  parts.forEach((part, i) => {
    const obj = part.object;
    obj.position.copy(part.start.position);
    obj.rotation.copy(part.start.rotation);
    obj.scale.setScalar(0.4);

    const startTime = i * 0.42;

    tl.to(
      obj.position,
      {
        x: part.target.position.x,
        y: part.target.position.y,
        z: part.target.position.z,
        duration: 1.15,
        ease: 'power3.inOut'
      },
      startTime
    )
      .to(
        obj.rotation,
        {
          x: part.target.rotation.x,
          y: part.target.rotation.y,
          z: part.target.rotation.z,
          duration: 1.15,
          ease: 'power3.inOut'
        },
        startTime
      )
      .to(
        obj.scale,
        { x: 1, y: 1, z: 1, duration: 0.9, ease: 'back.out(2.2)' },
        startTime + 0.15
      );

    // Confirmation glow pulse on arrival.
    part.glowMats.forEach((mat) => {
      const baseIntensity = mat.emissiveIntensity || 0.6;
      tl.fromTo(
        mat,
        { emissiveIntensity: baseIntensity },
        {
          emissiveIntensity: baseIntensity * 3.2,
          duration: 0.22,
          yoyo: true,
          repeat: 1,
          ease: 'power2.out'
        },
        startTime + 1.0
      );
    });

    tl.call(() => onEachPart && onEachPart(i, part), null, startTime + 1.15);
  });

  return tl;
}
