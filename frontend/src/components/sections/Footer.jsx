import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';

/**
 * Footer — luxury footer with staggered column reveals and hover-animated links.
 */
export default function Footer() {
  const { isDarkMode } = useTheme();
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, margin: '-80px' });

  // Stagger config for columns
  const columnVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: i * 0.12,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  return (
    <footer
      ref={footerRef}
      className={`w-screen pt-20 pb-12 px-8 md:px-16 lg:px-24 ${isDarkMode ? 'bg-book-bg border-t border-glass/20' : 'bg-[#cddcd0]'} relative transition-colors duration-500`}
      role="contentinfo"
    >
      {/* Footer Grid */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 text-left items-start mb-16">

        {/* Column 1: Identity & Operating Hours */}
        <motion.div
          custom={0}
          variants={columnVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="flex flex-col gap-6"
        >
          <div className="flex items-center gap-3 bg-[#139a88] px-4 py-2.5 rounded shadow-sm w-max transition-transform hover:scale-[1.02] duration-300">
            <span className="font-sans text-white text-5xl leading-none font-light">M</span>
            <div className="flex flex-col justify-center h-full pt-1">
              <span className="font-sans font-bold text-white text-2xl leading-none tracking-[0.15em]">MINTA</span>
              <span className="font-sans text-white text-[0.6rem] leading-none tracking-[0.25em] mt-1.5">PREMIUM SALON</span>
            </div>
          </div>
          <p className="font-syne text-sm text-text-muted leading-relaxed">
            A sanctuary of editorial hair design, clean organic chemistry, and mindful quietude in Soho, New York.
          </p>
          <div className="flex flex-col gap-2 mt-2 w-full">
            <span className="font-syne font-bold text-xs tracking-widest text-text-primary uppercase mb-2 transition-colors duration-500">STUDIO HOURS</span>
            <div className="flex justify-between font-syne text-xs lg:text-sm text-text-muted border-b border-glass/10 pb-2">
              <span>Mon – Fri</span>
              <span>09:00 – 20:00</span>
            </div>
            <div className="flex justify-between font-syne text-xs lg:text-sm text-text-muted border-b border-glass/10 pb-2">
              <span>Sat</span>
              <span>10:00 – 18:00</span>
            </div>
            <div className="flex justify-between font-syne text-xs lg:text-sm text-text-muted pb-2">
              <span>Sun</span>
              <span className="text-sage font-bold">Closed</span>
            </div>
          </div>
        </motion.div>

        {/* Column 2: Contact & Location */}
        <motion.div
          custom={1}
          variants={columnVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="flex flex-col gap-6"
        >
          <span className="font-syne font-bold text-xs lg:text-sm tracking-widest text-text-primary uppercase transition-colors duration-500">CONTACT &amp; STUDIO</span>

          <div className="flex flex-col gap-4 font-syne text-sm text-text-muted">
            <div>
              <span className="block text-[10px] text-text-muted tracking-wider uppercase mb-1">TELEPHONE</span>
              <a href="tel:+12125550143" className="hover:text-text-primary transition-colors text-sm lg:text-base font-medium hover:translate-x-0.5 inline-block transition-transform duration-300">+1 (212) 555-0143</a>
            </div>
            <div>
              <span className="block text-[10px] text-text-muted tracking-wider uppercase mb-1">EMAIL ENQUIRIES</span>
              <a href="mailto:studio@mintasalon.com" className="hover:text-text-primary transition-colors text-sm lg:text-base font-medium hover:translate-x-0.5 inline-block transition-transform duration-300">studio@mintasalon.com</a>
            </div>
            <div>
              <span className="block text-[10px] text-text-muted tracking-wider uppercase mb-1">STUDIO ADDRESS</span>
              <span className="block text-sm lg:text-base">12 Mercer St, Soho,</span>
              <span className="block text-sm lg:text-base">New York, NY 10013</span>
            </div>
          </div>
        </motion.div>

        {/* Column 3: Careers & Social */}
        <motion.div
          custom={2}
          variants={columnVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="flex flex-col gap-6"
        >
          <span className="font-syne font-bold text-xs lg:text-sm tracking-widest text-text-primary uppercase transition-colors duration-500">CAREERS &amp; TALENT</span>

          <div className="flex flex-col gap-4 font-syne text-sm text-text-muted mb-2">
            <p className="leading-relaxed">
              We are always seeking bespoke talent to join our sanctuary.
            </p>
            <div className="flex flex-col gap-2 mt-1">
              <span className="text-xs font-bold text-text-primary uppercase tracking-wider transition-colors duration-500">Active Positions:</span>
              <span className="text-xs lg:text-sm font-medium text-text-muted">• Senior Texture Stylist (FT)</span>
              <span className="text-[12px] lg:text-[13px] font-medium text-text-muted">• Organic Color Specialist (PT)</span>
            </div>
            <a href="mailto:careers@mintasalon.com" className="text-sage font-bold hover:underline text-sm">careers@mintasalon.com</a>
          </div>

          <div className="flex flex-col gap-3 mt-2">
            <span className="font-syne font-bold text-[10px] tracking-widest text-text-primary uppercase transition-colors duration-500">CONNECT</span>
            <div className="flex gap-6">
              <a href="#" className="font-syne text-xs lg:text-sm text-text-muted hover:text-text-primary transition-all duration-300 hover:translate-x-0.5" aria-label="Follow MINTA on Instagram">Instagram</a>
              <a href="#" className="font-syne text-xs lg:text-sm text-text-muted hover:text-text-primary transition-all duration-300 hover:translate-x-0.5" aria-label="Follow MINTA on LinkedIn">LinkedIn</a>
              <a href="#" className="font-syne text-xs lg:text-sm text-text-muted hover:text-text-primary transition-all duration-300 hover:translate-x-0.5" aria-label="Follow MINTA on Pinterest">Pinterest</a>
            </div>
          </div>
        </motion.div>

        {/* Column 4: Map */}
        <motion.div
          custom={3}
          variants={columnVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="flex flex-col gap-6 w-full"
        >
          <span className="font-syne font-bold text-xs lg:text-sm tracking-widest text-text-primary uppercase transition-colors duration-500">EXACT LOCATION</span>
          <div className="relative w-full h-48 rounded-[20px] overflow-hidden border border-glass/40 shadow-xl group transition-all duration-300 hover:shadow-2xl hover:border-sage/30">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.316829774643!2d-74.00424562423985!3d40.719875571392095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2598a3c9f21ab%3A0xe979ad2c286bc41!2s12%20Mercer%20St%2C%20New%20York%2C%20NY%2010013!5e0!3m2!1sen!2sus!4v1716812836248!5m2!1sen!2sus"
              title="MINTA Salon Location — 12 Mercer St, Soho, New York"
              className={`absolute inset-0 w-full h-full border-0 grayscale ${isDarkMode ? 'invert opacity-70' : 'opacity-90'} group-hover:opacity-95 group-hover:grayscale-0 transition-all duration-700`}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </motion.div>
      </div>

      {/* Copyright Bar with fade-in */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="max-w-7xl mx-auto w-full border-t border-glass/30 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left"
      >
        <span className="font-syne text-xs lg:text-sm text-text-muted">© 2026 MINTA. ALL RIGHTS RESERVED.</span>
        <div className="flex gap-6">
          <a href="#" className="font-syne text-xs lg:text-sm text-text-muted hover:text-text-primary transition-all duration-300 hover:translate-x-0.5">Privacy Policy</a>
          <a href="#" className="font-syne text-xs lg:text-sm text-text-muted hover:text-text-primary transition-all duration-300 hover:translate-x-0.5">Terms of Service</a>
          <a href="#" className="font-syne text-xs lg:text-sm text-text-muted hover:text-text-primary transition-all duration-300 hover:translate-x-0.5">Support</a>
          <Link to="/about" className="font-syne text-xs lg:text-sm text-text-muted hover:text-text-primary transition-all duration-300 hover:translate-x-0.5">About Us</Link>
          <Link to="/contact" className="font-syne text-xs lg:text-sm text-text-muted hover:text-text-primary transition-all duration-300 hover:translate-x-0.5">Contact Us</Link>
        </div>
      </motion.div>
    </footer>
  );
}
