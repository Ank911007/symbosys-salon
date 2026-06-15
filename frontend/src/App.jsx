import { lazy, Suspense } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'sonner';
import ErrorBoundary from './components/ErrorBoundary';
import { Preloader } from './components/ui/Preloader';
import Navbar from './Navbar';
import HeroSection from './components/sections/HeroSection';
import CardsCarousel from './components/sections/CardsCarousel';
import MobileShowcase from './components/sections/MobileShowcase';
import ServicesPricing from './components/sections/ServicesPricing';
import BookCTA from './components/sections/BookCTA';
import Footer from './components/sections/Footer';
import { RouteLoader } from './components/ui/RouteLoader';
import { EntryBookingModal } from './components/booking/EntryBookingModal';

// Lazy loaded page routes
const NearbySalons = lazy(() => import('./pages/NearbySalons'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));

function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Navbar />
      <HeroSection />
      <CardsCarousel />
      <MobileShowcase />
      <ServicesPricing />
      <BookCTA />
      <Footer />
      
      {!isAuthenticated && (
        <EntryBookingModal 
          isOpen={true} 
          onClose={() => {}} 
        />
      )}
    </>
  );
}

/**
 * App — root composition shell.
 * All state, data, and rendering logic lives in dedicated components.
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <Toaster position="bottom-right" richColors />
          <ErrorBoundary>
            <Preloader />
          {/* Skip to main content link for keyboard/screen reader users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-sage focus:text-canvas focus:font-syne focus:font-bold focus:text-xs focus:tracking-widest focus:px-6 focus:py-3 focus:rounded-full focus:shadow-2xl"
        >
          Skip to content
        </a>

        <div className="bg-canvas text-text-primary selection:bg-sage selection:text-canvas transition-colors duration-500 min-h-screen">
          <main id="main-content">
            <Suspense fallback={<RouteLoader />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/nearby" element={<NearbySalons />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/book/:id" element={<BookingPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<AuthPage />} />
                <Route path="/register" element={<AuthPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/admin" element={<AdminDashboardPage />} />
              </Routes>
            </Suspense>
          </main>
        </div>
        </ErrorBoundary>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
