import React from 'react';
import { motion } from 'framer-motion';

export default function ServiceBlock({ title, description, image, align = 'left', index = 0 }) {
  const isLeft = align === 'left';

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 relative">
      <div className="grid grid-cols-1 md:grid-cols-12 items-center">
        
        {/* Image Container */}
        <motion.div 
          className={`relative z-20 md:row-start-1 ${
            isLeft 
              ? 'md:col-start-1 md:col-end-6 order-1' 
              : 'md:col-start-8 md:col-end-13 order-1 md:order-2'
          }`}
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="aspect-[4/5] md:aspect-[3/4] overflow-hidden shadow-2xl relative bg-[#EAE0D5]">
            <div 
              className="w-full h-full bg-fixed bg-cover bg-center"
              style={{ backgroundImage: `url(${image})` }}
              role="img"
              aria-label={title}
            />
          </div>
        </motion.div>

        {/* Text Container */}
        <motion.div 
          className={`bg-[#3B2F2F] text-white p-10 sm:p-14 md:py-24 z-10 flex flex-col justify-center mt-[-10%] md:mt-0 md:row-start-1 shadow-xl ${
            isLeft 
              ? 'md:col-start-5 md:col-end-13 md:pl-28 lg:pl-40 order-2' 
              : 'md:col-start-1 md:col-end-9 md:pr-28 lg:pr-40 order-2 md:order-1'
          }`}
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <div className={`max-w-xl ${isLeft ? 'mr-auto' : 'ml-auto md:ml-12 lg:ml-24'}`}>
            <motion.h3 
              className="text-2xl md:text-3xl font-syne tracking-widest uppercase font-bold mb-6 text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {title}
            </motion.h3>
            <motion.p 
              className="text-sm md:text-base font-serif text-[#EAE0D5] leading-relaxed mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {description}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <button className="border border-[#EAE0D5]/40 text-[#EAE0D5] font-syne text-xs tracking-[0.2em] uppercase py-3 px-8 hover:bg-[#FDFBF7] hover:text-[#3B2F2F] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#C19A6B] focus:ring-offset-2 focus:ring-offset-[#3B2F2F]">
                See More
              </button>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
