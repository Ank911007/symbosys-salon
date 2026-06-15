import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { BookingForm } from '../components/booking/BookingForm';
import { SimpleFooter } from '../components/sections/SimpleFooter';
import { UserProfileDropdown } from '../components/ui/UserProfileDropdown';

export default function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const salon = location.state?.salon;

  useEffect(() => {
    window.scrollTo(0, 0);
    // If someone navigates here directly without a salon in state, redirect to search
    if (!salon) {
      navigate('/search', { replace: true });
    }
  }, [salon, navigate]);

  if (!salon) return null;

  return (
    <div className="min-h-screen bg-[#f4f9f5] flex flex-col font-syne">
      
      {/* Sleek Minimal Header */}
      <header className="bg-white border-b border-[#e0f0e3] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 text-[#4a9e5c] hover:bg-[#e8f5ea] rounded-full transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
            <Link to="/" className="font-serif text-2xl font-bold text-[#0b5c3b] tracking-tight">
              Minta
            </Link>
          </div>

          <div className="flex items-center">
            <UserProfileDropdown />
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-10 md:py-16">
        <BookingForm salon={salon} onCancel={() => navigate(-1)} />
      </main>

      <SimpleFooter />
    </div>
  );
}
