import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { fetchRecentReviews } from '../../lib/api';

export default function GuestBook() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Poll for reviews every few seconds to reflect new submissions automatically without refreshing
  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await fetchRecentReviews();
        setReviews(data);
      } catch (error) {
        console.error("Failed to load reviews", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadReviews();
    const interval = setInterval(loadReviews, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading && reviews.length === 0) {
    return null; // Hide the section initially
  }

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-[#cfdfce] relative">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Left Column - Sticky Header */}
          <div className="lg:col-span-5 relative">
            <div className="lg:sticky lg:top-32">
              <span className="font-syne font-bold tracking-[0.25em] text-[#1a3d1f] uppercase text-[11px] mb-6 block">
                Guest Book
              </span>
              <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl text-[#0b1c0f] leading-[1.1] tracking-tight">
                What they <span className="text-[#8ab894] italic block mt-1">experience.</span>
              </h2>
              <div className="w-full h-[1px] bg-[#1a3d1f]/30 mt-12 mb-8 hidden lg:block" />
            </div>
          </div>

          {/* Right Column - Reviews List */}
          <div className="lg:col-span-7 relative">
            
            {/* Custom decorative scrollbar line (Optional visual flair from screenshot) */}
            <div className="hidden lg:block absolute -right-8 top-0 bottom-0 w-1 bg-[#b4cdb6] rounded-full opacity-50" />

            <div className="flex flex-col gap-6">
              {reviews.map((review, i) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="border border-[#1a3d1f]/30 rounded-3xl p-8 hover:bg-white/10 transition-colors"
                >
                  <div className="flex gap-1 mb-5">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        size={14}
                        className={index < review.rating ? "fill-[#8ab894] text-[#8ab894]" : "text-[#b4cdb6]"}
                      />
                    ))}
                  </div>
                  
                  <p className="font-serif text-xl md:text-2xl text-[#0b1c0f] leading-snug mb-8 italic">
                    "{review.comment}"
                  </p>
                  
                  <p className="font-syne font-semibold tracking-wide text-[#1a3d1f] text-sm">
                    {review.customers?.name || "Guest"}
                    {review.salon?.name && (
                      <span className="font-normal opacity-70 ml-2">
                        • {review.salon.name}
                      </span>
                    )}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
