import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(({ className, label, options = [], error, placeholder, ...props }, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-syne font-bold text-[#1a3d1f]">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={cn(
            "flex h-12 w-full appearance-none rounded-xl border border-[#d8eedd] bg-white px-4 py-2 text-sm font-syne text-[#1a3d1f]",
            "transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-[#4a9e5c] focus:border-transparent",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          ref={ref}
          {...props}
        >
          {placeholder && <option value="" disabled hidden>{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown 
          size={16} 
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7aaa84] pointer-events-none" 
        />
      </div>
      {error && (
        <span className="text-xs font-syne text-red-500 mt-0.5">{error}</span>
      )}
    </div>
  );
});

Select.displayName = "Select";

export { Select };
