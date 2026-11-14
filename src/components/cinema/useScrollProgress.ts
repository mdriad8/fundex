import { useEffect, useState, type RefObject } from 'react';

export type ProgressMode =
  /** 0 when the section's top hits the viewport top, 1 when its bottom hits the viewport bottom (for sticky/pinned sections). */
  | 'pin'
  /** 0 when the section's top enters at the bottom of the viewport, 1 when its bottom leaves at the top. */
  | 'through'
  /** 0 at the top of the page, 1 when the element has scrolled fully out of view (for the hero). */
  | 'exit';

const clamp = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Writes the element's scroll progress (0–1) to the CSS variable `--p` on every frame it is near
 * the viewport, without re-rendering React. Optional `onProgress` receives the value too.
 */
export function useScrollProgress<T extends HTMLElement>(
  ref: RefObject<T>,
  mode: ProgressMode = 'pin',
  onProgress?: (p: number) => void,
  enabled = true,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    let frame = 0;
    let active = true;

    const measure = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      let p = 0;
      if (mode === 'pin') p = clamp(-r.top / Math.max(1, r.height - vh));
      else if (mode === 'through') p = clamp((vh - r.top) / (vh + r.height));
      else p = clamp(-r.top / Math.max(1, r.height));
      el.style.setProperty('--p', p.toFixed(4));
      onProgress?.(p);
    };
    const onScroll = () => {
      if (active && !frame) frame = requestAnimationFrame(measure);
    };

    const io = new IntersectionObserver(([e]) => {
      active = e.isIntersecting;
      if (active) onScroll();
    }, { rootMargin: '200px 0px' });
    io.observe(el);
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
    // onProgress is intentionally excluded: callers pass stable setters
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, mode, enabled]);
}

/** True when the visitor asked for reduced motion. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

/** True at or above a min-width breakpoint (e.g. 1024 for desktop-only pinned scenes). */
export function useMinWidth(px: number) {
  const [ok, setOk] = useState(() => typeof window !== 'undefined' && window.matchMedia(`(min-width: ${px}px)`).matches);
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${px}px)`);
    const on = () => setOk(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [px]);
  return ok;
}
