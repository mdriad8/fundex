import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import HeroCanvas from '../components/fx/HeroCanvas';
import Reveal from '../components/fx/Reveal';
import Spotlight from '../components/fx/Spotlight';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

type Status =
  | { state: 'idle' }
  | { state: 'sending' }
  | { state: 'sent'; message: string }
  | { state: 'error'; message: string; errors?: Record<string, string> };

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    inquiry: 'advisory',
    message: '',
    website: '', // spam trap: hidden from people, bots tend to fill it in
  });
  const [status, setStatus] = useState<Status>({ state: 'idle' });
  const startedAt = useRef(Date.now());
  const statusRef = useRef<HTMLDivElement>(null);

  const showStatus = (s: Status) => {
    setStatus(s);
    setTimeout(() => statusRef.current?.focus(), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    showStatus({ state: 'sending' });
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...formData, startedAt: String(startedAt.current) }),
      });
      let data: { ok?: boolean; message?: string; errors?: Record<string, string> } | null = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }
      // Success is shown ONLY when the server confirms the message was accepted for delivery.
      if (res.ok && data?.ok === true) {
        showStatus({ state: 'sent', message: data.message ?? 'Thank you. Your message has been sent.' });
        setFormData({ name: '', email: '', company: '', inquiry: 'advisory', message: '', website: '' });
        return;
      }
      showStatus({
        state: 'error',
        message: data?.message ?? 'Your message could not be sent. Please try again later or email info@fundexglobal.vc.',
        errors: data?.errors,
      });
    } catch {
      showStatus({
        state: 'error',
        message: 'We could not reach the server, so your message was not sent. Please check your connection or email info@fundexglobal.vc.',
      });
    }
  };

  const fieldError = (name: string) => (status.state === 'error' ? status.errors?.[name] : undefined);

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
        <title>Contact Fund'ex | Start a Conversation | Fundex Global</title>
        <meta name="description" content="Contact Fundex Global in Melbourne about strategic advisory, business planning or partnerships. Send us a message and we will reply by email." />
        <link rel="canonical" href="https://www.fundexglobal.vc/contact" />
      </Helmet>

      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 overflow-hidden">
        {/* Radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-800/20 via-transparent to-transparent" />
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

        <HeroCanvas density={5} />
        <div className="relative max-w-4xl mx-auto text-center w-full fade-up">
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
            Whether you need strategic advice, business planning support, or a partnership,
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
              <Reveal className="bg-white border border-gray-100 shadow-lg rounded-3xl p-6 sm:p-8 md:p-12">
                <h2 className="text-2xl sm:text-3xl font-light mb-6 sm:mb-8 text-slate-900">Send Us a Message</h2>

                <div
                  ref={statusRef}
                  tabIndex={-1}
                  role={status.state === 'error' ? 'alert' : 'status'}
                  aria-live="polite"
                  className={
                    status.state === 'sent'
                      ? 'mb-6 rounded-xl border border-teal-200 bg-teal-50 p-4 text-teal-900 outline-none'
                      : status.state === 'error'
                        ? 'mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 outline-none'
                        : 'sr-only'
                  }
                >
                  {status.state === 'sent' && status.message}
                  {status.state === 'error' && (
                    <>
                      <p>{status.message}</p>
                      {status.errors && (
                        <ul className="mt-2 list-disc pl-5">
                          {Object.values(status.errors).map((m) => (
                            <li key={m}>{m}</li>
                          ))}
                        </ul>
                      )}
                    </>
                  )}
                </div>

                {status.state !== 'sent' && (
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
                        minLength={2}
                        maxLength={100}
                        autoComplete="name"
                        aria-invalid={!!fieldError('name')}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-400 hover:border-teal-500 rounded-xl text-slate-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 transition-all duration-200 text-base"
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
                        maxLength={254}
                        autoComplete="email"
                        aria-invalid={!!fieldError('email')}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-400 hover:border-teal-500 rounded-xl text-slate-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 transition-all duration-200 text-base"
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
                      maxLength={120}
                      autoComplete="organization"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-400 hover:border-teal-500 rounded-xl text-slate-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 transition-all duration-200 text-base"
                      placeholder="Your Company Pty Ltd"
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
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-400 hover:border-teal-500 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 transition-all duration-200 text-base"
                    >
                      <option value="advisory">Strategic Advisory</option>
                      <option value="planning">Business Planning</option>
                      <option value="partnership">Partnerships &amp; Growth</option>
                      <option value="other">Other / Not sure yet</option>
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
                      minLength={20}
                      maxLength={4000}
                      rows={5}
                      aria-invalid={!!fieldError('message')}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-400 hover:border-teal-500 rounded-xl text-slate-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 transition-all duration-200 resize-none text-base"
                      placeholder="Tell us about your company, vision, and how we can help..."
                    />
                  </div>

                  <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
                    <label htmlFor="website">Leave this field empty</label>
                    <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={formData.website} onChange={handleChange} />
                  </div>

                  <button
                    type="submit"
                    disabled={status.state === 'sending'}
                    className="group w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-teal-700 hover:bg-teal-600 disabled:opacity-60 disabled:cursor-progress text-white rounded-xl shadow-lg shadow-teal-600/20 hover:shadow-teal-600/35 transition-all duration-300 text-base sm:text-lg cursor-pointer"
                  >
                    <span>{status.state === 'sending' ? 'Sending…' : 'Send Message'}</span>
                    <Send className="group-hover:translate-x-1 transition-transform duration-300" size={20} />
                  </button>

                  <p className="text-xs sm:text-sm text-slate-600">
                    We use these details only to reply to your enquiry. See our{' '}
                    <Link to="/privacy" className="underline hover:text-teal-700">privacy policy</Link>.
                    We typically respond within 24–48 hours. For urgent inquiries, please call our main office.
                  </p>
                </form>
                )}
              </Reveal>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-5 sm:space-y-8">
              <Spotlight className="bg-white border border-gray-100 shadow-md rounded-2xl p-6 sm:p-8 hover:border-teal-400/30 transition-all duration-300">
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
                      <div className="text-xs sm:text-sm text-gray-600 mb-1">Business Inquiries</div>
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
              </Spotlight>

              <Spotlight className="bg-white border border-gray-100 shadow-md rounded-2xl p-6 sm:p-8 hover:border-teal-400/30 transition-all duration-300">
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
              </Spotlight>
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
              Our office is based in Melbourne, enabling us to support founders and businesses in Australia and beyond.
            </p>
          </div>

          <div className="flex justify-center">
            {offices.map((office, index) => (
              <Spotlight
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
              </Spotlight>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-14 md:py-24 px-4 sm:px-6 lg:px-8 bg-teal-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-light mb-3 sm:mb-4 text-white">Prefer a Direct Conversation?</h2>
          <p className="text-white/90 mb-6 sm:mb-8 text-base sm:text-lg">
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
