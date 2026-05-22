import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    inquiry: 'investment',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const offices = [
    {
      city: 'Melbourne',
      address: 'Level 9, Suite 1 & 2, 2 Queen Street',
      postal: 'Melbourne VIC 3000',
      region: 'Australia',
    },
  ];

  return (
    <div className="pt-20">
      <Helmet>
        <title>Contact Fundex Global | Connect With Our Investment Team</title>
        <meta name="description" content="Contact Fundex Global for startup investment opportunities, venture capital partnerships, founder support, and strategic business growth discussions." />
        <meta name="keywords" content="contact Fundex Global, startup investors, venture capital contact, founder inquiries, investment opportunities" />
        <link rel="canonical" href="https://fundexglobal.vc/contact" />
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
              Get in Touch
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light mb-5 sm:mb-6 leading-tight text-white">
            Let's Start a
            <br />
            <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Conversation
            </span>
          </h1>
          <p className="text-base sm:text-xl text-slate-400 leading-relaxed px-2">
            Whether you're seeking investment, advisory support, or exploring opportunities,
            we're here to listen and explore how we can work together.
          </p>
        </div>
      </section>

      {/* Form + Sidebar */}
      <section className="py-14 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-white border border-gray-100 shadow-lg rounded-3xl p-6 sm:p-8 md:p-12">
                <h2 className="text-2xl sm:text-3xl font-light mb-6 sm:mb-8 text-slate-900">Send Us a Message</h2>

                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                  <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 hover:border-teal-400 rounded-xl text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all duration-200 text-sm sm:text-base"
                        placeholder="John Smith"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 hover:border-teal-400 rounded-xl text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all duration-200 text-sm sm:text-base"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-2">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 hover:border-teal-400 rounded-xl text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all duration-200 text-sm sm:text-base"
                      placeholder="Your Company Inc."
                    />
                  </div>

                  <div>
                    <label htmlFor="inquiry" className="block text-sm font-medium text-slate-700 mb-2">
                      Type of Inquiry *
                    </label>
                    <select
                      id="inquiry"
                      name="inquiry"
                      value={formData.inquiry}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 hover:border-teal-400 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all duration-200 text-sm sm:text-base"
                    >
                      <option value="investment">Seeking Investment</option>
                      <option value="advisory">Strategic Advisory</option>
                      <option value="brokerage">Business Brokerage / M&A</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="careers">Career Opportunities</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 hover:border-teal-400 rounded-xl text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all duration-200 resize-none text-sm sm:text-base"
                      placeholder="Tell us about your company, vision, and how we can help..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="group w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-teal-600 hover:bg-teal-500 text-white rounded-xl shadow-lg shadow-teal-600/20 hover:shadow-teal-600/35 transition-all duration-300 text-base sm:text-lg cursor-pointer"
                  >
                    <span>Send Message</span>
                    <Send className="group-hover:translate-x-1 transition-transform duration-300" size={20} />
                  </button>

                  <p className="text-xs sm:text-sm text-slate-500">
                    We typically respond within 24–48 hours. For urgent inquiries, please call our main office.
                  </p>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-5 sm:space-y-8">
              <div className="bg-white border border-gray-100 shadow-md rounded-2xl p-6 sm:p-8 hover:border-teal-400/30 transition-all duration-300">
                <h3 className="text-lg sm:text-xl font-medium mb-5 sm:mb-6 text-slate-900">Direct Contact</h3>
                <div className="space-y-4 sm:space-y-5">
                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center flex-shrink-0">
                      <Mail className="text-teal-600" size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm text-gray-500 mb-1">General Inquiries</div>
                      <a
                        href="mailto:info@fundexglobal.vc"
                        className="text-slate-800 hover:text-teal-600 transition-colors duration-200 text-sm sm:text-base break-all"
                      >
                        info@fundexglobal.vc
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center flex-shrink-0">
                      <Mail className="text-teal-600" size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm text-gray-500 mb-1">Investment Inquiries</div>
                      <a
                        href="mailto:info@fundexglobal.vc"
                        className="text-slate-800 hover:text-teal-600 transition-colors duration-200 text-sm sm:text-base break-all"
                      >
                        info@fundexglobal.vc
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center flex-shrink-0">
                      <Phone className="text-teal-600" size={18} />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm text-gray-500 mb-1">Main Office</div>
                      <a
                        href="tel:+61426655519"
                        className="text-slate-800 hover:text-teal-600 transition-colors duration-200 text-sm sm:text-base"
                      >
                        +61 426 655 519
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-100 shadow-md rounded-2xl p-6 sm:p-8 hover:border-teal-400/30 transition-all duration-300">
                <h3 className="text-lg sm:text-xl font-medium mb-5 sm:mb-6 text-slate-900">Office Hours</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-600 flex-shrink-0">Monday – Friday</span>
                    <span className="text-slate-800 text-right">9:00 AM – 5:00 PM</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-600">Saturday</span>
                    <span className="text-slate-800 text-right">By Appointment</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-600">Sunday</span>
                    <span className="text-slate-800 text-right">Closed</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Times shown are AEST. We operate across multiple time zones globally.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Location */}
      <section className="py-14 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 to-teal-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-light mb-4 sm:mb-6 text-white">Our Global Presence</h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Our office is based in Melbourne, enabling us to support founders and investors across the globe.
            </p>
          </div>

          <div className="flex justify-center">
            {offices.map((office, index) => (
              <div
                key={index}
                className="bg-white/10 border border-white/10 rounded-2xl p-8 sm:p-12 hover:border-teal-400/40 transition-all duration-300 w-full max-w-xl"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-teal-500/20 border border-teal-500/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-teal-400" size={22} />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-light mb-1 text-white">{office.city}</h3>
                    <div className="text-sm text-teal-400 mb-3">{office.region}</div>
                    <div className="text-slate-400 text-sm space-y-1">
                      <p>{office.address}</p>
                      <p>{office.postal}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-14 md:py-24 px-4 sm:px-6 lg:px-8 bg-teal-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-light mb-3 sm:mb-4 text-white">Prefer a Direct Conversation?</h2>
          <p className="text-teal-100 mb-6 sm:mb-8 text-base sm:text-lg">
            Schedule a call with our team to discuss your specific needs and explore
            how Fund'ex can support your journey.
          </p>
          <a
            href="tel:+61426655519"
            className="inline-flex items-center px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-teal-700 hover:bg-teal-50 rounded-xl shadow-lg transition-all duration-300 text-base sm:text-lg font-medium cursor-pointer"
          >
            Schedule a Call
          </a>
        </div>
      </section>
    </div>
  );
}

export default Contact;
