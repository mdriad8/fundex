import { Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900/80 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-8 sm:mb-10">
          <div className="sm:col-span-2 md:col-span-2">
            <h3 className="text-2xl font-light tracking-wider mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Fund'ex
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              Operating at the intersection of strategy and execution.
              Helping founders build enduring companies.
            </p>
            <div className="flex space-x-3 mt-6">
              {[
                { icon: Linkedin, label: 'Fundex Global on LinkedIn', href: 'https://www.linkedin.com/company/111150296/' },
                { icon: Mail, label: 'Email info@fundexglobal.vc', href: 'mailto:info@fundexglobal.vc' },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 hover:border-teal-600/50 hover:bg-teal-600/10 flex items-center justify-center text-slate-400 hover:text-teal-400 transition-all duration-200"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-5 text-slate-200 tracking-wide">Navigate</h4>
            <ul className="space-y-3">
              {[
                { name: 'Services', path: '/services' },
                { name: 'Approach', path: '/approach' },
                { name: 'About', path: '/about' },
                { name: 'Beyond the Prompt hackathon', path: '/hackathon' },
                { name: 'Contact', path: '/contact' },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-slate-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-5 text-slate-200 tracking-wide">Focus Areas</h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li>Strategic Advisory</li>
              <li>Business Planning</li>
              <li>Partnerships &amp; Growth</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            © {currentYear} Fundex Global Pty Ltd · ABN 49 694 783 205. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-slate-400 hover:text-slate-200 text-sm transition-colors duration-200">
              Privacy Policy
            </Link>
          </div>
        </div>
        <p className="mt-6 text-slate-400 text-xs leading-relaxed max-w-4xl">
          Fund'ex provides strategy, business planning and execution support. We do not provide financial
          product advice, make investment recommendations, or arrange or deal in investments.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
