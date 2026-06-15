import React, { useState, useRef, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Loader2, ArrowLeft, User, Phone as PhoneIcon } from 'lucide-react';
import { useCheckPhone, useVerifyOtp, useCompleteProfile } from '../../hooks/useMutations';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * EntryBookingModal — Multi-step phone login modal.
 * Step 1: Phone number input
 * Step 2: OTP verification (new users only)
 * Step 3: Profile completion (new users only)
 */
export function EntryBookingModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1); // 1=phone, 2=otp, 3=profile
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [tempToken, setTempToken] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');

  const otpRefs = useRef([]);
  const { login: authLogin } = useAuth();
  const checkPhoneMutation = useCheckPhone();
  const verifyOtpMutation = useVerifyOtp();
  const completeProfileMutation = useCompleteProfile();

  const isLoading = checkPhoneMutation.isPending || verifyOtpMutation.isPending || completeProfileMutation.isPending;

  // Focus first OTP input when step changes to 2
  useEffect(() => {
    if (step === 2 && otpRefs.current[0]) {
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    }
  }, [step]);

  // ─── Step 1: Check Phone ────────────────────────────────────────────
  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (phone.length < 10) {
      return toast.error('Please enter a valid 10-digit phone number');
    }

    try {
      const result = await checkPhoneMutation.mutateAsync({ phone });

      if (result.data.isNew) {
        // New user → go to OTP step
        toast.info('OTP sent! For testing, use: 123456', { duration: 5000 });
        setStep(2);
      } else {
        // Existing user → auto login
        const { customer, token } = result.data;
        authLogin(customer, token, 'customer');
        toast.success('Welcome back, ' + (customer.name || 'there') + '!');
        onClose();
      }
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    }
  };

  // ─── Step 2: Verify OTP ─────────────────────────────────────────────
  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const newOtp = pasted.split('');
      setOtp(newOtp);
      otpRefs.current[5]?.focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      return toast.error('Please enter the complete 6-digit OTP');
    }

    try {
      const result = await verifyOtpMutation.mutateAsync({ phone, otp: otpString });
      setTempToken(result.data.tempToken);
      toast.success('Phone verified!');
      setStep(3);
    } catch (err) {
      toast.error(err.message || 'Invalid OTP');
    }
  };

  // ─── Step 3: Complete Profile ───────────────────────────────────────
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      return toast.error('Please enter your name');
    }

    try {
      const result = await completeProfileMutation.mutateAsync({
        tempToken,
        phone,
        name: name.trim(),
        email: email.trim() || undefined,
        gender: gender || undefined,
      });
      const { customer, token } = result.data;
      authLogin(customer, token, 'customer');
      toast.success('Welcome to Minta, ' + customer.name + '!');
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to create profile');
    }
  };

  const slideVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      hideCloseButton={true}
      className="p-8 md:p-10 overflow-hidden bg-white max-w-md w-full rounded-3xl"
    >
      <div className="flex flex-col w-full min-h-[320px]">
        <AnimatePresence mode="wait">
          {/* ─── STEP 1: Phone Input ─────────────────────────────── */}
          {step === 1 && (
            <motion.div
              key="step-phone"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
            >
              <div className="mb-6 flex flex-col items-center">
                <div className="bg-[#eaf4fb] text-[#2c7a9c] text-[12px] font-bold px-5 py-2 rounded-full mb-5 tracking-wide uppercase">
                  WELCOME BACK
                </div>
                <h1 className="text-[28px] md:text-[32px] font-bold text-[#111827] text-center">
                  Log In to your Account
                </h1>
              </div>

              <form onSubmit={handlePhoneSubmit} className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[15px] font-medium text-[#4b5563]">Mobile Number</label>
                  <div className="flex w-full bg-[#f8fcf9] border border-[#3b7d4a] rounded-2xl overflow-hidden focus-within:ring-1 focus-within:ring-[#3b7d4a] transition-all h-[56px]">
                    <div className="flex items-center justify-center px-4 border-r border-[#3b7d4a] text-gray-900 font-semibold text-[15px] min-w-[72px]">
                      +91
                    </div>
                    <input
                      type="tel"
                      placeholder="Enter Here"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="flex-1 w-full bg-transparent text-gray-900 placeholder-[#9ca3af] text-[15px] font-medium px-4 focus:outline-none"
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || phone.length < 10}
                  className="w-full flex justify-center items-center gap-2 bg-[#3b7d4a] text-white font-medium text-[16px] rounded-2xl py-4 hover:bg-[#2e633a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3b7d4a] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading && <Loader2 size={16} className="animate-spin" />}
                  Continue
                </button>
              </form>
            </motion.div>
          )}

          {/* ─── STEP 2: OTP Verification ────────────────────────── */}
          {step === 2 && (
            <motion.div
              key="step-otp"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
            >
              <button
                onClick={() => { setStep(1); setOtp(['', '', '', '', '', '']); }}
                className="flex items-center gap-1.5 text-[#3b7d4a] text-sm font-medium mb-4 hover:underline"
              >
                <ArrowLeft size={16} /> Back
              </button>

              <div className="mb-6 text-center">
                <div className="w-16 h-16 bg-[#eaf4fb] rounded-full flex items-center justify-center mx-auto mb-4">
                  <PhoneIcon size={28} className="text-[#2c7a9c]" />
                </div>
                <h2 className="text-[24px] font-bold text-[#111827] mb-1">Verify your number</h2>
                <p className="text-[14px] text-[#6b7280]">
                  Enter the 6-digit code sent to <span className="font-semibold text-[#111827]">+91 {phone}</span>
                </p>
              </div>

              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div className="flex justify-center gap-2.5" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => otpRefs.current[i] = el}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-12 h-14 text-center text-xl font-bold border-2 border-[#d1d5db] rounded-xl bg-[#f9fafb] text-[#111827] focus:outline-none focus:border-[#3b7d4a] focus:ring-1 focus:ring-[#3b7d4a] transition-all"
                    />
                  ))}
                </div>

                <p className="text-center text-xs text-[#9ca3af]">
                  For testing, use code: <span className="font-bold text-[#3b7d4a]">123456</span>
                </p>

                <button
                  type="submit"
                  disabled={isLoading || otp.join('').length !== 6}
                  className="w-full flex justify-center items-center gap-2 bg-[#3b7d4a] text-white font-medium text-[16px] rounded-2xl py-4 hover:bg-[#2e633a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3b7d4a] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading && <Loader2 size={16} className="animate-spin" />}
                  Verify OTP
                </button>
              </form>
            </motion.div>
          )}

          {/* ─── STEP 3: Profile Completion ──────────────────────── */}
          {step === 3 && (
            <motion.div
              key="step-profile"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
            >
              <div className="mb-6 text-center">
                <div className="w-16 h-16 bg-[#e8f5ea] rounded-full flex items-center justify-center mx-auto mb-4">
                  <User size={28} className="text-[#3b7d4a]" />
                </div>
                <h2 className="text-[24px] font-bold text-[#111827] mb-1">Complete your profile</h2>
                <p className="text-[14px] text-[#6b7280]">
                  Just a few details to get started
                </p>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[14px] font-medium text-[#4b5563]">Full Name *</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#f4f9f5] text-gray-800 placeholder-gray-400 text-[15px] font-medium rounded-2xl px-5 py-[16px] focus:outline-none focus:ring-1 focus:ring-[#3b7d4a] border border-transparent focus:border-[#3b7d4a] transition-all"
                    autoFocus
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[14px] font-medium text-[#4b5563]">Email <span className="text-[#9ca3af]">(optional)</span></label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#f4f9f5] text-gray-800 placeholder-gray-400 text-[15px] font-medium rounded-2xl px-5 py-[16px] focus:outline-none focus:ring-1 focus:ring-[#3b7d4a] border border-transparent focus:border-[#3b7d4a] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[14px] font-medium text-[#4b5563]">Gender <span className="text-[#9ca3af]">(optional)</span></label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setGender('male')}
                      className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 font-medium text-[14px] transition-all ${
                        gender === 'male'
                          ? 'border-[#3b7d4a] bg-[#e8f5ea] text-[#3b7d4a]'
                          : 'border-[#e5e7eb] bg-[#f9fafb] text-[#6b7280] hover:border-[#9ca3af]'
                      }`}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="10" cy="14" r="7" />
                        <path d="M21 3l-5.5 5.5" />
                        <path d="M16 3h5v5" />
                      </svg>
                      Male
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('female')}
                      className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 font-medium text-[14px] transition-all ${
                        gender === 'female'
                          ? 'border-[#e91e8c] bg-[#fdf2f8] text-[#e91e8c]'
                          : 'border-[#e5e7eb] bg-[#f9fafb] text-[#6b7280] hover:border-[#9ca3af]'
                      }`}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="8" r="6" />
                        <path d="M12 14v7" />
                        <path d="M9 18h6" />
                      </svg>
                      Female
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !name.trim()}
                  className="w-full flex justify-center items-center gap-2 bg-[#3b7d4a] text-white font-medium text-[16px] rounded-2xl py-4 mt-2 hover:bg-[#2e633a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3b7d4a] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading && <Loader2 size={16} className="animate-spin" />}
                  Get Started
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
}
