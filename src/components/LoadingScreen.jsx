import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const { t } = useAuth();

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
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg-main"
        >
          {/* Subtle Ambient Glow behind emblem */}
          <div className="absolute w-[300px] h-[300px] bg-accent/5 rounded-full blur-[80px] animate-pulse" />

          <div className="relative flex flex-col items-center max-w-lg px-6 text-center">
            {/* Logo Emblem */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="mb-8"
            >
              <div 
                className="w-32 h-32 bg-white rounded-3xl flex items-center justify-center p-4 shadow-xl border border-white/10 animate-pulse"
                style={{ animationDuration: '3s' }}
              >
                <img
                  src="/logo.svg"
                  alt="കേരളOne Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </motion.div>

            {/* Slogan */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-2xl md:text-3xl font-bold tracking-wide text-txt-primary leading-relaxed mb-2"
            >
              <span className="font-malayalam font-extrabold">കേരള</span>
              <span className="text-accent font-sans font-black ml-1">One</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-xs md:text-sm text-txt-secondary font-light tracking-[0.2em] font-malayalam mb-12"
            >
              {t("From Promises to Reality", "പ്രഖ്യാപനങ്ങളിൽ നിന്ന് യാഥാർത്ഥ്യത്തിലേക്ക്")}
            </motion.p>

            {/* Progress Bar & Percentage */}
            <div className="w-64 h-[2px] bg-border-main relative overflow-hidden mb-4 rounded-full">
              <motion.div
                className="absolute top-0 left-0 h-full bg-accent"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <motion.div
              className="text-sm font-semibold tracking-wider text-accent font-mono text-glow-subtle"
            >
              {progress}%
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
