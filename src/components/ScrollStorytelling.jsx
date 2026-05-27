import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { Landmark, Award, Building, HardHat, Calendar } from "lucide-react";

const iconMap = {
  landmark: Landmark,
  hardhat: HardHat,
  building: Building,
  award: Award,
};

export default function ScrollStorytelling() {
  const containerRef = useRef(null);
  const { t } = useAuth();
  const { timeline } = useData();
  const [activeStep, setActiveStep] = useState(0);

  if (!timeline || timeline.length === 0) {
    return (
      <section
        id="storytelling"
        className="relative bg-bg-sec section-padding overflow-hidden flex items-center justify-center min-h-[450px]"
      >
        <span className="text-txt-secondary font-mono text-sm animate-pulse">
          {t("Loading milestone timeline...", "ടൈംലൈൻ വിവരങ്ങൾ ശേഖരിക്കുന്നു...")}
        </span>
      </section>
    );
  }

  // Sort milestones chronologically
  const sortedMilestones = [...timeline].sort((a, b) => parseInt(a.year) - parseInt(b.year));
  const stepCount = sortedMilestones.length || 1;

  // Hook scroll progress of this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Map scroll progress to milestones dynamically
  useEffect(() => {
    return smoothProgress.onChange((v) => {
      const stepIdx = Math.min(stepCount - 1, Math.floor(v * stepCount));
      setActiveStep(stepIdx);
    });
  }, [smoothProgress, stepCount]);

  return (
    <section
      ref={containerRef}
      id="storytelling"
      className="relative min-h-[180vh] bg-bg-sec section-padding overflow-hidden"
    >
      {/* Background radial glow */}
      <div className="absolute w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] top-1/3 left-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-24">
          <span className="text-xs uppercase tracking-widest text-accent font-mono font-bold block mb-3">
            {t("Interactive Storytelling", "വികസന വിവരണം")}
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-txt-primary font-malayalam leading-tight">
            {t("From Promise to Reality", "വാഗ്ദാനത്തിൽ നിന്ന് വികസനത്തിലേക്ക്")}
          </h2>
          <p className="text-txt-secondary text-sm md:text-base font-malayalam mt-4 max-w-xl mx-auto font-light">
            {t(
              "Scroll down to observe construction milestones animated in real-time.",
              "താഴേക്ക് സ്ക്രോൾ ചെയ്യുമ്പോൾ നിർമ്മാണ ഘട്ടങ്ങളുടെ മാറ്റം ആനിമേഷനിലൂടെ തത്സമയം കാണാം."
            )}
          </p>
        </div>

        {/* Storytelling Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Side: Dynamic SVG Road Path & Animated Vehicle */}
          <div className="lg:col-span-5 flex justify-center sticky top-32 h-[350px] lg:h-[450px]">
            <div className="relative w-72 h-[380px] border border-border-main bg-bg-main/60 rounded-3xl p-6 flex flex-col items-center justify-start overflow-hidden shadow-md">
              {/* High-tech scanner line */}
              <div className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent animate-[pulse_2s_infinite]" />

              {/* Vertical SVG Road Path */}
              <svg
                width="80"
                height="320"
                viewBox="0 0 80 320"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-y-8 z-0"
              >
                {/* Background Road Outline */}
                <path
                  d="M40 10 L40 310"
                  stroke="rgba(166, 124, 82, 0.1)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path
                  d="M40 10 L40 310"
                  stroke="rgba(166, 124, 82, 0.2)"
                  strokeWidth="2"
                  strokeDasharray="4 8"
                />

                {/* Animated Growing Road Path (Linked to scroll progress) */}
                <motion.path
                  d="M40 10 L40 310"
                  stroke="#A67C52"
                  strokeWidth="6"
                  strokeLinecap="round"
                  style={{
                    pathLength: scrollYProgress,
                  }}
                  className="drop-shadow-[0_0_8px_rgba(166,124,82,0.4)]"
                />
              </svg>

              {/* Dynamic anchor points along the road */}
              {sortedMilestones.map((item, idx) => {
                const spacing = stepCount > 1 ? 280 / (stepCount - 1) : 0;
                const yOffset = idx * spacing + 10;
                return (
                  <div
                    key={item.id || item.year}
                    className={`absolute z-10 w-10 h-10 rounded-full border flex items-center justify-center font-mono font-bold text-[10px] transition-all duration-500 ${
                      idx <= activeStep
                        ? "bg-accent text-white border-transparent scale-110 shadow-[0_0_12px_rgba(166,124,82,0.3)]"
                        : "bg-bg-sec text-txt-secondary border-border-main"
                    }`}
                    style={{
                      transform: `translateY(${yOffset}px)`,
                    }}
                  >
                    {item.year}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Side: Showcase Cards & Details */}
          <div className="lg:col-span-7 space-y-16">
            {sortedMilestones.map((step, idx) => {
              const isActive = idx === activeStep;
              const IconComponent = iconMap[step.icon?.toLowerCase()] || Calendar;

              return (
                <motion.div
                  key={step.id || step.year}
                  initial={{ opacity: 0.15, y: 30 }}
                  whileInView={{
                    opacity: isActive ? 1 : 0.25,
                    y: 0,
                    transition: { duration: 0.6 },
                  }}
                  viewport={{ once: false, amount: 0.5 }}
                  className={`premium-card p-8 transition-all duration-500 ${
                    isActive
                      ? "border-accent/40 bg-accent/[0.02] shadow-[0_0_20px_rgba(166,124,82,0.06)]"
                      : "border-border-main bg-bg-alt"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-3 rounded-xl transition-all duration-500 ${
                          isActive ? "bg-accent/10 scale-110" : "bg-bg-main"
                        }`}
                      >
                        <IconComponent className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <div className="text-accent font-mono text-xs tracking-wider">
                          {t("PHASE", "ഘട്ടം")} {idx + 1} • {step.year}
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-txt-primary font-malayalam mt-1">
                          {t(step.phaseEn, step.phaseMl)}
                        </h3>
                      </div>
                    </div>
                    {step.governmentEn && (
                      <div className="px-2.5 py-0.5 rounded-full text-[9px] font-semibold bg-accent/10 border border-accent/20 text-accent font-malayalam tracking-wider">
                        {t(step.governmentEn, step.governmentMl)}
                      </div>
                    )}
                  </div>

                  <p className="text-sm sm:text-base text-txt-secondary leading-relaxed font-malayalam mb-6">
                    {t(step.descEn, step.descMl)}
                  </p>

                  {step.statsEn && (
                    <div className="flex justify-between items-center py-3 px-4 rounded-xl bg-bg-main border border-border-main">
                      <span className="text-[11px] font-mono text-txt-secondary/60 tracking-wider">
                        {t("REALTIME METRIC:", "തത്സമയ കണക്ക്:")}
                      </span>
                      <span className="text-xs font-semibold text-accent font-malayalam text-glow-subtle">
                        {t(step.statsEn, step.statsMl)}
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
