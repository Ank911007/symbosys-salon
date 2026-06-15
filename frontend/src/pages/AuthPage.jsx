import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff, Loader2, Store, Phone, MapPin, Globe, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { useLogin, useRegister } from '../hooks/useMutations';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import LocationPickerMap from '../components/LocationPickerMap';

export default function AuthPage() {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname !== '/register');
  const [showPassword, setShowPassword] = useState(false);
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register State (Salon Owner)
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  // Salon Details
  const [salonName, setSalonName] = useState('');
  const [salonAddress, setSalonAddress] = useState('');
  const [salonLocation, setSalonLocation] = useState(null);
  const [website, setWebsite] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageBase64, setImageBase64] = useState('');
  const fileInputRef = useRef(null);
  
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image must be less than 2MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendOtp = () => {
    if (!ownerEmail || !ownerPhone) {
      toast.error('Please enter email and phone first');
      return;
    }
    // MOCK OTP SIMULATION
    setOtpSent(true);
    toast.success('OTP sent! (For testing, use: 123456)', { duration: 5000 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const result = await loginMutation.mutateAsync({ email: loginEmail, password: loginPassword });
        const userData = result.data.user;
        const authToken = result.data.token;
        authLogin(userData, authToken);
        toast.success(result.message || 'Logged in successfully!');
        
        if (userData.role === 'ADMIN') navigate('/admin');
        else if (userData.role === 'SALON_OWNER') navigate('/dashboard');
        else navigate('/');
      } else {
        if (ownerPassword !== confirmPassword) {
          return toast.error('Passwords do not match');
        }
        if (!otpSent || !otp) {
          return toast.error('Please verify your email/phone with OTP');
        }
        if (!salonLocation) {
          return toast.error('Please mark your salon location on the map');
        }
        
        const payload = {
          name: ownerName,
          email: ownerEmail,
          phone: ownerPhone,
          password: ownerPassword,
          role: 'SALON_OWNER',
          otp,
          salonName,
          salonAddress,
          lat: salonLocation.lat,
          lng: salonLocation.lng,
          website,
          image: imageBase64,
        };

        const result = await registerMutation.mutateAsync(payload);
        const userData = result.data.user;
        const authToken = result.data.token;
        authLogin(userData, authToken);
        toast.success(result.message || 'Salon registered successfully!');
        
        navigate('/dashboard', { state: { isNewRegistration: true } });
      }
    } catch (err) {
      toast.error(err.message || 'Authentication failed');
    }
  };

  const isLoading = loginMutation.isPending || registerMutation.isPending;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12" style={{ background: 'linear-gradient(160deg, #e8f5ea 0%, #f7fbf7 40%, #ffffff 100%)' }}>
      
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-8 left-6 md:left-12"
      >
        <Link to="/" className="flex items-center gap-2 text-[#2d5a34] hover:text-[#4a9e5c] transition-colors font-syne font-bold tracking-widest text-xs uppercase">
          <ArrowLeft size={16} /> Back
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`w-full ${isLogin ? 'max-w-md' : 'max-w-2xl'} bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgba(74,158,92,0.12)] border border-[#e0f0e3] transition-all duration-300`}
      >
        {isLogin ? (
          <div className="mb-6 mt-2">
            <h1 className="text-[28px] font-bold text-gray-900 flex items-center gap-2">
              👋 Welcome Back!
            </h1>
          </div>
        ) : (
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl text-[#1a3d1f] mb-2">Register Your Salon</h1>
            <p className="text-[#6aaa7a] text-sm font-syne">Join Minta as a partner and grow your business.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Your Email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-[#f4f9f5] text-gray-800 placeholder-gray-500 text-[15px] font-medium rounded-2xl px-5 py-[18px] focus:outline-none focus:ring-1 focus:ring-[#3b7d4a] transition-all"
                  />
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-[#f4f9f5] text-gray-800 placeholder-gray-500 text-[15px] font-medium rounded-2xl pl-5 pr-12 py-[18px] focus:outline-none focus:ring-1 focus:ring-[#3b7d4a] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 transition-colors"
                  >
                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>
                
                <div className="flex justify-end pt-2">
                  <button type="button" className="text-[14px] font-medium text-[#3b7d4a] hover:underline">
                    Forgot Password?
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
              >
                {/* Left Column: Owner Details */}
                <div className="space-y-5">
                  <h3 className="font-serif text-lg text-[#2d5a34] border-b border-[#e0f0e3] pb-2">Owner Details</h3>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-syne font-bold tracking-wider text-[#2d5a34] uppercase">Full Name</label>
                    <div className="relative">
                      <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9abf9d]" />
                      <input
                        type="text"
                        placeholder="John Doe"
                        required
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        className="w-full bg-[#f7faf7] border border-[#c8e6cc] text-[#2d5a34] text-sm font-syne rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c] transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-syne font-bold tracking-wider text-[#2d5a34] uppercase">Email</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9abf9d]" />
                      <input
                        type="email"
                        placeholder="you@example.com"
                        required
                        value={ownerEmail}
                        onChange={(e) => setOwnerEmail(e.target.value)}
                        className="w-full bg-[#f7faf7] border border-[#c8e6cc] text-[#2d5a34] text-sm font-syne rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c] transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-syne font-bold tracking-wider text-[#2d5a34] uppercase">Phone</label>
                    <div className="relative flex gap-2">
                      <div className="relative flex-1">
                        <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9abf9d]" />
                        <input
                          type="tel"
                          placeholder="+1 234 567 8900"
                          required
                          value={ownerPhone}
                          onChange={(e) => setOwnerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          maxLength={10}
                          className="w-full bg-[#f7faf7] border border-[#c8e6cc] text-[#2d5a34] text-sm font-syne rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c] transition-all"
                        />
                      </div>
                      <button 
                        type="button" 
                        onClick={handleSendOtp}
                        className="bg-[#e8f5ea] text-[#4a9e5c] font-syne font-bold text-xs px-4 rounded-xl border border-[#c8e6cc] hover:bg-[#d0ead4] transition-colors whitespace-nowrap"
                      >
                        {otpSent ? 'Resend' : 'Send OTP'}
                      </button>
                    </div>
                  </div>

                  {otpSent && (
                    <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="text-xs font-syne font-bold tracking-wider text-[#2d5a34] uppercase">Enter OTP</label>
                      <div className="relative">
                        <CheckCircle2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9abf9d]" />
                        <input
                          type="text"
                          placeholder="123456"
                          required
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="w-full bg-[#f7faf7] border border-[#c8e6cc] text-[#2d5a34] text-sm font-syne rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c] transition-all"
                        />
                      </div>
                      <p className="text-[10px] text-[#6aaa7a] font-syne">For testing, use code: 123456</p>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-syne font-bold tracking-wider text-[#2d5a34] uppercase">Password</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9abf9d]" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        required
                        minLength={8}
                        value={ownerPassword}
                        onChange={(e) => setOwnerPassword(e.target.value)}
                        className="w-full bg-[#f7faf7] border border-[#c8e6cc] text-[#2d5a34] text-sm font-syne rounded-xl pl-11 pr-11 py-3 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c] transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-syne font-bold tracking-wider text-[#2d5a34] uppercase">Confirm Password</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9abf9d]" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        required
                        minLength={8}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-[#f7faf7] border border-[#c8e6cc] text-[#2d5a34] text-sm font-syne rounded-xl pl-11 pr-11 py-3 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c] transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column: Salon Details */}
                <div className="space-y-5">
                  <h3 className="font-serif text-lg text-[#2d5a34] border-b border-[#e0f0e3] pb-2">Salon Details</h3>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-syne font-bold tracking-wider text-[#2d5a34] uppercase">Salon Name</label>
                    <div className="relative">
                      <Store size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9abf9d]" />
                      <input
                        type="text"
                        placeholder="Luxe Cuts & Spa"
                        required
                        value={salonName}
                        onChange={(e) => setSalonName(e.target.value)}
                        className="w-full bg-[#f7faf7] border border-[#c8e6cc] text-[#2d5a34] text-sm font-syne rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c] transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-syne font-bold tracking-wider text-[#2d5a34] uppercase">Salon Address</label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-4 top-3 text-[#9abf9d]" />
                      <textarea
                        placeholder="123 Main St, City, Country"
                        required
                        rows={3}
                        value={salonAddress}
                        onChange={(e) => setSalonAddress(e.target.value)}
                        className="w-full bg-[#f7faf7] border border-[#c8e6cc] text-[#2d5a34] text-sm font-syne rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c] transition-all resize-none"
                      />
                    </div>
                  </div>

                  <LocationPickerMap position={salonLocation} onChange={setSalonLocation} />

                  <div className="space-y-1.5">
                    <label className="text-xs font-syne font-bold tracking-wider text-[#2d5a34] uppercase">Website (Optional)</label>
                    <div className="relative">
                      <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9abf9d]" />
                      <input
                        type="url"
                        placeholder="https://luxecuts.com"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="w-full bg-[#f7faf7] border border-[#c8e6cc] text-[#2d5a34] text-sm font-syne rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c] transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-syne font-bold tracking-wider text-[#2d5a34] uppercase">Salon Image (Optional)</label>
                    <div 
                      className="border-2 border-dashed border-[#c8e6cc] rounded-xl p-4 text-center cursor-pointer hover:bg-[#f7faf7] transition-colors relative"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                      />
                      {imageBase64 ? (
                        <div className="flex items-center gap-3">
                          <img src={imageBase64} alt="Preview" className="w-12 h-12 object-cover rounded-lg border border-[#e0f0e3]" />
                          <div className="flex flex-col items-start overflow-hidden">
                            <span className="text-sm font-syne font-bold text-[#2d5a34] truncate w-full">{imageFile?.name}</span>
                            <span className="text-xs text-[#6aaa7a]">Click to change</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-2">
                          <ImageIcon size={24} className="text-[#9abf9d] mb-2" />
                          <span className="text-sm font-syne text-[#2d5a34]">Click to upload storefront photo</span>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed ${
              isLogin 
                ? 'bg-[#3b7d4a] text-white font-medium text-[16px] rounded-2xl py-4 mt-8 hover:bg-[#2e633a] focus:ring-[#3b7d4a]' 
                : 'bg-[#4a9e5c] text-white font-syne font-bold text-xs tracking-widest uppercase rounded-xl py-4 mt-6 hover:bg-[#3d8a4f] focus:ring-[#4a9e5c]'
            }`}
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            {isLogin ? 'Login' : 'Register Salon'}
          </button>
        </form>

        <div className={`mt-8 text-center ${isLogin ? 'text-[15px]' : 'text-sm font-syne'} text-gray-800`}>
          {isLogin ? (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => setIsLogin(false)}
                className="text-[#3b7d4a] font-medium hover:underline focus:outline-none"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p className="text-[#6aaa7a]">
              Already a partner?{' '}
              <button
                onClick={() => setIsLogin(true)}
                className="text-[#4a9e5c] font-bold hover:underline focus:outline-none"
              >
                Log in
              </button>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
