import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import KeralaMap from '../components/KeralaMap';

export default function MapPage() {
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
            {t("Regional Analysis", "മേഖലാ അടിസ്ഥാനത്തിലുള്ള വിശകലനം")}
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-txt-primary font-malayalam leading-tight mb-4">
            {t("Interactive Map", "വികസന ഭൂപടം")}
          </h1>
          <p className="text-txt-secondary text-sm md:text-base font-malayalam leading-relaxed font-light">
            {t(
              "Navigate through the districts of Kerala to view regional investment distributions and key project accomplishments.",
              "കേരളത്തിന്റെ വികസന നേട്ടങ്ങൾ ജില്ലകൾ തിരിച്ച് ഭൂപടത്തിലൂടെ വിലയിരുത്തുക. ഓരോ പ്രദേശത്തെയും പദ്ധതികളും ആകെ നിക്ഷേപവും ഇവിടെ കാണാം."
            )}
          </p>
        </div>
      </div>

      {/* Render Map */}
      <KeralaMap />
    </motion.div>
  );
}
