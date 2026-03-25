import { Mail, MapPin, Phone, Send } from 'lucide-react';
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
      city: 'New York',
      address: '432 Park Avenue, Floor 28',
      postal: 'New York, NY 10022',
      region: 'North America HQ',
    },
    {
      city: 'London',
      address: '1 Poultry, Level 5',
      postal: 'London EC2R 8EJ',
      region: 'Europe',
    },
    {
      city: 'Singapore',
      address: '8 Marina Boulevard, #15-01',
      postal: 'Singapore 018981',
      region: 'Asia Pacific',
    },
  ];

  return (
    <div className="pt-20">
      <section className="py-24 px-6 lg:px-8 bg-gradient-to-b from-blue-950/10 to-slate-950">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-light tracking-wide">
              Get in Touch
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-light mb-6">
            Let's Start a
            <br />
            Conversation
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed">
            Whether you're seeking investment, advisory support, or exploring opportunities,
            we're here to listen and explore how we can work together.
          </p>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12">
            <div className="lg:col-span-3">
              <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 md:p-12">
                <h2 className="text-3xl font-light mb-8">Send Us a Message</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="John Smith"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-slate-300 mb-2">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Your Company Inc."
                    />
                  </div>

                  <div>
                    <label htmlFor="inquiry" className="block text-sm font-medium text-slate-300 mb-2">
                      Type of Inquiry *
                    </label>
                    <select
                      id="inquiry"
                      name="inquiry"
                      value={formData.inquiry}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                    <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      placeholder="Tell us about your company, vision, and how we can help..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="group w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center justify-center space-x-2 text-lg"
                  >
                    <span>Send Message</span>
                    <Send className="group-hover:translate-x-1 transition-transform" size={20} />
                  </button>

                  <p className="text-sm text-slate-500">
                    We typically respond within 24-48 hours. For urgent inquiries, please call our main office.
                  </p>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
                <h3 className="text-xl font-medium mb-6">Direct Contact</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="text-blue-400 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <div className="text-sm text-slate-400 mb-1">General Inquiries</div>
                      <a href="mailto:hello@fundex.com" className="text-slate-200 hover:text-blue-400 transition-colors">
                        hello@fundex.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Mail className="text-blue-400 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <div className="text-sm text-slate-400 mb-1">Investment Inquiries</div>
                      <a href="mailto:invest@fundex.com" className="text-slate-200 hover:text-blue-400 transition-colors">
                        invest@fundex.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone className="text-blue-400 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <div className="text-sm text-slate-400 mb-1">Main Office</div>
                      <a href="tel:+61 451 077 562" className="text-slate-200 hover:text-blue-400 transition-colors">
                        +61 451 077 562
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
                <h3 className="text-xl font-medium mb-6">Office Hours</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Monday - Friday</span>
                    <span className="text-slate-200">9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Saturday</span>
                    <span className="text-slate-200">By Appointment Only</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sunday</span>
                    <span className="text-slate-200">Closed</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-4">
                  Times shown are EST. We operate across multiple time zones globally.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-8 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-6">Our Global Presence</h2>
            <p className="text-slate-400 text-lg">
              With offices across three continents, we're positioned to support
              founders and investors worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {offices.map((office, index) => (
              <div
                key={index}
                className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:border-blue-500/50 transition-all"
              >
                <div className="flex items-start space-x-3 mb-4">
                  <MapPin className="text-blue-400 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="text-2xl font-light mb-1">{office.city}</h3>
                    <div className="text-sm text-blue-400">{office.region}</div>
                  </div>
                </div>
                <div className="text-slate-400 text-sm space-y-1">
                  <p>{office.address}</p>
                  <p>{office.postal}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-blue-950/30 to-slate-900/30 border border-slate-800 rounded-3xl p-12 md:p-16">
            <h2 className="text-3xl font-light mb-4">Prefer a Direct Conversation?</h2>
            <p className="text-slate-400 mb-8">
              Schedule a call with our team to discuss your specific needs and explore
              how Fund'ex can support your journey.
            </p>
            <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all text-lg">
              Schedule a Call
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
