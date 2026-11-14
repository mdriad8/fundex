import { useRef, useState, type ComponentType, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Reveal from '../fx/Reveal';
import { useMinWidth, useReducedMotion, useScrollProgress } from './useScrollProgress';

export type ShowcaseService = {
  title: string;
  kicker: string;
  text: string;
  points: string[];
  Visual: ComponentType;
};

/**
 * Desktop: the section pins; the service list on the left advances as you scroll and a large
 * animated visual on the right cross-fades to match. Mobile / reduced motion: stacked cards.
 */
export default function ServiceShowcase({ services }: { services: ShowcaseService[] }) {
  const desktop = useMinWidth(1024);
  const reduced = useReducedMotion();
  const cinematic = desktop && !reduced;
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  useScrollProgress(
    ref,
    'pin',
    (p) => {
      const i = Math.min(services.length - 1, Math.floor(p * services.length * 0.999));
      setActive((a) => (a === i ? a : i));
    },
    cinematic,
  );

  const heading = (
    <>
      <p className="text-xs tracking-[0.3em] uppercase text-teal-700 mb-4">What we do</p>
      <h2 id="services-title" className="text-4xl sm:text-5xl xl:text-6xl font-light text-slate-900 mb-10">
        Three ways we help you <span className="font-medium text-teal-700">move forward</span>
      </h2>
    </>
  );

  if (!cinematic) {
    return (
      <section className="py-20 px-5 sm:px-8 bg-white" aria-labelledby="services-title">
        <div className="max-w-6xl mx-auto">
          <Reveal>{heading}</Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 120}>
                <article className="h-full rounded-3xl bg-slate-950 text-white overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-slate-900 to-teal-950 p-4">
                    <s.Visual />
                  </div>
                  <div className="p-6">
                    <p className="text-xs tracking-[0.25em] uppercase text-teal-300 mb-2">{s.kicker}</p>
                    <h3 className="text-2xl font-light mb-3">{s.title}</h3>
                    <p className="text-slate-300 leading-relaxed">{s.text}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <Link to="/services" className="mt-10 inline-flex items-center gap-2 text-teal-700 font-medium hover:gap-3 transition-all">
            Explore all services <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      aria-labelledby="services-title"
      style={{ '--p': 0, height: `${services.length * 90 + 40}vh` } as CSSProperties}
      className="relative bg-white"
    >
      <div className="sticky top-0 h-screen flex items-center">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-12 items-center gap-12 px-8 pt-16">
          <div className="col-span-6">
            {heading}
            <ol className="space-y-2">
              {services.map((s, i) => {
                const on = i === active;
                return (
                  <li key={s.title} aria-current={on ? 'true' : undefined}>
                    <div className={`border-l-2 pl-6 py-3 transition-all duration-500 ${on ? 'border-teal-500' : 'border-gray-200'}`}>
                      <p className={`text-xs tracking-[0.25em] uppercase transition-colors duration-500 ${on ? 'text-teal-700' : 'text-gray-500'}`}>
                        {String(i + 1).padStart(2, '0')} · {s.kicker}
                      </p>
                      <h3 className={`text-3xl xl:text-4xl font-light transition-colors duration-500 ${on ? 'text-slate-900' : 'text-slate-500'}`}>
                        {s.title}
                      </h3>
                      <div className={`grid transition-all duration-500 ${on ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden">
                          <p className="text-lg text-gray-600 leading-relaxed mb-3">{s.text}</p>
                          <ul className="flex flex-wrap gap-2">
                            {s.points.map((pt) => (
                              <li key={pt} className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm text-teal-900">
                                {pt}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
            <Link to="/services" className="mt-8 inline-flex items-center gap-2 text-teal-700 font-medium hover:gap-3 transition-all">
              Explore all services <ArrowUpRight size={18} />
            </Link>
          </div>

          <div className="col-span-6">
            <div className="relative aspect-square max-h-[70vh] mx-auto rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-950 to-teal-950 shadow-2xl shadow-teal-900/30 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(45,212,191,0.18),transparent_60%)]" />
              {services.map((s, i) => (
                <div
                  key={s.title}
                  className="absolute inset-0 p-10 transition-all duration-700 ease-out"
                  style={{
                    opacity: i === active ? 1 : 0,
                    transform: `scale(${i === active ? 1 : 0.92}) translateY(${i === active ? 0 : i < active ? -24 : 24}px)`,
                  }}
                >
                  <s.Visual />
                </div>
              ))}
              <div className="absolute bottom-6 left-6 right-6 flex gap-2" aria-hidden="true">
                {services.map((_, i) => (
                  <span key={i} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i <= active ? 'bg-teal-400' : 'bg-white/10'}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
