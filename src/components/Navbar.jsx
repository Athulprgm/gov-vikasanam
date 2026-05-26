import { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Shield, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout, language, toggleLanguage, t, theme, toggleTheme } = useAuth();
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
    { nameMl: "കാഴ്ചകൾ", nameEn: "Showcase", href: "/showcase", isRouter: true },
    { nameMl: "ഭൂപടം", nameEn: "Map", href: "/map", isRouter: true },
    { nameMl: "നാൾവഴി", nameEn: "Timeline", href: "/timeline", isRouter: true },
    { nameMl: "നേട്ടങ്ങൾ", nameEn: "Stats", href: "/statistics", isRouter: true },
    { nameMl: "അഭിപ്രായങ്ങൾ", nameEn: "Impact", href: "/impact", isRouter: true },
    ...(isAuthenticated ? [
      { nameMl: "ഫീഡ്", nameEn: "Feed", href: "/feed", isRouter: true },
      { nameMl: "പ്രൊഫൈൽ", nameEn: "Profile", href: "/profile", isRouter: true }
    ] : [])
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${
        scrolled
          ? 'py-4 bg-bg-main/90 backdrop-blur-md border-b border-border-main'
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo Section */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-sm group-hover:scale-105 transition-transform duration-300 shrink-0">
            <img
              src="/logo.png"
              alt="Kerala One Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-txt-primary font-extrabold text-sm leading-tight tracking-wider uppercase">
              {t("JanaVikasam", "ജനവികസനം")}
            </span>
            <span className="text-txt-secondary font-mono text-[9px] uppercase tracking-[0.2em]">
              {t("Kerala Development", "കേരള വികസനം")}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            link.isRouter ? (
              <Link
                key={link.href}
                to={link.href}
                className="group flex flex-col items-center relative py-1 text-xs font-semibold text-txt-secondary hover:text-txt-primary transition-colors duration-300"
              >
                <span>{t(link.nameEn, link.nameMl)}</span>
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-accent transition-all duration-300 group-hover:w-full" />
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="group flex flex-col items-center relative py-1 text-xs font-semibold text-txt-secondary hover:text-txt-primary transition-colors duration-300"
              >
                <span>{t(link.nameEn, link.nameMl)}</span>
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-accent transition-all duration-300 group-hover:w-full" />
              </a>
            )
          ))}
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-3.5">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1.5 rounded-xl border border-border-main text-[10px] font-bold text-txt-secondary hover:text-txt-primary hover:bg-bg-sec transition-all cursor-pointer"
          >
            {language === 'en' ? 'മലയാളം' : 'English'}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-xl border border-border-main text-txt-secondary hover:text-txt-primary hover:bg-bg-sec transition-all cursor-pointer"
            title={t("Toggle theme", "തീം മാറ്റുക")}
          >
            {theme === 'light' ? (
              <Moon className="w-3.5 h-3.5" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-yellow-400" />
            )}
          </button>

          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="text-xs font-semibold text-txt-secondary hover:text-accent transition-colors"
              >
                {t("Login", "ലോഗിൻ")}
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center px-4 py-2 rounded-xl border border-border-main bg-bg-sec text-xs font-semibold text-txt-primary hover:bg-accent hover:text-white hover:border-transparent transition-all duration-300"
              >
                {t("Sign Up", "രജിസ്റ്റർ")}
              </Link>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <span className="text-xs text-txt-secondary font-mono">
                {t("Hi", "ഹായ്")}, {user?.name ? user.name.split(' ')[0] : 'User'}
              </span>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="inline-flex items-center px-3.5 py-2 rounded-xl border border-accent/30 bg-accent/10 text-xs font-semibold text-accent hover:bg-accent/20 transition-all duration-300"
                >
                  <Shield className="w-3.5 h-3.5 mr-1.5" />
                  <span>{t("Console", "പാനൽ")}</span>
                </Link>
              )}
              <button
                onClick={logout}
                className="text-xs font-semibold text-txt-secondary hover:text-red-400 transition-colors cursor-pointer"
              >
                {t("Logout", "ലോഗ് ഔട്ട്")}
              </button>
            </div>
          )}

          <Link
            to="/showcase"
            className="inline-flex items-center px-4 py-2 rounded-xl border border-border-main text-xs font-semibold text-txt-primary hover:text-white hover:bg-accent hover:border-transparent transition-all duration-300 shadow-sm group"
          >
            <span>{t("See Change", "മാറ്റം കാണൂ")}</span>
            <ArrowUpRight className="ml-1.5 w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="md:hidden flex items-center space-x-2">
          {/* Theme Toggle for mobile header */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-border-main bg-bg-sec text-txt-primary cursor-pointer"
          >
            {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-yellow-400" />}
          </button>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-txt-primary focus:outline-none p-1.5 rounded-xl border border-border-main bg-bg-sec hover:bg-bg-main"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-bg-sec border-b border-border-main py-6 px-6 flex flex-col space-y-4 shadow-2xl animate-fade-in-down">
          {navLinks.map((link) => (
            link.isRouter ? (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className="flex justify-between items-center py-2.5 px-3 rounded-xl border border-border-main hover:bg-bg-main group transition-all"
              >
                <span className="text-sm font-semibold text-txt-primary">{t(link.nameEn, link.nameMl)}</span>
                <span className="w-2 h-2 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex justify-between items-center py-2.5 px-3 rounded-xl border border-border-main hover:bg-bg-main group transition-all"
              >
                <span className="text-sm font-semibold text-txt-primary">{t(link.nameEn, link.nameMl)}</span>
                <span className="w-2 h-2 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            )
          ))}
          
          {/* Mobile Language Switcher */}
          <div className="flex justify-between items-center py-2 px-3 border border-border-main rounded-xl bg-bg-main/50">
            <span className="text-xs text-txt-secondary">{t("Language", "ഭാഷ")}</span>
            <button 
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-xl border border-border-main text-xs font-semibold text-txt-primary bg-bg-sec cursor-pointer"
            >
              {language === 'en' ? 'മലയാളം' : 'English'}
            </button>
          </div>
          <div className="h-[1px] bg-border-main my-2" />

          {!isAuthenticated ? (
            <div className="flex flex-col space-y-3">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center w-full py-3 rounded-xl border border-border-main text-txt-secondary hover:text-txt-primary font-semibold text-sm transition-colors"
              >
                {t("Login", "ലോഗിൻ")}
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center w-full py-3 rounded-xl bg-bg-main border border-border-main text-txt-primary font-bold text-sm transition-colors"
              >
                {t("Sign Up", "രജിസ്റ്റർ")}
              </Link>
            </div>
          ) : (
            <div className="flex flex-col space-y-3">
              <div className="text-center text-xs text-txt-secondary font-mono">
                {t("Logged in as", "പ്രവേശിച്ചത്")} <span className="text-txt-primary font-semibold">{user?.name}</span>
              </div>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center w-full py-3 rounded-xl border border-accent/30 bg-accent/10 text-accent font-semibold text-sm"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  <span>{t("Console Portal", "അഡ്മിൻ പാനൽ")}</span>
                </Link>
              )}
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="flex items-center justify-center w-full py-3 rounded-xl border border-red-500/20 text-red-500 font-semibold text-sm hover:bg-red-500/5 transition-colors cursor-pointer"
              >
                {t("Logout", "ലോഗ് ഔട്ട്")}
              </button>
            </div>
          )}

          <Link
            to="/showcase"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center w-full py-3 mt-2 rounded-xl bg-accent text-white font-bold text-sm shadow-sm"
          >
            <span>{t("See Change", "മാറ്റം കാണൂ")}</span>
            <ArrowUpRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      )}
    </nav>
  );
}
