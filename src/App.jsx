import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Context Providers
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

// Pages
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import BlogsFeed from './pages/BlogsFeed';
import BlogDetail from './pages/BlogDetail';

// New Subpages
import Showcase from './pages/Showcase';
import MapPage from './pages/MapPage';
import TimelinePage from './pages/TimelinePage';
import StatisticsPage from './pages/StatisticsPage';
import ImpactPage from './pages/ImpactPage';

// Landing Page Components
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import InteractiveHub from './components/InteractiveHub';
import VideoDocumentary from './components/VideoDocumentary';
import Footer from './components/Footer';

// Protected Route Guard for Admin Panel
function ProtectedRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center text-xs font-mono text-accent">
        <span>പരിശോധിക്കുന്നു / Authenticating...</span>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

// Scroll to top helper on route changes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Shared page shell layout
function PageLayout({ children }) {
  return (
    <div className="relative w-full min-h-screen bg-bg-main text-txt-primary font-sans antialiased overflow-x-hidden">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

// Landing Page Shell
function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {/* Cinematic Loading screen overlay */}
      <LoadingScreen onComplete={() => setIsLoading(false)} />

      {/* Main Page Layout (Only active/visible when loading finishes) */}
      {!isLoading && (
        <PageLayout>
          <Hero />
          <InteractiveHub />
          <VideoDocumentary />
        </PageLayout>
      )}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public Interactive Landing Hub Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Portal Pages */}
            <Route path="/showcase" element={<PageLayout><Showcase /></PageLayout>} />
            <Route path="/map" element={<PageLayout><MapPage /></PageLayout>} />
            <Route path="/timeline" element={<PageLayout><TimelinePage /></PageLayout>} />
            <Route path="/statistics" element={<PageLayout><StatisticsPage /></PageLayout>} />
            <Route path="/impact" element={<PageLayout><ImpactPage /></PageLayout>} />

            {/* Authentication Pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/register" element={<Register />} />

            {/* Social microblogging feed pages */}
            <Route path="/feed" element={<BlogsFeed />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/blog/:id" element={<BlogDetail />} />

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
