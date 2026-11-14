import { ArrowRight, TrendingUp, Users, ShieldCheck, Compass, Target, Rocket, LineChart } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import HeroCanvas from '../components/fx/HeroCanvas';
import Reveal from '../components/fx/Reveal';
import Spotlight from '../components/fx/Spotlight';
import CinemaHero from '../components/cinema/CinemaHero';
import Manifesto from '../components/cinema/Manifesto';
import HorizontalJourney from '../components/cinema/HorizontalJourney';
import ServiceShowcase from '../components/cinema/ServiceShowcase';
import { AdvisoryVisual, PlanningVisual, PartnershipsVisual } from '../components/cinema/ServiceVisuals';

const journey = [
  {
    icon: Compass,
    step: '01',
    title: 'Discover',
    text: 'Where you are, where you want to go, and what is in the way.',
    deliverable: 'a one-page summary of your situation, goals and constraints.',
  },
  {
    icon: Target,
    step: '02',
    title: 'Focus',
    text: 'The few priorities that matter, turned into a clear plan.',
    deliverable: 'a prioritised 90-day plan with owners and milestones.',
  },
  {
    icon: Rocket,
    step: '03',
    title: 'Execute',
    text: 'Hands-on support to put the plan into motion.',
    deliverable: 'a weekly delivery rhythm and launch checklist.',
  },
  {
    icon: LineChart,
    step: '04',
    title: 'Grow',
    text: 'Review, learn and scale what works.',
    deliverable: 'a simple dashboard of the measures that matter.',
  },
];

const services = [
  {
    kicker: 'Strategy',
    title: 'Strategic Advisory',
    text: 'From market positioning to growth strategy, we help you make the critical decisions, then stay involved while the plan is put into action.',
    points: ['Go-to-market', 'Business model', 'Scaling', 'Expansion'],
    Visual: AdvisoryVisual,
  },
  {
    kicker: 'Planning',
    title: 'Business Planning',
    text: 'Your plan, presentation and operating information made clear, consistent and ready to share with partners, lenders or boards.',
    points: ['Business plan', 'Pitch narrative', 'Operating numbers', 'Q&A practice'],
    Visual: PlanningVisual,
  },
  {
    kicker: 'Growth',
    title: 'Partnerships & Growth',
    text: 'Find, shape and start the commercial partnerships that move a business forward: distribution, supply, channel and delivery partners.',
    points: ['Partner research', 'Proposals', 'Introductions', 'Business development'],
    Visual: PartnershipsVisual,
  },
];

const highlights = [
  {
    icon: TrendingUp,
    title: 'Growth-Oriented',
    description: 'Practical plans and priorities built for sustainable expansion.',
  },
  {
    icon: Users,
    title: 'Founder-First',
    description: 'Hands-on operational support beyond advice, aligned with your long-term vision.',
  },
  {
    icon: ShieldCheck,
    title: 'Clear Scope',
    description: 'We agree what we will do, and how we will measure progress, before any work starts.',
  },
];

function Home() {
  return (
    <div className="pt-20">
      <Helmet>
        <title>Fund'ex | Strategy & Execution Partner for Founders | Fundex Global</title>
        <meta name="description" content="Fundex Global is a Melbourne-based strategy and execution partner helping founders and growing businesses with strategy, business planning, growth and partnerships." />
        <link rel="canonical" href="https://www.fundexglobal.vc/" />
      </Helmet>

      {/* 1 · Opening scene */}
      <CinemaHero />

      {/* 2 · The idea, lit word by word */}
      <Manifesto
        id="story"
        eyebrow="Why Fund'ex exists"
        text="Good strategy is common. *Execution* is rare. Fund'ex brings both together, so your plan *doesn't* *stay* *a* *plan.*"
      />

      {/* 3 · The journey, sliding past */}
      <HorizontalJourney steps={journey} />

      {/* 4 · What we do */}
      <ServiceShowcase services={services} />

      {/* 5 · How we work with you */}
      <section className="relative py-24 sm:py-32 px-5 sm:px-8 bg-gray-50 border-t border-gray-200" aria-labelledby="why-title">
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-14 max-w-3xl">
            <p className="text-xs tracking-[0.3em] uppercase text-teal-700 mb-4">Why Fund'ex</p>
            <h2 id="why-title" className="text-4xl sm:text-5xl font-light text-slate-900">
              Builders and long-term partners, <span className="font-medium text-teal-700">not just advisors.</span>
            </h2>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {highlights.map((item, index) => (
              <Reveal key={item.title} delay={index * 140}>
                <Spotlight className="h-full rounded-3xl border border-gray-200 bg-white p-8 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-600/10 group">
                  <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 transition-colors duration-500 group-hover:bg-teal-600 group-hover:text-white">
                    <item.icon size={22} />
                  </div>
                  <h3 className="text-2xl font-light text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </Spotlight>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6 · Finale */}
      <section className="relative min-h-[90svh] flex items-center justify-center overflow-hidden bg-slate-950 px-5 sm:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,rgba(20,184,166,0.18),transparent_70%)]" />
        <HeroCanvas density={4} className="opacity-50" />
        <Reveal variant="zoom" className="relative text-center max-w-4xl">
          <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-teal-300/80 mb-6">Ready when you are</p>
          <h2 className="font-display text-5xl sm:text-7xl lg:text-8xl font-light tracking-[-0.04em] text-white mb-8 leading-[1.02]">
            Let's build <span className="font-medium text-shimmer">what's next.</span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Whether you need strategic guidance, business planning, or hands-on execution support, start with a conversation.
          </p>
          <Link
            to="/contact"
            className="btn-sheen group inline-flex items-center gap-2 px-9 py-4 rounded-full bg-white text-slate-950 font-semibold text-lg shadow-[0_0_60px_-10px_rgba(45,212,191,0.7)] hover:bg-teal-50 transition-all duration-300"
          >
            Start a Conversation
            <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" size={20} />
          </Link>
        </Reveal>
      </section>
    </div>
  );
}

export default Home;
