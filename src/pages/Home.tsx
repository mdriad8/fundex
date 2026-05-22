import { ArrowRight, TrendingUp, Users, Award } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

function Home() {
  const stats = [
    { value: '$500k+', label: 'Assets Under Management' },
    { value: '5+', label: 'Portfolio Companies' },
    { value: '3+', label: 'Countries' },
    { value: '5+', label: 'Successful Exits' },
  ];

  const highlights = [
    {
      icon: TrendingUp,
      title: 'Growth-Oriented',
      description: 'Patient capital deployed with strategic precision for sustainable expansion',
    },
    {
      icon: Users,
      title: 'Founder-First',
      description: 'Deep operational support beyond capital, aligned with your long-term vision',
    },
    {
      icon: Award,
      title: 'Proven Track Record',
      description: 'Decades of combined experience in building and scaling global enterprises',
    },
  ];

  return (
    <div className="pt-20">
      <Helmet>
        <title>Fundex Global | Venture Capital & Startup Investment Firm</title>
        <meta name="description" content="Fundex Global is a venture capital and startup investment firm supporting founders with funding, strategic growth, business scaling, and global investment opportunities." />
        <meta name="keywords" content="Fundex Global, venture capital, startup funding, startup investment, VC firm, business investment, startup accelerator, global investors" />
        <link rel="canonical" href="https://fundexglobal.vc/" />
      </Helmet>

      {/* Hero */}
      <section className="relative min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950">
        {/* Radial glow — same as inner pages */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-800/20 via-transparent to-transparent" />
        {/* Grid overlay — same as inner pages */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        {/* Extra center glow for home */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] lg:w-[800px] h-[400px] lg:h-[500px] bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center w-full py-16 md:py-24 z-10">
          {/* Badge — matches inner pages */}
          <div className="mb-5 sm:mb-6">
            <span className="inline-block px-4 sm:px-5 py-2 bg-teal-500/10 border border-teal-500/30 rounded-full text-teal-400 text-xs sm:text-sm font-light tracking-widest">
              Capital &bull; Strategy &bull; Execution
            </span>
          </div>

          {/* Heading — matches inner pages font-light style */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light mb-5 sm:mb-6 leading-tight text-white">
            Building the Future,
            <br />
            <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              One Company at a Time
            </span>
          </h1>

          {/* Divider */}
          <div className="flex items-center justify-center gap-4 mb-6 sm:mb-8 max-w-3xl mx-auto">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-teal-500/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-teal-400/80" />
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-teal-500/50" />
          </div>

          <p className="text-base sm:text-xl text-slate-400 leading-relaxed px-2 max-w-3xl mx-auto mb-10 sm:mb-14">
            Fund'ex operates at the intersection of capital, strategy, and execution.
            We partner with founders, funds, and investors to build enduring companies —
            from first cheque to final exit.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Link
              to="/contact"
              className="group w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 sm:px-9 py-4 bg-teal-600 hover:bg-teal-500 text-white rounded-xl shadow-lg shadow-teal-600/30 hover:shadow-teal-500/40 transition-all duration-300 text-base sm:text-lg font-medium cursor-pointer"
            >
              <span>Partner With Us</span>
              <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" size={20} />
            </Link>
            <Link
              to="/services"
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 sm:px-9 py-4 border border-white/20 hover:border-teal-400/60 hover:bg-teal-500/10 text-white rounded-xl transition-all duration-300 text-base sm:text-lg font-light cursor-pointer"
            >
              View Services
            </Link>
          </div>

          {/* Bottom tagline */}
          <div className="mt-16 sm:mt-20 flex items-center justify-center gap-6 sm:gap-10 text-xs text-slate-500 font-light tracking-widest uppercase">
            <span>Quiet</span>
            <span className="w-1 h-1 rounded-full bg-teal-600/50" />
            <span>Precise</span>
            <span className="w-1 h-1 rounded-full bg-teal-600/50" />
            <span>Global</span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 md:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-light bg-gradient-to-r from-teal-400 to-teal-500 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-500 text-xs sm:text-sm tracking-wide leading-snug">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Fund'ex */}
      <section className="py-14 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light mb-4 sm:mb-6 text-slate-900">Why Fund'ex</h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              We're not just investors. We're builders, advisors, and long-term partners
              committed to your success.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-8">
            {highlights.map((item, index) => (
              <div
                key={index}
                className="p-6 sm:p-8 bg-white border border-gray-200 rounded-2xl shadow-sm hover:border-teal-600/40 hover:shadow-lg hover:shadow-teal-600/10 transition-all duration-300 group"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-600/20 to-teal-600/10 rounded-xl flex items-center justify-center mb-5 sm:mb-6 group-hover:from-teal-600/30 group-hover:to-teal-600/20 transition-all duration-300">
                  <item.icon className="text-teal-400" size={22} />
                </div>
                <h3 className="text-lg sm:text-xl font-medium mb-2 sm:mb-3 text-slate-900">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 md:py-24 px-4 sm:px-6 lg:px-8 bg-teal-600">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light mb-4 sm:mb-6 text-white">Ready to Scale?</h2>
          <p className="text-white/85 text-base sm:text-lg mb-8 sm:mb-10 max-w-2xl mx-auto">
            Whether you're seeking investment, strategic guidance, or exit planning,
            we're here to help you build something exceptional.
          </p>
          <Link
            to="/contact"
            className="group inline-flex items-center space-x-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-slate-950 hover:bg-teal-50 rounded-xl shadow-xl shadow-white/5 transition-all duration-300 text-base sm:text-lg font-medium cursor-pointer"
          >
            <span>Start a Conversation</span>
            <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
