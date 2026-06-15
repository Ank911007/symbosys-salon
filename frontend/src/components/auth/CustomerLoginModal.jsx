import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Portal } from '../ui/Portal';
import { Input } from '../ui/Input';
import { PhoneInput } from '../ui/PhoneInput';
import { useCheckPhone, useVerifyOtp, useCompleteProfile } from '../../hooks/useMutations';
import { useAuth } from '../../context/AuthContext';

export default function CustomerLoginModal({ isOpen, onClose }) {
  // Steps: 1 (Phone), 2 (OTP), 3 (Profile)
  const [step, setStep] = useState(1);
  
  // Form State
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  
  // Temp token from OTP step
  const [tempToken, setTempToken] = useState(null);

  // Hooks & Mutations
  const { login } = useAuth();
  const checkPhoneMutation = useCheckPhone();
  const verifyOtpMutation = useVerifyOtp();
  const completeProfileMutation = useCompleteProfile();

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setPhone('');
        setOtp('');
        setName('');
        setEmail('');
        setGender('');
        setTempToken(null);
      }, 300);
    }
  }, [isOpen]);

  // Handle escape key
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

  if (!isOpen) return null;

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (!phone || phone.length < 9) {
      toast.error('Please enter a valid phone number.');
      return;
    }

    checkPhoneMutation.mutate(
      { phone },
      {
        onSuccess: (res) => {
          if (res.data.isNew) {
            toast.success(res.message);
            setStep(2);
          } else {
            // Existing customer logged in
            login(res.data.customer, res.data.token, 'customer');
            toast.success('Welcome back!');
            onClose();
          }
        },
        onError: (err) => {
          toast.error(err.message || 'Failed to check phone number.');
        }
      }
    );
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      toast.error('Please enter a valid 6-digit OTP.');
      return;
    }

    verifyOtpMutation.mutate(
      { phone, otp },
      {
        onSuccess: (res) => {
          setTempToken(res.data.tempToken);
          toast.success('Phone verified!');
          setStep(3);
        },
        onError: (err) => {
          toast.error(err.message || 'Invalid OTP.');
        }
      }
    );
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (!name || !gender) {
      toast.error('Name and gender are required.');
      return;
    }

    completeProfileMutation.mutate(
      { tempToken, name, email, gender },
      {
        onSuccess: (res) => {
          login(res.data.customer, res.data.token, 'customer');
          toast.success('Profile created successfully!');
          onClose();
        },
        onError: (err) => {
          toast.error(err.message || 'Failed to create profile.');
        }
      }
    );
  };

  const isPending = checkPhoneMutation.isPending || verifyOtpMutation.isPending || completeProfileMutation.isPending;

  return (
    <Portal>
      <AnimatePresence>
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
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
            className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden z-[10000]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#e8f5ea]">
              {step > 1 && step < 3 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="p-1.5 -ml-2 text-[#5a8c63] hover:bg-[#f0f7f1] rounded-full transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              <h2 className={`font-serif text-2xl text-[#1a3d1f] ${step === 1 ? '' : 'ml-2'}`}>
                {step === 1 ? 'Sign In / Register' : step === 2 ? 'Verify Phone' : 'Complete Profile'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 -mr-2 text-[#5a8c63] hover:bg-[#f0f7f1] rounded-full transition-colors focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {step === 1 && (
                <form onSubmit={handlePhoneSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-sm font-syne text-[#6aaa7a]">Enter your phone number to continue. If you don't have an account, we'll create one for you.</p>
                  </div>
                  
                  <PhoneInput 
                    label="Phone Number" 
                    value={phone}
                    onChange={(val) => setPhone(val)}
                    required
                    autoFocus
                  />

                  <button
                    type="submit"
                    disabled={isPending || !phone}
                    className="w-full bg-[#0b5c3b] text-white rounded-xl py-4 font-semibold font-syne tracking-wide hover:bg-[#08422a] active:bg-[#0b5c3b] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#0b5c3b]/20"
                  >
                    {isPending ? <Loader2 size={20} className="animate-spin" /> : 'Continue'}
                  </button>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handleOtpSubmit} className="space-y-6">
                  <div className="space-y-2 text-center">
                    <p className="text-sm font-syne text-[#6aaa7a]">We've sent a 6-digit code to</p>
                    <p className="font-syne font-bold text-[#1a3d1f] tracking-wider">+91 {phone}</p>
                    <p className="text-xs font-syne text-[#a4c2a8] mt-2">Test OTP: 123456</p>
                  </div>
                  
                  <Input 
                    label="One-Time Password" 
                    placeholder="123456" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    className="text-center text-xl tracking-[0.5em] font-bold"
                    maxLength={6}
                    autoFocus
                  />

                  <button
                    type="submit"
                    disabled={isPending || otp.length < 6}
                    className="w-full bg-[#0b5c3b] text-white rounded-xl py-4 font-semibold font-syne tracking-wide hover:bg-[#08422a] active:bg-[#0b5c3b] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#0b5c3b]/20"
                  >
                    {isPending ? <Loader2 size={20} className="animate-spin" /> : 'Verify Code'}
                  </button>
                </form>
              )}

              {step === 3 && (
                <form onSubmit={handleProfileSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <p className="text-sm font-syne text-[#6aaa7a]">Just a few more details to set up your account.</p>
                  </div>
                  
                  <Input 
                    label="Full Name" 
                    placeholder="e.g. Elena Gilbert" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoFocus
                  />

                  <Input 
                    label="Email Address (Optional)" 
                    type="email"
                    placeholder="elena@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <div className="space-y-1.5">
                    <label className="text-sm font-syne font-bold text-[#1a3d1f]">Gender</label>
                    <div className="flex gap-3">
                      {['female', 'male', 'other'].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setGender(g)}
                          className={`flex-1 py-3 px-4 rounded-xl border text-sm font-syne font-semibold capitalize transition-all ${
                            gender === g 
                              ? 'border-[#4a9e5c] bg-[#e8f5ea] text-[#1a3d1f]' 
                              : 'border-[#d8eedd] bg-white text-[#7aaa84] hover:bg-[#f7fbf7]'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isPending || !name || !gender}
                    className="w-full bg-[#0b5c3b] text-white rounded-xl py-4 font-semibold font-syne tracking-wide hover:bg-[#08422a] active:bg-[#0b5c3b] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#0b5c3b]/20 mt-4"
                  >
                    {isPending ? <Loader2 size={20} className="animate-spin" /> : 'Complete Registration'}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    </Portal>
  );
}
