import { useState, useCallback, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import SectionHeader from '../ui/SectionHeader';

const CARD_WIDTH = 340;
const CARD_GAP = 32;
const CARD_STEP = CARD_WIDTH + CARD_GAP;
const INITIAL_INDEX = 2;
const SWIPE_THRESHOLD = 50;

const galleryImages = [
  { url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800', title: 'Minimalist Interior' },
  { url: 'https://images.unsplash.com/photo-1580618672591-27f8c2d14609?auto=format&fit=crop&q=80&w=800', title: 'Premium Care' },
  { url: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=800', title: 'Expert Styling' },
  { url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=800', title: 'Precision Cuts' },
  { url: 'https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?auto=format&fit=crop&q=80&w=800', title: 'Spa & Wellness' },
  { url: 'https://images.unsplash.com/photo-1516975080661-46bdf36f81c4?auto=format&fit=crop&q=80&w=800', title: 'Organic Products' },
  { url: 'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?auto=format&fit=crop&q=80&w=800', title: 'Tranquil Wash' },
  { url: 'https://images.unsplash.com/photo-1595476108010-b4f1bf538b30?auto=format&fit=crop&q=80&w=800', title: 'Premium Tools' }
];

/**
 * CarouselCard — reusable wrapper with entrance animation.
 */
function CarouselCard({ isActive, onClick, image, className = '', index = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      tabIndex={isActive ? 0 : -1}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className={`relative w-[85vw] sm:w-[340px] shrink-0 border p-2 rounded-3xl min-h-[460px] transition-all duration-500 cursor-pointer outline-none overflow-hidden group ${
        isActive
          ? 'scale-100 sm:scale-105 opacity-100 border-sage/60 shadow-[0_10px_35px_-10px_rgba(164,194,168,0.25)]'
          : 'scale-95 opacity-50 border-glass/40 hover:opacity-70'
      } ${className}`}
    >
      <div className="w-full h-full rounded-[20px] overflow-hidden relative">
        <img 
          src={image.url} 
          alt={image.title}
          className="w-full h-full object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
          <h3 className="text-white font-syne font-bold tracking-widest uppercase text-sm">{image.title}</h3>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * CardsCarousel — horizontal slider with staggered entrance
 */
export default function CardsCarousel() {
  const { isDarkMode } = useTheme();
  const [activeIndex, setActiveIndex] = useState(INITIAL_INDEX);
  const touchStartX = useRef(0);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const totalCards = galleryImages.length;

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? totalCards - 1 : prev - 1));
  }, [totalCards]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev === totalCards - 1 ? 0 : prev + 1));
  }, [totalCards]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      delta > 0 ? handleNext() : handlePrev();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); handlePrev(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); handleNext(); }
  };

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className={`w-screen min-h-screen py-24 ${isDarkMode ? 'bg-canvas' : 'bg-[#cddcd0]'} flex flex-col justify-center relative overflow-hidden transition-colors duration-500`}
      aria-label="Salon Gallery"
    >
      {/* Section Header with scroll reveal */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
      >
        <SectionHeader label="OUR SANCTUARY" centered className="mb-4 z-10">
          The Minta Experience.
        </SectionHeader>
      </motion.div>

      {/* Navigation Arrows with fade-in */}
      <motion.button
        onClick={handlePrev}
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="absolute left-4 md:left-8 z-30 border border-glass bg-white/50 backdrop-blur-md text-[#1a3d1f] hover:bg-sage hover:text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg cursor-pointer select-none top-[60%] -translate-y-1/2"
        aria-label="Previous card"
      >
        <span className="font-syne font-bold text-lg" aria-hidden="true">←</span>
      </motion.button>

      <motion.button
        onClick={handleNext}
        initial={{ opacity: 0, x: 20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="absolute right-4 md:right-8 z-30 border border-glass bg-white/50 backdrop-blur-md text-[#1a3d1f] hover:bg-sage hover:text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg cursor-pointer select-none top-[60%] -translate-y-1/2"
        aria-label="Next card"
      >
        <span className="font-syne font-bold text-lg" aria-hidden="true">→</span>
      </motion.button>

      {/* Carousel Track */}
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Image Gallery"
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-full flex justify-center items-center py-10 overflow-hidden min-h-[500px]"
      >
        <div
          className="flex gap-8 transition-transform duration-500 ease-out shrink-0"
          style={{
            transform: `translateX(${(INITIAL_INDEX - activeIndex) * CARD_STEP}px)`,
          }}
        >
          {galleryImages.map((img, index) => (
             <CarouselCard 
                key={index}
                isActive={activeIndex === index} 
                onClick={() => setActiveIndex(index)} 
                image={img}
                index={index}
                className={isDarkMode ? 'bg-card-bg' : 'bg-white'} 
              />
          ))}
        </div>
      </div>
    </section>
  );
}
