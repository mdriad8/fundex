import type { CSSProperties, ReactNode } from 'react';

/** Deterministic pseudo-random numbers so the star field is identical on every render. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** A twinkling star field. */
export function Stars({ count = 80, seed = 7, className = '' }: { count?: number; seed?: number; className?: string }) {
  const rand = seeded(seed);
  const stars = Array.from({ length: count }, () => ({
    left: rand() * 100,
    top: rand() * 100,
    size: rand() < 0.15 ? 3 : rand() < 0.5 ? 2 : 1,
    delay: rand() * 6,
    dur: 3 + rand() * 5,
  }));
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      {stars.map((s, i) => (
        <span
          key={i}
          className="hk-twinkle absolute rounded-full bg-white"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.dur}s`,
            boxShadow: s.size > 2 ? '0 0 8px rgba(153,246,228,0.9)' : undefined,
          } as CSSProperties}
        />
      ))}
    </div>
  );
}

type CloudProps = {
  children: ReactNode;
  className?: string;
  /** seconds of bob offset so clouds don't move in sync */
  delay?: number;
  tone?: 'white' | 'teal';
  href?: string;
};

/** A soft cloud-shaped label (pill + two puffs). Optionally a link. */
export function Cloud({ children, className = '', delay = 0, tone = 'white', href }: CloudProps) {
  const fill = tone === 'white' ? 'bg-[#eefcf9]' : 'bg-teal-300';
  const inner = (
    <span className="relative inline-flex">
      <span className={`absolute -top-3 left-[18%] h-9 w-9 rounded-full ${fill}`} aria-hidden="true" />
      <span className={`absolute -top-5 left-[42%] h-12 w-12 rounded-full ${fill}`} aria-hidden="true" />
      <span
        className={`relative inline-flex items-center gap-2 rounded-full ${fill} px-5 py-2.5 font-mono text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em] text-slate-900 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.8)]`}
      >
        {children}
      </span>
    </span>
  );
  const style = { animationDelay: `${-delay}s` } as CSSProperties;
  if (href) {
    return (
      <a href={href} className={`hk-bob inline-block transition-transform duration-300 hover:scale-105 ${className}`} style={style}>
        {inner}
      </a>
    );
  }
  return (
    <span className={`hk-bob inline-block ${className}`} style={style}>
      {inner}
    </span>
  );
}

/** A paper plane towing a banner across the sky. */
export function Plane({ text, className = '' }: { text: string; className?: string }) {
  return (
    <div className={`hk-fly pointer-events-none absolute left-0 flex items-center ${className}`} aria-hidden="true">
      <span className="mr-1 rounded-md border border-teal-200/60 bg-teal-300 px-3 py-1 font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-slate-950 shadow-lg">
        {text}
      </span>
      <svg width="70" height="10" viewBox="0 0 70 10" className="text-teal-200/70">
        <path d="M0 5 H70" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
      </svg>
      <svg width="46" height="34" viewBox="0 0 46 34" className="drop-shadow-[0_6px_10px_rgba(0,0,0,0.5)]">
        <path d="M2 17 L44 2 L30 32 L22 20 Z" fill="#f0fdfa" />
        <path d="M22 20 L44 2 L18 24 Z" fill="#99f6e4" />
        <path d="M18 24 L22 20 L30 32 Z" fill="#5eead4" />
      </svg>
    </div>
  );
}
