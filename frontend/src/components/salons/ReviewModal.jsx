import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Loader2 } from 'lucide-react';
import { useSubmitReview } from '../../hooks/useMutations';
import { toast } from 'sonner';
import { Portal } from '../ui/Portal';
import { Input } from '../ui/Input';
import { PhoneInput } from '../ui/PhoneInput';
import { useAuth } from '../../context/AuthContext';

export default function ReviewModal({ isOpen, onClose, salon }) {
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  // Auto-fill and reset fields when modal opens
  useEffect(() => {
    if (isOpen) {
      if (user) {
        setName(user.name || '');
        setEmail(user.email || '');
        setPhone(user.phone || '');
      }
      setRating(0);
      setHoverRating(0);
      setComment('');
    }
  }, [isOpen, user]);

  const submitReviewMutation = useSubmitReview(salon?.id);

  // Handle escape key and scroll locking
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleEscape = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleEscape);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen || !salon) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a star rating.');
      return;
    }
    if (!name || !email) {
      toast.error('Please provide your name and email.');
      return;
    }

    submitReviewMutation.mutate(
      { name, email, phone, rating, comment },
      {
        onSuccess: () => {
          toast.success('Thank you for your review!');
          onClose();
        },
        onError: (err) => {
          toast.error(err.message || 'Failed to submit review.');
        }
      }
    );
  };

  return (
    <Portal>
      <AnimatePresence>
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0b5c3b]/50 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-[10000]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8f5ea] shrink-0">
              <h2 id="modal-title" className="font-serif text-2xl text-[#1a3d1f]">Review {salon.name}</h2>
              <button
                onClick={onClose}
                className="p-2 text-[#5a8c63] hover:bg-[#f0f7f1] rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#4a9e5c]"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Guest Details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-syne font-bold text-[#1a3d1f] border-b border-[#f0f7f1] pb-2">Your Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input 
                      label="Full Name" 
                      placeholder="e.g. Elena Gilbert" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required 
                    />
                    <Input 
                      label="Email Address" 
                      type="email" 
                      placeholder="elena@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                  <PhoneInput 
                    label="Phone Number (Optional)" 
                    value={phone}
                    onChange={(val) => setPhone(val)}
                  />
                </div>

                {/* Star Rating */}
                <div className="flex flex-col items-center space-y-3 pt-4 border-t border-[#f0f7f1]">
                  <span className="text-[#5a8c63] font-syne text-sm font-semibold tracking-wider uppercase">
                    How was your experience?
                  </span>
                  <div className="flex gap-2" role="radiogroup" aria-label="Star Rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        role="radio"
                        aria-checked={rating === star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="focus:outline-none focus:ring-2 focus:ring-[#4a9e5c] rounded-full p-1 transition-transform hover:scale-110 active:scale-95"
                      >
                        <Star
                          size={32}
                          className={`transition-colors ${
                            star <= (hoverRating || rating)
                              ? 'fill-[#f5a623] text-[#f5a623]'
                              : 'text-[#d0ead4]'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div className="space-y-2">
                  <label htmlFor="review-comment" className="text-[#1a3d1f] font-medium text-sm block">
                    Write a comment (optional)
                  </label>
                  <textarea
                    id="review-comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell others what you loved about this sanctuary..."
                    className="w-full bg-[#f7fbf7] border border-[#d8eedd] rounded-xl px-4 py-3 text-[#1a3d1f] placeholder:text-[#8ab894] focus:outline-none focus:ring-2 focus:ring-[#4a9e5c] focus:border-transparent transition-all resize-none h-28"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitReviewMutation.isPending}
                  className="w-full bg-[#0b5c3b] text-white rounded-xl py-4 font-semibold font-syne tracking-wide hover:bg-[#08422a] active:bg-[#0b5c3b] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#0b5c3b]/20"
                >
                  {submitReviewMutation.isPending ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Review'
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    </Portal>
  );
}
