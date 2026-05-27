import { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import gsap from "gsap";

export default function Hero() {
  const { t } = useAuth();
  const videoContainerRef = useRef(null);
  const titleRef = useRef(null);

  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      src: "https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?auto=format&fit=crop&w=1200&q=80",
      districtEn: "Idukki",
      districtMl: "ഇടുക്കി",
      placeEn: "Munnar Tea Valleys & Hill Stations",
      placeMl: "മൂന്നാർ തേയിലത്തോട്ടങ്ങളും മലനിരകളും"
    },
    {
      src: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80",
      districtEn: "Alappuzha",
      districtMl: "ആലപ്പുഴ",
      placeEn: "Vembanad Backwaters & Houseboats",
      placeMl: "വേമ്പനാട് കായലിലെ കെട്ടുവള്ളങ്ങൾ"
    },
    {
      src: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80",
      districtEn: "Ernakulam",
      districtMl: "എറണാകുളം",
      placeEn: "Kochi Marine Drive & Chinese Fishing Nets",
      placeMl: "കൊച്ചി മറൈൻ ഡ്രൈവും ചീനവലകളും"
    },
    {
      src: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
      districtEn: "Thiruvananthapuram",
      districtMl: "തിരുവനന്തപുരം",
      placeEn: "Kovalam Coastlines & Vizhinjam Port Terminal",
      placeMl: "കോവളം ബീച്ചും വിഴിഞ്ഞം അന്താരാഷ്ട്ര തുറമുഖവും"
    },
    {
      src: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&w=1200&q=80",
      districtEn: "Kasaragod",
      districtMl: "കാസർഗോഡ്",
      placeEn: "Historic Bekal Fort Beach Walkways",
      placeMl: "ബേക്കൽ കോട്ടയും തീരദേശ വികസനവും"
    },
    {
      src: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=1200&q=80",
      districtEn: "Wayanad",
      districtMl: "വയനാട്",
      placeEn: "Banasura Sagar Dam reservoir",
      placeMl: "ബാണാസുര സാഗർ ഡാം പദ്ധതി"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    // Parallax effect on scroll for the cinematic visual frame
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      if (videoContainerRef.current) {
        gsap.to(videoContainerRef.current, {
          y: scrollPos * 0.15,
          scale: 1 + scrollPos * 0.0003,
          duration: 0.1,
          overwrite: "auto",
        });
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center bg-bg-main pt-24 pb-16 overflow-hidden cinematic-grid"
    >
      {/* Background glow blobs */}
      <div className="glow-blob glow-green w-[500px] h-[500px] -top-20 -left-20" />
      <div className="glow-blob glow-blue w-[400px] h-[400px] bottom-0 right-0 opacity-10" />

      {/* Main Split Screen Container */}
      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Side: Cinematic Copy */}
        <div
          className="lg:col-span-7 flex flex-col justify-center text-left"
          ref={titleRef}
        >
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center space-x-2 bg-bg-sec border border-border-main px-4 py-1.5 rounded-full w-fit mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            <span className="text-xs uppercase tracking-widest text-accent font-mono font-bold">
              {t("Kerala Infrastructure Showcase 2026", "കേരള വികസന നേട്ടങ്ങൾ 2026")}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[40px] md:text-[56px] lg:text-[72px] font-extrabold text-txt-primary font-malayalam leading-[1.1] mb-6"
          >
            {t("Promises Given to", "ജനങ്ങൾക്ക് നൽകിയ")}{" "}
            <span className="text-accent text-glow">
              {t("the People...", "വാഗ്ദാനങ്ങൾ...")}
            </span>
            <br />
            {t("Today, Delivered as", "ഇന്ന് വികസനത്തിന്റെ")}{" "}
            <span className="underline decoration-accent decoration-wavy decoration-2 underline-offset-8">
              {t("Proof of Progress.", "തെളിവുകളായി.")}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-txt-secondary font-malayalam text-base sm:text-[18px] max-w-xl mb-10 leading-relaxed font-light"
          >
            {t(
              "Development and renovation projects announced prior to elections are now visible realities across every corner of Kerala.",
              "തിരഞ്ഞെടുപ്പിന് മുമ്പ് പ്രഖ്യാപിച്ച നവീകരണ പദ്ധതികൾ, ഇന്ന് കേരളത്തിന്റെ ഓരോ കോണിലും നേരിൽ കാണാവുന്ന യാഥാർത്ഥ്യമായി മാറിക്കഴിഞ്ഞിരിക്കുന്നു."
            )}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              to="/showcase"
              className="btn-primary inline-flex items-center"
            >
              {t("See the Change", "വികസനം കാണൂ")}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link
              to="/map"
              className="btn-secondary inline-flex items-center"
            >
              {t("Inspect Projects", "പദ്ധതികൾ പരിശോധിക്കുക")}
            </Link>
          </motion.div>

          {/* Micro stats banner */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 1, duration: 1 }}
            className="grid grid-cols-3 gap-6 border-t border-border-main mt-12 pt-6 max-w-md font-mono text-xs"
          >
            <div>
              <div className="text-txt-primary font-bold text-lg">120+</div>
              <div className="text-txt-secondary text-[10px] uppercase">
                {t("Projects", "പദ്ധതികൾ")}
              </div>
            </div>
            <div>
              <div className="text-txt-primary font-bold text-lg">₹500Cr+</div>
              <div className="text-txt-secondary text-[10px] uppercase">
                {t("Investment", "നിക്ഷേപം")}
              </div>
            </div>
            <div>
              <div className="text-txt-primary font-bold text-lg">100%</div>
              <div className="text-txt-secondary text-[10px] uppercase">
                {t("Transparency", "സുതാര്യത")}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Elegant Classic Picture Frame */}
        <div className="lg:col-span-5 relative w-full h-[350px] sm:h-[450px] lg:h-[550px] flex items-center justify-center">
          {/* Frame boundary corner indicators */}
          <div className="absolute inset-0 border border-border-main rounded-2xl p-2.5 pointer-events-none">
            <div className="absolute top-0 left-0 w-8 h-[1px] bg-accent" />
            <div className="absolute top-0 left-0 w-[1px] h-8 bg-accent" />
            <div className="absolute bottom-0 right-0 w-8 h-[1px] bg-accent" />
            <div className="absolute bottom-0 right-0 w-[1px] h-8 bg-accent" />
          </div>

          {/* Main Visual Frame */}
          <div
            ref={videoContainerRef}
            className="relative w-[97%] h-[97%] rounded-xl overflow-hidden shadow-xl bg-bg-sec border border-border-main flex items-center justify-center"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full"
              >
                <img
                  src={slides[currentSlide].src}
                  alt={slides[currentSlide].placeEn}
                  className="w-full h-full object-cover brightness-[0.85] scale-105"
                />
                
                {/* Dots indicator for current slide */}
                <div className="absolute top-4 right-4 z-20 flex space-x-1.5 bg-black/40 backdrop-blur-xs px-2.5 py-1.5 rounded-full">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === currentSlide ? 'bg-accent w-3.5' : 'bg-white/40 hover:bg-white/70'
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Clean elegant caption overlay */}
                <div className="absolute bottom-4 left-4 right-4 z-20 bg-bg-alt/90 backdrop-blur-md border border-border-main px-4 py-3 rounded-xl shadow-md text-left">
                  <span className="text-[9px] font-mono font-bold tracking-widest text-accent uppercase block mb-0.5">
                    {t("INFRASTRUCTURE SHOWCASE", "അടിസ്ഥാന വികസന കാഴ്ചകൾ")} • {t(slides[currentSlide].districtEn, slides[currentSlide].districtMl)}
                  </span>
                  <span className="text-xs font-semibold text-txt-primary font-malayalam leading-tight block mt-0.5">
                    {t(slides[currentSlide].placeEn, slides[currentSlide].placeMl)}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
