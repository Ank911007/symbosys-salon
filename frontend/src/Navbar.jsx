import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useTheme } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';
import { navLinks } from './data/services';
import { Link } from 'react-router-dom';
import { UserProfileDropdown } from './components/ui/UserProfileDropdown';
import CustomerLoginModal from './components/auth/CustomerLoginModal';

export default function Navbar() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, isAuthenticated, isCustomer, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { scrollY } = useScroll();

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);



  // Dynamically change border color opacity from 0 to 1 based on active theme
  const borderBottomColor = useTransform(
    scrollY,
    [0, 80],
    [
      isDarkMode ? 'rgba(255, 255, 255, 0)' : 'rgba(14, 17, 15, 0.05)',
      isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(14, 17, 15, 0.18)'
    ]
  );

  // Dynamic background blur/opacity increase for an ultra-premium feel
  const backdropFilter = useTransform(
    scrollY,
    [0, 80],
    ['blur(12px)', 'blur(24px)']
  );
  
  const backgroundColor = useTransform(
    scrollY,
    [0, 80],
    [
      isDarkMode ? 'rgba(5, 7, 6, 0.4)' : 'rgba(215, 222, 217, 0.65)',
      isDarkMode ? 'rgba(5, 7, 6, 0.75)' : 'rgba(215, 222, 217, 0.9)'
    ]
  );



  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 transition-all duration-300 border-b border-glass"
        style={{
          borderBottomColor,
          backdropFilter,
          backgroundColor,
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Left: Brand logo */}
        <div className="flex items-center">
          <Link
            to="/"
            className="font-syne font-bold tracking-[0.22em] text-text-primary text-base md:text-lg transition-opacity hover:opacity-80"
            aria-label="MINTA — Home"
          >
            MINTA
          </Link>
        </div>

        {/* Center Nav Links (Desktop) - Styled exactly like the Zen Capsule Navbar */}
        <div className="hidden md:flex items-center bg-black/20 dark:bg-white/5 border border-white/5 dark:border-white/10 rounded-full px-8 py-2.5 backdrop-blur-md shadow-inner gap-8 lg:gap-12">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="font-syne text-xs lg:text-sm tracking-[0.22em] font-medium text-text-muted hover:text-text-primary transition-all duration-300"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Right: Theme toggle + Profile/Book Now */}
        <div className="flex items-center gap-4 md:gap-6">
          <span 
            className="hidden lg:inline-block font-syne text-[11px] lg:text-xs tracking-[0.22em] font-medium text-text-muted/80 uppercase"
            style={{ fontVariant: 'small-caps' }}
          >
            Beauty for easy life
          </span>

          {/* Glassmorphic Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 md:p-3 rounded-full border border-glass bg-canvas/30 backdrop-blur-md text-text-primary hover:scale-[1.08] hover:bg-sage hover:text-canvas active:scale-95 transition-all duration-300 shadow-md cursor-pointer flex items-center justify-center z-50"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              // Sun Icon for Light Mode option
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 md:w-4.5 h-4.5 transition-transform duration-500 rotate-0 hover:rotate-45"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
            ) : (
              // Moon Icon for Dark Mode option
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 md:w-4.5 h-4.5 transition-transform duration-500 -rotate-12 hover:rotate-0"
                aria-hidden="true"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            )}
          </button>

          {/* Profile Dropdown (authenticated) or Book Now (unauthenticated) */}
          <UserProfileDropdown />

          {/* Hamburger Menu Toggle (Mobile) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex flex-col justify-between w-5 h-4 md:hidden focus:outline-none z-50 cursor-pointer"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-nav-overlay"
          >
            <motion.span
              animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full h-[1.5px] bg-text-primary block rounded-full"
            />
            <motion.span
              animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.1 }}
              className="w-full h-[1.5px] bg-text-primary block rounded-full"
            />
            <motion.span
              animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full h-[1.5px] bg-text-primary block rounded-full"
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Fullscreen Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-nav-overlay"
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-canvas/98 px-6 py-24 md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            <div className="flex flex-col gap-6 mt-12">
              {navLinks.map((link, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                  key={link.name}
                >
                  <a
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="font-syne text-2xl tracking-widest text-text-muted hover:text-text-primary transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col gap-6"
            >
              {isAuthenticated && isCustomer ? (
                <>
                  {/* Mobile Profile Info */}
                  <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-glass">
                    {user?.gender === 'female' ? (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {(user?.name || user?.phone || '?')[0].toUpperCase()}
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#3b7d4a] to-[#2d5a34] flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {(user?.name || user?.phone || '?')[0].toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-text-primary truncate">{user?.name || 'Guest'}</p>
                      <p className="text-xs text-text-muted truncate">+91 {user?.phone}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="w-full text-center bg-red-500/10 text-red-600 font-syne font-bold text-xs py-4 rounded-full border border-red-200"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <span className="font-syne text-xs tracking-[0.2em] text-text-muted uppercase">
                    Beauty for easy life
                  </span>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setLoginModalOpen(true);
                    }}
                    className="w-full text-center text-text-primary border border-glass font-syne font-bold text-xs py-4 rounded-full shadow-sm hover:bg-white/5 transition-colors"
                  >
                    Sign In
                  </button>
                  <Link
                    to="/search"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center bg-sage text-[#0e110f] font-syne font-bold text-xs py-4 rounded-full shadow-lg"
                  >
                    Book Now
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <CustomerLoginModal 
        isOpen={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
      />
    </>
  );
}
