import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, ArrowUpRight, Navigation } from 'lucide-react';
import ReviewModal from './ReviewModal';

/**
 * SalonResultCard
 *
 * Props:
 *  - salon         {object}  Salon data object
 *  - index         {number}  Index in list, used for stagger animation
 *  - isAdminMode   {boolean} If true, hides review/booking actions
 *
 * Designed for the SearchResults page with the light-green / white palette.
 */
export default function SalonResultCard({ salon, index = 0, onHover, isAdminMode = false }) {
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (isAdminMode) return;
    navigate(`/book/${salon.id}`, { state: { salon } });
  };

  const handleKeyDown = (e) => {
    if (isAdminMode) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  const hasDistance = typeof salon.distance === 'number';

  return (
    <>
      <motion.article
        layout
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4, delay: Math.min(index * 0.07, 0.42) }}
        whileHover={{ y: -4 }}
        className={`group bg-white rounded-[1.75rem] overflow-hidden border border-[#d8eedd] transition-all duration-300 flex flex-col h-full shadow-[0_2px_16px_rgba(74,158,92,0.06)] hover:shadow-[0_12px_40px_rgba(74,158,92,0.14)] ${
          isAdminMode ? 'cursor-default' : 'cursor-pointer hover:border-[#4a9e5c] focus-within:border-[#4a9e5c] focus-within:ring-2 focus-within:ring-[#4a9e5c] focus-within:ring-offset-2'
        }`}
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        role="listitem"
        aria-label={`${salon.name}${hasDistance ? `, ${salon.distance} km away` : ''}`}
      >
        {/* ── Image ── */}
        <div className="relative h-52 md:h-56 overflow-hidden bg-[#e8f5ea]">
          <img
            src={salon.image}
            alt={`${salon.name} salon interior`}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
            loading="lazy"
            decoding="async"
          />

          {/* Green gradient overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-[rgba(29,74,37,0.25)] via-transparent to-transparent"
            aria-hidden="true"
          />

          {/* ─ Badges ─ */}
          <div className="absolute top-3.5 left-3.5 right-3.5 flex justify-between items-start z-10">
            {/* Rating */}
            <div
              className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm"
              aria-label={`Rating: ${salon.rating} stars from ${salon.reviews} reviews`}
            >
              <Star size={11} className="text-[#f5a623] fill-[#f5a623]" aria-hidden="true" />
              <span className="text-[#1a3d1f] text-xs font-syne font-bold">{salon.rating}</span>
              <span className="text-[#7aaa84] text-[10px] font-syne">({salon.reviews})</span>
            </div>

            {/* Category */}
            {salon.category && (
              <span className="bg-[#4a9e5c]/90 backdrop-blur-md text-white font-syne text-[10px] font-bold tracking-wider px-3 py-1.5 rounded-full shadow-sm">
                {salon.category}
              </span>
            )}
          </div>

          {/* Distance badge — bottom-left of image */}
          {hasDistance && (
            <div className="absolute bottom-3.5 left-3.5 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
              <Navigation size={11} className="text-[#4a9e5c]" aria-hidden="true" />
              <span className="text-[#1a3d1f] text-xs font-syne font-bold">{salon.distance} km</span>
            </div>
          )}
        </div>

        {/* ── Content ── */}
        <div className="p-5 md:p-6 flex-grow flex flex-col justify-between">
          <div className="mb-5 space-y-1.5">
            {/* Address */}
            <div className="flex items-center gap-1.5 text-[#7aaa84]" aria-hidden="true">
              <MapPin size={12} className="shrink-0" />
              <span className="font-syne text-[10px] tracking-widest uppercase truncate">
                {salon.city || salon.address}
              </span>
            </div>

            {/* Name */}
            <h3 className="font-serif text-[1.4rem] leading-tight text-[#1a3d1f] group-hover:text-[#4a9e5c] transition-colors duration-300 line-clamp-2">
              {salon.name}
            </h3>

            {/* Description or Review Snippet */}
            {salon.description ? (
              <p className="font-syne text-sm text-[#7aaa84] line-clamp-2 leading-relaxed mt-1.5" title={salon.description}>
                {salon.description}
              </p>
            ) : salon.reviewSnippet ? (
              <p className="font-syne text-sm text-[#7aaa84] line-clamp-2 italic leading-relaxed mt-1.5" title={`"${salon.reviewSnippet}"`}>
                &ldquo;{salon.reviewSnippet}&rdquo;
              </p>
            ) : null}

            {/* Website Link */}
            {salon.website && (
              <a 
                href={salon.website.startsWith('http') ? salon.website : `https://${salon.website}`} 
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex items-center gap-1 text-[11px] font-syne font-semibold text-[#4a9e5c] hover:text-[#2d5a34] transition-colors mt-2 relative z-20"
                onClick={e => e.stopPropagation()}
                aria-label={`Visit ${salon.name} website`}
              >
                Visit Website <ArrowUpRight size={12} aria-hidden="true" />
              </a>
            )}
          </div>

          {/* Feature tags */}
          {salon.features && salon.features.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4" aria-label="Features">
              {salon.features.slice(0, 3).map((feature, i) => (
                <span
                  key={i}
                  className="text-[9px] font-syne uppercase tracking-wider bg-[#f0f7f1] text-[#4a9e5c] px-2.5 py-1.5 rounded-full border border-[#c8e6cc]"
                >
                  {feature}
                </span>
              ))}
              {salon.features.length > 3 && (
                <span
                  className="text-[9px] font-syne uppercase tracking-wider text-[#7aaa84] px-2.5 py-1.5 rounded-full"
                  aria-label={`And ${salon.features.length - 3} more features`}
                >
                  +{salon.features.length - 3}
                </span>
              )}
            </div>
          )}

          {/* ── Footer row ── */}
          {!isAdminMode && (
            <div className="flex justify-between items-center pt-4 border-t border-[#e0f0e3]">
              <button
                tabIndex={0}
                onClick={(e) => { e.stopPropagation(); setIsReviewOpen(true); }}
                className="flex items-center gap-1.5 text-[10px] font-syne font-bold tracking-[0.18em] uppercase text-[#6aaa7a] hover:text-[#4a9e5c] transition-all duration-200 focus:outline-none"
                aria-label={`Leave a review for ${salon.name}`}
              >
                Review 
              </button>
              
              <button
                tabIndex={0}
                onClick={(e) => { e.stopPropagation(); handleCardClick(); }}
                className="flex items-center gap-1.5 text-[10px] font-syne font-bold tracking-[0.18em] uppercase text-[#4a9e5c] hover:text-[#2d5a34] bg-[#f0f7f1] hover:bg-[#e0f0e3] px-3 py-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c] group-hover:bg-[#e0f0e3]"
                aria-label={`Book ${salon.name} online`}
              >
                Book Now <ArrowUpRight size={12} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </motion.article>

      <ReviewModal 
        isOpen={isReviewOpen} 
        onClose={() => setIsReviewOpen(false)} 
        salon={salon} 
      />
    </>
  );
}
