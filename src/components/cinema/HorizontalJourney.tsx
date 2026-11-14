import { useRef, useState, type CSSProperties } from 'react';
import Journey, { type JourneyStep } from '../fx/Journey';
import Reveal from '../fx/Reveal';
import EvolvingArtifact from './EvolvingArtifact';
import { useMinWidth, useReducedMotion, useScrollProgress } from './useScrollProgress';

/**
 * Desktop: the page pins. Each stage's words slide in, hold while you read, then slide away,
 * while one illustrative document on the right evolves stage by stage.
 * Mobile / reduced motion: an interactive vertical journey instead.
 */
export default function HorizontalJourney({ steps }: { steps: JourneyStep[] }) {
  const desktop = useMinWidth(1024);
  const reduced = useReducedMotion();
  const cinematic = desktop && !reduced;
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  useScrollProgress(
    ref,
    'pin',
    (p) => {
      // enter → hold → exit: hold each stage for the middle 60% of its segment
      const segs = steps.length - 1;
      const seg = p * segs;
      const k = Math.min(segs - 1, Math.floor(seg));
      const f = Math.min(1, Math.max(0, (seg - k - 0.3) / 0.4));
      const eased = (k + f * f * (3 - 2 * f)) / segs;
      ref.current?.style.setProperty('--pt', eased.toFixed(4));
      const i = Math.round(eased * segs);
      setActive((a) => (a === i ? a : i));
    },
    cinematic,
  );

  if (!cinematic) {
    return (
      <section className="relative py-20 px-5 sm:px-8 bg-gradient-to-b from-white to-gray-50" aria-labelledby="journey-title">
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-12">
            <p className="text-xs tracking-[0.3em] uppercase text-teal-700 mb-4">From ambition to execution</p>
            <h2 id="journey-title" className="text-4xl sm:text-5xl font-light text-slate-900">
              How we move you forward
            </h2>
          </Reveal>
          <Journey steps={steps} />
        </div>
      </section>
    );
  }

  const n = steps.length;
  return (
    <section
      ref={ref}
      aria-labelledby="journey-title"
      style={{ '--p': 0, '--pt': 0, height: `${n * 130}vh` } as CSSProperties}
      className="relative bg-slate-950"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(60% 55% at 72% 55%, rgba(20,184,166,0.18), transparent 70%)' }}
          aria-hidden="true"
        />

        {/* header + progress */}
        <div className="absolute top-0 inset-x-0 z-20 px-[6vw] pt-28 pb-6 flex items-end justify-between gap-8">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-teal-300/80 mb-3">From ambition to execution</p>
            <h2 id="journey-title" className="text-4xl xl:text-5xl font-light text-white">How we move you forward</h2>
          </div>
          <ol className="flex gap-6 text-sm" aria-label="Stages">
            {steps.map((s, i) => (
              <li
                key={s.step}
                aria-current={i === active ? 'step' : undefined}
                className={`transition-colors duration-500 ${i === active ? 'text-teal-300' : i < active ? 'text-slate-300' : 'text-slate-500'}`}
              >
                <span className="font-mono mr-2">{s.step}</span>
                {s.title}
              </li>
            ))}
          </ol>
        </div>
        <div className="absolute left-[6vw] right-[6vw] top-[13.25rem] z-20 h-px bg-white/10" aria-hidden="true">
          <div
            className="h-full origin-left bg-gradient-to-r from-teal-400 to-cyan-300 shadow-[0_0_12px_rgba(45,212,191,0.8)]"
            style={{ transform: 'scaleX(var(--p))' }}
          />
        </div>

        {/* left: stage words slide past */}
        <div className="absolute inset-y-0 left-0 w-[56vw] overflow-hidden">
          <div
            className="flex h-full will-change-transform"
            style={{ width: `${n * 56}vw`, transform: `translate3d(calc(var(--pt) * -${(n - 1) * 56}vw), 0, 0)` }}
          >
            {steps.map((s) => (
              <article
                key={s.step}
                className="relative w-[56vw] h-full flex items-center pl-[6vw] pr-[4vw] pt-40"
                aria-label={`Step ${s.step}: ${s.title}`}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-[2vw] bottom-[-5vw] font-display font-semibold leading-none text-transparent select-none"
                  style={{ fontSize: '30vw', WebkitTextStroke: '1px rgba(94,234,212,0.12)' }}
                >
                  {s.step}
                </span>
                <div className="relative">
                  <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-400/10 border border-teal-300/30 text-teal-200">
                    <s.icon size={30} />
                  </div>
                  <p className="text-sm tracking-[0.3em] uppercase text-teal-300 mb-4">Step {s.step}</p>
                  <h3 className="text-7xl xl:text-8xl font-light text-white mb-6">{s.title}</h3>
                  <p className="text-2xl text-slate-300 leading-relaxed max-w-lg">{s.text}</p>
                  <p className="mt-6 text-lg text-teal-100/80 max-w-lg">
                    <span className="text-teal-300">You get:</span> {s.deliverable}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* right: one document that evolves */}
        <div className="absolute inset-y-0 right-0 w-[44vw] flex items-center justify-center pr-[6vw] pt-40">
          <EvolvingArtifact stage={active} />
        </div>
      </div>
    </section>
  );
}
