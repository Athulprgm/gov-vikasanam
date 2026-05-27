import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Layers, Map, Clock, BarChart3, Quote, ArrowRight, CheckCircle } from 'lucide-react';

export default function InteractiveHub() {
  const { t } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section className="py-20 bg-bg-main relative overflow-hidden">
      {/* Decorative background gradients */}
      <div className="absolute w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-accent font-mono font-bold block mb-3">
            EXPLORE THE PORTAL
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-txt-primary font-malayalam leading-tight">
            കേരളത്തിന്റെ വികസനം വിരൽത്തുമ്പിൽ
          </h2>
          <p className="text-txt-secondary text-sm md:text-base font-malayalam mt-4 font-light">
            താഴെ നൽകിയിരിക്കുന്ന വിഭാഗങ്ങളിലൂടെ കടന്നുപോയി വികസന നേട്ടങ്ങൾ വിശദമായി പരിശോധിക്കുക.
          </p>
        </div>

        {/* High-Concept Grid Layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Card 1: Showcase - 7 Cols */}
          <motion.div variants={itemVariants} className="lg:col-span-7 group">
            <Link
              to="/showcase"
              className="premium-card h-full p-8 flex flex-col justify-between overflow-hidden relative min-h-[300px] bg-bg-sec border border-border-main hover:border-accent hover:shadow-lg transition-all duration-400 block"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full group-hover:bg-accent/10 transition-colors duration-400" />
              
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-accent/10 text-accent group-hover:scale-110 transition-transform">
                    <Layers className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-accent tracking-wider uppercase">
                    SHOWCASE
                  </span>
                </div>

                <h3 className="text-2xl font-extrabold text-txt-primary font-malayalam leading-tight mb-2">
                  വികസനക്കാഴ്ചകൾ (NH-66 & Bridges)
                </h3>
                <p className="text-txt-secondary text-sm font-malayalam font-light leading-relaxed max-w-md">
                  മുൻപും പിൻപുമുള്ള ദൃശ്യങ്ങൾ സ്ലൈഡറിലൂടെ ഒത്തുനോക്കൂ. പ്രധാന വികസന പദ്ധതികളുടെ വിശദവിവരങ്ങൾ പരിശോധിക്കാം.
                </p>
              </div>

              {/* Interactive Preview Element */}
              <div className="mt-8 flex items-center justify-between">
                {/* Micro preview grid */}
                <div className="flex items-center space-x-4">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full border border-bg-sec overflow-hidden bg-slate-300">
                      <img src="https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?auto=format&fit=crop&w=40&q=80" className="object-cover w-full h-full" alt="Preview 1" />
                    </div>
                    <div className="w-8 h-8 rounded-full border border-bg-sec overflow-hidden bg-slate-300">
                      <img src="https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=40&q=80" className="object-cover w-full h-full" alt="Preview 2" />
                    </div>
                  </div>
                  <span className="text-[10px] text-txt-secondary font-mono">5 active transformations</span>
                </div>

                <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-accent font-mono group-hover:translate-x-1 transition-transform">
                  <span>EXPLORE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Card 2: Map - 5 Cols */}
          <motion.div variants={itemVariants} className="lg:col-span-5 group">
            <Link
              to="/map"
              className="premium-card h-full p-8 flex flex-col justify-between overflow-hidden relative min-h-[300px] bg-bg-sec border border-border-main hover:border-accent hover:shadow-lg transition-all duration-400 block"
            >
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/5 rounded-full group-hover:scale-110 transition-transform duration-400 pointer-events-none" />

              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-accent/10 text-accent group-hover:scale-110 transition-transform">
                    <Map className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-accent tracking-wider uppercase">
                    REGIONAL MAP
                  </span>
                </div>

                <h3 className="text-2xl font-extrabold text-txt-primary font-malayalam leading-tight mb-2">
                  വികസന ഭൂപടം (14 Districts)
                </h3>
                <p className="text-txt-secondary text-sm font-malayalam font-light leading-relaxed">
                  ഓരോ ജില്ലയിലേയും പദ്ധതി നിക്ഷേപങ്ങളും തത്സമയ പൂർത്തീകരണ നിലവാരവും മാപ്പിലൂടെ നോക്കാം.
                </p>
              </div>

              {/* Interactive Preview Element */}
              <div className="mt-8 flex items-center justify-between">
                <div className="flex items-center space-x-2 bg-accent/5 border border-accent/10 py-1 px-2.5 rounded-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  <span className="text-[10px] text-accent font-mono uppercase tracking-wider">Interactive GIS Node</span>
                </div>

                <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-accent font-mono group-hover:translate-x-1 transition-transform">
                  <span>VIEW MAP</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Card 3: Timeline - 4 Cols */}
          <motion.div variants={itemVariants} className="lg:col-span-4 group">
            <Link
              to="/timeline"
              className="premium-card h-full p-8 flex flex-col justify-between overflow-hidden relative min-h-[280px] bg-bg-sec border border-border-main hover:border-accent hover:shadow-lg transition-all duration-400 block"
            >
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-accent/10 text-accent group-hover:scale-110 transition-transform">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-accent tracking-wider uppercase">
                    TIMELINE
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-txt-primary font-malayalam leading-tight mb-2">
                  വികസന നാൾവഴി
                </h3>
                <p className="text-txt-secondary text-xs font-malayalam font-light leading-relaxed">
                  2021 മുതൽ 2026 വരെയുള്ള കേരളത്തിന്റെ ചരിത്രപരമായ വികസന കുതിപ്പ് വർഷങ്ങൾ തിരിച്ചു കാണാം.
                </p>
              </div>

              {/* Micro Timeline Visual */}
              <div className="mt-6 flex items-center justify-between border-t border-border-main pt-4">
                <div className="flex space-x-2 font-mono text-[9px] text-txt-secondary/60">
                  <span>2021</span>
                  <span>➔</span>
                  <span>2024</span>
                  <span>➔</span>
                  <span className="text-accent font-bold">2026</span>
                </div>

                <span className="inline-flex items-center space-x-1 text-xs font-bold text-accent font-mono group-hover:translate-x-1 transition-transform">
                  <span>TIMELINE</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Card 4: Stats - 4 Cols */}
          <motion.div variants={itemVariants} className="lg:col-span-4 group">
            <Link
              to="/statistics"
              className="premium-card h-full p-8 flex flex-col justify-between overflow-hidden relative min-h-[280px] bg-bg-sec border border-border-main hover:border-accent hover:shadow-lg transition-all duration-400 block"
            >
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-accent/10 text-accent group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-accent tracking-wider uppercase">
                    STATISTICS
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-txt-primary font-malayalam leading-tight mb-2">
                  സ്ഥിതിവിവരങ്ങൾ
                </h3>
                <p className="text-txt-secondary text-xs font-malayalam font-light leading-relaxed">
                  ബജറ്റ് വിവരണങ്ങളും, ആകെ ചെലവഴിച്ച തുകകളും സുതാര്യമായി പൊതുജനങ്ങൾക്കായി തുറന്നു നൽകുന്നു.
                </p>
              </div>

              {/* Micro counter visual */}
              <div className="mt-6 flex items-center justify-between border-t border-border-main pt-4">
                <div className="flex space-x-3">
                  <div>
                    <span className="text-accent font-bold text-sm block leading-none font-mono">120+</span>
                    <span className="text-[8px] text-txt-secondary uppercase">Projects</span>
                  </div>
                  <div className="w-[1px] bg-border-main" />
                  <div>
                    <span className="text-accent font-bold text-sm block leading-none font-mono">₹5K Cr+</span>
                    <span className="text-[8px] text-txt-secondary uppercase">Invest</span>
                  </div>
                </div>

                <span className="inline-flex items-center space-x-1 text-xs font-bold text-accent font-mono group-hover:translate-x-1 transition-transform">
                  <span>METRICS</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Card 5: Impact - 4 Cols */}
          <motion.div variants={itemVariants} className="lg:col-span-4 group">
            <Link
              to="/impact"
              className="premium-card h-full p-8 flex flex-col justify-between overflow-hidden relative min-h-[280px] bg-bg-sec border border-border-main hover:border-accent hover:shadow-lg transition-all duration-400 block"
            >
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-accent/10 text-accent group-hover:scale-110 transition-transform">
                    <Quote className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-accent tracking-wider uppercase">
                    CITIZEN IMPACT
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-txt-primary font-malayalam leading-tight mb-2">
                  അഭിപ്രായങ്ങൾ
                </h3>
                <p className="text-txt-secondary text-xs font-malayalam font-light leading-relaxed">
                  പുതിയ പദ്ധതികൾ നമ്മുടെ ഓരോ സാധാരണക്കാരുടേയും നിത്യജീവിതത്തിൽ ഉണ്ടാക്കിയ വലിയ മാറ്റങ്ങൾ.
                </p>
              </div>

              {/* Micro testimonial visual */}
              <div className="mt-6 flex items-center justify-between border-t border-border-main pt-4">
                <div className="flex items-center space-x-2">
                  <div className="flex text-yellow-400 text-xs">★ ★ ★ ★ ★</div>
                  <span className="text-[8px] text-txt-secondary font-mono">Verified Citizen</span>
                </div>

                <span className="inline-flex items-center space-x-1 text-xs font-bold text-accent font-mono group-hover:translate-x-1 transition-transform">
                  <span>VOICES</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
