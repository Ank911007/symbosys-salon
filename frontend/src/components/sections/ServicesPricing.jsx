import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import StarRating from '../ui/StarRating';
import { services, testimonials } from '../../data/services';
import { fetchRecentReviews } from '../../lib/api';

/**
 * ServicesPricing — dual-column layout with scroll-reveal headings,
 * hover-animated service rows, and staggered testimonial cards.
 */
export default function ServicesPricing() {
  const { isDarkMode } = useTheme();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const sectionBg = isDarkMode ? 'bg-canvas' : 'bg-[#cddcd0]';
  const stickyBg = isDarkMode ? 'bg-canvas' : 'bg-[#cddcd0]';

  // Live reviews state
  const [realReviews, setRealReviews] = useState([]);

  useEffect(() => {
    const loadReviews = async () => {
      const data = await fetchRecentReviews();
      if (data && data.length > 0) {
        setRealReviews(data);
      }
    };
    
    loadReviews();
    const interval = setInterval(loadReviews, 3000); // Auto-update when new reviews are posted
    return () => clearInterval(interval);
  }, []);

  const displayReviews = realReviews.length > 0 
    ? realReviews.map(r => ({
        id: r.id,
        stars: r.rating,
        quote: `"${r.comment}"`,
        author: `${r.customers?.name || 'Guest'}${r.salon?.name ? ` • ${r.salon.name}` : ''}`
      }))
    : testimonials;

  return (
    <section
      ref={sectionRef}
      id="services"
      className={`w-screen h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24 ${sectionBg} transition-colors duration-500`}
      aria-label="Services and reviews"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">

        {/* Left Column: Services Menu */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
          className="h-[460px] lg:h-[520px] overflow-y-auto custom-scroll pr-4 relative"
          role="list"
          aria-label="Service menu"
        >
          <div className={`flex flex-col mb-6 sticky top-0 ${stickyBg} transition-colors duration-500 z-10 pb-4 border-b border-glass/40`}>
            <span className="font-syne text-xs tracking-[0.25em] text-text-muted uppercase">Service Menu</span>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-text-primary transition-colors duration-500 mt-1 tracking-wide">
              Confidence without <span className="italic text-sage font-normal">stress.</span>
            </h2>
          </div>

          <div className="flex flex-col gap-6 pt-2">
            {services.map((svc, idx) => (
              <motion.div
                key={svc.id}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + idx * 0.06 }}
                className="flex justify-between items-end border-b border-glass/50 pb-4 group cursor-pointer relative overflow-hidden"
                role="listitem"
              >
                {/* Hover accent line */}
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-sage group-hover:w-full transition-all duration-500 ease-out" />
                <div>
                  <h3 className="font-syne font-bold text-sm md:text-base lg:text-lg text-text-primary group-hover:text-sage transition-colors duration-300">
                    {svc.name}
                  </h3>
                  <p className="font-syne text-xs text-text-muted mt-2">{svc.desc}</p>
                </div>
                <span className="font-syne font-bold text-sm md:text-base lg:text-lg text-sage group-hover:translate-x-1 transition-transform duration-300">{svc.price}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Column: Guest Book / Reviews */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.4, 0.25, 1] }}
          className="h-[460px] lg:h-[520px] overflow-y-auto custom-scroll pr-4 relative"
          role="list"
          aria-label="Guest reviews"
        >
          <div className={`flex flex-col mb-6 sticky top-0 ${stickyBg} transition-colors duration-500 z-10 pb-4 border-b border-glass/40`}>
            <span className="font-syne text-xs tracking-[0.25em] text-text-muted uppercase">Guest Book</span>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-text-primary transition-colors duration-500 mt-1 tracking-wide">
              What they <span className="italic text-sage font-normal">experience.</span>
            </h2>
          </div>

          <div className="flex flex-col gap-5 pt-2">
            {displayReviews.map((t, idx) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + idx * 0.08 }}
                className="bg-card-bg border border-glass p-6 rounded-2xl flex flex-col gap-3 transition-all duration-500 hover:border-sage/40 hover:shadow-[0_4px_20px_-8px_rgba(164,194,168,0.2)] hover:-translate-y-0.5"
                role="listitem"
              >
                <StarRating rating={t.stars} />
                <p className="font-serif text-base lg:text-lg italic text-text-primary transition-colors duration-500 leading-relaxed">{t.quote}</p>
                <span className="font-syne text-xs lg:text-sm tracking-wider text-text-muted">{t.author}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
