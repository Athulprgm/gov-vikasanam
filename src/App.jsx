import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Lenis from 'lenis';

// Context Providers
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

// Pages
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// Landing Page Components
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

// Protected Route Guard for Admin Panel
function ProtectedRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center text-xs font-mono text-[#2ECC71]">
        <span>പരിശോധിക്കുന്നു / Authenticating...</span>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

// Landing Page Shell
function LandingPage() {
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
      lenis.focus;
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

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Interactive Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Authentication Pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Admin Control Center */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />

            {/* Fallback routing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
