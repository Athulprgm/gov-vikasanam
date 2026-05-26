import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BeforeAfterShowcase from '../components/BeforeAfterShowcase';
import FeaturedProjects from '../components/FeaturedProjects';

export default function Showcase() {
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
            Showcase Portfolio
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-txt-primary font-malayalam leading-tight mb-4">
            {t("Development Showcase", "വികസനക്കാഴ്ചകൾ")}
          </h1>
          <p className="text-txt-secondary text-sm md:text-base font-malayalam leading-relaxed font-light">
            {t(
              "Explore interactive visual transformations and details of key development achievements delivered to the public.",
              "ജനങ്ങൾക്ക് നൽകിയ വാഗ്ദാനങ്ങൾ എങ്ങനെ യാഥാർത്ഥ്യമായി എന്ന് ചിത്രങ്ങളിലൂടെയും പൂർണ്ണ വിവരങ്ങളിലൂടെയും വിലയിരുത്തുക."
            )}
          </p>
        </div>
      </div>

      {/* Render components */}
      <BeforeAfterShowcase />
      <div className="h-[1px] bg-border-main max-w-7xl mx-auto my-12" />
      <FeaturedProjects />
    </motion.div>
  );
}
