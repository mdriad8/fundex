import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Award, BadgeCheck, Globe2, Link2, MessageCircle, Share2, ShieldAlert, Sparkles, Users } from 'lucide-react';
import Reveal from '../components/fx/Reveal';
import ApplicationForm from './hackathon/ApplicationForm';
import { EventBar, Meta, PageHero, Tag } from './hackathon/Layout';
import { forms } from './hackathon/applications';

const tasks = [
  { icon: Share2, t: 'Share the event', d: 'Post three ready-made updates in the channels you already use: your club, class groups, LinkedIn.' },
  { icon: Users, t: 'Connect clubs', d: 'Introduce us to one or two student clubs or societies on your campus.' },
  { icon: MessageCircle, t: 'Answer questions', d: 'Point classmates to the official page and help them find teammates.' },
  { icon: Sparkles, t: 'Optional extras', d: 'Run a 30-minute online info session, suggest a speaker, or ask your university to share the event.' },
];

const perks = [
  { icon: BadgeCheck, t: 'Verified certificate', d: 'A Fund’ex Campus Ambassador certificate for your CV.' },
  { icon: Globe2, t: 'Ambassador wall', d: 'Your name and university on our global ambassador page (if you want it).' },
  { icon: Link2, t: 'LinkedIn recognition', d: 'A public thank-you from Fund’ex, and a personal reference for standout work.' },
  { icon: Award, t: 'Top Ambassador awards', d: 'Recognition for the ambassadors who make the biggest verified difference.' },
];

const facts = [
  ['1–2 h', 'A week, flexible'],
  ['Any', 'Country or campus'],
  ['Free', 'No fees, ever'],
  ['18+', 'To apply'],
];

export default function HackathonAmbassadors() {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash === '#apply') window.setTimeout(() => document.getElementById('apply')?.scrollIntoView({ block: 'start' }), 300);
  }, [hash]);

  return (
    <div className="pt-16 sm:pt-20">
      <Meta
        title="Campus Ambassadors | Beyond the Prompt 2027"
        description="Bring your campus into a global community of AI builders. Become a Campus Ambassador for Beyond the Prompt 2027, the free AI & automation conference and 48-hour hackathon."
        path="/hackathon/ambassadors"
      />
      <EventBar />
      <PageHero
        crumb="Campus Ambassadors"
        eyebrow="Segment 04 · Campus Ambassadors"
        title={<>Bring your campus to the build.</>}
        intro={
          <p>
            Beyond the Prompt brings builders from around the world together for a free AI &amp; automation conference and 48-hour hackathon on 23–25 January 2027. Campus Ambassadors make sure their university is part of it.
          </p>
        }
      >
        <div className="mt-10 flex flex-wrap items-center gap-5">
          <a
            href="#apply"
            className="group inline-flex items-center gap-2 rounded-2xl border-2 border-slate-950 bg-teal-400 px-7 py-4 font-mono text-sm font-bold uppercase tracking-wider text-slate-950 shadow-[6px_6px_0_#f0fdfa] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0_#f0fdfa]"
          >
            Apply now
          </a>
          <p className="font-mono text-xs uppercase tracking-wider text-slate-400">Applications reviewed weekly</p>
        </div>
        <div className="mt-10 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-teal-300/20 bg-teal-300/20 sm:grid-cols-4">
          {facts.map(([v, l]) => (
            <div key={l} className="bg-[#03121a] px-5 py-4">
              <p className="font-display text-2xl font-black text-white">{v}</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-slate-400">{l}</p>
            </div>
          ))}
        </div>
      </PageHero>

      <section className="hk-paper px-5 py-20 sm:px-8 sm:py-28" aria-labelledby="do-title">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Tag>What you do</Tag>
            <h2 id="do-title" className="font-display text-4xl font-black uppercase leading-[0.95] tracking-tight text-slate-900 sm:text-6xl">Light role, real impact</h2>
            <p className="mt-4 max-w-2xl text-lg text-slate-600">No quotas, no shifts, no selling. We give you the posts, graphics and answers. You bring your campus.</p>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {tasks.map((t, i) => (
              <Reveal key={t.t} delay={i * 80}>
                <div className="h-full rounded-3xl border-2 border-slate-900 bg-white p-6 shadow-[5px_5px_0_#020617]">
                  <p className="font-mono text-xs font-bold text-teal-700">0{i + 1} //</p>
                  <t.icon className="mt-4 text-slate-900" size={26} aria-hidden="true" />
                  <h3 className="mt-4 font-display text-xl font-bold text-slate-900">{t.t}</h3>
                  <p className="mt-2 text-slate-600">{t.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-5 py-20 sm:px-8 sm:py-28" aria-labelledby="get-title">
        <div className="mx-auto max-w-6xl">
          <Tag dark>What you get</Tag>
          <h2 id="get-title" className="font-display text-4xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-6xl">Recognition that travels</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {perks.map((p) => (
              <div key={p.t} className="h-full rounded-3xl border border-teal-300/25 bg-white/[0.03] p-6">
                <p.icon className="text-teal-300" size={26} aria-hidden="true" />
                <h3 className="mt-4 font-display text-xl font-bold text-white">{p.t}</h3>
                <p className="mt-2 text-slate-400">{p.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 p-7">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal-300">Who can apply</p>
              <ul className="mt-4 space-y-2 text-slate-300">
                <li>• Students at any level, researchers, staff and club committee members</li>
                <li>• At any university or college, in any country</li>
                <li>• Aged 18 or over</li>
                <li>• One or more ambassadors per campus are welcome</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-amber-300/30 bg-amber-300/[0.04] p-7">
              <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-amber-200">
                <ShieldAlert size={16} aria-hidden="true" /> Good to know
              </p>
              <ul className="mt-4 space-y-2 text-slate-300">
                <li>• Ambassadors represent the event, not their university. Please don&rsquo;t say your university endorses it.</li>
                <li>• Never promise prizes, jobs or money, and never collect anyone&rsquo;s personal details.</li>
                <li>• It&rsquo;s voluntary: step back any time, no questions asked.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="apply" className="hk-paper scroll-mt-32 px-5 py-20 sm:px-8 sm:py-28" aria-labelledby="apply-title">
        <div className="mx-auto max-w-4xl">
          <Tag>Apply</Tag>
          <h2 id="apply-title" className="font-display text-4xl font-black uppercase leading-[0.95] tracking-tight text-slate-900 sm:text-6xl">Become a Campus Ambassador</h2>
          <p className="mt-4 mb-10 text-lg text-slate-600">{forms.ambassador.intro} About five minutes. Fields marked * are required.</p>
          <ApplicationForm def={forms.ambassador} />
        </div>
      </section>
    </div>
  );
}
