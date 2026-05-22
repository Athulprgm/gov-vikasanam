import { motion } from 'framer-motion';
import { ArrowUpRight, CheckCircle } from 'lucide-react';

export default function CTA() {
  return (
    <section id="cta" className="relative bg-[#0B0B0B] py-28 overflow-hidden">
      {/* Immersive background glow bloom */}
      <div className="absolute w-[600px] h-[600px] bg-[#2ECC71]/10 rounded-full blur-[140px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        
        {/* Main CTA panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="glass-panel p-8 md:p-16 rounded-3xl border border-[#2ECC71]/25 bg-[#2ECC71]/[0.01] shadow-[0_0_50px_rgba(46,204,113,0.1)] text-center relative overflow-hidden"
        >
          {/* Subtle grid lining inside CTA card */}
          <div className="absolute inset-0 bg-grid-white/[0.01] pointer-events-none" />

          {/* Icon Badge */}
          <div className="inline-flex items-center space-x-2 bg-[#2ECC71]/10 border border-[#2ECC71]/30 px-4 py-2 rounded-full mb-8">
            <CheckCircle className="w-4 h-4 text-[#4CFF9B]" />
            <span className="text-xs uppercase tracking-widest text-[#4CFF9B] font-mono font-bold">
              100% Promises Accomplished
            </span>
          </div>

          {/* Slogan */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#F5F5F5] font-malayalam leading-[1.3] mb-6 max-w-3xl mx-auto">
            ജനങ്ങൾക്ക് നൽകിയ വാക്കുകൾ...
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2ECC71] to-[#4CFF9B] text-glow">പ്രവർത്തനങ്ങളായി മാറിയപ്പോൾ.</span>
          </h2>

          <p className="text-[#B0B0B0] text-sm md:text-base font-malayalam max-w-xl mx-auto mb-10 leading-relaxed font-light">
            കേരളത്തിലെ എല്ലാ വികസന പദ്ധതികളുടെയും വിശദാംശങ്ങളും കൃത്യമായ വിലയിരുത്തലുകളും സുതാര്യമായി പൊതുജനങ്ങൾക്കായി സമർപ്പിച്ചിരിക്കുന്നു.
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#featured-projects"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-[#2ECC71] to-[#4CFF9B] text-black font-bold text-sm hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 shadow-[0_4px_25px_rgba(46,204,113,0.25)] flex items-center"
            >
              പദ്ധതികൾ കാണൂ
              <ArrowUpRight className="ml-1.5 w-4 h-4" />
            </a>
            <a
              href="#kerala-map"
              className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-[#F5F5F5] font-bold text-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              ജില്ലാതല വിവരങ്ങൾ
            </a>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
