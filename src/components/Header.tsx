import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 text-sm font-light tracking-wide transition-all ${
      isActive ? 'text-blue-400' : 'text-slate-300 hover:text-white'
    }`;

  const mobileNavClass = ({ isActive }: { isActive: boolean }) =>
    `block w-full text-left px-4 py-3 text-base transition-all ${
      isActive ? 'text-blue-400 bg-slate-800/50' : 'text-slate-300 hover:text-white hover:bg-slate-800/30'
    }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/95 backdrop-blur-md border-b border-slate-800'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          <NavLink to="/" className="hover:opacity-70 transition-opacity">
            <img src={logo} alt="Fund'ex" className="h-14 w-auto" />
          </NavLink>

          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/" end className={navClass}>Home</NavLink>
            <NavLink to="/services" className={navClass}>Services</NavLink>
            <NavLink to="/approach" className={navClass}>Approach</NavLink>
            <NavLink to="/about" className={navClass}>About</NavLink>
            <NavLink to="/contact" className={navClass}>Contact</NavLink>
          </div>

          <button
            className="md:hidden text-slate-300 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900/98 backdrop-blur-lg border-b border-slate-800">
          <div className="px-6 py-4 space-y-1">
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
