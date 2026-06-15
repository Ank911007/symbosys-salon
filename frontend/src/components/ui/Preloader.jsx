import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem('hasSeenPreloader');
    
    // If they've already seen it this session, don't show it again
    if (hasLoaded) {
      setIsLoading(false);
      return;
    }
    
    // Lock body scroll while loading
    document.body.style.overflow = 'hidden';
    
    const timer = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem('hasSeenPreloader', 'true');
      document.body.style.overflow = 'unset';
    }, 2000); // 2 second loading screen
    
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[999999] bg-[#1a1a1a] flex items-center justify-center"
        >
          <div className="relative flex items-center justify-center w-28 h-28">
            {/* Spinning minimalist ring */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
              className="absolute inset-0 rounded-full border-[1px] border-transparent border-t-white/30 border-b-white/30"
            />
            {/* Favicon Scissors */}
            <motion.img 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
              src="/favicon.svg" 
              alt="Loading..." 
              className="w-10 h-10 object-contain invert opacity-90"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
