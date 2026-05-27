import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Home, Search, Shield, Award, Landmark, User, Calendar, BookOpen, Scale, HelpCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export default function GovernmentHistory() {
  const { t, language } = useAuth();
  const { stateInfo, chiefMinisters, loading } = useData();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParty, setSelectedParty] = useState('All');

  // List of unique parties for filters
  const partyFilters = useMemo(() => {
    const list = new Set(['All']);
    if (chiefMinisters && chiefMinisters.length > 0) {
      chiefMinisters.forEach(cm => {
        if (cm.party) list.add(cm.party);
      });
    }
    return Array.from(list);
  }, [chiefMinisters]);

  // Filtered Chief Ministers
  const filteredCMs = useMemo(() => {
    if (!chiefMinisters) return [];
    return chiefMinisters.filter(cm => {
      const matchesSearch = cm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            cm.party.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            cm.tenure.includes(searchQuery);
      
      const matchesParty = selectedParty === 'All' || cm.party === selectedParty;
      
      return matchesSearch && matchesParty;
    });
  }, [chiefMinisters, searchQuery, selectedParty]);

  // Helper to color-code political parties
  const getPartyStyles = (party) => {
    const p = party.toUpperCase();
    if (p.includes('CPI(M)') || p.includes('CPIM')) {
      return 'bg-red-500/10 text-red-500 border-red-500/20';
    } else if (p.includes('CPI')) {
      return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
    } else if (p.includes('INC') || p.includes('CONGRESS')) {
      return 'bg-sky-500/10 text-sky-500 border-sky-500/20';
    } else if (p.includes('IUML')) {
      return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    } else if (p.includes('PSP')) {
      return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    }
    return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  };

  const getPartyName = (party) => {
    if (language === 'ml') {
      const mappings = {
        'CPI': 'സി.പി.ഐ',
        'CPI(M)': 'സി.പി.ഐ (എം)',
        'INC': 'ഐ.എൻ.സി (കോൺഗ്രസ്സ്)',
        'PSP': 'പി.എസ്.പി',
        'IUML': 'ലീഗ് (IUML)'
      };
      return mappings[party] || party;
    }
    return party;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center text-xs font-mono text-accent">
        <span>വിവരങ്ങൾ ശേഖരിക്കുന്നു / Loading Government Data...</span>
      </div>
    );
  }

  // Ensure stateInfo exists, default back to empty object
  const info = stateInfo || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-bg-main pt-28 pb-20 relative overflow-hidden"
    >
      {/* Background Glow Blobs */}
      <div className="glow-blob glow-green w-[500px] h-[500px] -top-20 -left-20" />
      <div className="glow-blob glow-blue w-[400px] h-[400px] bottom-10 right-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Navigation buttons */}
        <div className="flex items-center space-x-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-border-main bg-bg-sec hover:bg-bg-main text-xs font-semibold text-txt-secondary hover:text-accent transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>{t("Back", "പിന്നിലേക്ക്")}</span>
          </button>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-border-main bg-bg-sec hover:bg-bg-main text-xs font-semibold text-txt-secondary hover:text-accent transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>{t("Home", "ഹോം")}</span>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="max-w-4xl mb-16">
          <span className="text-xs uppercase tracking-widest text-accent font-mono font-bold block mb-3">
            {t("KERALA PORTAL", "കേരള വിവരങ്ങൾ")}
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-txt-primary font-malayalam leading-tight mb-4">
            {t("Government Profile & CM History", "ഭരണസംവിധാനവും മുഖ്യമന്ത്രിമാരുടെ ചരിത്രവും")}
          </h1>
          <p className="text-txt-secondary text-sm md:text-base leading-relaxed font-malayalam font-light">
            {t(
              "A comprehensive dynamic timeline detailing the political history and administration milestones of Kerala since its formation in 1956.",
              "1956-ൽ ഐക്യകേരളം രൂപീകൃതമായതു മുതലുള്ള രാഷ്ട്രീയ ചരിത്രവും വിവിധ സർക്കാരുകളുടെ ഭരണകാലയളവുകളും വിശദമായി മനസ്സിലാക്കുക."
            )}
          </p>
        </div>

        {/* Main Grid: State Info and Current Chief Minister */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          
          {/* Left / State Profile Metrics Grid */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl md:text-2xl font-bold font-malayalam flex items-center space-x-2.5">
              <Landmark className="w-5 h-5 text-accent" />
              <span>{t("Kerala State Profile", "കേരള സംസ്ഥാന പ്രൊഫൈൽ")}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Formed On */}
              <div className="premium-card flex items-start space-x-4">
                <div className="p-2.5 rounded-xl bg-accent/5 border border-accent/15 text-accent shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-txt-secondary font-semibold font-mono block">
                    {t("Formed On", "രൂപീകരണം")}
                  </span>
                  <span className="text-sm font-bold text-txt-primary mt-1 block">
                    {language === 'ml' ? '1956 നവംബർ 01' : info.formedOn}
                  </span>
                </div>
              </div>

              {/* Capital */}
              <div className="premium-card flex items-start space-x-4">
                <div className="p-2.5 rounded-xl bg-accent/5 border border-accent/15 text-accent shrink-0">
                  <Landmark className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-txt-secondary font-semibold font-mono block">
                    {t("Capital", "തലസ്ഥാനം")}
                  </span>
                  <span className="text-sm font-bold text-txt-primary mt-1 block">
                    {t(info.capital, "തിരുവനന്തപുരം")}
                  </span>
                </div>
              </div>

              {/* Official Language */}
              <div className="premium-card flex items-start space-x-4">
                <div className="p-2.5 rounded-xl bg-accent/5 border border-accent/15 text-accent shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-txt-secondary font-semibold font-mono block">
                    {t("Official Language", "ഔദ്യോഗിക ഭാഷ")}
                  </span>
                  <span className="text-sm font-bold text-txt-primary mt-1 block">
                    {t(info.officialLanguage, "മലയാളം")}
                  </span>
                </div>
              </div>

              {/* Legislature */}
              <div className="premium-card flex items-start space-x-4">
                <div className="p-2.5 rounded-xl bg-accent/5 border border-accent/15 text-accent shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-txt-secondary font-semibold font-mono block">
                    {t("Legislature Assembly", "നിയമസഭ")}
                  </span>
                  <span className="text-sm font-bold text-txt-primary mt-1 block">
                    {t(info.legislature, "കേരള നിയമസഭ")}
                  </span>
                </div>
              </div>

              {/* High Court */}
              <div className="premium-card flex items-start space-x-4 md:col-span-2">
                <div className="p-2.5 rounded-xl bg-accent/5 border border-accent/15 text-accent shrink-0">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-txt-secondary font-semibold font-mono block">
                    {t("High Court", "ഉന്നത നീതിപീഠം")}
                  </span>
                  <span className="text-sm font-bold text-txt-primary mt-1 block">
                    {t(info.highCourt, "കേരള ഹൈക്കോടതി")}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Right / Current Governor & Chief Minister Banner */}
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold font-malayalam flex items-center space-x-2.5">
              <User className="w-5 h-5 text-accent-sec" />
              <span>{t("Executive Authority", "ഭരണാധികാരികൾ")}</span>
            </h2>

            {/* Governor and CM Details Card */}
            <div className="premium-card bg-gradient-to-br from-bg-sec to-bg-main border-accent-sec/20 relative overflow-hidden flex flex-col justify-between h-[310px]">
              
              {/* Governor Profile */}
              <div className="pb-4 border-b border-border-main flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-accent-sec/10 text-accent-sec flex items-center justify-center font-bold text-xs">
                  Gov
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-txt-secondary font-mono">
                    {t("Governor", "ഗവർണ്ണർ")}
                  </span>
                  <h3 className="text-sm font-bold text-txt-primary mt-0.5">
                    {t(info.currentGovernor, "രാജേന്ദ്ര അർലേക്കർ")}
                  </h3>
                </div>
              </div>

              {/* Chief Minister Profile */}
              <div className="pt-4 flex items-start space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                  <User className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <span className="inline-block px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-accent/10 text-accent border border-accent/20 mb-1.5">
                    {t(info.currentCmStatus || "Current Chief Minister", "നിലവിലെ മുഖ്യമന്ത്രി")}
                  </span>
                  <h3 className="text-lg font-bold text-txt-primary leading-tight font-serif-en">
                    {info.currentCmName}
                  </h3>
                  <div className="text-xs text-txt-secondary mt-1 space-y-0.5">
                    <p className="font-semibold">{t(info.currentCmParty, info.currentCmParty)} ({info.currentCmAlliance})</p>
                    <p className="text-[10px] text-txt-muted">{t("Sworn in on:", "അധികാരമേറ്റത്:")} {info.currentCmSwornIn}</p>
                  </div>
                </div>
              </div>

              {/* Accent Border Line */}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-accent-sec to-accent" />
            </div>

          </div>

        </div>

        {/* Milestone Records Highlights */}
        <div className="premium-card bg-bg-sec/50 border-border-main/60 p-8 rounded-3xl mb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="space-y-1 md:border-r border-border-main/50 pr-4">
            <span className="text-[10px] uppercase tracking-wider text-txt-secondary font-semibold font-mono flex items-center">
              <Award className="w-3.5 h-3.5 text-accent-sec mr-1.5" />
              {t("First Chief Minister", "ആദ്യ മുഖ്യമന്ത്രി")}
            </span>
            <p className="text-sm font-bold text-txt-primary mt-1 font-serif-en">{info.firstCm}</p>
          </div>

          <div className="space-y-1 lg:border-r border-border-main/50 pr-4">
            <span className="text-[10px] uppercase tracking-wider text-txt-secondary font-semibold font-mono flex items-center">
              <Award className="w-3.5 h-3.5 text-accent-sec mr-1.5" />
              {t("First Communist CM (India)", "ഇന്ത്യയിലെ ആദ്യ കമ്മ്യൂണിസ്റ്റ് സി.എം")}
            </span>
            <p className="text-sm font-bold text-txt-primary mt-1 font-serif-en">{info.firstCommunistCmInIndia}</p>
          </div>

          <div className="space-y-1 md:border-r border-border-main/50 pr-4">
            <span className="text-[10px] uppercase tracking-wider text-txt-secondary font-semibold font-mono flex items-center">
              <Award className="w-3.5 h-3.5 text-accent-sec mr-1.5" />
              {t("Only Muslim CM", "ഏക മുസ്ലിം മുഖ്യമന്ത്രി")}
            </span>
            <p className="text-sm font-bold text-txt-primary mt-1 font-serif-en">{info.onlyMuslimCm}</p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-txt-secondary font-semibold font-mono flex items-center">
              <Award className="w-3.5 h-3.5 text-accent-sec mr-1.5" />
              {t("Longest Serving Leaders", "കൂടുതൽ കാലം ഭരിച്ചവർ")}
            </span>
            <p className="text-sm font-bold text-txt-primary mt-1 font-serif-en">
              {info.longestServingLeaders ? info.longestServingLeaders.join(', ') : ''}
            </p>
          </div>

        </div>

        {/* Timeline Header, Search & Filters */}
        <div className="space-y-8 mb-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-accent-sec font-mono font-bold block mb-2">
                {t("CHRONOLOGY", "കാലഗണന")}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold font-malayalam">
                {t("Chief Ministers Chronological History", "മുൻ മുഖ്യമന്ത്രിമാരും ഭരണകാലയളവും")}
              </h2>
            </div>

            {/* Interactive Search Bar */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-txt-muted absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t("Search by name, party, tenure...", "പേര്, പാർട്ടി, വർഷം വഴി തിരയുക...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-border-main bg-bg-sec text-xs text-txt-primary focus:outline-none focus:border-accent transition-colors placeholder:text-txt-muted/60"
              />
            </div>
          </div>

          {/* Party Filters */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border-main/50">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-txt-muted mr-2 font-mono">
              {t("Filter Party:", "പാർട്ടി ഫിൽറ്റർ:")}
            </span>
            {partyFilters.map(party => (
              <button
                key={party}
                onClick={() => setSelectedParty(party)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  selectedParty === party
                    ? 'bg-accent text-bg-color border-accent shadow-sm'
                    : 'bg-bg-sec text-txt-secondary border-border-main hover:border-txt-muted'
                }`}
              >
                {party === 'All' ? t('All Parties', 'എല്ലാ പാർട്ടികളും') : getPartyName(party)}
              </button>
            ))}
          </div>

        </div>

        {/* Chronological List of Chief Ministers */}
        <div className="relative border-l border-border-main/80 ml-6 md:ml-12 space-y-12">
          
          <AnimatePresence mode="popLayout">
            {filteredCMs.map((cm, idx) => (
              <motion.div
                key={cm.id || cm.no || idx}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="relative pl-8 md:pl-16 group"
              >
                
                {/* Timeline Circle Bullet */}
                <div className="absolute left-[-11px] top-4 w-5 h-5 rounded-full border-4 border-bg-main bg-border-main group-hover:bg-accent group-hover:scale-110 transition-all duration-350 z-10 flex items-center justify-center" />

                {/* CM card structure */}
                <div className="premium-card bg-bg-sec/40 backdrop-blur-md max-w-4xl hover:border-accent-sec/30 relative">
                  
                  {/* Absolute CM Chronological Index Number Indicator */}
                  <span className="absolute top-4 right-4 md:right-6 text-2xl md:text-4xl font-extrabold font-mono text-txt-muted/15 select-none">
                    #{String(cm.no).padStart(2, '0')}
                  </span>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    {/* Left: Name and Tenure */}
                    <div>
                      <span className="text-[10px] font-mono tracking-widest text-accent-sec uppercase block mb-1">
                        {t("Kerala Chief Minister", "കേരള മുഖ്യമന്ത്രി")}
                      </span>
                      <h3 className="text-lg md:text-xl font-bold text-txt-primary tracking-tight font-serif-en">
                        {cm.name}
                      </h3>
                      
                      <div className="flex items-center space-x-1.5 text-xs text-txt-secondary mt-1.5 font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-accent/85" />
                        <span>{t("Tenure:", "ഭരണകാലം:")} {cm.tenure}</span>
                      </div>
                    </div>

                    {/* Right: Political Party Info Badge */}
                    <div className="shrink-0 flex items-center">
                      <span className={`px-3 py-1.5 rounded-lg border text-xs font-bold font-mono tracking-wide ${getPartyStyles(cm.party)}`}>
                        {getPartyName(cm.party)}
                      </span>
                    </div>

                  </div>

                </div>

              </motion.div>
            ))}
          </AnimatePresence>

          {/* Fallback no-records view */}
          {filteredCMs.length === 0 && (
            <div className="pl-8 py-10 text-center text-txt-secondary font-malayalam max-w-lg mx-auto">
              <HelpCircle className="w-8 h-8 text-txt-muted/50 mx-auto mb-3" />
              <p className="text-sm font-semibold">{t("No Chief Ministers found matching your criteria.", "തിരഞ്ഞെടുത്ത പാർട്ടിയോ വാക്കോ ഉള്ള മുഖ്യമന്ത്രിമാരെ കണ്ടെത്താനായില്ല.")}</p>
            </div>
          )}

        </div>

      </div>
    </motion.div>
  );
}
