import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Landmark, Award, Building, HardHat } from "lucide-react";

export default function ScrollStorytelling() {
  const containerRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);

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

  // Map scroll progress to different milestones
  useEffect(() => {
    return smoothProgress.onChange((v) => {
      if (v < 0.25) setActiveStep(0);
      else if (v < 0.5) setActiveStep(1);
      else if (v < 0.75) setActiveStep(2);
      else setActiveStep(3);
    });
  }, [smoothProgress]);

  const steps = [
    {
      titleMl: "പദ്ധതി പ്രഖ്യാപനം & ഫണ്ട് വിഹിതം",
      titleEn: "Project Declaration & Funding",
      descMl:
        "പ്രകടനപത്രികയിലെ വാഗ്ദാനങ്ങൾക്കായുള്ള പ്രാഥമിക ബജറ്റ് നിർണ്ണയവും ഫണ്ട് നീക്കിവെക്കലും നടന്നു.",
      descEn:
        "Initial budget layout and KIIFB financial approvals for proposed roads, bridges, and institutions.",
      year: "2021",
      icon: <Landmark className="w-6 h-6 text-accent" />,
      stats: "120+ പദ്ധതികളുടെ അനുമതി",
    },
    {
      titleMl: "ഭൂമി ഏറ്റെടുക്കലും നിർമ്മാണ തുടക്കവും",
      titleEn: "Land Acquisition & Foundation",
      descMl:
        "തടസ്സങ്ങൾ ഒഴിവാക്കി ദ്രുതഗതിയിൽ ഭൂമി ഏറ്റെടുക്കുകയും പൈലിംഗ്, ഫൗണ്ടേഷൻ ജോലികൾ ആരംഭിക്കുകയും ചെയ്തു.",
      descEn:
        "Fast-tracked land clearance and foundation laying. Commenced base structural works.",
      year: "2022",
      icon: <HardHat className="w-6 h-6 text-accent" />,
      stats: "₹1,500 Cr പ്രാഥമിക ഫണ്ട്",
    },
    {
      titleMl: "വൻകിട നിർമ്മാണങ്ങളുടെ ദ്രുതഗതി",
      titleEn: "Superstructure & Bridges Construction",
      descMl:
        "ദേശീയപാത 4-വരിയിൽ നിന്നും 6-വരിയാക്കൽ, തന്ത്രപ്രധാന പാലങ്ങളുടെ നിർമ്മാണം എന്നിവ ദ്രുതഗതിയിലായി.",
      descEn:
        "Assembling structural flyovers, high-tech school digital blocks, and electric water metro hulls.",
      year: "2024",
      icon: <Building className="w-6 h-6 text-accent" />,
      stats: "85% നിർമ്മാണ പൂർത്തീകരണം",
    },
    {
      titleMl: "സമർപ്പണം: വാഗ്ദാനങ്ങൾ യാഥാർത്ഥ്യം",
      titleEn: "Commissioning & Inauguration",
      descMl:
        "അന്താരാഷ്ട്ര നിലവാരത്തിൽ പൂർത്തിയാക്കിയ പദ്ധതികൾ നാടിനായി തുറന്നുകൊടുത്തു.",
      descEn:
        "Grand openings. The visual transformation of roads, medical hubs, and water transits completed.",
      year: "2026",
      icon: <Award className="w-6 h-6 text-accent" />,
      stats: "100% സമർപ്പിത സേവനം",
    },
  ];

  return (
    <section
      ref={containerRef}
      id="storytelling"
      className="relative min-h-[160vh] bg-bg-sec section-padding overflow-hidden"
    >
      {/* Background radial glow */}
      <div className="absolute w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] top-1/3 left-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-24">
          <span className="text-xs uppercase tracking-widest text-accent font-mono font-bold block mb-3">
            Interactive Storytelling
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-txt-primary font-malayalam leading-tight">
            വാഗ്ദാനത്തിൽ നിന്ന് വികസനത്തിലേക്ക്
          </h2>
          <p className="text-txt-secondary text-sm md:text-base font-malayalam mt-4 max-w-xl mx-auto font-light">
            താഴേക്ക് സ്ക്രോൾ ചെയ്യുമ്പോൾ നിർമ്മാണ ഘട്ടങ്ങളുടെ മാറ്റം
            ആനിമേഷനിലൂടെ തത്സമയം കാണാം.
          </p>
        </div>

        {/* Storytelling Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Side: Dynamic SVG Road Path & Animated Vehicle */}
          <div className="lg:col-span-5 flex justify-center sticky top-32 h-[350px] lg:h-[450px]">
            <div className="relative w-72 h-[380px] border border-border-main bg-bg-main/60 rounded-3xl p-6 flex flex-col items-center justify-between overflow-hidden shadow-md">
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

              {/* Four anchor points along the road */}
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`relative z-10 w-10 h-10 rounded-full border flex items-center justify-center font-mono font-bold text-xs transition-all duration-500 ${
                    idx <= activeStep
                      ? "bg-accent text-white border-transparent scale-110 shadow-[0_0_12px_rgba(166,124,82,0.3)]"
                      : "bg-bg-sec text-txt-secondary border-border-main"
                  }`}
                  style={{
                    transform: `translateY(${idx * 80 - 10}px)`,
                  }}
                >
                  {steps[idx].year}
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Showcase Cards & Details */}
          <div className="lg:col-span-7 space-y-16">
            {steps.map((step, idx) => {
              const isActive = idx === activeStep;
              return (
                <motion.div
                  key={idx}
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
                  <div className="flex items-center space-x-4 mb-4">
                    <div
                      className={`p-3 rounded-xl transition-all duration-500 ${
                        isActive ? "bg-accent/10 scale-110" : "bg-bg-main"
                      }`}
                    >
                      {step.icon}
                    </div>
                    <div>
                      <div className="text-accent font-mono text-xs tracking-wider">
                        PHASE {idx + 1} • {step.year}
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-txt-primary font-malayalam mt-1">
                        {step.titleMl}
                      </h3>
                      <div className="text-xs text-txt-secondary font-mono font-light mt-0.5">
                        {step.titleEn}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-txt-secondary leading-relaxed font-malayalam mb-6">
                    {step.descMl}
                  </p>

                  <div className="flex justify-between items-center py-3 px-4 rounded-xl bg-bg-main border border-border-main">
                    <span className="text-[11px] font-mono text-txt-secondary/60 tracking-wider">
                      REALTIME METRIC:
                    </span>
                    <span className="text-xs font-semibold text-accent font-malayalam text-glow-subtle">
                      {step.stats}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
