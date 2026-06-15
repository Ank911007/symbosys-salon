import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Button from '../ui/Button';
import heroBg from '../../assets/hero_bg.png';

/**
 * WordReveal — animates each word staggered for cinematic heading effect.
 */
function WordReveal({ text, className = '', delay = 0 }) {
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            duration: 0.6,
            delay: delay + i * 0.08,
            ease: [0.25, 0.4, 0.25, 1],
          }}
          className="inline-block mr-[0.28em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

/**
 * HeroSection — Full-viewport hero with parallax background,
 * word-by-word heading reveal, animated badge, and CTA.
 */
export default function HeroSection() {
  const { isDarkMode } = useTheme();
  const sectionRef = useRef(null);

  // Parallax: background moves slower than scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);

  const heroSectionStyle = {
    backgroundColor: isDarkMode ? '#0e110f' : '#cddcd0',
  };

  const heroGradientStyle = {
    background: isDarkMode
      ? 'linear-gradient(to bottom, rgba(14, 17, 15, 0.85) 0%, rgba(14, 17, 15, 0) 100%)'
      : 'linear-gradient(to bottom, rgba(14, 17, 15, 0.75) 0%, rgba(14, 17, 15, 0) 100%)',
  };

  return (
    <section
      ref={sectionRef}
      style={heroSectionStyle}
      className="relative h-screen flex flex-col justify-between items-center text-center px-6 overflow-hidden transition-colors duration-500"
      aria-label="Hero"
    >
      {/* Parallax Background Image */}
      <motion.div
        className="absolute inset-0 bg-cover z-0 scale-110"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundPosition: 'center 22%',
          y: bgY,
        }}
        role="presentation"
      />
      {/* Gradient Overlay with scroll fade */}
      <motion.div
        style={{ ...heroGradientStyle, opacity: overlayOpacity }}
        className="absolute inset-0 z-0 transition-all duration-500"
      />

      {/* Top spacing to completely clear the fixed navbar */}
      <div className="h-32 md:h-40" />

      {/* Center Hero Content (Generous top margins) */}
      <div className="relative z-10 max-w-4xl flex flex-col items-center gap-6 mt-16 md:mt-24">
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-glass bg-canvas/30 backdrop-blur-md"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-sage animate-ping" />
          <span className="font-syne text-[10px] tracking-[0.25em] text-white/95 uppercase">
            Minta Simply Flows
          </span>
        </motion.div>

        {/* Word-by-Word Heading Reveal */}
        <h1 className="font-serif text-5xl md:text-7xl font-light leading-[1.1] text-white max-w-3xl">
          <WordReveal text="Beauty that works for you —" delay={0.3} />
          <br />
          <motion.span
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 1.0, ease: [0.25, 0.4, 0.25, 1] }}
            className="italic inline-block"
          >
            effortlessly.
          </motion.span>
        </h1>

        {/* CTA Button with delayed entrance */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.3, ease: [0.25, 0.4, 0.25, 1] }}
          className="mt-4"
        >
          <Button to="/nearby" variant="primary">
            BOOK YOUR SESSION
          </Button>
        </motion.div>
      </div>

      {/* Bottom Bar with slide-up reveal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.6 }}
        className="relative z-10 w-full max-w-7xl flex justify-between items-center py-10 border-t border-glass px-4 md:px-8 mt-auto text-left"
      >
        <span className="font-syne text-[10px] tracking-[0.25em] text-text-muted uppercase">
          Crafted For You
        </span>
        <span className="font-syne text-[10px] tracking-[0.2em] text-text-muted uppercase hidden sm:inline-block">
          Est. 2026
        </span>
      </motion.div>
    </section>
  );
}
