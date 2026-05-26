import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ScrollStorytelling from '../components/ScrollStorytelling';
import DevelopmentTimeline from '../components/DevelopmentTimeline';

export default function TimelinePage() {
  const { t } = useAuth();
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-bg-main pt-32 pb-16"
    >
      <div className="max-w-7xl mx-auto px-6 mb-12">
        {/* Navigation Buttons (Back & Home) */}
        <div className="flex items-center space-x-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-border-main bg-bg-sec hover:bg-bg-main text-xs font-semibold text-txt-secondary hover:text-accent transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>{t("Back", "പിന്നിലേക്ക്")}</span>
          </button>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-border-main bg-bg-sec hover:bg-bg-main text-xs font-semibold text-txt-secondary hover:text-accent transition-colors group"
          >
            <Home className="w-3.5 h-3.5" />
            <span>{t("Home", "ഹോം")}</span>
          </Link>
        </div>

        {/* Page Title & Intro */}
        <div className="max-w-3xl">
          <span className="text-xs uppercase tracking-widest text-accent font-mono font-bold block mb-2">
            {t("Chronology of Progress", "വികസനത്തിന്റെ നാൾവഴി")}
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-txt-primary font-malayalam leading-tight mb-4">
            {t("Development Timeline", "വികസന നാൾവഴി")}
          </h1>
          <p className="text-txt-secondary text-sm md:text-base font-malayalam leading-relaxed font-light">
            {t(
              "Track the phases of implementation from promises to reality. Scroll down to see interactive construction stages.",
              "പദ്ധതി പ്രഖ്യാപനം മുതൽ പൂർത്തീകരണം വരെയുള്ള ഓരോ ഘട്ടങ്ങളും സമയക്രമത്തിൽ പരിശോധിക്കുക. നാൾവഴിയിലൂടെയുള്ള ഒരു യാത്ര."
            )}
          </p>
        </div>
      </div>

      {/* Render ScrollStorytelling & click-based DevelopmentTimeline */}
      <ScrollStorytelling />
      <div className="h-[1px] bg-border-main max-w-7xl mx-auto my-12" />
      <DevelopmentTimeline />
    </motion.div>
  );
}
