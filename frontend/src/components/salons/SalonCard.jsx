import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, ArrowUpRight } from 'lucide-react';

export default function SalonCard({ salon, index = 0 }) {
  const handleCardClick = () => {
    if (salon.website) window.open(salon.website, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-white rounded-[2rem] overflow-hidden border border-[#EAE0D5] hover:border-[#C19A6B] transition-all cursor-pointer relative shadow-sm hover:shadow-xl flex flex-col h-full"
      onClick={handleCardClick}
    >
      <div className="relative h-56 md:h-64 overflow-hidden bg-[#FDFBF7]">
        <img 
          src={salon.image} 
          alt={salon.name} 
          className="w-full h-full object-cover opacity-95 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
          loading="lazy"
        />
        
        {/* Badges Overlay */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
          <div 
            className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm"
            aria-label={`Rating ${salon.rating} out of 5, ${salon.reviews} reviews`}
          >
            <Star size={12} className="text-[#C19A6B] fill-[#C19A6B]" aria-hidden="true" />
            <span className="text-[#3B2F2F] text-xs font-syne font-bold">{salon.rating}</span>
            <span className="text-[#8C7A6B] text-[10px] font-syne">({salon.reviews})</span>
          </div>
          
          <div className="flex flex-col gap-2 items-end">
            <span className="bg-white/95 backdrop-blur-md text-[#3B2F2F] font-syne text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-full shadow-sm">
              {salon.priceLevel}
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-6 md:p-8 flex-grow flex flex-col justify-between">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-[#8C7A6B] mb-3" aria-hidden="true">
            <MapPin size={14} />
            <span className="font-syne text-[10px] tracking-widest uppercase">{salon.city || salon.address}</span>
          </div>
          
          <h3 className="font-serif text-3xl text-[#3B2F2F] group-hover:text-[#C19A6B] transition-colors line-clamp-1">{salon.name}</h3>
          
          {salon.reviewSnippet && (
            <p className="font-syne text-sm text-[#8C7A6B] mt-2 line-clamp-2 leading-relaxed">
              "{salon.reviewSnippet}"
            </p>
          )}
        </div>

        <div>
          {salon.features && salon.features.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6" aria-label="Salon Features">
              {salon.features.slice(0, 3).map((feature, i) => (
                <span key={i} className="text-[9px] font-syne uppercase tracking-wider bg-[#FDFBF7] text-[#8C7A6B] px-3 py-1.5 rounded-full border border-[#EAE0D5]">
                  {feature}
                </span>
              ))}
              {salon.features.length > 3 && (
                <span className="text-[9px] font-syne uppercase tracking-wider bg-transparent text-[#8C7A6B] px-3 py-1.5 rounded-full" aria-label={`And ${salon.features.length - 3} more features`}>
                  +{salon.features.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t border-[#EAE0D5]">
            <span className="font-syne font-bold text-[#3B2F2F] text-xs tracking-widest uppercase">
              {salon.distance ? `${salon.distance} km away` : 'Book Now'}
            </span>
            <button 
              className="flex items-center gap-2 text-[10px] font-syne font-bold tracking-[0.2em] uppercase text-[#3B2F2F] hover:text-[#C19A6B] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C19A6B] rounded-sm p-1"
              aria-label={`View website for ${salon.name}`}
            >
              View Website <ArrowUpRight size={14} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
