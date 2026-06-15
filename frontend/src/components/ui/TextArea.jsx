import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const TextArea = forwardRef(({ className, label, error, ...props }, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-syne font-bold text-[#1a3d1f]">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          "w-full min-h-[120px] rounded-xl border border-[#d8eedd] bg-white px-4 py-3 text-sm font-syne text-[#1a3d1f] placeholder:text-[#a0c2a8] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c] focus:border-transparent resize-y",
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
});

TextArea.displayName = "TextArea";

export { TextArea };
