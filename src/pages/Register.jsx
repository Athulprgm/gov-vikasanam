import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, User, Mail, Lock, ArrowRight, CornerDownLeft, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const user = await register(name, email, password);
      // First user is automatically admin, redirect to admin. Else redirect home.
      if (user.is_admin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Try using a different email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0B0B0B] text-[#F5F5F5] font-sans flex items-center justify-center p-6 selection:bg-[#2ECC71] selection:text-black antialiased overflow-hidden">
      
      {/* Dynamic Glow Blobs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#2ECC71] rounded-full blur-[120px] opacity-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#3498db] rounded-full blur-[120px] opacity-10 pointer-events-none" />

      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-white/[0.01] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        {/* Branding header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-[#4CFF9B] font-mono text-xs uppercase tracking-widest hover:opacity-85 transition-opacity mb-4">
            <CornerDownLeft className="w-3.5 h-3.5" />
            <span>മടങ്ങുക / Return to Home</span>
          </Link>
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-tr from-[#2ECC71] to-[#4CFF9B] rounded-2xl shadow-[0_0_20px_rgba(46,204,113,0.3)]">
              <Shield className="w-8 h-8 text-black" />
            </div>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#F5F5F5]">
            JANA<span className="text-[#2ECC71]">VIKASAM</span> SIGNUP
          </h1>
          <p className="text-xs text-[#B0B0B0] font-malayalam mt-2">
            പുതിയ അക്കൗണ്ട് സൃഷ്ടിച്ചു ലോഗിൻ ചെയ്യുക
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#121212]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold leading-relaxed">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-[#B0B0B0] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-white/30">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Official Name"
                  className="w-full bg-black/45 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-[#F5F5F5] placeholder-white/20 focus:outline-none focus:border-[#2ECC71] focus:ring-1 focus:ring-[#2ECC71] transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-[#B0B0B0] mb-1.5">
                Email Address
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
                  className="w-full bg-black/45 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-[#F5F5F5] placeholder-white/20 focus:outline-none focus:border-[#2ECC71] focus:ring-1 focus:ring-[#2ECC71] transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-[#B0B0B0] mb-1.5">
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
                  placeholder="Min 6 characters"
                  className="w-full bg-black/45 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-[#F5F5F5] placeholder-white/20 focus:outline-none focus:border-[#2ECC71] focus:ring-1 focus:ring-[#2ECC71] transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-[#B0B0B0] mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-white/30">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full bg-black/45 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-[#F5F5F5] placeholder-white/20 focus:outline-none focus:border-[#2ECC71] focus:ring-1 focus:ring-[#2ECC71] transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative group bg-gradient-to-r from-[#2ECC71] to-[#4CFF9B] text-black font-semibold rounded-xl py-3.5 hover:shadow-[0_0_20px_rgba(76,255,155,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center space-x-2 text-sm disabled:opacity-50 mt-6 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>അക്കൗണ്ട് നിർമ്മിക്കുന്നു...</span>
                </>
              ) : (
                <>
                  <span>അക്കൗണ്ട് സൃഷ്ടിക്കുക / Sign Up</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5 text-center text-xs text-[#B0B0B0]">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="text-[#2ECC71] hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
