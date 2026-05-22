import { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { nameMl: "കാഴ്ചകൾ", nameEn: "Showcase", href: "#featured-projects" },
    { nameMl: "ഭൂപടം", nameEn: "Map", href: "#kerala-map" },
    { nameMl: "നാൾവഴി", nameEn: "Timeline", href: "#timeline" },
    { nameMl: "നേട്ടങ്ങൾ", nameEn: "Stats", href: "#statistics" },
    { nameMl: "അഭിപ്രായങ്ങൾ", nameEn: "Impact", href: "#citizen-impact" }
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${
        scrolled
          ? 'py-4 bg-[#0B0B0B]/80 backdrop-blur-md border-b border-white/5'
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo Section */}
        <a href="#hero" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#2ECC71] to-[#4CFF9B] flex items-center justify-center font-bold text-black text-lg shadow-[0_0_15px_rgba(46,204,113,0.3)] group-hover:scale-105 transition-transform duration-300">
            ജ
          </div>
          <div className="flex flex-col">
            <span className="text-[#F5F5F5] font-extrabold text-lg leading-tight tracking-wider font-malayalam">
              ജനവികസനം
            </span>
            <span className="text-[#B0B0B0] font-mono text-[9px] uppercase tracking-[0.25em]">
              JANAVIKASAM
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group flex flex-col items-center relative py-1 text-sm font-medium text-[#B0B0B0] hover:text-[#F5F5F5] transition-colors duration-300"
            >
              <span className="font-malayalam text-xs">{link.nameMl}</span>
              <span className="text-[10px] opacity-60 font-mono tracking-wider font-light mt-0.5 group-hover:opacity-100 transition-opacity">
                {link.nameEn}
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#2ECC71] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* Action Button */}
        <div className="hidden md:block">
          <a
            href="#before-after"
            className="inline-flex items-center px-4 py-2 rounded-full border border-white/10 text-xs font-semibold text-[#F5F5F5] hover:text-black hover:bg-gradient-to-r hover:from-[#2ECC71] hover:to-[#4CFF9B] hover:border-transparent transition-all duration-300 shadow-[0_0_10px_rgba(46,204,113,0.05)] hover:shadow-[0_0_20px_rgba(46,204,113,0.25)] group"
          >
            മാറ്റം കാണൂ
            <ArrowUpRight className="ml-1.5 w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-[#F5F5F5] focus:outline-none p-1.5 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#0B0B0B]/95 backdrop-blur-xl border-b border-white/5 py-6 px-6 flex flex-col space-y-4 shadow-2xl animate-fade-in-down">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="flex justify-between items-center py-2.5 px-3 rounded-lg border border-white/5 hover:border-[#2ECC71]/30 hover:bg-[#2ECC71]/5 group transition-all"
            >
              <div className="flex flex-col">
                <span className="font-malayalam text-[#F5F5F5] text-sm font-semibold">{link.nameMl}</span>
                <span className="text-xs text-[#B0B0B0] font-mono">{link.nameEn}</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#2ECC71] opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
          <a
            href="#before-after"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center w-full py-3 mt-2 rounded-lg bg-gradient-to-r from-[#2ECC71] to-[#4CFF9B] text-black font-bold text-sm shadow-[0_0_15px_rgba(46,204,113,0.2)]"
          >
            മാറ്റം കാണൂ
            <ArrowUpRight className="ml-2 w-4 h-4" />
          </a>
        </div>
      )}
    </nav>
  );
}
