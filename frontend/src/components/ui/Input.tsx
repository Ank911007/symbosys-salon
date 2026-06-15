import React, { forwardRef, InputHTMLAttributes, useId } from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-syne font-bold text-primary-text transition-colors duration-300">
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          className={cn(
            "flex h-12 w-full rounded-xl border border-border bg-input-bg px-4 py-2 text-sm font-syne text-primary-text",
            "transition-all duration-300 placeholder:text-[#a0c2a8]",
            "focus:outline-none focus:ring-2 focus:ring-[#4a9e5c] focus:border-transparent",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <span className="text-xs font-syne text-red-500 mt-0.5">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
