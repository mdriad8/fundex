import { useEffect, useRef } from 'react';
import createGlobe from 'cobe';
import { useReducedMotion } from '../cinema/useScrollProgress';

/** Cities shown as glowing dots: Australia bright (every prize team has an Australian member), the world around it. */
const AUSTRALIA: [number, number][] = [
  [-37.81, 144.96], // Melbourne
  [-33.87, 151.21], // Sydney
  [-27.47, 153.03], // Brisbane
  [-31.95, 115.86], // Perth
  [-34.93, 138.6], // Adelaide
  [-35.28, 149.13], // Canberra
  [-42.88, 147.33], // Hobart
];
const WORLD: [number, number][] = [
  [51.51, -0.13], [6.52, 3.38], [-1.29, 36.82], [19.08, 72.88], [23.81, 90.41], [1.35, 103.82],
  [-6.21, 106.85], [14.6, 120.98], [35.68, 139.69], [43.65, -79.38], [40.71, -74.0], [37.77, -122.42],
  [-23.55, -46.63], [52.52, 13.4], [25.2, 55.27], [-36.85, 174.76], [30.04, 31.24], [-33.92, 18.42],
];

// Put Melbourne's longitude facing the viewer.
const START_PHI = Math.PI - ((144.96 * Math.PI) / 180 - Math.PI / 2);

type Props = { className?: string; theta?: number };

/** Dot-matrix globe (WebGL via cobe) that slowly turns and pauses when off-screen or with reduced motion. */
export default function Globe({ className = '', theta = 0.25 }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    let phi = START_PHI;
    let visible = true;
    let width = el.offsetWidth;
    const onResize = () => (width = el.offsetWidth);
    window.addEventListener('resize', onResize);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    const small = width < 640;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let globe: ReturnType<typeof createGlobe> | null = null;
    try {
      globe = createGlobe(el, {
        devicePixelRatio: dpr,
        width: width * dpr,
        height: width * dpr,
        phi,
        theta,
        dark: 1,
        diffuse: 1.4,
        mapSamples: small ? 9000 : 18000,
        mapBrightness: 5,
        baseColor: [0.07, 0.25, 0.27],
        markerColor: [0.37, 0.92, 0.83],
        glowColor: [0.06, 0.38, 0.36],
        markers: [
          ...AUSTRALIA.map((location, i) => ({ location, size: i === 0 ? 0.09 : 0.055 })),
          ...WORLD.map((location) => ({ location, size: 0.035 })),
        ],
        onRender: (state) => {
          if (!reduced && visible) phi += 0.0025;
          state.phi = phi;
          state.width = width * dpr;
          state.height = width * dpr;
        },
      });
      requestAnimationFrame(() => el.classList.add('opacity-100'));
    } catch {
      // No WebGL: the page still works without the globe.
      el.style.display = 'none';
    }

    return () => {
      globe?.destroy();
      io.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [reduced, theta]);

  return (
    <canvas
      ref={canvas}
      aria-hidden="true"
      className={`aspect-square w-full opacity-0 transition-opacity duration-[1500ms] ${className}`}
    />
  );
}
