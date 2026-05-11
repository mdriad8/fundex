import { Linkedin, Twitter, Mail } from 'lucide-react';
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
              Operating at the intersection of capital, strategy, and execution.
              Building enduring companies from first cheque to final exit.
            </p>
            <div className="flex space-x-3 mt-6">
              {[
                { icon: Linkedin, label: 'LinkedIn' },
                { icon: Twitter, label: 'Twitter' },
                { icon: Mail, label: 'Email' },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 hover:border-blue-500/50 hover:bg-blue-500/10 flex items-center justify-center text-slate-400 hover:text-blue-400 transition-all duration-200"
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
              <li>Venture Capital</li>
              <li>Strategic Advisory</li>
              <li>Business Brokerage</li>
              <li>M&A Transactions</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {currentYear} Fund'ex. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors duration-200">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
