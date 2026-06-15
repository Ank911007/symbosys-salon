import React from 'react';
import { motion } from 'framer-motion';

export function RouteLoader() {
  return (
    <div className="flex-1 w-full min-h-[50vh] flex items-center justify-center bg-transparent">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="w-8 h-8 rounded-full border-2 border-transparent border-t-[#139a88] border-r-[#139a88]"
      />
    </div>
  );
}
