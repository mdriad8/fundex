import { useRef, type CSSProperties } from 'react';
import { useReducedMotion, useScrollProgress } from './useScrollProgress';

type Word = { w: string; accent?: boolean };

const parse = (text: string): Word[] =>
  text.split(' ').map((w) => (w.startsWith('*') ? { w: w.replace(/\*/g, ''), accent: true } : { w }));

/**
 * Pinned full-screen statement that lights up word by word as you scroll.
 * Words wrapped in *asterisks* are highlighted in teal.
 */
export default function Manifesto({ id, eyebrow, text }: { id?: string; eyebrow: string; text: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  useScrollProgress(ref, 'pin', undefined, !reduced);
  const words = parse(text);
  const n = words.length;

  return (
    <section
      id={id}
      ref={ref}
      aria-label={eyebrow}
      style={{ '--p': reduced ? 1 : 0, '--n': n } as CSSProperties}
      className={`relative bg-slate-950 ${reduced ? 'py-32' : 'h-[170vh] lg:h-[230vh]'}`}
    >
      <div className={`${reduced ? '' : 'sticky top-0 h-[100svh]'} flex items-center overflow-hidden`}>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 50% at 50% 60%, rgba(20,184,166,calc(0.06 + var(--p) * 0.12)), transparent 70%)',
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
          <p className="mb-8 text-xs sm:text-sm tracking-[0.3em] uppercase text-teal-300/80">{eyebrow}</p>
          <p className="sr-only">{words.map((x) => x.w).join(' ')}</p>
          <p
            aria-hidden="true"
            className="font-display text-[2rem] leading-[1.12] sm:text-5xl lg:text-7xl font-medium tracking-[-0.035em]"
          >
            {words.map((x, i) => (
              <span
                key={i}
                className={x.accent ? 'text-teal-300' : 'text-white'}
                style={{
                  ['--i' as string]: i,
                  opacity: 'clamp(0.14, calc(var(--p) * var(--n) * 1.75 - var(--i)), 1)',
                  transition: 'opacity 0.15s linear',
                }}
              >
                {x.w}{' '}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
