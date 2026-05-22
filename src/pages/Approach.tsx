import { Eye, Zap, Layers, Target, Users2, LineChart } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

function Approach() {
  const principles = [
    {
      icon: Eye,
      title: 'Vision',
      subtitle: 'We back ideas with long-term relevance',
      description:
        'Short-term thinking builds fragile companies. We invest in businesses solving meaningful problems with sustainable competitive advantages. Our horizon is measured in decades, not exit windows.',
      details: [
        'Focus on structural market shifts',
        'Prioritize defensible moats',
        'Value mission-driven founders',
        'Long-term capital allocation',
      ],
    },
    {
      icon: Zap,
      title: 'Velocity',
      subtitle: 'We move with purpose, not noise',
      description:
        'Speed matters, but direction matters more. We make decisive moves based on deep conviction and thorough diligence. No bureaucracy, no committees — just clear thinking and fast execution.',
      details: [
        'Streamlined decision-making',
        'Direct founder access',
        'Rapid deployment capability',
        'Bias toward action',
      ],
    },
    {
      icon: Layers,
      title: 'Scalability',
      subtitle: 'We build systems that last',
      description:
        'Growth without infrastructure is chaos. We help founders build organizations designed to scale — from hiring frameworks to operational systems to capital planning.',
      details: [
        'Operational excellence focus',
        'Scalable team structures',
        'Process optimization',
        'Technology-first mindset',
      ],
    },
  ];

  const process = [
    {
      icon: Target,
      step: '01',
      title: 'Discovery',
      description:
        'We begin with deep conversations about your vision, market opportunity, and capital needs. No templates, no generic pitches — just honest dialogue about where you are and where you want to go.',
    },
    {
      icon: Users2,
      step: '02',
      title: 'Evaluation',
      description:
        'Our diligence is thorough but respectful. We assess market dynamics, competitive positioning, team capability, and financial fundamentals. We move quickly and communicate transparently throughout.',
    },
    {
      icon: LineChart,
      step: '03',
      title: 'Partnership',
      description:
        'Once aligned, we move fast. Clean term sheets, founder-friendly structures, and rapid deployment. Then the real work begins — we roll up our sleeves and help you build.',
    },
  ];

  return (
    <div className="pt-20">
      <Helmet>
        <title>Our Approach | Strategic Startup Investment | Fundex Global</title>
        <meta name="description" content="Discover Fundex Global's investment approach focused on innovation, founder partnerships, strategic guidance, scalable growth, and long-term startup success." />
        <meta name="keywords" content="investment strategy, startup approach, venture capital strategy, founder partnership, startup innovation, scalable business growth" />
        <link rel="canonical" href="https://fundexglobal.vc/approach" />
      </Helmet>

      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 overflow-hidden">
        {/* Radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-800/20 via-transparent to-transparent" />
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

        <div className="relative max-w-4xl mx-auto text-center w-full">
          <div className="mb-5 sm:mb-6">
            <span className="inline-block px-4 sm:px-5 py-2 bg-teal-500/10 border border-teal-500/30 rounded-full text-teal-400 text-xs sm:text-sm font-light tracking-widest">
              Our Approach
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light mb-5 sm:mb-6 leading-tight text-white">
            Principles That
            <br />
            <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Drive Everything
            </span>
          </h1>
          <p className="text-base sm:text-xl text-slate-400 leading-relaxed px-2">
            Our investment philosophy isn't about trends or hype. It's about identifying
            exceptional founders and backing them with patient, strategic capital.
          </p>
        </div>
      </section>

      {/* Principles */}
      <section className="py-12 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto space-y-16 lg:space-y-24">
          {principles.map((principle, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } gap-8 lg:gap-12 items-start lg:items-center`}
            >
              <div className="flex-1 space-y-5 sm:space-y-6 w-full">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-teal-50 border border-teal-100 rounded-2xl flex items-center justify-center">
                  <principle.icon className="text-teal-600" size={32} />
                </div>

                <div>
                  <h2 className="text-3xl sm:text-4xl font-light mb-2 text-slate-900">{principle.title}</h2>
                  <p className="text-teal-600 text-base sm:text-xl font-light">{principle.subtitle}</p>
                </div>

                <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                  {principle.description}
                </p>
              </div>

              <div className="flex-1 w-full">
                <div className="bg-teal-50/50 border border-teal-100 rounded-2xl p-6 sm:p-8 hover:border-teal-400/40 transition-all duration-300">
                  <h3 className="text-base sm:text-lg font-medium mb-5 sm:mb-6 text-slate-700">In Practice</h3>
                  <div className="space-y-3">
                    {principle.details.map((detail, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-3 p-3 rounded-xl bg-white border border-gray-100 shadow-sm hover:border-teal-400/30 transition-all duration-200"
                      >
                        <div className="w-2 h-2 bg-teal-500 rounded-full flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How We Work */}
      <section className="py-14 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 to-teal-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light mb-4 sm:mb-6 text-white">How We Work</h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
              Our process is designed for clarity and speed. From first meeting to partnership,
              we prioritize transparency and mutual respect.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {process.map((item, index) => (
              <div key={index} className="relative group mt-4">
                <div className="bg-white/[0.08] border border-white/10 rounded-2xl p-6 sm:p-8 h-full hover:border-teal-400/40 hover:bg-white/[0.12] transition-all duration-300">
                  <div className="absolute -top-4 left-6 sm:left-8 px-4 py-1 bg-teal-500 text-white text-sm font-medium rounded-full shadow-lg shadow-teal-600/20">
                    {item.step}
                  </div>

                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-teal-500/20 border border-teal-500/20 rounded-xl flex items-center justify-center mb-5 sm:mb-6 mt-3 sm:mt-4 transition-all duration-300">
                    <item.icon className="text-teal-400" size={24} />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-light mb-3 sm:mb-4 text-white">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm sm:text-base">{item.description}</p>
                </div>

                {index < process.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-teal-500/30 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Sets Us Apart */}
      <section className="py-14 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-teal-600 rounded-3xl p-6 sm:p-10 md:p-16">
            <div className="max-w-3xl">
              <h2 className="text-3xl sm:text-4xl font-light mb-5 sm:mb-6 text-white">What Sets Us Apart</h2>
              <div className="space-y-5 sm:space-y-6 text-white/85 leading-relaxed text-base sm:text-lg">
                <p>
                  We're not a traditional venture firm obsessed with quick flips or portfolio size.
                  We're operators who became investors because we saw the gap between capital and real support.
                </p>
                <p>
                  Every partner at Fund'ex has built, scaled, and exited companies. We've been in your seat.
                  We know what keeps you up at night, and more importantly, we know how to help.
                </p>
                <p>
                  Our portfolio is intentionally concentrated. We take fewer bets and invest more time.
                  When we partner with you, you get our full attention — not just our capital.
                </p>
              </div>

              <div className="mt-8 sm:mt-10 pt-8 sm:pt-10 border-t border-white/25">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6">
                  {[
                    { value: '5-10', label: 'Active investments per year' },
                    { value: '87%', label: 'Founder-led board seats' },
                    { value: '2+ yrs', label: 'Average hold period' },
                    { value: '24/7', label: 'Founder access' },
                  ].map((stat, i) => (
                    <div key={i}>
                      <div className="text-2xl sm:text-3xl font-light text-white mb-1">
                        {stat.value}
                      </div>
                      <div className="text-white/75 text-xs sm:text-sm leading-snug">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 md:py-24 px-4 sm:px-6 lg:px-8 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-light mb-4 sm:mb-6 text-white">Ready to Build Together?</h2>
          <p className="text-slate-400 text-base sm:text-lg mb-8 sm:mb-10">
            If our approach resonates with your vision, let's start a conversation.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-6 sm:px-8 py-3.5 sm:py-4 bg-teal-600 hover:bg-teal-500 text-white rounded-xl shadow-lg shadow-teal-600/20 hover:shadow-teal-600/35 transition-all duration-300 text-base sm:text-lg cursor-pointer"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Approach;
