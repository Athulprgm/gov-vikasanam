import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, CornerDownLeft, Loader2, UserCheck, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UserLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login, language, toggleLanguage, t, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const user = await login(email, password);
      // Redirect admin to admin dashboard, regular users to landing page
      if (user.is_admin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-bg-main text-txt-primary font-sans flex items-center justify-center p-6 selection:bg-accent/25 selection:text-txt-primary antialiased overflow-hidden">
      
      {/* Cinematic Ambient Glow Blobs */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-accent rounded-full blur-[130px] opacity-[0.08] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-accent-sec rounded-full blur-[130px] opacity-[0.08] pointer-events-none" />

      {/* Subtle overlay grid lines */}
      <div className="absolute inset-0 bg-grid-white/[0.01] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        {/* Navigation link back to home */}
        <div className="flex justify-between items-center mb-6 px-1">
          <Link to="/" className="inline-flex items-center space-x-1.5 text-xs text-accent font-semibold hover:opacity-85 transition-opacity">
            <CornerDownLeft className="w-3.5 h-3.5" />
            <span>{t("Back", "മടങ്ങുക")}</span>
          </Link>

          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleLanguage}
              className="px-2 py-1 rounded-lg border border-border-main text-[9px] font-bold text-txt-secondary hover:text-txt-primary cursor-pointer bg-bg-sec"
            >
              {language === 'en' ? 'മലയാളം' : 'English'}
            </button>
            <button 
              onClick={toggleTheme}
              className="p-1.5 rounded-lg border border-border-main text-txt-secondary hover:text-txt-primary cursor-pointer bg-bg-sec"
              title="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-3.5 h-3.5" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-yellow-400" />
              )}
            </button>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-accent rounded-2xl shadow-sm">
              <UserCheck className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-txt-primary">
            JANA<span className="text-accent">VIKASAM</span> LOGIN
          </h1>
          <p className="text-xs text-txt-secondary font-malayalam mt-2">
            {t("Log in to view your profile", "പ്രവേശിച്ചു നിങ്ങളുടെ പ്രൊഫൈൽ കാണുക")}
          </p>
        </div>

        {/* Cinematic Glassmorphism Card */}
        <div className="premium-card bg-bg-sec border border-border-main rounded-3xl p-8 shadow-md relative overflow-hidden">
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold leading-relaxed">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-txt-secondary mb-2">
                User Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-txt-secondary/40">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full bg-bg-main border border-border-main rounded-xl py-3.5 pl-11 pr-4 text-sm text-txt-primary placeholder-txt-secondary/40 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-txt-secondary mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-txt-secondary/40">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-bg-main border border-border-main rounded-xl py-3.5 pl-11 pr-4 text-sm text-txt-primary placeholder-txt-secondary/40 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center space-x-2 text-sm disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-bg-main" />
                  <span>കണക്ട് ചെയ്യുന്നു...</span>
                </>
              ) : (
                <>
                  <span>ലോഗിн / Sign In</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Navigation Links */}
          <div className="mt-8 pt-6 border-t border-border-main text-center text-xs text-txt-secondary space-y-4">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="text-accent hover:underline">
                Sign Up
              </Link>
            </p>
            <div className="pt-2">
              <Link to="/admin/login" className="text-txt-secondary hover:text-txt-primary font-semibold flex items-center justify-center space-x-1">
                <span>Go to Admin Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
