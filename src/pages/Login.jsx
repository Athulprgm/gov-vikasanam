import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, CornerDownLeft, Loader2, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UserLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login } = useAuth();
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
    <div className="relative min-h-screen bg-[#0B0B0B] text-[#F5F5F5] font-sans flex items-center justify-center p-6 selection:bg-[#2ECC71] selection:text-black antialiased overflow-hidden">
      
      {/* Cinematic Ambient Glow Blobs */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-[#2ECC71] rounded-full blur-[130px] opacity-[0.08] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-[#3498db] rounded-full blur-[130px] opacity-[0.08] pointer-events-none" />

      {/* Subtle overlay grid lines */}
      <div className="absolute inset-0 bg-grid-white/[0.01] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        {/* Navigation link back to home */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-[#4CFF9B] font-mono text-xs uppercase tracking-widest hover:opacity-85 transition-opacity mb-4">
            <CornerDownLeft className="w-3.5 h-3.5" />
            <span>മടങ്ങുക / Return to Home</span>
          </Link>
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-tr from-[#2ECC71] to-[#4CFF9B] rounded-2xl shadow-[0_0_20px_rgba(46,204,113,0.25)]">
              <UserCheck className="w-7 h-7 text-black" />
            </div>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#F5F5F5]">
            JANA<span className="text-[#2ECC71]">VIKASAM</span> LOGIN
          </h1>
          <p className="text-xs text-[#B0B0B0] font-malayalam mt-2">
            പ്രവേശിച്ചു നിങ്ങളുടെ പ്രൊഫൈൽ കാണുക
          </p>
        </div>

        {/* Cinematic Glassmorphism Card */}
        <div className="bg-[#121212]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold leading-relaxed">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-[#B0B0B0] mb-2">
                User Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-white/30">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full bg-black/45 border border-white/5 rounded-xl py-3.5 pl-11 pr-4 text-sm text-[#F5F5F5] placeholder-white/20 focus:outline-none focus:border-[#2ECC71] focus:ring-1 focus:ring-[#2ECC71] transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-[#B0B0B0] mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-white/30">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/45 border border-white/5 rounded-xl py-3.5 pl-11 pr-4 text-sm text-[#F5F5F5] placeholder-white/20 focus:outline-none focus:border-[#2ECC71] focus:ring-1 focus:ring-[#2ECC71] transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative group bg-gradient-to-r from-[#2ECC71] to-[#4CFF9B] text-black font-semibold rounded-xl py-4 hover:shadow-[0_0_20px_rgba(76,255,155,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center space-x-2 text-sm disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>കണക്ട് ചെയ്യുന്നു...</span>
                </>
              ) : (
                <>
                  <span>ലോഗിൻ / Sign In</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Navigation Links */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-[#B0B0B0] space-y-4">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="text-[#2ECC71] hover:underline">
                Sign Up
              </Link>
            </p>
            <div className="pt-2">
              <Link to="/admin/login" className="text-slate-400 hover:text-white font-semibold flex items-center justify-center space-x-1">
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
