import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Button from '../ui/Button';

/**
 * BookCTA — call-to-action section with dramatic scroll-triggered reveal,
 * scale entrance on heading, and pulsing CTA button.
 */
export default function BookCTA() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      id="book"
      className="w-screen pt-28 pb-20 px-8 md:px-16 lg:px-24 bg-book-bg border-t border-glass/20 relative transition-colors duration-500 flex flex-col justify-center items-center overflow-hidden"
      aria-label="Book a session"
    >
      {/* Decorative radial glow behind CTA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 0.15, scale: 1 } : {}}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(164, 194, 168, 0.25) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-3xl mx-auto flex flex-col items-center gap-6 text-center relative z-10">
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-syne text-xs tracking-[0.3em] text-text-muted uppercase"
        >
          Ready for your new standard?
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.4, 0.25, 1] }}
          className="font-serif text-5xl md:text-6xl lg:text-7xl font-light leading-tight text-text-primary transition-colors duration-500"
        >
          Book your session and <br />
          <span className="italic text-sage font-normal">feel the difference.</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <Button
            to="/search"
            variant="primary"
            className="mt-6 px-10"
          >
            BOOK YOUR SESSION
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
