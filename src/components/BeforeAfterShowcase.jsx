import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projectsData } from '../data/projectsData';
import { ChevronsLeftRight, HelpCircle, Info } from 'lucide-react';

export default function BeforeAfterShowcase() {
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50); // 0 to 100 percentage
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const activeProject = projectsData[activeProjectIdx];

  // Handle slider movement (mouse / touch)
  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  return (
    <section id="before-after" className="relative bg-[#0B0B0B] py-24 overflow-hidden">
      {/* Decorative Glow Blob */}
      <div className="glow-blob glow-green w-[500px] h-[500px] top-1/4 right-0 opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-[#4CFF9B] font-mono font-bold block mb-3">
            Visual Proof
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#F5F5F5] font-malayalam leading-tight">
            മാറ്റം നേരിൽ കാണാം
          </h2>
          <p className="text-[#B0B0B0] text-sm md:text-base font-malayalam mt-4 max-w-xl mx-auto font-light">
            സ്ലൈഡർ ഇടത്തോട്ടോ വലത്തോട്ടോ വലിച്ചിട്ട് പദ്ധതികൾക്ക് മുൻപും ശേഷവുമുള്ള വ്യത്യാസം കാണുക.
          </p>
        </div>

        {/* Horizontal Project Selector tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {projectsData.map((project, idx) => (
            <button
              key={project.id}
              onClick={() => {
                setActiveProjectIdx(idx);
                setSliderPosition(50); // Reset slider
              }}
              className={`px-5 py-3 rounded-full text-xs font-semibold font-malayalam border transition-all duration-300 ${
                idx === activeProjectIdx
                  ? 'bg-gradient-to-r from-[#2ECC71] to-[#4CFF9B] text-black border-transparent shadow-[0_0_15px_rgba(46,204,113,0.25)]'
                  : 'bg-white/5 text-[#B0B0B0] border-white/5 hover:bg-white/10 hover:border-white/10'
              }`}
            >
              {project.categoryMl}
            </button>
          ))}
        </div>

        {/* Main Showcase Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left / Top: Interactive Before-After Slider Container */}
          <div className="lg:col-span-7 flex justify-center">
            <div
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              className="relative w-full aspect-[4/3] max-w-2xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl select-none cursor-ew-resize bg-[#151515]"
            >
              {/* After Image (Full width background) */}
              <img
                src={activeProject.afterImg}
                alt="After"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
              <div className="absolute bottom-4 right-4 z-20 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-[10px] font-semibold text-[#4CFF9B] font-malayalam tracking-wider">
                യാഥാർത്ഥ്യം (2026)
              </div>

              {/* Before Image (Width bound to slider position) */}
              <div
                className="absolute inset-0 z-10 overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
              >
                <img
                  src={activeProject.beforeImg}
                  alt="Before"
                  className="absolute inset-0 w-full h-full object-cover grayscale brightness-75 pointer-events-none"
                  style={{ width: containerRef.current ? containerRef.current.offsetWidth : '100vw', maxWidth: 'none' }}
                />
                <div className="absolute bottom-4 left-4 z-20 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-[10px] font-semibold text-[#B0B0B0] font-malayalam tracking-wider">
                  വാഗ്ദാന വേള (2021)
                </div>
              </div>

              {/* Slider Divider Bar & Handle */}
              <div
                className="absolute top-0 bottom-0 z-20 w-[2px] bg-[#2ECC71] shadow-[0_0_10px_#4CFF9B]"
                style={{ left: `${sliderPosition}%` }}
                onMouseDown={() => setIsDragging(true)}
                onTouchStart={() => setIsDragging(true)}
              >
                {/* Glowing Drag Handle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black border border-[#2ECC71] shadow-[0_0_15px_rgba(76,255,155,0.4)] flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-110 transition-transform">
                  <ChevronsLeftRight className="w-4 h-4 text-[#4CFF9B]" />
                </div>
              </div>
            </div>
          </div>

          {/* Right / Bottom: Detailed Project Info */}
          <div className="lg:col-span-5 text-left flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <span className="text-xs font-mono font-bold tracking-wider text-[#4CFF9B]">
                  PROJECT INFOCUS: {activeProject.categoryEn}
                </span>
                
                <h3 className="text-2xl md:text-3xl font-extrabold text-[#F5F5F5] font-malayalam mt-2 mb-4 leading-snug">
                  {activeProject.titleMl}
                </h3>
                
                <div className="flex items-center space-x-2 text-xs text-[#B0B0B0] font-mono tracking-wider mb-6">
                  <span>{activeProject.districtEn}</span>
                  <span className="text-white/20">•</span>
                  <span>INVESTMENT: {activeProject.investment}</span>
                </div>

                <p className="text-[#B0B0B0] text-sm md:text-base font-malayalam leading-relaxed mb-8">
                  {activeProject.descriptionMl}
                </p>

                {/* Before vs After detailed text bullet points */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                    <Info className="w-5 h-5 text-[#B0B0B0] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] font-mono tracking-widest text-[#B0B0B0] uppercase">BEFORE / വാഗ്ദാനം</div>
                      <p className="text-xs text-[#B0B0B0] font-malayalam mt-1 leading-relaxed">{activeProject.beforeTextMl}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-4 rounded-xl bg-[#2ECC71]/5 border border-[#2ECC71]/10 hover:border-[#2ECC71]/20 transition-colors">
                    <HelpCircle className="w-5 h-5 text-[#2ECC71] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] font-mono tracking-widest text-[#4CFF9B] uppercase">AFTER / യാഥാർത്ഥ്യം</div>
                      <p className="text-xs text-[#F5F5F5] font-malayalam mt-1 leading-relaxed">{activeProject.afterTextMl}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
