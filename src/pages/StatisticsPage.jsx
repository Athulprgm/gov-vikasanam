import { motion } from 'framer-motion';
import { ArrowLeft, Home, Landmark, DollarSign, Activity } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import PremiumStatistics from '../components/PremiumStatistics';

export default function StatisticsPage() {
  const { t } = useAuth();
  const { districts } = useData();
  const navigate = useNavigate();

  // Find max investment for percentage rendering
  const maxInvestment = Math.max(
    ...districts.map((d) => parseInt(d.investment.replace(/[^0-9]/g, ''), 10) || 1)
  );

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
            {t("Data Transparency", "വിവരങ്ങളുടെ സുതാര്യത")}
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-txt-primary font-malayalam leading-tight mb-4">
            {t("Key Statistics", "സ്ഥിതിവിവരങ്ങൾ")}
          </h1>
          <p className="text-txt-secondary text-sm md:text-base font-malayalam leading-relaxed font-light">
            {t(
              "View consolidated public expenditure, project completion rates, and regional investment metrics across Kerala.",
              "കേരളത്തിലുടനീളം അടിസ്ഥാന സൗകര്യ വികസനത്തിനായി ചിലവഴിച്ച തുകയുടെയും പൂർത്തിയായ പദ്ധതികളുടെയും കൃത്യമായ കണക്കുകൾ താഴെ കാണാം."
            )}
          </p>
        </div>
      </div>

      {/* Main Stats Counters */}
      <PremiumStatistics />

      {/* Detailed District Investment Table/Cards Section */}
      <div className="max-w-7xl mx-auto px-6 mt-16">
        <h2 className="text-2xl font-extrabold text-txt-primary font-malayalam mb-8 text-left">
          {t("District Wise Investment Analysis", "ജില്ല തിരിച്ചുളള വികസന വിവരണം")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {districts.map((district, idx) => {
            const numericInvestment = parseInt(district.investment.replace(/[^0-9]/g, ''), 10) || 0;
            const percentageOfMax = Math.round((numericInvestment / maxInvestment) * 100);

            return (
              <motion.div
                key={district.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
                className="premium-card p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-accent font-mono text-[10px] tracking-wider uppercase">
                      {t("REGION", "മേഖല")} #{idx + 1}
                    </span>
                    <span className="text-[10px] text-txt-secondary font-mono">
                      {district.projectsCount} {t("Projects", "പദ്ധതികൾ")}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-malayalam text-txt-primary mb-1">
                    {t(district.nameEn, district.nameMl)}
                  </h3>
                  <p className="text-xs font-mono text-txt-secondary mb-4">
                    {t(`${district.nameEn} District`, `${district.nameMl} ജില്ല`)}
                  </p>

                  <div className="p-3 bg-bg-main rounded-xl border border-border-main mb-4 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-txt-secondary">{t("Investment", "നിക്ഷേപം")}:</span>
                    <span className="text-base font-extrabold text-accent font-mono">{district.investment}</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-txt-secondary/60 mb-1">
                    <span>{t("% Share of Max District Outlay", "പരമാവധി ജില്ലാ വിഹിതത്തിന്റെ ശതമാനം")}</span>
                    <span>{percentageOfMax}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-bg-main border border-border-main rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${percentageOfMax}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
