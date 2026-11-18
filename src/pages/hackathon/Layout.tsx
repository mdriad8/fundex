import type { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, NavLink } from 'react-router-dom';
import { Stars } from '../../components/hackathon/Sky';

/** While true, hackathon pages are noindex (see src/pages/Hackathon.tsx). */
export const PREVIEW = true;

const links = [
  { to: '/hackathon', label: 'Overview', end: true },
  { to: '/hackathon/contribute', label: 'Get involved' },
  { to: '/hackathon/ambassadors', label: 'Campus Ambassadors' },
];

/** Sticky event bar shared by every Beyond the Prompt page (dates + section links). */
export function EventBar() {
  return (
    <div className="sticky top-16 sm:top-20 z-30 border-b border-teal-300/20 bg-[#03121a]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-5 py-2 sm:px-8">
        <p className="hidden font-mono text-[11px] uppercase tracking-[0.2em] text-teal-300 sm:block">
          Beyond the Prompt 2027 <span className="text-slate-500">/</span> <span className="text-slate-300">23–25 Jan · Online + Melbourne</span>
        </p>
        <nav aria-label="Beyond the Prompt" className="-mx-2 flex overflow-x-auto">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-lg px-2 py-1 font-mono text-xs uppercase tracking-wider transition-colors ${isActive ? 'text-white' : 'text-slate-400 hover:text-teal-200'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}

export function Tag({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <p className={`mb-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] ${dark ? 'text-teal-300' : 'text-teal-700'}`}>
      <span className={`h-2.5 w-2.5 ${dark ? 'bg-teal-300' : 'bg-teal-600'}`} aria-hidden="true" />
      {children}
    </p>
  );
}

type HeroProps = {
  crumb: string;
  eyebrow: string;
  title: ReactNode;
  intro: ReactNode;
  children?: ReactNode;
};

/** Dark page header with breadcrumb and numbered eyebrow. */
export function PageHero({ crumb, eyebrow, title, intro, children }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#03121a] px-5 pb-20 pt-14 sm:px-8 sm:pb-28 sm:pt-20">
      <Stars count={60} seed={7} />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(45,212,191,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(45,212,191,0.06)_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_70%_60%_at_70%_40%,#000_30%,transparent_80%)]" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl">
        <nav aria-label="Breadcrumb" className="font-mono text-xs text-slate-400">
          <Link to="/hackathon" className="hover:text-teal-200">Beyond the Prompt</Link> <span className="text-slate-600">/</span>{' '}
          <span className="text-slate-200" aria-current="page">{crumb}</span>
        </nav>
        <p className="mt-10 font-mono text-xs uppercase tracking-[0.3em] text-teal-300">{eyebrow}</p>
        <h1 className="hk-chunky mt-4 max-w-4xl font-display text-5xl font-black uppercase leading-[0.92] tracking-[-0.02em] sm:text-7xl">{title}</h1>
        <div className="mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">{intro}</div>
        {children}
      </div>
    </section>
  );
}

export function Meta({ title, description, path }: { title: string; description: string; path: string }) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={`https://www.fundexglobal.vc${path}`} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={`https://www.fundexglobal.vc${path}`} />
      {PREVIEW && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  );
}

/** HI Cyber Con-style status badge: Open / By conversation / etc. */
export function Status({ children, tone = 'open' }: { children: ReactNode; tone?: 'open' | 'talk' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider ${tone === 'open' ? 'border-teal-700 bg-teal-50 text-teal-800' : 'border-slate-400 bg-white text-slate-600'}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${tone === 'open' ? 'bg-teal-600 animate-pulse' : 'bg-slate-400'}`} aria-hidden="true" />
      {children}
    </span>
  );
}
