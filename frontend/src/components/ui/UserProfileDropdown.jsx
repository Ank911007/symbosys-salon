import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import CustomerLoginModal from '../auth/CustomerLoginModal';

export function UserProfileDropdown() {
  const { user, isAuthenticated, isCustomer, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const profileRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Gender-based avatar
  const renderAvatar = () => {
    const gender = user?.gender;
    const initial = (user?.name || user?.phone || '?')[0].toUpperCase();
    
    if (gender === 'female') {
      return (
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
          {initial}
        </div>
      );
    }
    return (
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#3b7d4a] to-[#2d5a34] flex items-center justify-center text-white font-bold text-sm shadow-md">
        {initial}
      </div>
    );
  };

  if (!isAuthenticated || !isCustomer) {
    return (
      <>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLoginModalOpen(true)}
            className="hidden sm:inline-block text-text-primary font-syne font-bold text-xs md:text-sm px-4 py-3 hover:text-text-muted transition-colors"
          >
            Sign In
          </button>
          <Link
            to="/search"
            className="hidden sm:inline-block bg-[#a4c2a8] text-[#0e110f] font-syne font-bold text-xs md:text-sm px-6 py-3 rounded-full hover:scale-[1.05] hover:bg-[#0e110f] hover:text-[#f2f4f3] transition-all duration-300 shadow-md cursor-pointer"
          >
            Book Now
          </Link>
        </div>
        
        <CustomerLoginModal 
          isOpen={loginModalOpen} 
          onClose={() => setLoginModalOpen(false)} 
        />
      </>
    );
  }

  return (
    <div className="relative hidden sm:block z-[100]" ref={profileRef}>
      <button
        onClick={() => setProfileOpen(!profileOpen)}
        className="flex items-center gap-2 cursor-pointer group"
        aria-haspopup="true"
        aria-expanded={profileOpen}
      >
        {renderAvatar()}
        <ChevronDown 
          size={14} 
          className={`text-[#6b7280] transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {profileOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-[calc(100%+12px)] w-72 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-[100]"
          >
            {/* Profile Header */}
            <div className="px-5 py-4 bg-gradient-to-br from-[#f0faf2] to-[#e8f5ea] border-b border-[#e0f0e3]">
              <div className="flex items-center gap-3">
                {renderAvatar()}
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-bold text-[#111827] truncate">
                    {user?.name || 'Guest'}
                  </p>
                  <p className="text-[12px] text-[#6b7280] truncate">
                    {user?.email || 'No email added'}
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="px-5 py-3 space-y-2.5">
              <div className="flex items-center gap-3 text-[13px]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <span className="text-[#374151]">+91 {user?.phone || '—'}</span>
              </div>
              {user?.email && (
                <div className="flex items-center gap-3 text-[13px]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  <span className="text-[#374151] truncate">{user.email}</span>
                </div>
              )}
              {user?.gender && (
                <div className="flex items-center gap-3 text-[13px]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <span className="text-[#374151] capitalize">{user.gender}</span>
                </div>
              )}
            </div>

            {/* Logout */}
            <div className="border-t border-gray-100">
              <button
                onClick={() => {
                  logout();
                  setProfileOpen(false);
                }}
                className="w-full flex items-center gap-3 px-5 py-3.5 text-[13px] font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
