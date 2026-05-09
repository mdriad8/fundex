import { TrendingUp, Compass, Briefcase, ChevronRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';


function Services() {
  const services = [
    {
      icon: TrendingUp,
      title: 'Venture Capital',
      subtitle: 'Early-stage to growth investments',
      description:
        'We invest in founders with vision, discipline, and ambition. Our capital is patient, strategic, and aligned with long-term value creation.',
      features: [
        'Seed to Series B investments',
        'Flexible deal structures',
        'Hands-on operational support',
        'Network access and introductions',
        'Follow-on capital reserves',
      ],
      investmentRange: '$500K - $25M',
      focus: 'Technology, Healthcare, Climate, FinTech',
    },
    {
      icon: Compass,
      title: 'Strategic Advisory',
      subtitle: 'Scaling, positioning & execution',
      description:
        'From market positioning to growth strategy, we support founders through critical decisions with data-driven insights and proven frameworks.',
      features: [
        'Go-to-market strategy',
        'Fundraising preparation',
        'Organizational scaling',
        'Product-market fit optimization',
        'International expansion planning',
      ],
      timeline: '3-12 month engagements',
      focus: 'High-growth startups and scale-ups',
    },
    {
      icon: Briefcase,
      title: 'Business Brokerage',
      subtitle: 'Acquisitions, exits & M&A',
      description:
        'We advise on acquisitions, exits, and strategic transactions with discretion and precision, ensuring optimal outcomes for all stakeholders.',
      features: [
        'Buy-side and sell-side advisory',
        'Business valuation and modeling',
        'Deal structuring and negotiation',
        'Due diligence coordination',
        'Post-transaction integration',
      ],
      dealSize: '$5M - $500M+',
      focus: 'Technology and services sectors',
    },
  ];

  return (
    <div className="pt-20">
      <Helmet>
        <title>Services | Startup Funding & Growth Solutions | Fundex Global</title>
        <meta name="description" content="Explore Fundex Global services including startup investment, venture capital support, strategic advisory, business scaling, mentorship, and founder growth solutions." />
        <meta name="keywords" content="startup services, venture capital services, startup mentorship, founder support, startup growth, business scaling, investment advisory" />
        <link rel="canonical" href="https://fundexglobal.vc/services" />
      </Helmet>
      <section className="py-24 px-6 lg:px-8 bg-gradient-to-b from-blue-950/10 to-slate-950">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-light tracking-wide">
              Our Services
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-light mb-6">
            Comprehensive Support,
            <br />
            Every Stage
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed">
            From inception to exit, we provide the capital, expertise, and
            network you need to build a category-defining company.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-24">
          {services.map((service, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } gap-12 items-center`}
            >
              <div className="flex-1 space-y-6">
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                  <service.icon className="text-blue-400" size={32} />
                </div>

                <div>
                  <h2 className="text-4xl font-light mb-2">{service.title}</h2>
                  <p className="text-blue-400 text-lg">{service.subtitle}</p>
                </div>

                <p className="text-slate-300 text-lg leading-relaxed">
                  {service.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                  {service.investmentRange && (
                    <div className="space-y-1">
                      <div className="text-sm text-slate-500">
                        Investment Range
                      </div>
                      <div className="text-slate-200">
                        {service.investmentRange}
                      </div>
                    </div>
                  )}
                  {service.timeline && (
                    <div className="space-y-1">
                      <div className="text-sm text-slate-500">
                        Typical Timeline
                      </div>
                      <div className="text-slate-200">{service.timeline}</div>
                    </div>
                  )}
                  {service.dealSize && (
                    <div className="space-y-1">
                      <div className="text-sm text-slate-500">Deal Size</div>
                      <div className="text-slate-200">{service.dealSize}</div>
                    </div>
                  )}
                  <div className="space-y-1">
                    <div className="text-sm text-slate-500">Primary Focus</div>
                    <div className="text-slate-200">{service.focus}</div>
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
                  <h3 className="text-xl font-medium mb-6 text-slate-300">
                    What We Provide
                  </h3>
                  <ul className="space-y-4">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <ChevronRight
                          className="text-blue-400 flex-shrink-0 mt-0.5"
                          size={20}
                        />
                        <span className="text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 lg:px-8 bg-slate-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-light mb-12 text-center">
            Who We Work With
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:border-blue-500/50 transition-all">
              <h3 className="text-2xl font-light mb-4">Founders</h3>
              <p className="text-slate-400 leading-relaxed mb-6">
                Ambitious entrepreneurs building scalable businesses with clear
                paths to market leadership. We partner with those who think in
                decades, not quarters.
              </p>
              <div className="text-sm text-slate-500">
                Typical Profile: Pre-seed to Series B, high-growth potential,
                strong founding team
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:border-blue-500/50 transition-all">
              <h3 className="text-2xl font-light mb-4">Investors</h3>
              <p className="text-slate-400 leading-relaxed mb-6">
                Institutional and individual investors seeking co-investment
                opportunities, deal flow, and strategic partnerships in
                high-conviction opportunities.
              </p>
              <div className="text-sm text-slate-500">
                Typical Profile: Family offices, VCs, angels, strategic
                corporates
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-light mb-6">
            Let&apos;s Discuss Your Needs
          </h2>
          <p className="text-slate-400 text-lg mb-10 leading-relaxed">
            Every company is unique. Share your vision, and we'll explore how
            Fund'ex can support your journey to building something exceptional.
          </p>
          <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all text-lg">
            <a href="tel:+61451077562">Schedule a Call</a>
          </button>
        </div>
      </section>
    </div>
  );
}

export default Services;
