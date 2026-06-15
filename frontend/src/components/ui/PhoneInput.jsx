import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

const countries = [
  { code: 'US', dialCode: '+1', maxLength: 10, label: 'US (+1)', iso: 'us' },
  { code: 'IN', dialCode: '+91', maxLength: 10, label: 'IN (+91)', iso: 'in' },
  { code: 'UK', dialCode: '+44', maxLength: 10, label: 'GB (+44)', iso: 'gb' },
  { code: 'AU', dialCode: '+61', maxLength: 9, label: 'AU (+61)', iso: 'au' },
];

const PhoneInput = forwardRef(({ className, label, error, value, onChange, ...props }, ref) => {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    if (value && value.length > country.maxLength) {
      if (onChange) onChange(value.slice(0, country.maxLength));
    }
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= selectedCountry.maxLength) {
      if (onChange) onChange(val);
    }
  };

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-syne font-bold text-[#1a3d1f]">
          {label}
        </label>
      )}
      <div className={cn(
        "flex w-full rounded-xl border border-[#d8eedd] bg-white transition-all duration-200 focus-within:ring-2 focus-within:ring-[#4a9e5c] focus-within:border-transparent overflow-visible",
        error && "border-red-500 focus-within:ring-red-500",
        className
      )}>
        {/* Custom Country Code Selector */}
        <div className="relative border-r border-[#d8eedd]" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="h-12 w-[110px] flex items-center justify-between bg-[#fcfdfc] hover:bg-[#f4f9f5] transition-colors rounded-l-xl px-3 focus:outline-none"
            aria-haspopup="listbox"
            aria-expanded={isDropdownOpen}
          >
            <div className="flex items-center gap-2">
              <div className="w-5 h-4 overflow-hidden rounded-[2px] shadow-sm flex-shrink-0">
                <img 
                  src={`https://flagcdn.com/w20/${selectedCountry.iso}.png`} 
                  alt={selectedCountry.code}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm font-syne font-semibold text-[#5a8c63]">
                {selectedCountry.code}
              </span>
            </div>
            <ChevronDown 
              size={14} 
              className={cn("text-[#7aaa84] transition-transform duration-200", isDropdownOpen && "rotate-180")} 
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <ul 
              className="absolute top-[calc(100%+8px)] left-0 w-[160px] bg-white border border-[#d8eedd] rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
              role="listbox"
            >
              {countries.map(c => (
                <li 
                  key={c.code} 
                  role="option"
                  aria-selected={selectedCountry.code === c.code}
                  onClick={() => handleCountrySelect(c)}
                  className={cn(
                    "px-4 py-3 text-sm font-syne font-medium flex items-center gap-3 cursor-pointer transition-colors",
                    selectedCountry.code === c.code 
                      ? "bg-[#e8f5ea] text-[#0b5c3b]" 
                      : "text-[#5a8c63] hover:bg-[#f4f9f5] hover:text-[#1a3d1f]"
                  )}
                >
                  <div className="w-5 h-4 overflow-hidden rounded-[2px] shadow-sm flex-shrink-0">
                    <img 
                      src={`https://flagcdn.com/w20/${c.iso}.png`} 
                      alt={c.code}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {c.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Phone Number Input */}
        <input
          type="tel"
          value={value || ''}
          onChange={handlePhoneChange}
          placeholder="000 000 0000"
          className="flex-1 w-full h-12 bg-transparent px-4 py-2 text-sm font-syne text-[#1a3d1f] focus:outline-none placeholder:text-[#a0c2a8] rounded-r-xl"
          ref={ref}
          {...props}
        />
      </div>
      {error && (
        <span className="text-xs font-syne text-red-500 mt-0.5">{error}</span>
      )}
    </div>
  );
});

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
