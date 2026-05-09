import { Eye, Zap, Layers, Target, Users2, LineChart } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

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
      <section className="py-24 px-6 lg:px-8 bg-gradient-to-b from-blue-950/10 to-slate-950">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-light tracking-wide">
              Our Approach
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-light mb-6">
            Principles That
            <br />
            Drive Everything
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed">
            Our investment philosophy isn't about trends or hype. It's about identifying
            exceptional founders and backing them with patient, strategic capital.
          </p>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-24">
          {principles.map((principle, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } gap-12 items-center`}
            >
              <div className="flex-1 space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
                  <principle.icon className="text-blue-400" size={36} />
                </div>

                <div>
                  <h2 className="text-4xl font-light mb-2">{principle.title}</h2>
                  <p className="text-blue-400 text-xl font-light">{principle.subtitle}</p>
                </div>

                <p className="text-slate-300 text-lg leading-relaxed">
                  {principle.description}
                </p>
              </div>

              <div className="flex-1">
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
                  <h3 className="text-lg font-medium mb-6 text-slate-300">In Practice</h3>
                  <div className="space-y-4">
                    {principle.details.map((detail, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-3 p-3 rounded-lg bg-slate-950/50"
                      >
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-slate-300">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 lg:px-8 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light mb-6">How We Work</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Our process is designed for clarity and speed. From first meeting to partnership,
              we prioritize transparency and mutual respect.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {process.map((item, index) => (
              <div
                key={index}
                className="relative group"
              >
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 h-full hover:border-blue-500/50 transition-all">
                  <div className="absolute -top-4 left-8 px-4 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                    {item.step}
                  </div>

                  <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 mt-4 group-hover:bg-blue-500/20 transition-all">
                    <item.icon className="text-blue-400" size={28} />
                  </div>

                  <h3 className="text-2xl font-light mb-4">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{item.description}</p>
                </div>

                {index < process.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-slate-800 to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-blue-950/30 to-slate-900/30 border border-slate-800 rounded-3xl p-12 md:p-16">
            <div className="max-w-3xl">
              <h2 className="text-4xl font-light mb-6">What Sets Us Apart</h2>
              <div className="space-y-6 text-slate-300 leading-relaxed text-lg">
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

              <div className="mt-10 pt-10 border-t border-slate-700">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <div className="text-3xl font-light text-blue-400 mb-1">5-10</div>
                    <div className="text-slate-400 text-sm">Active investments per year</div>
                  </div>
                  <div>
                    <div className="text-3xl font-light text-blue-400 mb-1">87%</div>
                    <div className="text-slate-400 text-sm">Founder-led board seats</div>
                  </div>
                  <div>
                    <div className="text-3xl font-light text-blue-400 mb-1">2+ yrs</div>
                    <div className="text-slate-400 text-sm">Average hold period</div>
                  </div>
                  <div>
                    <div className="text-3xl font-light text-blue-400 mb-1">24/7</div>
                    <div className="text-slate-400 text-sm">Founder access</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-light mb-6">Ready to Build Together?</h2>
          <p className="text-slate-400 text-lg mb-10">
            If our approach resonates with your vision, let's start a conversation.
          </p>
          <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all text-lg">
            Get in Touch
          </button>
        </div>
      </section>
    </div>
  );
}

export default Approach;
