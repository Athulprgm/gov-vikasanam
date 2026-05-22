import { useState, useEffect } from 'react';
import Lenis from 'lenis';

// Import components
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ScrollStorytelling from './components/ScrollStorytelling';
import BeforeAfterShowcase from './components/BeforeAfterShowcase';
import KeralaMap from './components/KeralaMap';
import DevelopmentTimeline from './components/DevelopmentTimeline';
import PremiumStatistics from './components/PremiumStatistics';
import FeaturedProjects from './components/FeaturedProjects';
import VideoDocumentary from './components/VideoDocumentary';
import CitizenImpact from './components/CitizenImpact';
import CTA from './components/CTA';
import Footer from './components/Footer';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    if (isLoading) return; // Wait until loading finishes to initialize scroll

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth exponential ease
      wheelMultiplier: 1.1,
      touchMultiplier: 1.5,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Dynamic hash scroll matching
    const handleAnchorScroll = (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (target) {
        e.preventDefault();
        const id = target.getAttribute('href');
        if (id === '#') return;
        
        const element = document.querySelector(id);
        if (element) {
          lenis.scrollTo(element, { offset: -70 });
        }
      }
    };

    document.addEventListener('click', handleAnchorScroll);

    return () => {
      lenis.destroy();
      document.removeEventListener('click', handleAnchorScroll);
    };
  }, [isLoading]);

  return (
    <>
      {/* Cinematic Loading screen overlay */}
      <LoadingScreen onComplete={() => setIsLoading(false)} />

      {/* Main Page Layout (Only active/visible when loading finishes) */}
      {!isLoading && (
        <div className="relative w-full min-h-screen bg-[#0B0B0B] text-[#F5F5F5] font-sans selection:bg-[#2ECC71] selection:text-black antialiased overflow-x-hidden">
          <Navbar />
          <Hero />
          
          <main>
            {/* Scroll build storytelling */}
            <ScrollStorytelling />
            
            {/* Interactive Before After Comparison Slider */}
            <BeforeAfterShowcase />
            
            {/* Interactive regional map of Kerala */}
            <KeralaMap />
            
            {/* Horizontal Milestones Timeline */}
            <DevelopmentTimeline />
            
            {/* Key counts and investment numbers */}
            <PremiumStatistics />
            
            {/* Detailed Portfolio grid */}
            <FeaturedProjects />
            
            {/* Cinematic masked documentary clip expansion */}
            <VideoDocumentary />
            
            {/* Customer voices and impact quotes */}
            <CitizenImpact />
            
            {/* Massive Final Call to Action */}
            <CTA />
          </main>
          
          {/* Global close footer */}
          <Footer />
        </div>
      )}
    </>
  );
}

export default App;
