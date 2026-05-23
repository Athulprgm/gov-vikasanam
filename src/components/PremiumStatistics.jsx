import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useData } from '../context/DataContext';

function CountUpNumber({ value, target, duration = 2 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = parseInt(target, 10);
    if (isNaN(end)) {
      setCount(target); // Fallback for non-numeric
      return;
    }

    const totalMiliseconds = duration * 1000;
    const intervalTime = 30;
    const totalSteps = totalMiliseconds / intervalTime;
    const increment = (end - start) / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setCount(target);
      } else {
        setCount(Math.ceil(start));
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return (
    <span ref={ref} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-r from-[#2ECC71] to-[#4CFF9B] text-glow">
      {typeof count === 'number' ? `${count}${value.replace(/[0-9]/g, '')}` : value}
    </span>
  );
}
export default function PremiumStatistics() {
  const { districts } = useData();

  // Sum projects count across all districts
  const totalProjects = districts.reduce((acc, d) => acc + (d.projects_count || 0), 0);

  // Parse and sum investments (e.g. "₹340 Cr" -> 340)
  const totalInvestment = districts.reduce((acc, d) => {
    const numericStr = d.investment.replace(/[^0-9]/g, '');
    const amount = parseInt(numericStr, 10) || 0;
    return acc + amount;
  }, 0);

  const stats = [
    {
      value: `${totalProjects}+`,
      target: `${totalProjects}`,
      labelMl: "പൂർത്തിയായ പദ്ധതികൾ",
      labelEn: "Completed Mega Projects",
      descMl: "ഹൈവേകൾ, പാലങ്ങൾ, വിദ്യാലയങ്ങൾ മുതൽ സ്മാർട്ട് സിറ്റികൾ വരെ."
    },
    {
      value: `₹${totalInvestment.toLocaleString()}Cr`,
      target: `${totalInvestment}`,
      labelMl: "വികസന നിക്ഷേപം",
      labelEn: "Development Investment",
      descMl: "കേരള ചരിത്രത്തിലെ ഏറ്റവും ഉയർന്ന തുക അടിസ്ഥാന സൗകര്യങ്ങൾക്കായി വകയിരുത്തി."
    },
    {
      value: `${districts.length}`,
      target: `${districts.length}`,
      labelMl: "ജില്ലകളിൽ വികസനം",
      labelEn: "Districts Transformed",
      descMl: "തെക്കൻ അതിർത്തിയായ തിരുവനന്തപുരം മുതൽ വടക്കൻ കാസർഗോഡ് വരെ വ്യാപിച്ച വികസനം."
    }
  ];

  return (
    <section id="statistics" className="relative bg-[#151515] py-28 overflow-hidden border-y border-white/5">
      {/* Background neon grid lines */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(46,204,113,0.03),transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              className="flex flex-col items-center justify-center p-8 rounded-2xl border border-white/5 bg-black/20 hover:border-[#2ECC71]/20 transition-all duration-300 group"
            >
              {/* Outer Glowing Circle Border */}
              <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center mb-6 bg-white/5 group-hover:border-[#2ECC71]/40 transition-colors duration-300">
                <CountUpNumber value={stat.value} target={stat.target} />
              </div>

              <h3 className="text-lg md:text-xl font-bold text-[#F5F5F5] font-malayalam leading-snug">
                {stat.labelMl}
              </h3>
              
              <div className="text-xs text-[#4CFF9B] font-mono tracking-wider uppercase mt-1 mb-3">
                {stat.labelEn}
              </div>

              <p className="text-sm text-[#B0B0B0] font-malayalam max-w-xs leading-relaxed font-light">
                {stat.descMl}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
