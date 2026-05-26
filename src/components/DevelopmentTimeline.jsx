import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { Calendar, ArrowRight, ArrowLeft } from "lucide-react";

export default function DevelopmentTimeline() {
  const { timeline } = useData();
  const { t } = useAuth();
  const [activeIdx, setActiveIdx] = useState(() => Math.max(0, timeline.length - 1));

  const safeIdx = Math.min(activeIdx, Math.max(0, timeline.length - 1));
  const activeMilestone = timeline[safeIdx] || {
    year: "",
    phaseMl: "",
    phaseEn: "",
    descMl: "",
    descEn: "",
  };

  useEffect(() => {
    if (timeline && timeline.length > 0) {
      setActiveIdx(timeline.length - 1);
    }
  }, [timeline]);

  const handlePrev = () => {
    setActiveIdx((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev < timeline.length - 1 ? prev + 1 : prev));
  };

  return (
    <section
      id="timeline"
      className="relative bg-bg-main section-padding overflow-hidden"
    >
      {/* Background glow blobs */}
      <div className="glow-blob glow-blue w-[400px] h-[400px] top-10 left-10 opacity-5 pointer-events-none" />
      <div className="glow-blob glow-green w-[500px] h-[500px] bottom-10 right-10 opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs uppercase tracking-widest text-accent font-mono font-bold block mb-3">
            {t("Milestones Tracker", "വികസന നാഴികക്കല്ലുകൾ")}
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-txt-primary font-malayalam leading-tight">
            {t("Development Timeline", "വികസന നാൾവഴി")}
          </h2>
          <p className="text-txt-secondary text-sm md:text-base font-malayalam mt-4 max-w-xl mx-auto font-light">
            {t(
              "Track the phases of implementation from promises to reality from 2021 to 2026.",
              "2021 മുതൽ 2026 വരെയുള്ള വികസന യാത്രയിലെ നാഴികക്കല്ലുകൾ പരിശോധിക്കാം."
            )}
          </p>
        </div>

        {/* Timeline Horizontal Line / Year Selector */}
        <div className="relative max-w-4xl mx-auto mb-16 px-4">
          {/* Progress Connecting Line */}
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-border-main -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-0 h-[2px] bg-accent -translate-y-1/2 z-0 transition-all duration-500 shadow-sm"
            style={{
              width: `${(safeIdx / Math.max(1, timeline.length - 1)) * 100}%`,
            }}
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
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-mono font-extrabold text-sm border-2 transition-all duration-300 focus:outline-none cursor-pointer ${
                      isActive
                        ? "bg-accent text-white border-transparent scale-110 shadow-sm"
                        : isPassed
                          ? "bg-accent-sec/20 text-accent border-accent/30"
                          : "bg-bg-sec text-txt-secondary border-border-main hover:border-accent"
                    }`}
                  >
                    {item.year}
                  </button>
                  <span
                    className={`mt-3 font-malayalam text-xs font-semibold tracking-wider transition-colors duration-300 ${
                      isActive
                        ? "text-accent"
                        : isPassed
                          ? "text-accent/80"
                          : "text-txt-secondary"
                    }`}
                  >
                    {t(item.phaseEn, item.phaseMl)}
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
                className="premium-card p-8 shadow-md relative"
              >
                {/* Year Watermark */}
                <div className="absolute -top-12 -right-4 font-mono font-extrabold text-8xl md:text-9xl text-accent/[0.02] select-none pointer-events-none">
                  {activeMilestone.year}
                </div>

                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <div className="flex items-center space-x-1 text-accent">
                    <Calendar className="w-4 h-4 text-glow-subtle" />
                    <span className="font-mono text-[10px] tracking-widest font-bold uppercase">
                      {t(`PHASE ${safeIdx + 1} OF DEVELOPMENT`, `വികസന ഘട്ടം ${safeIdx + 1}`)}
                    </span>
                  </div>
                  {activeMilestone.governmentEn && (
                    <div className="px-2.5 py-0.5 rounded-full text-[9px] font-semibold bg-accent/15 border border-accent/25 text-accent font-malayalam tracking-wider">
                      {t(activeMilestone.governmentEn, activeMilestone.governmentMl)}
                    </div>
                  )}
                  {activeMilestone.statsEn && (
                    <div className="px-2.5 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-malayalam">
                      {t(activeMilestone.statsEn, activeMilestone.statsMl)}
                    </div>
                  )}
                </div>

                <h3 className="text-xl md:text-2xl font-extrabold text-txt-primary font-malayalam mb-4">
                  {t(activeMilestone.phaseEn, activeMilestone.phaseMl)} ({activeMilestone.year})
                </h3>

                <p className="text-sm md:text-base text-txt-secondary font-malayalam leading-relaxed">
                  {t(activeMilestone.descEn, activeMilestone.descMl)}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handlePrev}
              disabled={safeIdx === 0}
              className={`p-3 rounded-full border border-border-main flex items-center justify-center transition-all cursor-pointer ${
                safeIdx === 0
                  ? "opacity-30 cursor-not-allowed"
                  : "bg-bg-sec hover:bg-bg-alt text-txt-primary hover:border-accent"
              }`}
              aria-label="Previous step"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <span className="font-mono text-xs text-txt-secondary">
              {safeIdx + 1} / {timeline.length}
            </span>

            <button
              onClick={handleNext}
              disabled={safeIdx === timeline.length - 1}
              className={`p-3 rounded-full border border-border-main flex items-center justify-center transition-all cursor-pointer ${
                safeIdx === timeline.length - 1
                  ? "opacity-30 cursor-not-allowed"
                  : "bg-bg-sec hover:bg-bg-alt text-txt-primary hover:border-accent"
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
