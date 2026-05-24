import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, ShieldAlert, ArrowRight } from "lucide-react";
import gsap from "gsap";

export default function Hero() {
  const videoContainerRef = useRef(null);
  const titleRef = useRef(null);

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
              Kerala Infrastructure Showcase 2026
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[40px] md:text-[56px] lg:text-[72px] font-extrabold text-txt-primary font-malayalam leading-[1.1] mb-6"
          >
            ജനങ്ങൾക്ക് നൽകിയ{" "}
            <span className="text-accent text-glow">
              വാഗ്ദാനങ്ങൾ...
            </span>
            <br />
            ഇന്ന് വികസനത്തിന്റെ{" "}
            <span className="underline decoration-accent decoration-wavy decoration-2 underline-offset-8">
              തെളിവുകളായി.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-txt-secondary font-malayalam text-base sm:text-[18px] max-w-xl mb-10 leading-relaxed font-light"
          >
            തിരഞ്ഞെടുപ്പിന് മുമ്പ് പ്രഖ്യാപിച്ച നവീകരണ പദ്ധതികൾ, ഇന്ന്
            കേരളത്തിന്റെ ഓരോ കോണിലും നേരിൽ കാണാവുന്ന യാഥാർത്ഥ്യമായി
            മാറിക്കഴിഞ്ഞിരിക്കുന്നു.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-wrap gap-4"
          >
            <a
              href="#before-after"
              className="btn-primary inline-flex items-center"
            >
              വികസനം കാണൂ
              <ArrowRight className="ml-2 w-4 h-4" />
            </a>
            <a
              href="#kerala-map"
              className="btn-secondary inline-flex items-center"
            >
              പദ്ധതികൾ പരിശോധിക്കുക
            </a>
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
              <div className="text-txt-secondary text-[10px]">PROJECTS</div>
            </div>
            <div>
              <div className="text-txt-primary font-bold text-lg">₹500Cr+</div>
              <div className="text-txt-secondary text-[10px]">INVESTMENT</div>
            </div>
            <div>
              <div className="text-txt-primary font-bold text-lg">100%</div>
              <div className="text-txt-secondary text-[10px]">TRANSPARENCY</div>
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
            className="relative w-[97%] h-[97%] rounded-xl overflow-hidden shadow-xl bg-bg-sec border border-border-main"
          >
            {/* Clean elegant caption overlay */}
            <div className="absolute bottom-4 left-4 right-4 z-20 bg-bg-alt/90 backdrop-blur-md border border-border-main px-4 py-3 rounded-xl shadow-md text-left">
              <span className="text-[9px] font-mono font-bold tracking-widest text-accent uppercase block mb-0.5">
                INFRASTRUCTURE SHOWCASE
              </span>
              <span className="text-xs font-semibold text-txt-primary font-malayalam leading-tight">
                കേരളത്തിന്റെ നവീകരിച്ച അടിസ്ഥാന സൗകര്യങ്ങൾ (NH-66)
              </span>
            </div>

            <img
              src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1200&q=80"
              alt="Kerala Development Drone View"
              className="w-full h-full object-cover scale-105 brightness-[0.9]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
