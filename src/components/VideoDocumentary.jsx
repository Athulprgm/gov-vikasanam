import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";

export default function VideoDocumentary() {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  // Track scroll of this section to expand video container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Transform video width/scale based on scroll position
  const videoWidth = useTransform(
    scrollYProgress,
    [0.1, 0.45],
    ["60%", "100%"],
  );
  const borderRadius = useTransform(
    scrollYProgress,
    [0.1, 0.45],
    ["24px", "0px"],
  );
  const textScale = useTransform(scrollYProgress, [0.2, 0.5], [0.85, 1]);
  const textOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section
      ref={containerRef}
      id="video-section"
      className="relative bg-bg-main section-padding flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-bg-main via-transparent to-bg-main z-10 pointer-events-none" />

      {/* Outer Scroll Container */}
      <div className="w-full flex flex-col items-center relative z-20">
        {/* Slogan above video */}
        <div className="max-w-3xl mx-auto px-6 text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-accent font-mono font-bold block mb-3">
            Cinematic Proof
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-txt-primary font-malayalam leading-tight">
            പറഞ്ഞത് മാത്രം അല്ല... ചെയ്തു കൂടി.
          </h2>
          <p className="text-txt-secondary text-sm md:text-base font-malayalam mt-4 max-w-xl mx-auto font-light">
            കേരളത്തിന്റെ വികസനം വെറും വാക്കുകളിൽ ഒതുങ്ങുന്നതല്ല, കൺമുന്നിലെ
            യാഥാർത്ഥ്യങ്ങളാണ്.
          </p>
        </div>

        {/* Masked Video Container (Expands on scroll) */}
        <motion.div
          style={{
            width: videoWidth,
            borderRadius: borderRadius,
          }}
          className="relative aspect-[16/9] max-w-7xl mx-auto overflow-hidden shadow-md border border-border-main bg-bg-sec"
        >
          {/* Shadow Overlay */}
          <div className="absolute inset-0 bg-black/20 z-10" />

          {/* Looping Drone Video of Kerala Highway / Infrastructure */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover scale-105"
            src="https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c025f73cf785c4d28430bd124940cfd6&profile_id=139&oauth2_token_id=57447761"
            loop
            muted
            autoPlay
            playsInline
          />

          {/* On-Video Info Layer (Linked to scroll expansion) */}
          <motion.div
            style={{
              opacity: textOpacity,
              scale: textScale,
            }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center text-white"
          >
            <h3 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-malayalam leading-tight max-w-2xl text-glow-subtle mb-4">
              പ്രഖ്യാപനങ്ങളിൽ നിന്ന് യാഥാർത്ഥ്യത്തിലേക്ക്
            </h3>
            <p className="text-xs sm:text-sm font-mono text-accent tracking-[0.2em] uppercase">
              DELIVERING KERALA'S FUTURE TODAY
            </p>
          </motion.div>

          {/* Controls Layer */}
          <div className="absolute bottom-6 right-6 z-30 flex items-center space-x-3">
            {/* Play/Pause toggle */}
            <button
              onClick={togglePlay}
              className="p-3 rounded-full bg-bg-alt/90 backdrop-blur-md border border-border-main text-txt-primary hover:text-accent hover:scale-105 transition-all focus:outline-none cursor-pointer"
              aria-label="Toggle Play"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>

            {/* Mute/Unmute toggle */}
            <button
              onClick={toggleMute}
              className="p-3 rounded-full bg-bg-alt/90 backdrop-blur-md border border-border-main text-txt-primary hover:text-accent hover:scale-105 transition-all focus:outline-none cursor-pointer"
              aria-label="Toggle Audio"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Frame Label */}
          <div className="absolute top-6 left-6 z-30 text-[9px] font-mono text-white/70 pointer-events-none">
            STREAMING FEED // INFRA_CAM_01
          </div>
        </motion.div>
      </div>
    </section>
  );
}
