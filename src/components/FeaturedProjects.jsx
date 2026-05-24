import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "../context/DataContext";
import { X, ExternalLink, Calendar, MapPin, CheckCircle2 } from "lucide-react";

export default function FeaturedProjects() {
  const { projects } = useData();
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <section
      id="featured-projects"
      className="relative bg-bg-main section-padding overflow-hidden"
    >
      {/* Ambient background bloom */}
      <div className="glow-blob glow-green w-[500px] h-[500px] top-1/2 left-0 opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs uppercase tracking-widest text-accent font-mono font-bold block mb-3">
            Portfolio of Achievements
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-txt-primary font-malayalam leading-tight">
            പ്രധാന വികസന പദ്ധതികൾ
          </h2>
          <p className="text-txt-secondary text-sm md:text-base font-malayalam mt-4 max-w-xl mx-auto font-light">
            കേരളത്തിലുടനീളം വിജയകരമായി പൂർത്തിയാക്കിയ മാതൃകാ
            പദ്ധതികളെക്കുറിച്ചുള്ള വിശദാംശങ്ങൾ താഴെ കാണാം.
          </p>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              onClick={() => setSelectedProject(project)}
              className="premium-card cursor-pointer flex flex-col justify-between group overflow-hidden p-0 rounded-[20px] shadow-sm"
            >
              {/* Card Image Area with Zoom effect */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-bg-alt/90 via-transparent to-transparent z-10" />
                <img
                  src={project.afterImg}
                  alt={project.titleEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Category tag */}
                <div className="absolute top-4 left-4 z-20 bg-bg-alt/90 backdrop-blur-md border border-border-main px-3 py-1 rounded-full text-[10px] font-semibold text-accent font-malayalam tracking-wider">
                  {project.categoryMl}
                </div>

                {/* Completion status ring */}
                <div className="absolute bottom-4 right-4 z-20 flex items-center bg-bg-alt/90 backdrop-blur-md border border-border-main px-2.5 py-1 rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-accent" />
                  <span className="text-[10px] font-mono font-bold text-txt-primary">
                    {project.percentage}% COMPLETED
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 text-left flex-grow flex flex-col justify-between bg-bg-alt">
                <div>
                  <div className="flex items-center space-x-1.5 text-xs text-txt-secondary font-mono mb-2">
                    <MapPin className="w-3 h-3 text-accent" />
                    <span>{project.districtEn}</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-txt-primary font-malayalam leading-snug mb-3">
                    {project.titleMl}
                  </h3>
                  <p className="text-xs text-txt-secondary font-malayalam line-clamp-3 leading-relaxed mb-6 font-light">
                    {project.descriptionMl}
                  </p>
                </div>

                {/* Card footer CTA */}
                <div className="flex justify-between items-center pt-4 border-t border-border-main">
                  <span className="text-[10px] font-mono tracking-widest text-txt-secondary/60 uppercase">
                    BUDGET: {project.investment}
                  </span>
                  <span className="text-[10px] font-semibold text-accent font-mono flex items-center group-hover:translate-x-1 transition-transform">
                    VIEW SUMMARY
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Premium Modal Popup Dialog */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-main/95 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="premium-card p-0 w-full max-w-4xl rounded-3xl overflow-hidden shadow-xl relative flex flex-col"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 z-40 p-2 rounded-full bg-bg-sec border border-border-main text-txt-primary hover:text-accent hover:scale-105 transition-all cursor-pointer"
                  aria-label="Close details"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Main scrollable area */}
                <div className="overflow-y-auto max-h-[85vh] no-scrollbar">
                  {/* Banner Image */}
                  <div className="relative aspect-[21/9] w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-alt via-transparent to-transparent z-10" />
                    <img
                      src={selectedProject.afterImg}
                      alt={selectedProject.titleEn}
                      className="w-full h-full object-cover"
                    />

                    {/* Header tags */}
                    <div className="absolute bottom-6 left-6 z-20 text-left">
                      <div className="bg-accent/15 backdrop-blur-md border border-accent/30 px-3 py-1 rounded-full text-[10px] font-semibold text-accent font-malayalam tracking-wider w-fit mb-2">
                        {selectedProject.categoryMl}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-extrabold text-txt-primary font-malayalam leading-tight text-glow-subtle">
                        {selectedProject.titleMl}
                      </h3>
                      <p className="text-xs text-txt-secondary font-mono mt-1">
                        {selectedProject.titleEn}
                      </p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 md:p-8 text-left grid grid-cols-1 md:grid-cols-12 gap-8 bg-bg-alt">
                    {/* Left Column: project details */}
                    <div className="md:col-span-8 space-y-6">
                      <div>
                        <h4 className="text-xs font-mono tracking-widest text-accent mb-2 uppercase">
                          PROJECT SYNOPSIS
                        </h4>
                        <p className="text-sm md:text-base text-txt-primary/95 font-malayalam leading-relaxed">
                          {selectedProject.descriptionMl}
                        </p>
                      </div>

                      {/* Before / After layout */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                        <div className="p-4 bg-bg-sec border border-border-main rounded-2xl">
                          <div className="text-[10px] font-mono text-txt-secondary tracking-wider uppercase mb-1">
                            വാഗ്ദാന പത്രിക (2021)
                          </div>
                          <p className="text-xs text-txt-secondary font-malayalam leading-relaxed">
                            {selectedProject.beforeTextMl}
                          </p>
                        </div>

                        <div className="p-4 bg-accent/5 border border-accent/25 rounded-2xl">
                          <div className="text-[10px] font-mono text-accent tracking-wider uppercase mb-1">
                            പൂർത്തീകരിച്ച അവസ്ഥ (2026)
                          </div>
                          <p className="text-xs text-txt-primary font-malayalam leading-relaxed">
                            {selectedProject.afterTextMl}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: metrics sidebar */}
                    <div className="md:col-span-4 space-y-4">
                      <div className="p-5 bg-bg-sec border border-border-main rounded-2xl space-y-4">
                        <div className="text-[10px] font-mono text-accent tracking-widest uppercase">
                          PROJECT DASHBOARD
                        </div>

                        <div className="border-b border-border-main pb-3">
                          <div className="text-[10px] text-txt-secondary/50 mb-1">
                            REGIONAL AREA
                          </div>
                          <div className="text-sm font-bold text-txt-primary flex items-center">
                            <MapPin className="w-3.5 h-3.5 text-accent mr-1.5" />
                            {selectedProject.districtEn}
                          </div>
                        </div>

                        <div className="border-b border-border-main pb-3">
                          <div className="text-[10px] text-txt-secondary/50 mb-1">
                            CAPITAL OUTLAY
                          </div>
                          <div className="text-sm font-extrabold text-accent font-mono">
                            {selectedProject.investment}
                          </div>
                        </div>

                        <div className="pb-2">
                          <div className="text-[10px] text-txt-secondary/50 mb-1">
                            COMPLETION STATUS
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex-grow h-1.5 bg-bg-main rounded-full overflow-hidden">
                              <div
                                className="h-full bg-accent"
                                style={{
                                  width: `${selectedProject.percentage}%`,
                                }}
                              />
                            </div>
                            <span className="font-mono text-xs font-bold text-accent">
                              {selectedProject.percentage}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Small disclaimer */}
                      <div className="p-4 bg-bg-sec border border-border-main rounded-xl text-[10px] text-txt-secondary/60 leading-relaxed">
                        * ഈ പദ്ധതി അതാത് നഗരസഭയുടെയും ബന്ധപ്പെട്ട സംസ്ഥാന
                        വകുപ്പിന്റെയും മേൽനോട്ടത്തിൽ വിജയകരമായി നാടിനായി
                        സമർപ്പിക്കപ്പെട്ടതാണ്.
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
