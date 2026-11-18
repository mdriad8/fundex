import { Link } from 'react-router-dom';
import { ArrowRight, Building2, GraduationCap, Handshake, Megaphone, Mic, Users } from 'lucide-react';
import Reveal from '../components/fx/Reveal';
import { EventBar, Meta, PageHero, Status, Tag } from './hackathon/Layout';
import { CONTACT_EMAIL } from './hackathon/applications';

type Route = {
  n: string;
  icon: typeof Users;
  title: string;
  who: string;
  give: string[];
  get: string[];
  status: string;
  tone: 'open' | 'talk';
  cta: string;
  to?: string;
  href?: string;
};

const routes: Route[] = [
  {
    n: '01',
    icon: GraduationCap,
    title: 'Campus Ambassador',
    who: 'Students, researchers, staff and club leaders at any university or college, in any country.',
    give: ['Share the event on your campus', 'Introduce us to clubs', 'Optional: run an info or team-finding session'],
    get: ['Verified certificate', 'Listing on our ambassador wall', 'LinkedIn shout-out and Top Ambassador awards'],
    status: 'Open worldwide',
    tone: 'open',
    cta: 'Become an ambassador',
    to: '/hackathon/ambassadors',
  },
  {
    n: '02',
    icon: Users,
    title: 'Club Partner',
    who: 'Recognised student clubs and societies, anywhere in the world.',
    give: ['Share with your members', 'A newsletter item or team-forming session'],
    get: ['Official Club Partner badge', 'Listing on the partner register', 'An announcement post from Fund’ex'],
    status: 'Open to clubs',
    tone: 'open',
    cta: 'Apply as a club',
    to: '/hackathon/apply/club',
  },
  {
    n: '03',
    icon: Handshake,
    title: 'Community Partner',
    who: 'Developer groups, AI communities, meetups, Discords and nonprofits.',
    give: ['Bring your community into the event', 'Suggest mentors, judges or speakers'],
    get: ['Community Partner badge', 'Listing on the partner register', 'An announcement post'],
    status: 'Open',
    tone: 'open',
    cta: 'Apply as a community',
    to: '/hackathon/apply/community',
  },
  {
    n: '04',
    icon: Building2,
    title: 'University Partner',
    who: 'Universities, faculties, research centres and startup hubs.',
    give: ['One real contribution: a venue, official promotion, a University Representative, speakers or mentors'],
    get: ['Official University Partner recognition', 'Your representative opens or joins the panel', 'An outcomes report'],
    status: 'By conversation',
    tone: 'talk',
    cta: 'Start a conversation',
    to: '/hackathon/apply/university',
  },
  {
    n: '05',
    icon: Mic,
    title: 'Speaker',
    who: 'Practitioners, researchers and builders with something practical to teach.',
    give: ['A talk, workshop or panel spot: online on Sat 23 Jan or in person in Melbourne on Sun 24 Jan'],
    get: ['A speaker announcement', 'Your session streamed and recorded for every participant'],
    status: 'Call open to 8 Jan',
    tone: 'open',
    cta: 'Propose a session',
    to: '/hackathon/apply/speaker',
  },
  {
    n: '06',
    icon: Megaphone,
    title: 'Sponsor',
    who: 'Organisations backing practical AI skills and early-career talent.',
    give: ['Cash support for prizes and delivery, or in-kind credits and licences'],
    get: ['Packages from Main Sponsor to Supporting', 'Workshops, mentoring and recognition', 'An impact report'],
    status: 'Prospectus on request',
    tone: 'talk',
    cta: 'Request the prospectus',
    href: `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Beyond the Prompt 2027 sponsorship prospectus')}`,
  },
];

const steps = [
  { n: '01', t: 'Apply', d: 'Pick a route and fill in the short form. It takes about five minutes.' },
  { n: '02', t: 'We check', d: 'We verify every application personally and reply within about a week.' },
  { n: '03', t: 'You’re in', d: 'Approved partners get a welcome pack, posts to share and a listing, once you’ve approved the wording.' },
];

export default function HackathonContribute() {
  return (
    <div className="pt-16 sm:pt-20">
      <Meta
        title="Get involved | Beyond the Prompt 2027"
        description="Become a Campus Ambassador, Club, Community or University Partner, speaker or sponsor of Beyond the Prompt 2027, a free AI & automation conference and 48-hour hackathon."
        path="/hackathon/contribute"
      />
      <EventBar />
      <PageHero
        crumb="Get involved"
        eyebrow="Segment 03 · Get involved"
        title={<>Build it with&nbsp;us.</>}
        intro={<p>Beyond the Prompt is a free AI &amp; automation conference and 48-hour hackathon for builders worldwide. Here&rsquo;s every way you, your club, your community or your university can be part of it.</p>}
      >
        <div className="mt-10 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-teal-300/20 bg-teal-300/20 sm:grid-cols-4">
          {[
            ['6', 'Ways to take part'],
            ['Any', 'Country welcome'],
            ['Free', 'For every partner'],
            ['~1 week', 'To hear back'],
          ].map(([v, l]) => (
            <div key={l} className="bg-[#03121a] px-5 py-4">
              <p className="font-display text-2xl font-black text-white">{v}</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-slate-400">{l}</p>
            </div>
          ))}
        </div>
      </PageHero>

      <section className="hk-paper px-5 py-20 sm:px-8 sm:py-28" aria-labelledby="routes-title">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Tag>Contribution routes</Tag>
            <h2 id="routes-title" className="font-display text-4xl font-black uppercase leading-[0.95] tracking-tight text-slate-900 sm:text-6xl">Choose your route</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {routes.map((r, i) => {
              const inner = (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-sm font-bold text-teal-700">{r.n} //</span>
                      <r.icon className="text-slate-900" size={26} aria-hidden="true" />
                    </div>
                    <Status tone={r.tone}>{r.status}</Status>
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-black uppercase tracking-tight text-slate-900 sm:text-3xl">{r.title}</h3>
                  <p className="mt-2 text-slate-600">{r.who}</p>
                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    <div>
                      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">You give</p>
                      <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
                        {r.give.map((g) => <li key={g} className="flex gap-2"><span className="text-teal-600">+</span>{g}</li>)}
                      </ul>
                    </div>
                    <div>
                      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">You get</p>
                      <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
                        {r.get.map((g) => <li key={g} className="flex gap-2"><span className="text-teal-600">→</span>{g}</li>)}
                      </ul>
                    </div>
                  </div>
                  <span className="mt-7 inline-flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-wider text-teal-800 group-hover:text-teal-950">
                    {r.cta} <ArrowRight className="transition-transform group-hover:translate-x-1" size={16} />
                  </span>
                </>
              );
              const cls =
                'group flex h-full flex-col rounded-3xl border-2 border-slate-900 bg-white p-7 shadow-[6px_6px_0_#020617] transition-all hover:-translate-y-1 hover:shadow-[8px_10px_0_#14b8a6] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-300';
              return (
                <Reveal key={r.n} delay={(i % 2) * 90}>
                  {r.to ? (
                    <Link to={r.to} className={cls}>{inner}</Link>
                  ) : (
                    <a href={r.href} className={cls}>{inner}</a>
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative bg-slate-950 px-5 py-20 sm:px-8 sm:py-24" aria-labelledby="how-title">
        <div className="mx-auto max-w-6xl">
          <Tag dark>How it works</Tag>
          <h2 id="how-title" className="font-display text-4xl font-black uppercase tracking-tight text-white sm:text-5xl">Three steps</h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <li key={s.n} className="rounded-3xl border border-teal-300/25 bg-white/[0.03] p-7">
                <p className="font-mono text-sm font-bold text-teal-300">{s.n} //</p>
                <p className="mt-3 font-display text-2xl font-bold text-white">{s.t}</p>
                <p className="mt-2 text-slate-400">{s.d}</p>
              </li>
            ))}
          </ol>
          <p className="mt-10 max-w-3xl text-sm text-slate-400">
            Listings appear only after approval and only with the names and logos you&rsquo;ve agreed to. Joining as an ambassador or club doesn&rsquo;t mean your university endorses the event. We never share applicant or participant details with sponsors. Questions?{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-teal-300 underline underline-offset-4">{CONTACT_EMAIL}</a>
          </p>
        </div>
      </section>
    </div>
  );
}
