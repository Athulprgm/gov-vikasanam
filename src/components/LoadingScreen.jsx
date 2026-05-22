import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const duration = 2000; // 2 seconds loading
    const intervalTime = 20;
    const steps = duration / intervalTime;
    let stepCount = 0;

    const timer = setInterval(() => {
      stepCount++;
      const nextProgress = Math.min(Math.round((stepCount / steps) * 100), 100);
      setProgress(nextProgress);

      if (stepCount >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          setIsDone(true);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 800); // Allow fadeout animation to complete
        }, 300);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B0B0B]"
        >
          {/* Subtle Ambient Glow behind emblem */}
          <div className="absolute w-[300px] h-[300px] bg-[#2ECC71]/10 rounded-full blur-[80px] animate-pulse" />

          <div className="relative flex flex-col items-center max-w-lg px-6 text-center">
            {/* Elegant SVG Emblem */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="mb-8"
            >
              <svg
                width="80"
                height="80"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-[0_0_15px_rgba(76,255,155,0.4)]"
              >
                <path
                  d="M50 15L15 45L25 55L50 32.5L75 55L85 45L50 15Z"
                  fill="url(#emblem-grad)"
                />
                <path
                  d="M50 40L25 62.5L35 72.5L50 59L65 72.5L75 62.5L50 40Z"
                  fill="url(#emblem-grad)"
                  opacity="0.8"
                />
                <path
                  d="M50 65L35 78.5L40 83.5L50 74.5L60 83.5L65 78.5L50 65Z"
                  fill="url(#emblem-grad)"
                  opacity="0.6"
                />
                <defs>
                  <linearGradient id="emblem-grad" x1="15" y1="15" x2="85" y2="83.5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#2ECC71" />
                    <stop offset="1" stopColor="#4CFF9B" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>

            {/* Slogan */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-2xl md:text-3xl font-extrabold tracking-wide text-[#F5F5F5] font-malayalam leading-relaxed mb-2"
            >
              ജനവികസനം
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-xs md:text-sm text-[#B0B0B0] font-light tracking-[0.2em] font-malayalam mb-12"
            >
              പ്രഖ്യാപനങ്ങളിൽ നിന്ന് യാഥാർത്ഥ്യത്തിലേക്ക്
            </motion.p>

            {/* Progress Bar & Percentage */}
            <div className="w-64 h-[2px] bg-white/5 relative overflow-hidden mb-4 rounded-full">
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#2ECC71] to-[#4CFF9B]"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <motion.div
              className="text-sm font-semibold tracking-wider text-[#4CFF9B] font-mono text-glow-subtle"
            >
              {progress}%
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
