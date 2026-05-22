import { Building2, Globe2, Award, Users } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

function About() {
  const values = [
    {
      title: 'Integrity First',
      description:
        'We operate with complete transparency and honesty. Our word is our bond, and we expect the same from our partners.',
    },
    {
      title: 'Long-Term Thinking',
      description:
        'We measure success in decades, not quarters. Patient capital allows us to support founders through the inevitable ups and downs of building.',
    },
    {
      title: 'Operational Excellence',
      description:
        'Beautiful strategy without flawless execution is worthless. We help build the systems and teams that turn vision into reality.',
    },
    {
      title: 'Founder Empowerment',
      description:
        'You built this company. We are here to support, not control. Our role is to make you more successful, not to run the show.',
    },
  ];

  const milestones = [
    {
      year: '2024',
      title: 'Foundation',
      description: "Fund'ex established by former operators and investors with a shared vision for founder-first capital.",
    },
    {
      year: '2025',
      title: 'Global Expansion',
      description: 'Opened offices in London and Singapore, extending our reach to European and Asian markets.',
    },
    {
      year: '2025',
      title: 'Advisory Launch',
      description: 'Introduced strategic advisory services in response to portfolio company needs.',
    },
    {
      year: '2025',
      title: 'Brokerage Division',
      description: 'Established business brokerage practice to support M&A and strategic transactions.',
    },
    {
      year: '2025',
      title: 'Portfolio Milestone',
      description: 'Reached 5+ portfolio companies across 3 countries with $500k+ AUM.',
    },
  ];

  return (
    <div className="pt-20">
      <Helmet>
        <title>About Fundex Global | Venture Capital & Innovation Partner</title>
        <meta name="description" content="Learn about Fundex Global, a venture capital and innovation-focused investment firm helping startups achieve sustainable growth and market leadership." />
        <meta name="keywords" content="about Fundex Global, venture capital company, startup investment firm, innovation partner, global startup funding" />
        <link rel="canonical" href="https://fundexglobal.vc/about" />
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
              About Fund'ex
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light mb-5 sm:mb-6 leading-tight text-white">
            Built by Founders,
            <br />
            <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              For Founders
            </span>
          </h1>
          <p className="text-base sm:text-xl text-slate-400 leading-relaxed px-2">
            Fund'ex is a private venture platform built for founders and investors who think long-term.
            We operate across venture capital, strategic advisory, and business brokerage — supporting
            companies from first cheque to final exit.
          </p>
        </div>
      </section>

      {/* Philosophy + Stats */}
      <section className="py-14 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center mb-14 sm:mb-24">
            <div>
              <h2 className="text-3xl sm:text-4xl font-light mb-5 sm:mb-6 text-slate-900">Our Philosophy</h2>
              <div className="space-y-4 text-gray-600 text-base sm:text-lg leading-relaxed">
                <p>
                  Fund'ex was born from a simple observation: most venture firms talk about partnership,
                  but few truly operate that way.
                </p>
                <p>
                  We wanted to build something different. A firm where founders get real support,
                  not just capital and board seats. Where decisions are made by operators who've
                  built companies, not career investors who haven't.
                </p>
                <p>
                  Our philosophy is simple:{' '}
                  <strong className="text-slate-900">
                    build quietly, scale deliberately, and compound value over time
                  </strong>
                  . No hype. No vanity metrics. Just sustainable growth and long-term value creation.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {[
                { icon: Building2, value: '5+', label: 'Portfolio Companies' },
                { icon: Globe2, value: '3+', label: 'Countries' },
                { icon: Award, value: '5+', label: 'Successful Exits' },
                { icon: Users, value: '$500k+', label: 'Assets Under Management' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-100 shadow-md rounded-2xl p-4 sm:p-6 hover:shadow-xl hover:shadow-teal-500/10 hover:-translate-y-1 transition-all duration-300"
                >
                  <item.icon className="text-teal-600 mb-3 sm:mb-4" size={28} />
                  <div className="text-2xl sm:text-3xl font-light bg-gradient-to-r from-teal-400 to-teal-500 bg-clip-text text-transparent mb-1">
                    {item.value}
                  </div>
                  <div className="text-gray-500 text-xs sm:text-sm leading-snug">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Values */}
          <div className="bg-gradient-to-br from-slate-900 to-teal-900 rounded-3xl p-6 sm:p-10 md:p-16">
            <h2 className="text-3xl sm:text-4xl font-light mb-8 sm:mb-12 text-center text-white">What We Believe</h2>
            <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
              {values.map((value, index) => (
                <div key={index} className="space-y-2 sm:space-y-3">
                  <h3 className="text-lg sm:text-xl font-medium bg-gradient-to-r from-teal-400 to-teal-500 bg-clip-text text-transparent">
                    {value.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed text-sm sm:text-base">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-14 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950">
        {/* Background accents */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-teal-800/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-10 sm:mb-16">
            <span className="inline-block px-4 py-1.5 bg-teal-500/10 border border-teal-500/30 rounded-full text-teal-400 text-xs font-medium tracking-widest mb-4">
              Since 2024
            </span>
            <h2 className="text-3xl sm:text-4xl font-light mb-4 sm:mb-6 text-white">Our Journey</h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
              From a small team with big ambitions to a global platform supporting
              exceptional founders worldwide.
            </p>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-teal-400/80 via-teal-500/40 to-transparent" />

            <div className="space-y-10 sm:space-y-14">
              {milestones.map((milestone, index) => (
                <div key={index} className="relative">
                  {/* Mobile layout */}
                  <div className="flex items-start md:hidden pl-14">
                    <div className="absolute left-5 -translate-x-1/2 top-2 w-4 h-4 bg-teal-500 rounded-full border-2 border-teal-300/50 shadow-lg shadow-teal-500/50 z-10" />
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 w-full hover:border-teal-500/40 transition-all duration-300">
                      <div className="inline-block px-3 py-1 bg-teal-500/20 border border-teal-500/30 text-teal-400 text-xs font-semibold rounded-full mb-2 tracking-wider">
                        {milestone.year}
                      </div>
                      <h3 className="text-lg font-medium mb-1 text-white">{milestone.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{milestone.description}</p>
                    </div>
                  </div>

                  {/* Desktop layout */}
                  <div
                    className={`hidden md:flex items-center gap-8 lg:gap-16 ${
                      index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                    }`}
                  >
                    <div className={`flex-1 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                      <div className={`bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-teal-500/40 hover:bg-white/8 transition-all duration-300 ${index % 2 === 0 ? 'ml-auto' : 'mr-auto'}`}>
                        <div className={`inline-block px-4 py-1 bg-teal-500/20 border border-teal-500/30 text-teal-400 text-xs font-semibold rounded-full mb-3 tracking-wider`}>
                          {milestone.year}
                        </div>
                        <h3 className="text-xl sm:text-2xl font-medium mb-2 text-white">{milestone.title}</h3>
                        <p className="text-slate-400 leading-relaxed">{milestone.description}</p>
                      </div>
                    </div>

                    {/* Center dot */}
                    <div className="relative flex-shrink-0">
                      <div className="w-5 h-5 bg-teal-500 rounded-full border-2 border-teal-300/50 shadow-lg shadow-teal-500/60 z-10 relative" />
                      <div className="absolute inset-0 w-5 h-5 bg-teal-400/30 rounded-full animate-ping" />
                    </div>

                    <div className="flex-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Join Network CTA */}
      <section className="py-14 md:py-24 px-4 sm:px-6 lg:px-8 bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10 md:p-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-light mb-4 sm:mb-6 text-white">Join Our Network</h2>
            <p className="text-slate-400 text-base sm:text-lg mb-8 sm:mb-10 leading-relaxed max-w-2xl mx-auto">
              Whether you're a founder seeking partnership, an investor exploring opportunities,
              or a professional interested in joining our team, we'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                to="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 bg-teal-600 hover:bg-teal-500 text-white rounded-xl shadow-lg shadow-teal-600/20 transition-all duration-300 text-base sm:text-lg cursor-pointer"
              >
                Partner With Us
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 border border-white/20 text-white hover:border-teal-400 hover:text-teal-400 rounded-xl transition-all duration-300 text-base sm:text-lg cursor-pointer"
              >
                Career Opportunities
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
