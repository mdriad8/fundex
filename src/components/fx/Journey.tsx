import { useEffect, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';

export type JourneyStep = {
  icon: LucideIcon;
  step: string;
  title: string;
  text: string;
  deliverable: string;
};

/**
 * Interactive four-stage journey. A teal line fills up to the active stage; the active card lifts
 * and reveals an example deliverable. Cycles gently while in view until the visitor interacts
 * (hover, focus or click take over). No auto-cycling for reduced motion.
 */
export default function Journey({ steps }: { steps: JourneyStep[] }) {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [userControlled, setUserControlled] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!inView || userControlled || reduced) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % steps.length), 3200);
    return () => window.clearInterval(id);
  }, [inView, userControlled, steps.length]);

  const choose = (i: number) => {
    setUserControlled(true);
    setActive(i);
  };

  const progress = inView ? ((active + 1) / steps.length) * 100 : 0;

  return (
    <div ref={ref} className="relative">
      {/* Track + animated fill (desktop) */}
      <div className="hidden lg:block absolute top-[2.15rem] left-[12.5%] right-[12.5%] h-0.5 bg-gray-200 rounded-full" aria-hidden="true">
        <div
          className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-[width] duration-700 ease-out shadow-[0_0_12px_rgba(20,184,166,0.6)]"
          style={{ width: `${Math.max(0, ((active) / (steps.length - 1)) * 100) * (inView ? 1 : 0)}%` }}
        />
      </div>
      {/* Vertical track (mobile/tablet) */}
      <div className="lg:hidden absolute top-4 bottom-4 left-[1.7rem] w-0.5 bg-gray-200 rounded-full" aria-hidden="true">
        <div
          className="w-full rounded-full bg-gradient-to-b from-teal-500 to-cyan-500 transition-[height] duration-700 ease-out"
          style={{ height: `${progress}%` }}
        />
      </div>

      <ol className="relative grid gap-5 lg:grid-cols-4 lg:gap-6">
        {steps.map((s, i) => {
          const isActive = i === active;
          const isDone = i < active;
          return (
            <li key={s.step} className="relative pl-16 lg:pl-0">
              <button
                type="button"
                onMouseEnter={() => choose(i)}
                onFocus={() => choose(i)}
                onClick={() => choose(i)}
                aria-expanded={isActive}
                aria-controls={`journey-detail-${i}`}
                className={`group w-full text-left lg:text-center rounded-2xl border p-5 sm:p-6 transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${
                  isActive
                    ? 'bg-white border-teal-500/50 shadow-xl shadow-teal-700/10 lg:-translate-y-2'
                    : 'bg-white/70 border-gray-200 hover:border-teal-300'
                }`}
              >
                <span
                  className={`absolute left-0 top-5 lg:static lg:mx-auto lg:mb-5 flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-500 ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/40 ring-4 ring-teal-100 scale-110'
                      : isDone
                        ? 'bg-teal-600 text-white'
                        : 'bg-white border border-gray-200 text-teal-700'
                  }`}
                  aria-hidden="true"
                >
                  <s.icon size={24} />
                </span>
                <span className="block text-xs font-medium tracking-widest text-teal-700 mb-1">STEP {s.step}</span>
                <span className="block text-xl font-medium text-slate-900 mb-2">{s.title}</span>
                <span className="block text-gray-600 leading-relaxed text-sm sm:text-base">{s.text}</span>
                <span
                  id={`journey-detail-${i}`}
                  className={`grid transition-all duration-500 ${isActive ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}
                >
                  <span className="overflow-hidden">
                    <span className="block rounded-xl bg-teal-50 border border-teal-100 px-4 py-3 text-sm text-teal-900">
                      <span className="font-medium">Example deliverable: </span>
                      {s.deliverable}
                    </span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
