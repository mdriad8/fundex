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

      {/* Hero */}
      <section className="py-14 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-950/15 via-indigo-950/5 to-slate-950">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-5 sm:mb-6">
            <span className="inline-block px-4 sm:px-5 py-2 bg-blue-500/10 border border-blue-500/25 rounded-full text-blue-400 text-xs sm:text-sm font-light tracking-widest">
              Our Services
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light mb-5 sm:mb-6 leading-tight">
            Comprehensive Support,
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Every Stage
            </span>
          </h1>
          <p className="text-base sm:text-xl text-slate-400 leading-relaxed px-2">
            From inception to exit, we provide the capital, expertise, and
            network you need to build a category-defining company.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-16 lg:space-y-24">
          {services.map((service, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } gap-8 lg:gap-12 items-start lg:items-center`}
            >
              <div className="flex-1 space-y-5 sm:space-y-6 w-full">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500/20 to-indigo-500/10 rounded-2xl flex items-center justify-center border border-blue-500/15">
                  <service.icon className="text-blue-400" size={28} />
                </div>

                <div>
                  <h2 className="text-3xl sm:text-4xl font-light mb-2">{service.title}</h2>
                  <p className="text-blue-400 text-base sm:text-lg">{service.subtitle}</p>
                </div>

                <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                  {service.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {service.investmentRange && (
                    <div className="space-y-1">
                      <div className="text-xs sm:text-sm text-slate-500">Investment Range</div>
                      <div className="text-slate-200 text-sm sm:text-base">{service.investmentRange}</div>
                    </div>
                  )}
                  {service.timeline && (
                    <div className="space-y-1">
                      <div className="text-xs sm:text-sm text-slate-500">Typical Timeline</div>
                      <div className="text-slate-200 text-sm sm:text-base">{service.timeline}</div>
                    </div>
                  )}
                  {service.dealSize && (
                    <div className="space-y-1">
                      <div className="text-xs sm:text-sm text-slate-500">Deal Size</div>
                      <div className="text-slate-200 text-sm sm:text-base">{service.dealSize}</div>
                    </div>
                  )}
                  <div className="space-y-1">
                    <div className="text-xs sm:text-sm text-slate-500">Primary Focus</div>
                    <div className="text-slate-200 text-sm sm:text-base">{service.focus}</div>
                  </div>
                </div>
              </div>

              <div className="flex-1 w-full">
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 hover:border-blue-500/30 transition-all duration-300">
                  <h3 className="text-lg sm:text-xl font-medium mb-5 sm:mb-6 text-slate-300">What We Provide</h3>
                  <ul className="space-y-3 sm:space-y-4">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-3 group/item">
                        <div className="w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/item:bg-blue-500/20 transition-all duration-200">
                          <ChevronRight className="text-blue-400" size={14} />
                        </div>
                        <span className="text-slate-300 text-sm sm:text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Who We Work With */}
      <section className="py-14 md:py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/30 border-y border-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-light mb-8 sm:mb-12 text-center">Who We Work With</h2>

          <div className="grid sm:grid-cols-2 gap-5 sm:gap-8">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sm:p-8 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
              <h3 className="text-xl sm:text-2xl font-light mb-3 sm:mb-4">Founders</h3>
              <p className="text-slate-400 leading-relaxed mb-5 sm:mb-6 text-sm sm:text-base">
                Ambitious entrepreneurs building scalable businesses with clear
                paths to market leadership. We partner with those who think in
                decades, not quarters.
              </p>
              <div className="text-xs sm:text-sm text-slate-500">
                Typical Profile: Pre-seed to Series B, high-growth potential,
                strong founding team
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sm:p-8 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
              <h3 className="text-xl sm:text-2xl font-light mb-3 sm:mb-4">Investors</h3>
              <p className="text-slate-400 leading-relaxed mb-5 sm:mb-6 text-sm sm:text-base">
                Institutional and individual investors seeking co-investment
                opportunities, deal flow, and strategic partnerships in
                high-conviction opportunities.
              </p>
              <div className="text-xs sm:text-sm text-slate-500">
                Typical Profile: Family offices, VCs, angels, strategic corporates
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-light mb-4 sm:mb-6">Let's Discuss Your Needs</h2>
          <p className="text-slate-400 text-base sm:text-lg mb-8 sm:mb-10 leading-relaxed">
            Every company is unique. Share your vision, and we'll explore how
            Fund'ex can support your journey to building something exceptional.
          </p>
          <a
            href="tel:+61426655519"
            className="inline-flex items-center px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 transition-all duration-300 text-base sm:text-lg cursor-pointer"
          >
            Schedule a Call
          </a>
        </div>
      </section>
    </div>
  );
}

export default Services;
