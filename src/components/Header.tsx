import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

function Header({ currentPage, setCurrentPage }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Home', id: 'home' },
    { name: 'Services', id: 'services' },
    { name: 'Approach', id: 'approach' },
    { name: 'About', id: 'about' },
    { name: 'Contact', id: 'contact' },
  ];

  const handleNavClick = (pageId: string) => {
    setCurrentPage(pageId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-950/95 backdrop-blur-md border-b border-slate-800"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <button
            onClick={() => handleNavClick("home")}
            className="text-2xl font-light tracking-wider hover:opacity-70 transition-opacity"
          >
           <img src={logo} alt="Fund'ex" className="h-14 w-auto" />
          </button>

          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-2 text-sm font-light tracking-wide transition-all ${
                  currentPage === item.id
                    ? "text-blue-400"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {item.name}
              </button>
            ))}
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
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`block w-full text-left px-4 py-3 text-base transition-all ${
                  currentPage === item.id
                    ? "text-blue-400 bg-slate-800/50"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/30"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
