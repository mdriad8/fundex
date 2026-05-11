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
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/30 via-slate-950 to-slate-950" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] lg:w-[700px] h-[200px] sm:h-[300px] lg:h-[400px] bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[200px] lg:w-[300px] h-[200px] lg:h-[300px] bg-indigo-600/6 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10 py-16">
          <div className="mb-6 sm:mb-8">
            <span className="inline-block px-4 sm:px-5 py-2 bg-blue-500/10 border border-blue-500/25 rounded-full text-blue-400 text-xs sm:text-sm font-light tracking-widest">
              Capital &bull; Strategy &bull; Execution
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-light tracking-tight mb-6 sm:mb-8 leading-tight">
            Building the Future,
            <br />
            <span className="bg-gradient-to-r from-slate-300 via-slate-400 to-slate-500 bg-clip-text text-transparent">
              One Company at a Time
            </span>
          </h1>

          <p className="text-base sm:text-xl md:text-2xl text-slate-400 font-light max-w-3xl mx-auto mb-10 sm:mb-14 leading-relaxed px-2">
            Fund'ex operates at the intersection of capital, strategy, and execution.
            We partner with founders, funds, and investors to build enduring companies —
            from first cheque to final exit.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Link
              to="/contact"
              className="group w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 transition-all duration-300 text-base sm:text-lg cursor-pointer"
            >
              <span>Partner With Us</span>
              <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" size={20} />
            </Link>
            <Link
              to="/services"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 bg-slate-900/50 border border-slate-700 hover:border-blue-400/50 hover:bg-slate-800/60 text-slate-300 hover:text-white rounded-xl backdrop-blur-sm transition-all duration-300 text-base sm:text-lg cursor-pointer"
            >
              View Services
            </Link>
          </div>

          <div className="mt-14 sm:mt-20 text-xs sm:text-sm text-slate-500 font-light tracking-widest uppercase">
            Quiet. Precise. Global.
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 md:py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/40 border-y border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-light bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-400 text-xs sm:text-sm tracking-wide leading-snug">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Fund'ex */}
      <section className="py-14 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light mb-4 sm:mb-6">Why Fund'ex</h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
              We're not just investors. We're builders, advisors, and long-term partners
              committed to your success.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-8">
            {highlights.map((item, index) => (
              <div
                key={index}
                className="p-6 sm:p-8 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 group"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500/20 to-indigo-500/10 rounded-xl flex items-center justify-center mb-5 sm:mb-6 group-hover:from-blue-500/30 group-hover:to-indigo-500/20 transition-all duration-300">
                  <item.icon className="text-blue-400" size={22} />
                </div>
                <h3 className="text-lg sm:text-xl font-medium mb-2 sm:mb-3">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm sm:text-base">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-950/10 via-indigo-950/5 to-slate-950">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light mb-4 sm:mb-6">Ready to Scale?</h2>
          <p className="text-slate-400 text-base sm:text-lg mb-8 sm:mb-10 max-w-2xl mx-auto">
            Whether you're seeking investment, strategic guidance, or exit planning,
            we're here to help you build something exceptional.
          </p>
          <Link
            to="/contact"
            className="group inline-flex items-center space-x-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-slate-950 hover:bg-blue-50 rounded-xl shadow-xl shadow-white/5 transition-all duration-300 text-base sm:text-lg font-medium cursor-pointer"
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
