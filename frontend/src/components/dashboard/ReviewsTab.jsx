import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, CheckCircle, EyeOff, Eye } from 'lucide-react';
import { useUpdateReviewApproval } from '../../hooks/useMutations';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function ReviewsTab({ reviews }) {
  const queryClient = useQueryClient();
  const { mutate: updateApproval, isPending } = useUpdateReviewApproval();
  const [filter, setFilter] = useState('all'); // 'all', 'public', 'hidden'

  const handleToggleApproval = (reviewId, currentStatus) => {
    updateApproval(
      { reviewId, isApproved: !currentStatus },
      {
        onSuccess: () => {
          toast.success(`Review ${!currentStatus ? 'approved' : 'hidden'} successfully`);
          queryClient.invalidateQueries(['ownerSalon']);
        },
        onError: (err) => {
          toast.error(err.message || 'Failed to update review status');
        }
      }
    );
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div className="space-y-6">
        <h3 className="font-serif text-2xl text-[#1a3d1f]">Reviews</h3>
        <div className="text-center py-16 bg-white border border-[#d0ead4] rounded-2xl">
          <MessageSquare size={24} className="mx-auto text-[#7aaa84] mb-3" />
          <p className="text-[#7aaa84] font-syne text-sm">No reviews yet. Share your salon with customers to start getting feedback!</p>
        </div>
      </div>
    );
  }

  // Only calculate average rating based on APPROVED reviews for the UI summary
  const approvedReviews = reviews.filter(r => r.isApproved);
  const avgRating = approvedReviews.length > 0 
    ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length).toFixed(1)
    : "0.0";

  const filteredReviews = reviews.filter(r => {
    if (filter === 'public') return r.isApproved;
    if (filter === 'hidden') return !r.isApproved;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h3 className="font-serif text-2xl text-[#1a3d1f]">Reviews</h3>
          <p className="text-xs font-syne text-[#7aaa84] mt-1">{reviews.length} total • {approvedReviews.length} approved • {avgRating} avg rating</p>
        </div>
        <div className="flex items-center gap-1.5 bg-[#f0f7f1] px-4 py-2 rounded-full border border-[#c8e6cc]">
          <Star size={14} className="text-amber-500 fill-amber-500" />
          <span className="font-syne font-bold text-sm text-[#1a3d1f]">{avgRating}</span>
        </div>
      </div>

      <div className="flex gap-2 border-b border-[#e0f0e3] pb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-full text-sm font-syne font-semibold transition-colors ${
            filter === 'all' ? 'bg-[#1a3d1f] text-white' : 'bg-[#f0f7f1] text-[#4a9e5c] hover:bg-[#e0f0e3]'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('public')}
          className={`px-4 py-1.5 rounded-full text-sm font-syne font-semibold transition-colors ${
            filter === 'public' ? 'bg-[#1a3d1f] text-white' : 'bg-[#f0f7f1] text-[#4a9e5c] hover:bg-[#e0f0e3]'
          }`}
        >
          Public
        </button>
        <button
          onClick={() => setFilter('hidden')}
          className={`px-4 py-1.5 rounded-full text-sm font-syne font-semibold transition-colors flex items-center gap-1.5 ${
            filter === 'hidden' ? 'bg-[#1a3d1f] text-white' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
          }`}
        >
          Hidden
          {reviews.length - approvedReviews.length > 0 && (
            <span className="bg-amber-500 text-white text-[10px] px-1.5 rounded-full">
              {reviews.length - approvedReviews.length}
            </span>
          )}
        </button>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
        {filteredReviews.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-center py-10 bg-white border border-[#e0f0e3] rounded-2xl"
          >
            <p className="text-[#7aaa84] font-syne text-sm">No reviews found for this filter.</p>
          </motion.div>
        ) : (
          filteredReviews.map((review, idx) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
            className={`bg-white rounded-2xl p-5 border shadow-sm transition-all ${review.isApproved ? 'border-[#e0f0e3]' : 'border-amber-200 bg-amber-50/30'}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-syne font-bold text-sm text-[#1a3d1f]">{review.customers?.name || 'Anonymous'}</p>
                  {review.isApproved ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700">
                      <CheckCircle size={10} /> Public
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700">
                      <EyeOff size={10} /> Hidden
                    </span>
                  )}
                </div>
                <p className="text-[10px] font-syne text-[#7aaa84] mt-1">
                  {review.customers?.email} • {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-200'}
                    />
                  ))}
                </div>
                <button
                  onClick={() => handleToggleApproval(review.id, review.isApproved)}
                  disabled={isPending}
                  className={`text-xs font-syne font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors disabled:opacity-50 ${
                    review.isApproved 
                      ? 'text-red-600 hover:bg-red-50' 
                      : 'text-[#4a9e5c] hover:bg-[#e8f5ea]'
                  }`}
                >
                  {review.isApproved ? (
                    <>Hide Review</>
                  ) : (
                    <><Eye size={12} /> Approve</>
                  )}
                </button>
              </div>
            </div>
            {review.comment && (
              <p className={`text-sm font-syne leading-relaxed italic ${review.isApproved ? 'text-[#2d5a34]' : 'text-[#5a8c63]'}`}>"{review.comment}"</p>
            )}
          </motion.div>
        ))
        )}
        </AnimatePresence>
      </div>
    </div>
  );
}
