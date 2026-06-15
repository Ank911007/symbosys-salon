import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CategoryCarousel({ categories }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="w-full px-4 md:px-8 py-12 -mt-10 relative z-20 transition-colors duration-300">
      <div className="relative group">
        <button 
          aria-label="Scroll left"
          onClick={() => scroll('left')}
          className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-white/90 backdrop-blur border border-[#EAE0D5] text-[#3B2F2F] shadow-xl hover:bg-[#FDFBF7] transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#C19A6B]"
        >
          <ChevronLeft size={24} aria-hidden="true" />
        </button>
        
        <div 
          ref={scrollRef}
          className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-2 md:px-4"
          role="list"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              role="listitem"
              tabIndex={0}
              className="flex-shrink-0 w-32 md:w-40 aspect-square rounded-[2rem] bg-white border border-[#EAE0D5] flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-[#FDFBF7] transition-all duration-300 focus-within:ring-2 focus-within:ring-[#C19A6B] focus-within:ring-offset-4 focus-within:ring-offset-[#FDFBF7] shadow-sm hover:shadow-md"
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-4xl" aria-hidden="true">{category.icon}</span>
              <span className="font-syne font-bold tracking-[0.2em] uppercase text-[10px] text-[#3B2F2F]">
                {category.name}
              </span>
            </motion.div>
          ))}
        </div>

        <button 
          aria-label="Scroll right"
          onClick={() => scroll('right')}
          className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-white/90 backdrop-blur border border-[#EAE0D5] text-[#3B2F2F] shadow-xl hover:bg-[#FDFBF7] transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#C19A6B]"
        >
          <ChevronRight size={24} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
