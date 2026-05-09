import { Building2, Globe2, Award, Users } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

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
      description: 'Fund\'ex established by former operators and investors with a shared vision for founder-first capital.',
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
      <section className="py-24 px-6 lg:px-8 bg-gradient-to-b from-blue-950/10 to-slate-950">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-light tracking-wide">
              About Fund'ex
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-light mb-6">
            Built by Founders,
            <br />
            For Founders
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed">
            Fund'ex is a private venture platform built for founders and investors who think long-term.
            We operate across venture capital, strategic advisory, and business brokerage — supporting
            companies from first cheque to final exit.
          </p>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <h2 className="text-4xl font-light mb-6">Our Philosophy</h2>
              <div className="space-y-4 text-slate-300 text-lg leading-relaxed">
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
                  Our philosophy is simple: <strong className="text-white">build quietly, scale deliberately,
                  and compound value over time</strong>. No hype. No vanity metrics. Just sustainable growth
                  and long-term value creation.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 transition-all">
                <Building2 className="text-blue-400 mb-4" size={32} />
                <div className="text-3xl font-light mb-1">5+</div>
                <div className="text-slate-400 text-sm">Portfolio Companies</div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 transition-all">
                <Globe2 className="text-blue-400 mb-4" size={32} />
                <div className="text-3xl font-light mb-1">3+</div>
                <div className="text-slate-400 text-sm">Countries</div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 transition-all">
                <Award className="text-blue-400 mb-4" size={32} />
                <div className="text-3xl font-light mb-1">5+</div>
                <div className="text-slate-400 text-sm">Successful Exits</div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 transition-all">
                <Users className="text-blue-400 mb-4" size={32} />
                <div className="text-3xl font-light mb-1">$500k+</div>
                <div className="text-slate-400 text-sm">Assets Under Management</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-950/20 to-slate-900/20 border border-slate-800 rounded-3xl p-12 md:p-16">
            <h2 className="text-4xl font-light mb-12 text-center">What We Believe</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <div key={index} className="space-y-3">
                  <h3 className="text-xl font-medium text-blue-400">{value.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-8 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-6">Our Journey</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              From a small team with big ambitions to a global platform supporting
              exceptional founders worldwide.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/50 via-blue-500/20 to-transparent"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative flex flex-col ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  } gap-8 md:gap-16 items-center`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="inline-block px-4 py-1 bg-blue-600 text-white text-sm font-medium rounded-full mb-3">
                      {milestone.year}
                    </div>
                    <h3 className="text-2xl font-light mb-2">{milestone.title}</h3>
                    <p className="text-slate-400">{milestone.description}</p>
                  </div>

                  <div className="w-4 h-4 bg-blue-500 rounded-full border-4 border-slate-950 relative z-10"></div>

                  <div className="flex-1"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 md:p-16 text-center">
            <h2 className="text-4xl font-light mb-6">Join Our Network</h2>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed max-w-2xl mx-auto">
              Whether you're a founder seeking partnership, an investor exploring opportunities,
              or a professional interested in joining our team, we'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all text-lg">
                Partner With Us
              </button>
              <button className="px-8 py-4 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white rounded-lg transition-all text-lg">
                Career Opportunities
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
