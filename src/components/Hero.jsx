import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, ShieldAlert, ArrowRight } from 'lucide-react';
import gsap from 'gsap';

export default function Hero() {
  const videoContainerRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    // Parallax effect on scroll for the cinematic visual frame
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      if (videoContainerRef.current) {
        gsap.to(videoContainerRef.current, {
          y: scrollPos * 0.15,
          scale: 1 + scrollPos * 0.0003,
          duration: 0.1,
          overwrite: 'auto'
        });
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center bg-[#0B0B0B] pt-24 pb-16 overflow-hidden cinematic-grid"
    >
      {/* Background glow blobs */}
      <div className="glow-blob glow-green w-[500px] h-[500px] -top-20 -left-20 pulse-glow-slow" />
      <div className="glow-blob glow-blue w-[400px] h-[400px] bottom-0 right-0 opacity-10" />

      {/* Main Split Screen Container */}
      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Side: Cinematic Copy */}
        <div className="lg:col-span-7 flex flex-col justify-center text-left" ref={titleRef}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full w-fit mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[#2ECC71] animate-ping" />
            <span className="text-xs uppercase tracking-widest text-[#4CFF9B] font-mono font-bold">
              Kerala Infrastructure Showcase 2026
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#F5F5F5] font-malayalam leading-[1.3] mb-6"
          >
            ജനങ്ങൾക്ക് നൽകിയ <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2ECC71] to-[#4CFF9B] text-glow">വാഗ്ദാനങ്ങൾ...</span>
            <br />
            ഇന്ന് വികസനത്തിന്റെ <span className="underline decoration-[#2ECC71] decoration-wavy decoration-2 underline-offset-8">തെളിവുകളായി.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-[#B0B0B0] font-malayalam text-base sm:text-lg max-w-xl mb-10 leading-relaxed font-light"
          >
            തിരഞ്ഞെടുപ്പിന് മുമ്പ് പ്രഖ്യാപിച്ച നവീകരണ പദ്ധതികൾ, ഇന്ന് കേരളത്തിന്റെ ഓരോ കോണിലും നേരിൽ കാണാവുന്ന യാഥാർത്ഥ്യമായി മാറിക്കഴിഞ്ഞിരിക്കുന്നു.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-wrap gap-4"
          >
            <a
              href="#before-after"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-[#2ECC71] to-[#4CFF9B] text-black font-bold text-sm hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 shadow-[0_4px_25px_rgba(46,204,113,0.3)] flex items-center"
            >
              വികസനം കാണൂ
              <ArrowRight className="ml-2 w-4 h-4" />
            </a>
            <a
              href="#kerala-map"
              className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-[#F5F5F5] font-bold text-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center"
            >
              പദ്ധതികൾ പരിശോധിക്കുക
            </a>
          </motion.div>

          {/* Micro stats banner */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 1, duration: 1 }}
            className="grid grid-cols-3 gap-6 border-t border-white/10 mt-12 pt-6 max-w-md font-mono text-xs"
          >
            <div>
              <div className="text-[#F5F5F5] font-bold text-lg">120+</div>
              <div className="text-[#B0B0B0] text-[10px]">PROJECTS</div>
            </div>
            <div>
              <div className="text-[#F5F5F5] font-bold text-lg">₹500Cr+</div>
              <div className="text-[#B0B0B0] text-[10px]">INVESTMENT</div>
            </div>
            <div>
              <div className="text-[#F5F5F5] font-bold text-lg">100%</div>
              <div className="text-[#B0B0B0] text-[10px]">TRANSPARENCY</div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Luxury Simulated Viewport HUD */}
        <div className="lg:col-span-5 relative w-full h-[350px] sm:h-[450px] lg:h-[550px] flex items-center justify-center">
          
          {/* Animated decorative frame boundaries */}
          <div className="absolute inset-0 border border-white/10 rounded-2xl p-2 z-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#2ECC71]" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#2ECC71]" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#2ECC71]" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#2ECC71]" />
          </div>

          {/* High-Tech HUD elements overlay */}
          <div className="absolute inset-4 z-20 pointer-events-none flex flex-col justify-between p-4 font-mono text-[9px] text-[#4CFF9B] opacity-75">
            <div className="flex justify-between">
              <span>CAMERA: REC ●</span>
              <span>4K HDR 60FPS</span>
            </div>
            {/* Center crosshair */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4CFF9B] block" />
              <div className="absolute w-6 h-[1px] bg-[#4CFF9B]/30" />
              <div className="absolute h-6 w-[1px] bg-[#4CFF9B]/30" />
            </div>
            <div className="flex justify-between items-end">
              <div>
                <div>LAT: 10.8505° N</div>
                <div>LON: 76.2711° E</div>
              </div>
              <div className="text-right">
                <div>ALT: 250M</div>
                <div>ISO: 100</div>
              </div>
            </div>
          </div>

          {/* Main Visual Frame */}
          <div
            ref={videoContainerRef}
            className="relative w-[98%] h-[98%] rounded-xl overflow-hidden shadow-2xl bg-black border border-white/5"
          >
            {/* Video overlay to give vintage cinema tint */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 z-10" />
            <div className="absolute inset-0 bg-[#0B0B0B]/20 mix-blend-color z-10" />

            {/* Immersive Drone-like image representing highway and nature */}
            <img
              src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1200&q=80"
              alt="Kerala Development Drone View"
              className="w-full h-full object-cover scale-110 brightness-[0.8]"
            />

            {/* Glowing speed vector graphic */}
            <svg
              className="absolute top-12 left-12 w-28 h-28 opacity-40 z-20"
              viewBox="0 0 100 100"
            >
              <circle cx="50" cy="50" r="40" stroke="#4CFF9B" strokeWidth="1" strokeDasharray="5 10" fill="none" className="animate-[spin_20s_linear_infinite]" />
              <circle cx="50" cy="50" r="30" stroke="#4CFF9B" strokeWidth="2" strokeDasharray="30 20" fill="none" className="animate-[spin_10s_linear_infinite_reverse]" />
            </svg>
          </div>

          {/* Micro ambient sparks/dots floating on the side */}
          <div className="absolute -right-4 top-1/4 w-12 h-12 flex flex-wrap gap-2 opacity-20 pointer-events-none">
            {Array.from({ length: 9 }).map((_, i) => (
              <span key={i} className="w-1.5 h-1.5 bg-[#2ECC71] rounded-full" />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
