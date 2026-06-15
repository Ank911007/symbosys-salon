import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, ChevronDown, Navigation, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

export default function HeroSearchBar({ groomingOptions = [], cityOptions = [], onSearch }) {
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setServiceDropdownOpen(false);
        setLocationDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = () => {
    // Navigate to /search with query params
    const params = new URLSearchParams();
    if (selectedService) params.set('service', selectedService);
    if (selectedLocation) params.set('city', selectedLocation);
    navigate(`/search?${params.toString()}`);
    if (onSearch) onSearch({ service: selectedService, location: selectedLocation });
  };

  const handleUseCurrentLocation = () => {
    if (!('geolocation' in navigator)) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      () => {
        setSelectedLocation('Current Location');
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  const filteredGroomingOptions = groomingOptions.filter(opt => opt.toLowerCase().includes(selectedService.toLowerCase()));
  const filteredCityOptions = cityOptions.filter(opt => opt.toLowerCase().includes(selectedLocation.toLowerCase()));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
      className="max-w-3xl mx-auto w-full space-y-3"
    >
      <div ref={searchRef} className="flex flex-col md:flex-row items-stretch bg-white/95 backdrop-blur-xl border border-[#EAE0D5] rounded-[2rem] p-2 gap-2 shadow-[0_8px_30px_rgba(140,122,107,0.1)] relative transition-colors duration-300">
        
        {/* Service Search Input */}
        <div 
          className="flex-1 relative flex items-center"
          onClick={() => { setServiceDropdownOpen(true); setLocationDropdownOpen(false); }}
        >
          <div className="pl-6 text-[#C19A6B]" aria-hidden="true">
            <Search size={18} />
          </div>
          <div className="w-full flex justify-between items-center pr-4">
            <input
              type="text"
              value={selectedService}
              onChange={(e) => {
                setSelectedService(e.target.value);
                setServiceDropdownOpen(true);
              }}
              placeholder="Haircut, Massage, Facial..."
              className="w-full bg-transparent border-none py-4 pl-4 text-sm font-syne text-[#3B2F2F] placeholder:text-[#8C7A6B] focus:outline-none focus:ring-0"
              aria-label="Search for grooming services"
              aria-expanded={serviceDropdownOpen}
              role="combobox"
              aria-controls="service-listbox"
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearchSubmit(); }}
            />
            <button 
              aria-label="Toggle service dropdown"
              className="focus:outline-none focus:ring-2 focus:ring-[#C19A6B] rounded-full p-1"
              onClick={(e) => {
                e.stopPropagation();
                setServiceDropdownOpen(!serviceDropdownOpen);
                setLocationDropdownOpen(false);
              }}
            >
              <ChevronDown 
                size={16} 
                className={`text-[#8C7A6B] transition-transform ${serviceDropdownOpen ? 'rotate-180' : ''}`} 
                aria-hidden="true"
              />
            </button>
          </div>
          
          <AnimatePresence>
            {serviceDropdownOpen && filteredGroomingOptions.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                id="service-listbox" 
                role="listbox" 
                className="absolute top-[calc(100%+0.5rem)] left-0 w-full bg-white/95 backdrop-blur-2xl border border-[#EAE0D5] rounded-2xl shadow-[0_8px_30px_rgba(140,122,107,0.15)] overflow-hidden z-50 max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#EAE0D5] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#C19A6B]/50 transition-colors"
              >
                {filteredGroomingOptions.map(option => (
                  <button 
                    key={option} 
                    role="option"
                    aria-selected={selectedService === option}
                    className={`w-full text-left px-6 py-3.5 text-sm font-syne transition-all duration-200 cursor-pointer flex items-center gap-3 ${selectedService === option ? 'bg-[#FDFBF7] text-[#C19A6B] pl-8 border-l-2 border-[#C19A6B]' : 'text-[#3B2F2F] hover:bg-[#FDFBF7] hover:text-[#C19A6B] hover:pl-8 border-l-2 border-transparent'} focus:bg-[#FDFBF7] focus:outline-none`}
                    onClick={(e) => { e.stopPropagation(); setSelectedService(option); setServiceDropdownOpen(false); }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40"></span>
                    {option}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="hidden md:block w-px bg-[#EAE0D5] my-3 transition-colors duration-300" aria-hidden="true"></div>
        
        {/* Location Search Input */}
        <div 
          className="flex-1 relative flex items-center"
          onClick={() => { setLocationDropdownOpen(true); setServiceDropdownOpen(false); }}
        >
          <div className="pl-6 text-[#C19A6B]" aria-hidden="true">
            <MapPin size={18} />
          </div>
          <div className="w-full flex justify-between items-center pr-4">
            <input
              type="text"
              value={selectedLocation}
              onChange={(e) => {
                setSelectedLocation(e.target.value);
                setLocationDropdownOpen(true);
              }}
              placeholder="City or Current Location"
              className="w-full bg-transparent border-none py-4 pl-4 text-sm font-syne text-[#3B2F2F] placeholder:text-[#8C7A6B] focus:outline-none focus:ring-0"
              aria-label="Search for location"
              aria-expanded={locationDropdownOpen}
              role="combobox"
              aria-controls="location-listbox"
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearchSubmit(); }}
            />
            <button
              aria-label="Toggle location dropdown"
              className="focus:outline-none focus:ring-2 focus:ring-[#C19A6B] rounded-full p-1"
              onClick={(e) => {
                e.stopPropagation();
                setLocationDropdownOpen(!locationDropdownOpen);
                setServiceDropdownOpen(false);
              }}
            >
              <ChevronDown 
                size={16} 
                className={`text-[#8C7A6B] transition-transform ${locationDropdownOpen ? 'rotate-180' : ''}`} 
                aria-hidden="true"
              />
            </button>
          </div>
          
          <AnimatePresence>
            {locationDropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                id="location-listbox" 
                role="listbox" 
                className="absolute top-[calc(100%+0.5rem)] left-0 w-full bg-white/95 backdrop-blur-2xl border border-[#EAE0D5] rounded-2xl shadow-[0_8px_30px_rgba(140,122,107,0.15)] overflow-hidden z-50 max-h-64 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#EAE0D5] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#C19A6B]/50 transition-colors"
              >
                {/* Use Current Location — always first */}
                <button
                  className="w-full text-left px-6 py-3.5 text-sm font-syne transition-all duration-200 cursor-pointer flex items-center gap-3 text-[#4a9e5c] hover:bg-[#f0f7f1] border-b border-[#EAE0D5] focus:outline-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUseCurrentLocation();
                    setLocationDropdownOpen(false);
                  }}
                  aria-label="Use my current location"
                >
                  {locating ? (
                    <Loader2 size={14} className="animate-spin shrink-0" aria-hidden="true" />
                  ) : (
                    <Navigation size={14} className="shrink-0" aria-hidden="true" />
                  )}
                  <span className="font-bold">{locating ? 'Detecting…' : 'Use Current Location'}</span>
                </button>

                {filteredCityOptions.map(option => (
                  <button 
                    key={option} 
                    role="option"
                    aria-selected={selectedLocation === option}
                    className={`w-full text-left px-6 py-3.5 text-sm font-syne transition-all duration-200 cursor-pointer flex items-center gap-3 ${selectedLocation === option ? 'bg-[#FDFBF7] text-[#C19A6B] pl-8 border-l-2 border-[#C19A6B]' : 'text-[#3B2F2F] hover:bg-[#FDFBF7] hover:text-[#C19A6B] hover:pl-8 border-l-2 border-transparent'} focus:bg-[#FDFBF7] focus:outline-none`}
                    onClick={(e) => { e.stopPropagation(); setSelectedLocation(option); setLocationDropdownOpen(false); }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40"></span>
                    {option}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <Button 
          onClick={handleSearchSubmit}
          className="w-full md:w-auto md:px-10 py-4 rounded-full bg-[#b8ceba] hover:bg-[#a4c2a8] text-[#161816] font-syne font-bold text-xs tracking-widest uppercase transition-colors"
        >
          SEARCH
        </Button>
      </div>

      {/* Use Current Location shortcut pill — below the bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center"
      >
        <button
          onClick={() => { handleUseCurrentLocation(); }}
          disabled={locating}
          className="flex items-center gap-2 px-5 py-2 bg-white/80 backdrop-blur-md border border-[#b8ceba] rounded-full text-xs font-syne font-bold text-[#3B2F2F] hover:bg-white hover:border-[#8aab8e] transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#C19A6B]"
          aria-label="Use my current location"
        >
          {locating ? (
            <Loader2 size={12} className="animate-spin text-[#4a9e5c]" aria-hidden="true" />
          ) : (
            <Navigation size={12} className="text-[#4a9e5c]" aria-hidden="true" />
          )}
          {locating ? 'Detecting location…' : 'Use my current location'}
        </button>
      </motion.div>
    </motion.div>
  );
}
