import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronDown,
  FlaskConical,
  Lightbulb,
  Lock,
  Medal,
  Rocket,
  Scale,
  ShieldCheck,
  Sparkles,
  Trophy,
  Wrench,
} from 'lucide-react';
import Reveal from '../components/fx/Reveal';
import Globe from '../components/hackathon/Globe';
import Blocks from '../components/hackathon/Blocks';
import { Cloud, Plane, Stars } from '../components/hackathon/Sky';
import { useMinWidth, useScrollProgress } from '../components/cinema/useScrollProgress';

/**
 * Beyond the Prompt 2027: the Fund'ex hackathon page.
 * While PREVIEW is true the page is noindex and not linked from the menu or sitemap.
 * Before launch: set PREVIEW = false and REG_URL to the registration form, then add the menu link and sitemap entry.
 */
const PREVIEW = true;
const REG_URL = '';

const START = '2027-01-23T00:00:00Z';
const END = '2027-01-25T00:00:00Z';

const fade = (ms: number) => ({ '--fade-delay': `${ms}ms` }) as CSSProperties;

/* ------------------------------------------------------------------ data */

const ticker = ['AI', 'Automation', 'No-code welcome', '48 hours', 'Fully online', 'Any time zone', '18+', 'Prizes to be won', 'You keep your IP', 'Free to enter'];

const stats = [
  { value: '48', unit: 'hours', label: 'Kick-off to submission' },
  { value: 'TBA', unit: '', label: 'Prizes, announced soon' },
  { value: '1–4', unit: 'people', label: 'Per team' },
  { value: 'A$0', unit: '', label: 'To enter, and no paid tools needed' },
];

const cities: { city: string; tz: string; au?: boolean }[] = [
  { city: 'Melbourne', tz: 'Australia/Melbourne', au: true },
  { city: 'Perth', tz: 'Australia/Perth', au: true },
  { city: 'Singapore', tz: 'Asia/Singapore' },
  { city: 'Dhaka', tz: 'Asia/Dhaka' },
  { city: 'Mumbai', tz: 'Asia/Kolkata' },
  { city: 'Nairobi', tz: 'Africa/Nairobi' },
  { city: 'Lagos', tz: 'Africa/Lagos' },
  { city: 'London', tz: 'Europe/London' },
  { city: 'São Paulo', tz: 'America/Sao_Paulo' },
  { city: 'New York', tz: 'America/New_York' },
];

const levels = [
  { icon: Lightbulb, title: 'The big vision', text: 'In 150 words: if this worked at scale, what changes, and for whom? Impact is judged relative to your users.' },
  { icon: Wrench, title: 'The working slice', text: 'The first piece that actually works for one real user, built during the 48 hours.' },
  { icon: FlaskConical, title: 'The proof', text: 'A demo video, inspectable code or no-code workflow, and three test cases, including one where it fails.' },
];

const fields = ['Health & Wellbeing', 'Learning, Work & Opportunity', 'Climate, Energy & Resilience', 'Trust, Safety & Information', 'Communities, Access & Inclusion', 'Other / Open Innovation'];

const milestones = [
  { date: '1 Dec', title: 'Registration opens' },
  { date: '4 · 11 · 18 Jan', title: 'Team-matching rounds' },
  { date: '20 Jan', title: 'Registration closes' },
  { date: '23 Jan', title: 'Hacking starts', big: true },
  { date: '25 Jan', title: 'Submit your proof', big: true },
  { date: '28 Jan', title: 'Results', big: true },
];

const schedule: { when: string; what: string; utc?: string; key?: boolean }[] = [
  { when: 'Mon 30 Nov 22:00', what: 'Registration and team matching open', utc: '2026-11-30T22:00:00Z' },
  { when: '4 · 11 · 18 Jan', what: 'Team-matching rounds' },
  { when: 'Sun 17 Jan 23:59', what: 'Team-matching requests close', utc: '2027-01-17T23:59:00Z' },
  { when: 'Wed 20 Jan 12:00', what: 'Registration closes and teams are locked', utc: '2027-01-20T12:00:00Z' },
  { when: 'Sat 23 Jan 00:00', what: 'Start. The recorded opening briefing is released.', utc: START, key: true },
  { when: 'Sat 23 Jan 01:00', what: 'Optional live Q&A #1', utc: '2027-01-23T01:00:00Z' },
  { when: 'Sat 23 Jan 09:00', what: 'Optional live Q&A #2', utc: '2027-01-23T09:00:00Z' },
  { when: 'Mon 25 Jan 00:00', what: 'Submission deadline', utc: END, key: true },
  { when: '25–27 Jan', what: 'Independent judging' },
  { when: 'Thu 28 Jan 08:00', what: 'Results and optional showcase (recorded)', utc: '2027-01-28T08:00:00Z', key: true },
];

const prizes = [
  { icon: Trophy, amount: '1st', label: 'Grand prize' },
  { icon: Medal, amount: '2nd', label: 'Runner-up' },
  { icon: Sparkles, amount: 'Best', label: 'Beginner-Led Team' },
];

const weights: [string, number][] = [
  ['Working implementation & evidence', 30],
  ['Problem understanding', 15],
  ['Ambition & original contribution', 15],
  ['Appropriate AI or automation', 15],
  ['Reliability, testing & data handling', 15],
  ['Usability & accessibility', 5],
  ['Demonstration clarity', 5],
];

const tiers = [
  { name: 'Community partner', text: 'Share the event with your members once, and nominate mentors or judges.' },
  { name: 'Tools partner', text: 'Optional credits, licences or trial codes for teams, listed in the starter kit.' },
  { name: 'Track partner', text: 'Own a “Best use of {your product}” prize and a short recorded workshop.' },
  { name: 'Supporting partner', text: 'Headline support, a slot in the opening video, and a post-event report.' },
];

const rules = [
  { icon: Lock, title: 'You keep your work', text: 'Your project stays yours. Fundex gets only the limited rights needed to judge it. Public showcase is a separate opt-in. No equity, investment or obligation to work with Fundex.' },
  { icon: Scale, title: 'Build fairly', text: 'AI-assisted building is allowed. Disclose AI tools, third-party parts and anything built before the event. Use only data you’re allowed to use.' },
  { icon: ShieldCheck, title: 'Your data', text: 'We collect your name, email, country, city and skills to run the event and match teams. We don’t ask for ID at registration. Prize winners complete a sanctions check before payment.' },
];

const faqs = [
  { q: 'Can anyone register?', a: 'Yes. Anyone aged 18 or over can register from anywhere. To compete for prizes, your team needs at least one contributing member who lives in Australia. Matching rounds help international participants find Australian teammates.' },
  { q: 'Why does every prize team need someone in Australia?', a: 'Prizes are paid in Australian dollars to that team member by Australian bank transfer, which keeps payments simple and fast. The team decides how to share the prize.' },
  { q: 'What if I can’t find an Australian teammate?', a: 'You can still build and submit as a Showcase entry. You get judge feedback and certificates, but no cash prize or placing.' },
  { q: 'I’m a beginner or not a programmer. Can I join?', a: 'Yes. Designers, researchers and domain experts are valuable, no-code solutions are accepted if they can be inspected, and there is a prize for beginner-led teams.' },
  { q: 'Do I need paid AI tools?', a: 'No. Any lawful model or tool is allowed. Free tiers and open-source models are enough to compete.' },
  { q: 'Do I have to be online the whole time?', a: 'No. Work when it suits you, sleep and take breaks. Only the submission deadline is fixed.' },
  { q: 'Is this a startup or investment programme?', a: 'No. It’s a learning hackathon. There’s no equity, no investment offer and no obligation to work with Fundex.' },
];

/* ------------------------------------------------------------- helpers */

function useFormatted(utc: string, opts: Intl.DateTimeFormatOptions) {
  const [text, setText] = useState('');
  const key = JSON.stringify(opts);
  useEffect(() => {
    try {
      setText(new Intl.DateTimeFormat(undefined, opts).format(new Date(utc)));
    } catch {
      setText('');
    }
    // opts is serialised into key
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [utc, key]);
  return text;
}

function LocalTime({ utc }: { utc: string }) {
  const text = useFormatted(utc, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });
  return <span>{text || '—'}</span>;
}

function CityTime({ tz }: { tz: string }) {
  const text = useFormatted(START, { timeZone: tz, weekday: 'short', hour: '2-digit', minute: '2-digit' });
  return <span>{text || '—'}</span>;
}

function Countdown() {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setLeft(Math.max(0, Math.floor((Date.parse(START) - Date.now()) / 1000)));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  if (left === null) return null;
  if (left === 0) return <p className="font-mono text-teal-300">Hacking is live.</p>;
  const parts = [
    [Math.floor(left / 86400), 'd'],
    [Math.floor((left % 86400) / 3600), 'h'],
    [Math.floor((left % 3600) / 60), 'm'],
    [left % 60, 's'],
  ] as const;
  return (
    <p className="font-mono text-sm sm:text-base text-slate-300" role="timer" aria-label="Countdown to the start">
      <span className="text-teal-300">$</span> T-minus{' '}
      {parts.map(([v, u]) => (
        <span key={u} className="mr-2 inline-block tabular-nums">
          <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-white">{String(v).padStart(2, '0')}</span>
          <span className="ml-0.5 text-slate-400">{u}</span>
        </span>
      ))}
      <span className="hk-twinkle text-teal-300" aria-hidden="true">▌</span>
    </p>
  );
}

function RegisterButton({ light = false }: { light?: boolean }) {
  const base = 'group inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-950 px-7 py-4 font-mono text-sm sm:text-base font-bold uppercase tracking-wider transition-all duration-200';
  const look = light
    ? 'bg-white text-slate-950 shadow-[6px_6px_0_#14b8a6] hover:shadow-[3px_3px_0_#14b8a6] hover:translate-x-[3px] hover:translate-y-[3px]'
    : 'bg-teal-400 text-slate-950 shadow-[6px_6px_0_#f0fdfa] hover:shadow-[3px_3px_0_#f0fdfa] hover:translate-x-[3px] hover:translate-y-[3px]';
  if (REG_URL) {
    return (
      <a href={REG_URL} className={`${base} ${look}`}>
        Register free <ArrowRight className="transition-transform group-hover:translate-x-1" size={18} />
      </a>
    );
  }
  return (
    <span className={`${base} ${look} cursor-default`} aria-disabled="true">
      Registration opens 1 Dec
    </span>
  );
}

function Tag({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <p className={`mb-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] ${dark ? 'text-teal-300' : 'text-teal-700'}`}>
      <span className={`h-2.5 w-2.5 ${dark ? 'bg-teal-300' : 'bg-teal-600'}`} aria-hidden="true" />
      {children}
    </p>
  );
}

/* ---------------------------------------------------------------- page */

export default function Hackathon() {
  const desktop = useMinWidth(1024);
  const skyRef = useRef<HTMLElement>(null);
  useScrollProgress(skyRef, 'through', undefined, desktop);

  return (
    <div className="pt-20">
      <Helmet>
        <title>Beyond the Prompt 2027 | Fund'ex AI & Automation Hackathon</title>
        <meta name="description" content="Beyond the Prompt: a free, online, 48-hour AI and automation hackathon by Fundex Global. Open to everyone 18+. 23–25 January 2027 (UTC)." />
        <link rel="canonical" href="https://www.fundexglobal.vc/hackathon" />
        {PREVIEW && <meta name="robots" content="noindex, nofollow" />}
      </Helmet>

      {PREVIEW && (
        <div className="relative z-20 -mt-20 pt-16 sm:pt-20 md:pt-[5.75rem] bg-amber-400/10 border-b border-amber-300/20">
          <p className="max-w-6xl mx-auto px-5 sm:px-8 py-2 text-center text-xs sm:text-sm text-amber-100">
            Private preview. Dates, prizes and rules are pending Fundex approval, and registration isn’t open yet.
          </p>
        </div>
      )}

      {/* ============ HERO: night sky, block letters, rising globe ============ */}
      <section className={`relative overflow-hidden bg-[#03121a] ${PREVIEW ? '' : '-mt-20 pt-20'}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#04202a] to-[#0a3a3d]" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(ellipse_60%_70%_at_50%_100%,rgba(45,212,191,0.35),transparent_70%)]" />
        <Stars count={110} />
        <Plane text="Registration opens 1 Dec" className="hidden sm:flex top-[3%]" />

        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 pt-16 sm:pt-20 text-center">
          <div className="fade-up" style={fade(0)}>
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-300/30 bg-teal-300/10 px-4 py-1.5 font-mono text-[11px] sm:text-xs uppercase tracking-[0.25em] text-teal-200">
              Fund'ex presents
            </span>
          </div>

          <h1 className="mt-6 fade-up" style={fade(120)}>
            <span className="hk-chunky block font-display font-black uppercase leading-[0.86] tracking-[-0.035em] text-[3.1rem] min-[400px]:text-[3.6rem] sm:text-[6.5rem] lg:text-[9.5rem]">
              Beyond
            </span>
            <span className="hk-chunky block font-display font-black uppercase leading-[0.86] tracking-[-0.035em] text-[3.1rem] min-[400px]:text-[3.6rem] sm:text-[6.5rem] lg:text-[9.5rem]">
              the Prompt
            </span>
          </h1>

          <p className="mt-6 font-mono text-sm sm:text-lg uppercase tracking-[0.2em] text-teal-200 fade-up" style={fade(260)}>
            Think big. Prove small.
          </p>
          <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg text-slate-300 fade-up" style={fade(360)}>
            A free, online, 48-hour AI &amp; automation hackathon. Bring a big idea and prove the first piece works.
          </p>

          <div className="mt-8 flex flex-col items-center gap-5 fade-up" style={fade(480)}>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <RegisterButton />
              <a href="#sponsor" className="font-mono text-sm uppercase tracking-wider text-teal-200 underline decoration-teal-300/40 underline-offset-8 hover:text-white">
                Sponsor us →
              </a>
            </div>
            <Countdown />
          </div>
        </div>

        {/* clouds floating around the planet (Cal Hacks style) */}
        <div className="relative z-10 mx-auto mt-10 max-w-6xl px-5">
          <div className="relative h-[300px] sm:h-[460px] lg:h-[560px]">
            <div className="absolute left-1/2 top-0 w-[620px] sm:w-[900px] lg:w-[1100px] -translate-x-1/2">
              <Globe />
            </div>
            <Cloud className="absolute left-0 top-6 sm:left-[4%] sm:top-12" delay={0}>23–25 Jan 2027</Cloud>
            <Cloud className="absolute right-0 top-2 sm:right-[6%] sm:top-6" delay={2} tone="teal">48 hours · online</Cloud>
            <Cloud className="absolute left-[8%] top-40 hidden sm:inline-block lg:left-[12%] lg:top-56" delay={4}>Prizes to be won</Cloud>
            <Cloud className="absolute right-[2%] top-36 hidden sm:inline-block lg:right-[10%] lg:top-52" delay={1} href="#challenge">The challenge →</Cloud>
            <Cloud className="absolute left-1/2 bottom-16 -translate-x-1/2 hidden lg:inline-block" delay={3} tone="teal">Australia ✦ the world</Cloud>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#0a3a3d]/0" />
      </section>

      {/* ============ TICKER ============ */}
      <div className="marquee relative z-10 -mt-px border-y-2 border-slate-950 bg-teal-400 py-3 overflow-hidden" aria-hidden="true">
        <div className="marquee-track" style={{ '--marquee-duration': '35s' } as CSSProperties}>
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0">
              {ticker.map((t) => (
                <span key={t + k} className="mx-5 font-mono text-sm font-bold uppercase tracking-[0.18em] text-slate-950">
                  {t} <span className="ml-5 text-slate-950/40">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ============ STATS (MLH style) ============ */}
      <section className="hk-paper relative overflow-hidden px-5 sm:px-8 py-20 sm:py-28" aria-labelledby="stats-title">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <Reveal>
              <Tag>Built for builders</Tag>
              <h2 id="stats-title" className="font-display text-4xl sm:text-6xl font-black uppercase leading-[0.95] tracking-tight text-slate-900">
                Not for pitch decks.
              </h2>
              <p className="mt-5 max-w-xl text-lg text-slate-600">
                Teams are judged on working evidence. Code or no-code, any lawful AI tool, beginners welcome. Show it working for one real user.
              </p>
            </Reveal>
            <div className="mt-10 grid grid-cols-2 gap-4">
              {stats.map((s, i) => (
                <Reveal key={s.label} delay={i * 100}>
                  <div className="h-full rounded-2xl border-2 border-slate-900 bg-white p-5 shadow-[5px_5px_0_#0f172a]">
                    <p className="font-mono text-3xl sm:text-5xl font-bold text-slate-900 tabular-nums">
                      {s.value}
                      {s.unit && <span className="ml-1.5 text-base sm:text-lg font-semibold text-teal-700">{s.unit}</span>}
                    </p>
                    <p className="mt-2 font-mono text-[11px] sm:text-xs uppercase tracking-[0.15em] text-slate-500">{s.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal variant="zoom" className="mx-auto w-full max-w-md">
            <Blocks className="w-full drop-shadow-[0_30px_40px_rgba(15,23,42,0.25)]" />
          </Reveal>
        </div>
      </section>

      {/* ============ ANYWHERE (Space Apps style) ============ */}
      <section className="relative overflow-hidden bg-[#03121a] px-5 sm:px-8 py-20 sm:py-28" aria-labelledby="anywhere-title">
        <Stars count={50} seed={21} />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <Tag dark>Build from anywhere</Tag>
            <h2 id="anywhere-title" className="font-display text-4xl sm:text-6xl font-black uppercase leading-[0.95] tracking-tight text-white">
              One world. <span className="text-teal-300">One Aussie</span> on every prize team.
            </h2>
            <p className="mt-5 text-lg text-slate-300 leading-relaxed">
              Anyone 18+ can join, from anywhere. To compete for prizes, each team needs at least one contributing member who lives in Australia.
              No Aussie teammate yet? Tick “match me” and we’ll connect you in a matching round.
            </p>
            <p className="mt-4 text-slate-400">No Australian member? You can still enter as a <span className="text-white">Showcase entry</span>, with feedback and certificates.</p>
          </Reveal>
          <Reveal delay={150}>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-slate-400">Kick-off, local time</p>
            <ul className="grid grid-cols-2 gap-3">
              {cities.map((c) => (
                <li
                  key={c.city}
                  className={`rounded-xl border px-4 py-3 ${c.au ? 'border-teal-300/50 bg-teal-300/10' : 'border-white/10 bg-white/[0.03]'}`}
                >
                  <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-400">
                    {c.city} {c.au && <span className="text-teal-300">✦</span>}
                  </p>
                  <p className="font-mono text-lg text-white tabular-nums">
                    <CityTime tz={c.tz} />
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-3 font-mono text-xs text-slate-500">
              Your time: <span className="text-teal-300"><LocalTime utc={START} /></span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ CHALLENGE: three levels ============ */}
      <section id="challenge" className="relative bg-white px-5 sm:px-8 py-24 sm:py-32" aria-labelledby="challenge-title">
        <div className="mx-auto max-w-6xl">
          <Reveal className="max-w-3xl">
            <Tag>The challenge</Tag>
            <h2 id="challenge-title" className="font-display text-4xl sm:text-6xl font-black uppercase leading-[0.95] tracking-tight text-slate-900">
              Any problem. <span className="hk-chunky-dark text-white">One working piece.</span>
            </h2>
            <p className="mt-5 text-lg text-slate-600 leading-relaxed">
              The theme is fully open. Tell us the bigger problem and who benefits, show what already exists and what your approach adds, then build the first slice that works for a real user.
            </p>
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {levels.map((l, i) => (
              <Reveal key={l.title} delay={i * 130}>
                <div className="group h-full rounded-3xl border-2 border-slate-900 bg-white p-7 shadow-[6px_6px_0_#14b8a6] transition-all duration-200 hover:-translate-y-1 hover:shadow-[10px_10px_0_#14b8a6]">
                  <div className="mb-6 flex items-center justify-between">
                    <span className="rounded-lg bg-slate-900 px-2.5 py-1 font-mono text-xs font-bold uppercase tracking-wider text-teal-300">Level {i + 1}</span>
                    <l.icon className="text-teal-700" size={26} />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-slate-900">{l.title}</h3>
                  <p className="mt-2 text-slate-600 leading-relaxed">{l.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-14">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Optional fields · not separate competitions</p>
            <div className="flex flex-wrap gap-3">
              {fields.map((f, i) => (
                <span
                  key={f}
                  className="rounded-full border-2 border-slate-900 bg-teal-50 px-4 py-1.5 text-sm font-medium text-slate-900 shadow-[3px_3px_0_#0f172a]"
                  style={{ transform: `rotate(${[-2, 1.5, -1, 2, -1.5, 1][i]}deg)` }}
                >
                  {f}
                </span>
              ))}
            </div>
            <p className="mt-10 max-w-3xl rounded-2xl border-2 border-dashed border-teal-600/50 bg-teal-50/50 px-5 py-4 text-slate-700">
              <span className="font-mono font-bold uppercase text-teal-800">No thin wrappers.</span> A named user, a workflow beyond a single model call, and honest disclosure of what works and what is simulated.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ TIMELINE IN THE SKY (Cal Hacks style) ============ */}
      <section
        ref={skyRef}
        id="schedule"
        style={{ '--p': 0.5 } as CSSProperties}
        className="relative overflow-hidden bg-gradient-to-b from-[#03121a] via-[#0b3b44] to-[#2a8c86] px-5 sm:px-8 pt-24 sm:pt-32 pb-40"
        aria-labelledby="schedule-title"
      >
        <Stars count={60} seed={42} className="[mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
        <div className="relative mx-auto max-w-6xl">
          <Reveal className="text-center">
            <Tag dark>Mark your calendar</Tag>
            <h2 id="schedule-title" className="font-display text-4xl sm:text-6xl font-black uppercase leading-[0.95] tracking-tight text-white">
              The road to <span className="text-teal-300">launch</span>
            </h2>
          </Reveal>

          {/* desktop: clouds drifting along a dashed flight path */}
          <div className="relative mt-16 hidden h-[420px] lg:block">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 420" preserveAspectRatio="none" aria-hidden="true">
              <path d="M10 330 C 150 330, 170 120, 330 140 S 520 330, 660 250 S 840 70, 990 90" fill="none" stroke="rgba(204,251,241,0.55)" strokeWidth="2" strokeDasharray="7 9" />
            </svg>
            {milestones.map((m, i) => {
              const pos = [
                { left: '0%', top: '255px' },
                { left: '17%', top: '95px' },
                { left: '35%', top: '200px' },
                { left: '52%', top: '260px' },
                { left: '68%', top: '120px' },
                { left: '84%', top: '15px' },
              ][i];
              const depth = [0.6, -0.4, 0.8, -0.6, 0.5, -0.8][i];
              return (
                <div
                  key={m.title}
                  className="absolute"
                  style={{ ...pos, transform: `translate3d(calc((var(--p) - 0.5) * ${depth * 120}px), 0, 0)` }}
                >
                  <Cloud delay={i * 1.3} tone={m.big ? 'teal' : 'white'}>
                    <span className="flex flex-col items-start leading-tight normal-case">
                      <span className="text-base sm:text-lg font-black tracking-tight">{m.date}</span>
                      <span className="text-[11px] tracking-[0.12em] uppercase">{m.title}</span>
                    </span>
                  </Cloud>
                </div>
              );
            })}
          </div>

          {/* mobile: stacked clouds */}
          <ol className="mt-12 space-y-6 lg:hidden">
            {milestones.map((m, i) => (
              <li key={m.title} className={i % 2 ? 'text-right' : 'text-left'}>
                <Cloud delay={i} tone={m.big ? 'teal' : 'white'}>
                  <span className="flex flex-col items-start leading-tight normal-case">
                    <span className="text-base font-black tracking-tight">{m.date}</span>
                    <span className="text-[11px] tracking-[0.12em] uppercase">{m.title}</span>
                  </span>
                </Cloud>
              </li>
            ))}
          </ol>

          {/* full schedule with local times */}
          <Reveal className="mt-16">
            <details className="group rounded-3xl border border-white/15 bg-slate-950/60 backdrop-blur">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-mono text-sm uppercase tracking-[0.15em] text-white [&::-webkit-details-marker]:hidden">
                Full schedule in your time zone
                <ChevronDown className="text-teal-300 transition-transform duration-300 group-open:rotate-180" size={20} />
              </summary>
              <ol className="divide-y divide-white/5 border-t border-white/10">
                {schedule.map((r) => (
                  <li key={r.when + r.what} className={`grid gap-1 px-6 py-4 sm:grid-cols-[180px_1fr_220px] sm:gap-4 ${r.key ? 'bg-teal-400/[0.07]' : ''}`}>
                    <span className="font-mono text-xs sm:text-sm text-slate-400 tabular-nums">{r.when} UTC</span>
                    <span className={r.key ? 'font-semibold text-white' : 'text-slate-200'}>{r.what}</span>
                    <span className="font-mono text-sm text-teal-300 tabular-nums">{r.utc ? <LocalTime utc={r.utc} /> : '—'}</span>
                  </li>
                ))}
              </ol>
            </details>
          </Reveal>
        </div>
        {/* horizon */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-[radial-gradient(ellipse_70%_100%_at_50%_100%,rgba(240,253,250,0.35),transparent_70%)]" aria-hidden="true" />
      </section>

      {/* ============ PRIZES ============ */}
      <section id="prizes" className="hk-paper relative px-5 sm:px-8 py-24 sm:py-32" aria-labelledby="prizes-title">
        <div className="mx-auto max-w-6xl">
          <Reveal className="text-center">
            <Tag>Prizes · funded by Fundex Global</Tag>
            <h2 id="prizes-title" className="font-display text-4xl sm:text-6xl font-black uppercase leading-[0.95] tracking-tight text-slate-900">
              Prizes worth building for
            </h2>
            <p className="mt-4 font-mono text-sm uppercase tracking-[0.18em] text-teal-700">Prize amounts and partner prizes announced soon</p>
          </Reveal>
          <div className="mt-14 grid items-end gap-6 md:grid-cols-3">
            {[1, 0, 2].map((idx) => {
              const p = prizes[idx];
              const first = idx === 0;
              return (
                <Reveal key={p.label} variant="zoom" delay={first ? 0 : 150}>
                  <div
                    className={`rounded-3xl border-2 border-slate-900 p-8 text-center ${
                      first ? 'bg-slate-900 text-white shadow-[8px_8px_0_#14b8a6] md:pb-14 md:pt-12' : 'bg-white shadow-[6px_6px_0_#0f172a]'
                    }`}
                  >
                    <p.icon className={`mx-auto ${first ? 'text-teal-300' : 'text-teal-700'}`} size={first ? 44 : 34} />
                    <p className={`mt-4 font-display font-black tracking-tight ${first ? 'hk-chunky text-6xl sm:text-7xl' : 'text-5xl text-slate-900'}`}>{p.amount}</p>
                    <p className={`mt-3 font-mono text-xs uppercase tracking-[0.2em] ${first ? 'text-teal-200' : 'text-slate-500'}`}>{p.label}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <Reveal className="mt-12 grid gap-6 md:grid-cols-2 text-slate-600 leading-relaxed">
            <p>
              Team prizes, one per team, paid in Australian dollars by bank transfer to the team’s Australia-based member. A beginner-led team is one where at least half the members have 12 months or less of hands-on building experience.
            </p>
            <p>
              <span className="font-semibold text-slate-900">Certificates:</span> Participation, Completion, Finalist (top 25% of eligible submissions, maximum 6 teams), Winner, and individual Community Champion awards. Partner prizes are listed only once confirmed in writing. All prizes are subject to the Official Rules.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ JUDGING: pixel bars ============ */}
      <section id="judging" className="relative bg-slate-950 px-5 sm:px-8 py-24 sm:py-32" aria-labelledby="judging-title">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <Tag dark>Judging</Tag>
            <h2 id="judging-title" className="font-display text-4xl sm:text-6xl font-black uppercase leading-[0.95] tracking-tight text-white">
              Working evidence <span className="text-teal-300">counts most.</span>
            </h2>
            <p className="mt-5 text-lg text-slate-300 leading-relaxed">
              At least two independent human judges score each project. Pitch polish, expensive models and team size earn nothing extra. Judges will be announced once confirmed.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <ul className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              {weights.map(([name, w]) => (
                <li key={name}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-4">
                    <span className="text-sm sm:text-base text-slate-200">{name}</span>
                    <span className="font-mono text-sm font-bold text-teal-300 tabular-nums">{w}%</span>
                  </div>
                  <span className="flex gap-1" aria-hidden="true">
                    {Array.from({ length: 6 }, (_, k) => (
                      <span key={k} className={`h-3 flex-1 rounded-[3px] ${k < w / 5 ? 'bg-teal-400' : 'bg-white/10'}`} />
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ============ SPONSOR US ============ */}
      <section id="sponsor" className="relative overflow-hidden bg-teal-400 px-5 sm:px-8 py-24 sm:py-28" aria-labelledby="sponsor-title">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(2,6,23,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(2,6,23,0.08)_1px,transparent_1px)] bg-[size:28px_28px]" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-end">
            <Reveal>
              <p className="mb-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-slate-900">
                <span className="h-2.5 w-2.5 bg-slate-900" aria-hidden="true" /> Partners
              </p>
              <h2 id="sponsor-title" className="font-display text-4xl sm:text-6xl font-black uppercase leading-[0.95] tracking-tight text-slate-950">
                Put your tools in builders’ hands.
              </h2>
              <p className="mt-5 text-lg text-slate-900/80">
                Back a global hackathon where every prize team includes an Australian builder. We never share participant data, sell guaranteed numbers, or let partners influence judging.
              </p>
              <Link
                to="/contact"
                className="mt-8 inline-flex items-center gap-2 rounded-2xl border-2 border-slate-950 bg-slate-950 px-7 py-4 font-mono text-sm font-bold uppercase tracking-wider text-teal-300 shadow-[6px_6px_0_#f0fdfa] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0_#f0fdfa]"
              >
                Ask for the sponsor pack <ArrowRight size={18} />
              </Link>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              {tiers.map((t, i) => (
                <Reveal key={t.name} delay={i * 90}>
                  <div className="h-full rounded-2xl border-2 border-slate-950 bg-[#f0fdfa] p-5 shadow-[5px_5px_0_#020617]">
                    <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-teal-800">{t.name}</p>
                    <p className="mt-2 text-sm text-slate-700">{t.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex h-24 items-center justify-center rounded-2xl border-2 border-dashed border-slate-950/40 font-mono text-xs uppercase tracking-[0.2em] text-slate-950/60">
                Your logo here
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ RULES + FAQ ============ */}
      <section id="rules" className="relative bg-white px-5 sm:px-8 py-24 sm:py-32" aria-labelledby="rules-title">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Tag>Rules, ownership and privacy</Tag>
            <h2 id="rules-title" className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight text-slate-900">The short version</h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {rules.map((r, i) => (
              <Reveal key={r.title} delay={i * 110}>
                <div className="h-full rounded-3xl border-2 border-slate-900 p-7">
                  <r.icon className="mb-5 text-teal-700" size={26} />
                  <h3 className="font-display text-xl font-bold text-slate-900">{r.title}</h3>
                  <p className="mt-2 text-slate-600 leading-relaxed">{r.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 font-mono text-xs text-slate-500">The full Official Rules, Privacy Notice and Code of Conduct will be linked here before registration opens.</p>

          <div id="faq" className="mx-auto mt-24 max-w-3xl">
            <Reveal className="mb-8">
              <Tag>FAQ</Tag>
              <h2 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight text-slate-900">Questions</h2>
            </Reveal>
            <div className="space-y-3">
              {faqs.map((f) => (
                <details key={f.q} className="group rounded-2xl border-2 border-slate-900 bg-white px-6 py-5 open:shadow-[5px_5px_0_#14b8a6] transition-shadow">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <ChevronDown className="shrink-0 text-teal-700 transition-transform duration-300 group-open:rotate-180" size={20} />
                  </summary>
                  <p className="mt-3 text-slate-600 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ FINALE ============ */}
      <section className="relative overflow-hidden bg-[#03121a] px-5 sm:px-8 pt-24 sm:pt-32">
        <Stars count={90} seed={99} />
        <Plane text="See you on 23 Jan" className="top-10" />
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <Reveal variant="zoom">
            <Rocket className="mx-auto mb-6 text-teal-300" size={40} />
            <h2 className="hk-chunky font-display text-5xl sm:text-7xl lg:text-8xl font-black uppercase leading-[0.9] tracking-[-0.03em]">
              Prove the first piece.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-slate-300">
              Free, online and open to everyone 18+. Questions?{' '}
              <Link to="/contact" className="text-teal-300 underline decoration-teal-300/40 underline-offset-4 hover:text-teal-200">Get in touch</Link>.
            </p>
            <div className="mt-10 flex justify-center">
              <RegisterButton light />
            </div>
          </Reveal>
        </div>
        <div className="relative mt-14 h-[240px] sm:h-[360px] overflow-hidden">
          <div className="absolute left-1/2 top-0 w-[640px] sm:w-[1000px] -translate-x-1/2">
            <Globe theta={0.35} />
          </div>
        </div>
      </section>
    </div>
  );
}
