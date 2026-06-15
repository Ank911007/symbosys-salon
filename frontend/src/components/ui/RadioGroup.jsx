import React from 'react';
import { motion } from 'framer-motion';

/**
 * RadioGroup Component
 * A highly accessible, reusable, and production-grade Radio Group.
 * Follows WAI-ARIA best practices.
 *
 * @param {string} name - The name attribute for the radio inputs
 * @param {string} value - The currently selected value
 * @param {function} onChange - Callback when selection changes
 * @param {Array<{value: string, label: string, description?: string, icon?: React.ReactNode}>} options - The list of radio options
 * @param {string} [className] - Optional container class names
 */
export default function RadioGroup({ name, value, onChange, options, className = '' }) {
  return (
    <div 
      className={`grid gap-3 ${className}`} 
      role="radiogroup" 
      aria-label="Select an option"
    >
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <label
            key={option.value}
            className={`
              relative flex cursor-pointer rounded-xl border p-4 shadow-sm focus-within:ring-2 focus-within:ring-[#4a9e5c] transition-all duration-200
              ${isSelected ? 'bg-[#f0f7f1] border-[#4a9e5c]' : 'bg-[#f7faf7] border-[#c8e6cc] hover:bg-[#f0f7f1] hover:border-[#a4cfa8]'}
            `}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              className="sr-only" // Visually hidden but accessible to screen readers
              onChange={(e) => onChange(e.target.value)}
              checked={isSelected}
              aria-checked={isSelected}
            />
            
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-3">
                {option.icon && (
                  <div className={`transition-colors duration-200 ${isSelected ? 'text-[#4a9e5c]' : 'text-[#9abf9d]'}`}>
                    {option.icon}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className={`font-syne font-bold tracking-wider text-xs uppercase transition-colors duration-200 ${isSelected ? 'text-[#1a3d1f]' : 'text-[#2d5a34]'}`}>
                    {option.label}
                  </span>
                  {option.description && (
                    <span className="font-syne text-[10px] text-[#6aaa7a] mt-0.5">
                      {option.description}
                    </span>
                  )}
                </div>
              </div>

              {/* Custom Radio Circle */}
              <div
                className={`
                  flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all duration-200
                  ${isSelected ? 'border-[#4a9e5c] bg-[#4a9e5c]' : 'border-[#9abf9d] bg-white'}
                `}
                aria-hidden="true"
              >
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="h-1.5 w-1.5 rounded-full bg-white"
                  />
                )}
              </div>
            </div>
          </label>
        );
      })}
    </div>
  );
}
