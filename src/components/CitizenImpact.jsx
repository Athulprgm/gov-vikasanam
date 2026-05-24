import { motion } from "framer-motion";
import { useData } from "../context/DataContext";
import { Quote, Star } from "lucide-react";

export default function CitizenImpact() {
  const { testimonials } = useData();

  return (
    <section
      id="citizen-impact"
      className="relative bg-bg-sec section-padding overflow-hidden border-y border-border-main"
    >
      {/* Background glowing gradients */}
      <div className="glow-blob glow-blue w-[400px] h-[400px] top-10 left-10 opacity-5 pointer-events-none" />
      <div className="glow-blob glow-green w-[500px] h-[500px] bottom-10 right-10 opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs uppercase tracking-widest text-accent font-mono font-bold block mb-3">
            Voices of Kerala
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-txt-primary font-malayalam leading-tight">
            ജനങ്ങളുടെ അനുഭവങ്ങൾ
          </h2>
          <p className="text-txt-secondary text-sm md:text-base font-malayalam mt-4 max-w-xl mx-auto font-light">
            വികസന പദ്ധതികൾ കേരളത്തിലെ സാധാരണക്കാരുടെ ജീവിതത്തിൽ ഉണ്ടാക്കിയ
            ഗുണപരമായ മാറ്റങ്ങൾ അവരുടെ വാക്കുകളിൽ.
          </p>
        </div>

        {/* Floating Testimonial Cards Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => {
            // Soft float parameters for natural subtle motion
            const yFloat =
              idx === 0 ? [-2, 2, -2] : idx === 1 ? [2, -2, 2] : [-1.5, 1.5, -1.5];
            const floatDuration = idx === 0 ? 6 : idx === 1 ? 7 : 8;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: idx * 0.15, duration: 0.6 }}
                animate={{
                  y: yFloat,
                  transition: {
                    duration: floatDuration,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                className="premium-card relative flex flex-col justify-between transition-colors duration-300 shadow-sm"
              >
                {/* Floating quote symbol */}
                <div className="absolute top-6 right-6 text-accent/[0.04] pointer-events-none">
                  <Quote className="w-16 h-16" />
                </div>

                {/* Stars */}
                <div className="flex space-x-1 mb-6 text-accent">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-current drop-shadow-sm"
                    />
                  ))}
                </div>

                {/* Malayalam Quote */}
                <p className="text-sm md:text-base text-txt-primary font-malayalam leading-relaxed mb-6 font-medium italic text-left">
                  " {testimonial.quoteMl} "
                </p>

                {/* English Translation */}
                <p className="text-xs text-txt-secondary font-mono leading-relaxed mb-8 text-left opacity-75">
                  "{testimonial.quoteEn}"
                </p>

                {/* Author Info */}
                <div className="flex items-center space-x-4 pt-6 border-t border-border-main text-left">
                  <div className="relative">
                    {/* Ring glow */}
                    <div className="absolute inset-0 bg-accent/10 rounded-full blur-[4px]" />
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover border border-accent/30 relative z-10"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-txt-primary font-malayalam">
                      {testimonial.name}
                    </h4>
                    <p className="text-[10px] text-accent font-mono tracking-wider uppercase mt-0.5">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
