import { useRef, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import HeroCanvas from '../fx/HeroCanvas';
import AnimatedHeadline from '../fx/AnimatedHeadline';
import { useScrollProgress } from './useScrollProgress';

const fade = (ms: number) => ({ '--fade-delay': `${ms}ms` }) as CSSProperties;

/** Full-screen opening scene. As you scroll, the words lift away and the growth line rushes toward you. */
export default function CinemaHero() {
  const ref = useRef<HTMLElement>(null);
  useScrollProgress(ref, 'exit');

  return (
    <section
      ref={ref}
      style={{ '--p': 0 } as CSSProperties}
      className="relative h-[100svh] min-h-[560px] flex items-center justify-center overflow-hidden bg-slate-950 -mt-20"
    >
      {/* depth layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_40%,rgba(20,184,166,0.18),transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div className="float-slow absolute -top-32 -left-24 w-[520px] h-[520px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div
        className="absolute inset-0 origin-bottom-right will-change-transform"
        style={{ transform: 'scale(calc(1 + var(--p) * 0.45))' }}
      >
        <HeroCanvas density={7} story className="opacity-70 sm:opacity-100" />
      </div>

      <div
        className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8 pt-20 text-center will-change-transform"
        style={{
          transform: 'translate3d(0, calc(var(--p) * -140px), 0) scale(calc(1 - var(--p) * 0.1))',
          opacity: 'calc(1 - var(--p) * 1.7)',
        }}
      >
        <div className="mb-6 sm:mb-8 fade-up" style={fade(0)}>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-400/30 bg-teal-400/10 text-teal-200 text-xs sm:text-sm tracking-[0.2em] uppercase backdrop-blur">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400" />
            </span>
            Strategy · Execution · Growth
          </span>
        </div>

        <AnimatedHeadline
          startDelay={80}
          step={70}
          className="font-display text-[2.05rem] min-[400px]:text-[2.3rem] leading-[1.05] sm:text-7xl lg:text-[6.5rem] font-light tracking-[-0.04em] text-white mb-6 sm:mb-8"
          lines={[
            { text: 'Building the Future,' },
            { text: 'One Company at a Time', className: 'font-medium pb-3', wordClassName: 'text-shimmer' },
          ]}
        />

        <p className="mx-auto max-w-2xl text-base sm:text-xl text-slate-300 leading-relaxed mb-9 sm:mb-12 fade-up" style={fade(750)}>
          <span className="sm:hidden">Strategy and hands-on execution for founders and growing businesses.</span>
          <span className="hidden sm:inline">
            Fund'ex works at the intersection of strategy and execution, helping founders and growing
            businesses turn ambitious plans into lasting progress.
          </span>
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center fade-up" style={fade(900)}>
          <Link
            to="/contact"
            className="btn-sheen group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-base sm:text-lg shadow-[0_0_40px_-8px_rgba(45,212,191,0.8)] transition-all duration-300"
          >
            Partner With Us
            <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" size={20} />
          </Link>
          <Link
            to="/services"
            className="hidden sm:inline-flex items-center justify-center px-8 py-4 rounded-full border border-white/20 hover:border-teal-300/60 hover:bg-white/5 text-white text-base sm:text-lg backdrop-blur transition-all duration-300"
          >
            View Services
          </Link>
        </div>
      </div>

      {/* scroll cue */}
      <a
        href="#story"
        className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 hidden sm:block text-[11px] tracking-[0.3em] uppercase text-slate-400 hover:text-teal-200 transition-colors"
        style={{ opacity: 'calc(1 - var(--p) * 4)' }}
      >
        <span className="flex flex-col items-center gap-2 fade-up" style={fade(1200)}>
          <span>Scroll</span>
          <span className="relative h-10 w-6 rounded-full border border-slate-500/70" aria-hidden="true">
            <span className="scroll-cue absolute left-1/2 top-2 h-2 w-1 -translate-x-1/2 rounded-full bg-teal-300" />
          </span>
        </span>
      </a>
    </section>
  );
}
