import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Button from '../ui/Button';

/**
 * MobileShowcase — Interactive iPhone mockup with scroll-triggered reveals,
 * floating phone animation, and staggered left-column entrance.
 */
export default function MobileShowcase() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-120px' });

  // Stagger variants for left column
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] },
    },
  };

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="w-screen h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24 bg-card-bg relative overflow-hidden transition-colors duration-500"
      aria-label="Gallery showcase"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">

        {/* Left: Staggered Typography Reveal */}
        <motion.div
          className="flex flex-col items-start gap-4"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <motion.span variants={itemVariants} className="font-syne text-[11px] tracking-[0.3em] text-text-muted uppercase mb-1">
            Digital Sanctuary
          </motion.span>
          <motion.h2 variants={itemVariants} className="font-serif text-5xl md:text-6xl lg:text-7xl font-light leading-[1.15] text-text-primary transition-colors duration-500">
            Your glow.<br />
            <span className="italic font-normal text-sage">Finally unlocked.</span>
          </motion.h2>
          <motion.p variants={itemVariants} className="font-syne text-sm md:text-base text-text-muted leading-relaxed max-w-lg mt-4">
            Treatments designed exclusively for your unique style. Seamless styling, silent booking, premium experience. Walk in stressed, walk out completely refreshed.
          </motion.p>
          <motion.div variants={itemVariants} className="mt-8">
            <Button href="#book" variant="outline">
              SELECT TREATMENT
            </Button>
          </motion.div>
        </motion.div>

        {/* Right: iPhone Mockup with float + reveal */}
        <div className="flex justify-center md:justify-end">
          <motion.div
            initial={{ opacity: 0, y: 80, rotateY: 8 }}
            animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            className="relative"
          >
            {/* Subtle floating animation */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              }}
            >
              <div
                className="relative w-[240px] h-[520px] md:w-[275px] md:h-[590px] lg:w-[305px] lg:h-[660px] bg-[#f4f6f4] border-[11px] border-[#161a18] rounded-[52px] shadow-[0_25px_65px_-15px_rgba(0,0,0,0.85)] p-5 flex flex-col gap-5 overflow-hidden transition-all duration-300"
                role="img"
                aria-label="MINTA mobile app preview showing member club and booking interface"
              >
                {/* Dynamic Island */}
                <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-28 h-5.5 bg-[#000] rounded-full border border-white/5 flex items-center justify-between px-3 z-20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1c3c2a] relative flex items-center justify-center">
                    <span className="w-0.5 h-0.5 rounded-full bg-[#4ade80]" />
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#0a0a0a]" />
                </div>

                {/* Status Bar */}
                <div className="mt-4 flex justify-between items-center px-2 text-[#161a18]/90 text-[9px] tracking-wider font-mono font-bold select-none z-10">
                  <span>MINTA.OS</span>
                  <div className="flex items-center gap-1.5">
                    <span>5G</span>
                    <span className="w-5 h-2.5 border border-[#161a18]/45 rounded-sm relative flex items-center p-[1px]">
                      <span className="w-3.5 h-full bg-[#161a18] rounded-2xs" />
                      <span className="absolute -right-[3px] w-[2px] h-[4px] bg-[#161a18]/45 rounded-r-xs" />
                    </span>
                  </div>
                </div>

                {/* Member Card */}
                <div className="bg-[#ffffff] border border-[#e2e6e3] rounded-[24px] p-5 flex flex-col gap-3.5 mt-2 shadow-sm transition-all duration-300">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-[#8fa893] font-bold tracking-[0.25em] uppercase">MEMBER CLUB</span>
                    <span className="text-[8px] text-[#5e6660] tracking-wider uppercase font-mono">Active</span>
                  </div>

                  <div className="h-[1px] bg-[#e8ece9] w-full" />

                  <span className="font-serif text-xl lg:text-2xl italic leading-tight text-[#161a18] mt-0.5">
                    Organic Glow <br />
                    Ritual
                  </span>
                  <p className="text-[11px] text-[#5e6660] leading-relaxed mt-0.5">
                    A curated bespoke treatment including raw botanical tea wash, hand-tailored style profile shape design, and customized hot oil hair spa.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2.5 mt-auto">
                  <div className="w-full h-11 bg-[#161a18] text-white rounded-xl flex items-center justify-center font-syne font-bold text-[10px] tracking-[0.18em] shadow-md cursor-pointer hover:bg-sage hover:text-canvas transition-colors duration-300">
                    BOOK PACKAGE
                  </div>
                  <div className="w-full h-11 border border-[#161a18]/25 text-[#161a18]/80 rounded-xl flex items-center justify-center font-syne text-[10px] tracking-[0.18em] hover:text-[#161a18] hover:border-[#161a18] transition-all duration-300 cursor-pointer">
                    GO BACK
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
