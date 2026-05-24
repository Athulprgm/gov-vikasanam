import { ArrowUp } from "lucide-react";

export default function Footer() {
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-bg-sec pt-20 pb-10 overflow-hidden border-t border-border-main">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Footer Top */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-border-main items-start">
          {/* Column 1: Info and statement */}
          <div className="md:col-span-5 text-left">
            <a href="#hero" className="flex items-center space-x-3 mb-6">
              <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center font-bold text-white text-lg">
                ജ
              </div>
              <div className="flex flex-col">
                <span className="text-txt-primary font-extrabold text-lg leading-tight tracking-wider font-malayalam">
                  ജനവികസനം
                </span>
                <span className="text-txt-secondary font-mono text-[9px] uppercase tracking-[0.25em]">
                  JANAVIKASAM
                </span>
              </div>
            </a>
            <p className="text-sm text-txt-primary font-malayalam leading-relaxed max-w-sm mb-4">
              " വികസനം ഇനി വാക്കുകളിൽ അല്ല... ദൃശ്യങ്ങളിൽ. "
            </p>
            <p className="text-xs text-txt-secondary font-malayalam leading-relaxed max-w-sm font-light">
              കേരളത്തിന്റെ വിപ്ലവകരമായ മാറ്റങ്ങൾ സുതാര്യമായി പൊതുജനങ്ങൾ
              വിലയിരുത്തുന്ന പ്രീമിയം ഇൻഫ്രാസ്ട്രക്ചർ പോർട്ടൽ.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div className="md:col-span-4 text-left">
            <h4 className="text-xs font-mono font-bold tracking-widest text-accent uppercase mb-6">
              NAVIGATION
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs font-malayalam">
              <a
                href="#featured-projects"
                className="text-txt-secondary hover:text-accent transition-colors"
              >
                വികസനക്കാഴ്ചകൾ
              </a>
              <a
                href="#kerala-map"
                className="text-txt-secondary hover:text-accent transition-colors"
              >
                വികസന ഭൂപടം
              </a>
              <a
                href="#timeline"
                className="text-txt-secondary hover:text-accent transition-colors"
              >
                നാൾവഴി
              </a>
              <a
                href="#statistics"
                className="text-txt-secondary hover:text-accent transition-colors"
              >
                സ്ഥിതിവിവരങ്ങൾ
              </a>
              <a
                href="#citizen-impact"
                className="text-txt-secondary hover:text-accent transition-colors"
              >
                അഭിപ്രായങ്ങൾ
              </a>
              <a
                href="#before-after"
                className="text-txt-secondary hover:text-accent transition-colors"
              >
                മാറ്റം നേരിൽ
              </a>
            </div>
          </div>

          {/* Column 3: Connect & Socials */}
          <div className="md:col-span-3 text-left">
            <h4 className="text-xs font-mono font-bold tracking-widest text-accent uppercase mb-6">
              CONNECT WITH US
            </h4>
            <div className="flex space-x-4 mb-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-lg bg-bg-main border border-border-main hover:border-accent/40 hover:bg-accent/5 hover:text-accent flex items-center justify-center transition-all"
                aria-label="GitHub"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-lg bg-bg-main border border-border-main hover:border-accent/40 hover:bg-accent/5 hover:text-accent flex items-center justify-center transition-all"
                aria-label="Twitter"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-lg bg-bg-main border border-border-main hover:border-accent/40 hover:bg-accent/5 hover:text-accent flex items-center justify-center transition-all"
                aria-label="YouTube"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
                  <polygon points="10 15 15 12 10 9 10 15" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-lg bg-bg-main border border-border-main hover:border-accent/40 hover:bg-accent/5 hover:text-accent flex items-center justify-center transition-all"
                aria-label="Facebook"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            </div>

            <button
              onClick={handleScrollTop}
              className="inline-flex items-center space-x-1.5 text-[10px] font-mono font-bold text-txt-secondary hover:text-accent transition-colors"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>BACK TO TOP</span>
            </button>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-txt-secondary/60 space-y-4 sm:space-y-0">
          <div>
            © {new Date().getFullYear()} JANAVIKASAM. ALL RIGHTS RESERVED.
          </div>
          <div className="flex space-x-6">
            <a href="#hero" className="hover:text-accent transition-colors">
              PRIVACY POLICY
            </a>
            <a href="#hero" className="hover:text-accent transition-colors">
              TERMS OF USE
            </a>
            <a href="#hero" className="hover:text-accent transition-colors">
              DATA TRANSPARENCY
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
