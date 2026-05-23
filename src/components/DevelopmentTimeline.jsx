import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import { Calendar, ArrowRight, ArrowLeft } from 'lucide-react';

export default function DevelopmentTimeline() {
  const { timeline } = useData();
  const [activeIdx, setActiveIdx] = useState(3); // Default index

  const safeIdx = Math.min(activeIdx, Math.max(0, timeline.length - 1));
  const activeMilestone = timeline[safeIdx] || { year: '', phaseMl: '', phaseEn: '', descMl: '', descEn: '' };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev < timeline.length - 1 ? prev + 1 : prev));
  };

  return (
    <section id="timeline" className="relative bg-[#0B0B0B] py-24 overflow-hidden">
      {/* Background glow blobs */}
      <div className="glow-blob glow-blue w-[400px] h-[400px] top-10 left-10 opacity-5 pointer-events-none" />
      <div className="glow-blob glow-green w-[500px] h-[500px] bottom-10 right-10 opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs uppercase tracking-widest text-[#4CFF9B] font-mono font-bold block mb-3">
            Milestones Tracker
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#F5F5F5] font-malayalam leading-tight">
            വികസന നാൾവഴി
          </h2>
          <p className="text-[#B0B0B0] text-sm md:text-base font-malayalam mt-4 max-w-xl mx-auto font-light">
            2021 മുതൽ 2026 വരെയുള്ള വികസന യാത്രയിലെ നാഴികക്കല്ലുകൾ പരിശോധിക്കാം.
          </p>
        </div>

        {/* Timeline Horizontal Line / Year Selector */}
        <div className="relative max-w-4xl mx-auto mb-16 px-4">
          
          {/* Progress Connecting Line */}
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/5 -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-0 h-[2px] bg-gradient-to-r from-[#2ECC71] to-[#4CFF9B] -translate-y-1/2 z-0 transition-all duration-500 shadow-[0_0_8px_#4CFF9B]"
            style={{ width: `${(safeIdx / Math.max(1, timeline.length - 1)) * 100}%` }}
          />

          {/* Timeline Nodes */}
          <div className="relative z-10 flex justify-between">
            {timeline.map((item, idx) => {
              const isActive = idx === safeIdx;
              const isPassed = idx < safeIdx;

              return (
                <div key={item.year} className="flex flex-col items-center">
                  <button
                    onClick={() => setActiveIdx(idx)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-mono font-extrabold text-sm border-2 transition-all duration-300 focus:outline-none ${
                      isActive
                        ? 'bg-gradient-to-r from-[#2ECC71] to-[#4CFF9B] text-black border-transparent scale-110 shadow-[0_0_15px_rgba(76,255,155,0.6)]'
                        : isPassed
                        ? 'bg-[#2ECC71]/10 text-[#2ECC71] border-[#2ECC71]/40'
                        : 'bg-[#151515] text-[#B0B0B0] border-white/10 hover:border-white/20'
                    }`}
                  >
                    {item.year}
                  </button>
                  <span
                    className={`mt-3 font-malayalam text-xs font-semibold tracking-wider transition-colors duration-300 ${
                      isActive ? 'text-[#4CFF9B]' : isPassed ? 'text-[#2ECC71]/80' : 'text-[#B0B0B0]'
                    }`}
                  >
                    {item.phaseMl}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Timeline Card Slide */}
        <div className="max-w-3xl mx-auto">
          <div className="relative min-h-[220px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMilestone.year}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="glass-panel p-8 rounded-2xl border border-white/5 shadow-2xl relative"
              >
                {/* Year Watermark */}
                <div className="absolute -top-12 -right-4 font-mono font-extrabold text-8xl md:text-9xl text-white/[0.02] select-none pointer-events-none">
                  {activeMilestone.year}
                </div>

                <div className="flex items-center space-x-3 mb-4 text-[#4CFF9B]">
                  <Calendar className="w-5 h-5 text-glow-subtle" />
                  <span className="font-mono text-xs tracking-widest font-bold">
                    PHASE {activeIdx + 1} OF DEVELOPMENT
                  </span>
                </div>

                <h3 className="text-xl md:text-2xl font-extrabold text-[#F5F5F5] font-malayalam mb-4">
                  {activeMilestone.phaseMl} ({activeMilestone.year}) — {activeMilestone.phaseEn}
                </h3>

                <p className="text-sm md:text-base text-[#B0B0B0] font-malayalam leading-relaxed">
                  {activeMilestone.descMl}
                </p>
                
                <p className="text-xs font-mono text-[#B0B0B0]/60 mt-3 italic">
                  {activeMilestone.descEn}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handlePrev}
              disabled={safeIdx === 0}
              className={`p-3 rounded-full border border-white/10 flex items-center justify-center transition-all ${
                safeIdx === 0
                  ? 'opacity-30 cursor-not-allowed'
                  : 'bg-white/5 hover:bg-white/10 text-[#F5F5F5] hover:border-white/20'
              }`}
              aria-label="Previous step"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <span className="font-mono text-xs text-[#B0B0B0]">
              {safeIdx + 1} / {timeline.length}
            </span>

            <button
              onClick={handleNext}
              disabled={safeIdx === timeline.length - 1}
              className={`p-3 rounded-full border border-white/10 flex items-center justify-center transition-all ${
                safeIdx === timeline.length - 1
                  ? 'opacity-30 cursor-not-allowed'
                  : 'bg-white/5 hover:bg-white/10 text-[#F5F5F5] hover:border-white/20'
              }`}
              aria-label="Next step"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
