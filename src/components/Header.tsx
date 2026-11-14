import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKey);
    };
  }, []);

  const navClass = ({ isActive }: { isActive: boolean }) => {
    const base = 'relative px-4 py-2 text-sm font-light tracking-wide transition-all duration-200';
    if (isScrolled) {
      return `${base} ${isActive ? 'text-teal-300' : 'text-slate-300 hover:text-white'}`;
    }
    return `${base} ${isActive ? 'text-white' : 'text-slate-300 hover:text-white'}`;
  };

  const mobileNavClass = ({ isActive }: { isActive: boolean }) =>
    `block w-full text-left px-4 py-3 text-base transition-all duration-200 rounded-lg ${
      isActive
        ? 'text-teal-600 bg-teal-50'
        : 'text-gray-600 hover:text-teal-600 hover:bg-teal-50/50'
    }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-slate-950/75 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20'
          : 'bg-white/10 backdrop-blur-md border-b border-white/10'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:pt-3">
        <div className="flex items-center justify-between h-16 sm:h-20">

          <NavLink to="/" className="hover:opacity-75 transition-opacity duration-200">
            <picture>
              <source srcSet="/logo.webp" type="image/webp" />
              <img
                src="/logo.png"
                alt="Fund'ex"
                width={440}
                height={135}
                {...{ fetchpriority: "high" }}
                decoding="async"
                className="h-10 sm:h-14 w-auto"
              />
            </picture>
          </NavLink>

          <div className="hidden md:flex items-center space-x-1">
            {[
              { to: '/', label: 'Home', end: true },
              { to: '/services', label: 'Services', end: false },
              { to: '/approach', label: 'Approach', end: false },
              { to: '/about', label: 'About', end: false },
              { to: '/contact', label: 'Contact', end: false },
            ].map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={navClass}>
                {({ isActive }) => (
                  <>
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-teal-400 to-teal-500 rounded-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <button
            className={`md:hidden transition-colors duration-200 p-2 rounded-lg ${isScrolled ? 'text-slate-200 hover:text-white hover:bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/8'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden bg-white backdrop-blur-xl border-b border-gray-200">
          <div className="px-4 py-4 space-y-1">
            <NavLink to="/" end className={mobileNavClass} onClick={() => setIsMobileMenuOpen(false)}>Home</NavLink>
            <NavLink to="/services" className={mobileNavClass} onClick={() => setIsMobileMenuOpen(false)}>Services</NavLink>
            <NavLink to="/approach" className={mobileNavClass} onClick={() => setIsMobileMenuOpen(false)}>Approach</NavLink>
            <NavLink to="/about" className={mobileNavClass} onClick={() => setIsMobileMenuOpen(false)}>About</NavLink>
            <NavLink to="/contact" className={mobileNavClass} onClick={() => setIsMobileMenuOpen(false)}>Contact</NavLink>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
