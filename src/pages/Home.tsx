import { ArrowRight, TrendingUp, Users, Award } from 'lucide-react';


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
      <section className="min-h-screen flex items-center justify-center px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-slate-950 to-slate-950"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-light tracking-wide mb-8">
              Capital • Strategy • Execution
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight mb-8 leading-tight">
            Building the Future,
            <br />
            <span className="text-slate-400">One Company at a Time</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 font-light max-w-3xl mx-auto mb-12 leading-relaxed">
            Fund'ex operates at the intersection of capital, strategy, and execution.
            We partner with founders, funds, and investors to build enduring companies —
            from first cheque to final exit.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center space-x-2 text-lg">
              <span>Partner With Us</span>
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </button>
            <button className="px-8 py-4 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white rounded-lg transition-all text-lg">
              View Portfolio
            </button>
          </div>

          <div className="mt-20 text-sm text-slate-500 font-light tracking-widest">
            Quiet. Precise. Global.
          </div>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-light text-blue-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-400 text-sm tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light mb-6">Why Fund'ex</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              We're not just investors. We're builders, advisors, and long-term partners
              committed to your success.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {highlights.map((item, index) => (
              <div
                key={index}
                className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-blue-500/50 transition-all group"
              >
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-all">
                  <item.icon className="text-blue-400" size={24} />
                </div>
                <h3 className="text-xl font-medium mb-3">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-8 bg-gradient-to-b from-blue-950/10 to-slate-950">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-light mb-6">Ready to Scale?</h2>
          <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
            Whether you're seeking investment, strategic guidance, or exit planning,
            we're here to help you build something exceptional.
          </p>
          <button className="group px-8 py-4 bg-white text-slate-950 hover:bg-slate-100 rounded-lg transition-all flex items-center space-x-2 text-lg mx-auto font-medium">
            <span>Start a Conversation</span>
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;
