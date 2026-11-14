import { useEffect, useRef } from 'react';

type Props = {
  /** Approximate number of drifting nodes per 100,000 px² of canvas. */
  density?: number;
  /** When true, some nodes organise themselves into one clear path ("complexity → execution"). */
  story?: boolean;
  /** Overall intensity multiplier (0–1). */
  intensity?: number;
  className?: string;
};

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  pulse: number;
  /** For path nodes: target position along the path. */
  tx?: number;
  ty?: number;
};

const PATH_NODES = 14;

/**
 * Animated background. Teal nodes drift as a loose network (complexity); in story mode a
 * subset then gathers into one rising path across the hero (clarity → strategy → execution),
 * with a light pulse travelling along it. Nearby links respond subtly to the cursor.
 * Decorative only (aria-hidden). Pauses off-screen and when the tab is hidden.
 * With reduced motion, a single settled frame is drawn.
 */
export default function HeroCanvas({ density = 7, story = false, intensity = 1, className = '' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pointer = { x: -9999, y: -9999, active: false };
    let free: Node[] = [];
    let path: Node[] = [];
    let width = 0;
    let height = 0;
    let raf = 0;
    let running = false;
    let visible = true;
    let startTime = performance.now();
    let last = performance.now();

    // A gentle curve that stays low in the centre (below the text) and rises on the right.
    const curve = (t: number) => {
      // Desktop: low under the buttons, rising only to the right of the text block.
      // Mobile: a shallow rise along the bottom edge, clear of the text.
      const mobile = width < 640;
      const x0 = width * (mobile ? 0.02 : 0.04), y0 = height * (mobile ? 0.97 : 0.94);
      const cx = width * (mobile ? 0.6 : 0.7), cy = height * (mobile ? 1.02 : 1.12);
      const x1 = width * (mobile ? 0.98 : 0.97), y1 = height * (mobile ? 0.86 : 0.2);
      const u = 1 - t;
      return { x: u * u * x0 + 2 * u * t * cx + t * t * x1, y: u * u * y0 + 2 * u * t * cy + t * t * y1 };
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(14, Math.min(80, Math.round(((width * height) / 100000) * density)));
      const rnd = () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.7,
        pulse: Math.random() * Math.PI * 2,
      });
      free = Array.from({ length: count }, rnd);
      path = story
        ? Array.from({ length: PATH_NODES }, (_, i) => {
            const target = curve(i / (PATH_NODES - 1));
            const n: Node = { ...rnd(), r: 1.9, tx: target.x, ty: target.y };
            if (reduced) {
              n.x = target.x;
              n.y = target.y;
            }
            return n;
          })
        : [];
      startTime = performance.now();
      last = startTime;
    };

    const link = (a: Node, b: Node, alpha: number, color = '45, 212, 191', w = 0.8) => {
      ctx.strokeStyle = `rgba(${color}, ${alpha * intensity})`;
      ctx.lineWidth = w;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, width, height);
      const elapsed = now - startTime;
      // frame-rate independent motion: dt = 1 at 60 fps
      const dt = Math.min(6, Math.max(0, (now - last) / 16.667));
      last = now;
      const maxD = Math.min(150, Math.max(100, width / 10));
      // 0 → 1 over ~2.5 s, starting after 0.9 s: the moment the path "organises"
      const settle = reduced ? 1 : Math.min(1, Math.max(0, (elapsed - 900) / 2500));

      // drift
      if (!reduced) {
        for (const n of free) {
          if (pointer.active) {
            const dx = pointer.x - n.x;
            const dy = pointer.y - n.y;
            const d = Math.hypot(dx, dy);
            if (d < 180 && d > 1) {
              n.vx += (dx / d) * 0.006 * dt;
              n.vy += (dy / d) * 0.006 * dt;
            }
          }
          n.vx *= Math.pow(0.993, dt);
          n.vy *= Math.pow(0.993, dt);
          if (Math.hypot(n.vx, n.vy) < 0.06) {
            n.vx += (Math.random() - 0.5) * 0.03;
            n.vy += (Math.random() - 0.5) * 0.03;
          }
          n.x += n.vx * dt;
          n.y += n.vy * dt;
          if (n.x < -20) n.x = width + 20;
          if (n.x > width + 20) n.x = -20;
          if (n.y < -20) n.y = height + 20;
          if (n.y > height + 20) n.y = -20;
        }
        for (const n of path) {
          if (settle > 0) {
            const ease = 1 - Math.pow(1 - (0.02 + settle * 0.08), dt);
            const bx = n.tx! + Math.sin(now / 1400 + n.pulse) * 2 * settle;
            const by = n.ty! + Math.cos(now / 1600 + n.pulse) * 2 * settle;
            n.x += (bx - n.x) * ease;
            n.y += (by - n.y) * ease;
          } else {
            n.x += n.vx * dt;
            n.y += n.vy * dt;
          }
        }
      }

      // loose network (complexity) fades back a little as the path forms
      const looseAlpha = 0.32 - settle * 0.12;
      const all = free;
      for (let i = 0; i < all.length; i++) {
        for (let j = i + 1; j < all.length; j++) {
          const d = Math.hypot(all[i].x - all[j].x, all[i].y - all[j].y);
          if (d < maxD) link(all[i], all[j], (1 - d / maxD) * looseAlpha);
        }
        if (pointer.active) {
          const d = Math.hypot(all[i].x - pointer.x, all[i].y - pointer.y);
          if (d < 160) link(all[i], { x: pointer.x, y: pointer.y } as Node, (1 - d / 160) * 0.35, '103, 232, 249', 0.9);
        }
      }

      // the clear path (execution): each segment appears only once both ends have arrived,
      // so the line visibly builds from left to right and never cuts across the headline
      if (path.length) {
        const near = (n: Node) => Math.hypot(n.x - n.tx!, n.y - n.ty!) < 24;
        for (let i = 0; i < path.length - 1; i++) {
          const drawn = reduced ? 1 : Math.min(1, Math.max(0, settle * (path.length - 1) - i));
          if (drawn <= 0 || !near(path[i]) || !near(path[i + 1])) continue;
          const a = path[i];
          const b = path[i + 1];
          link(a, { x: a.x + (b.x - a.x) * drawn, y: a.y + (b.y - a.y) * drawn } as Node, 0.75, '94, 234, 212', 1.8);
        }
        // travelling light pulse once the path has formed
        if (settle > 0.6) {
          const t = ((now - startTime) / 4200) % 1;
          const f = t * (path.length - 1);
          const k = Math.min(path.length - 2, Math.floor(f));
          const p = f - k;
          const x = path[k].x + (path[k + 1].x - path[k].x) * p;
          const y = path[k].y + (path[k + 1].y - path[k].y) * p;
          const g = ctx.createRadialGradient(x, y, 0, x, y, 18);
          g.addColorStop(0, `rgba(165, 243, 252, ${0.9 * intensity * (settle - 0.6) * 2.5})`);
          g.addColorStop(1, 'rgba(165, 243, 252, 0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(x, y, 18, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // nodes
      for (const n of free) {
        const glow = reduced ? 0.6 : 0.45 + Math.sin(now / 900 + n.pulse) * 0.25;
        ctx.fillStyle = `rgba(94, 234, 212, ${glow * intensity})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      for (const n of path) {
        ctx.fillStyle = `rgba(153, 246, 228, ${(0.55 + settle * 0.4) * intensity})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + settle * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduced || !visible || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    draw(performance.now());
    start();

    const ro = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    const host = canvas.parentElement ?? canvas;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };

    document.addEventListener('visibilitychange', onVisibility);
    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerleave', onLeave);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
    };
  }, [density, story, intensity]);

  return <canvas ref={canvasRef} aria-hidden="true" className={`absolute inset-0 h-full w-full ${className}`} />;
}
