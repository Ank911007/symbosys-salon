import React from 'react';
import { Skeleton } from '../ui/Skeleton';

export default function SalonResultCardSkeleton() {
  return (
    <div className="bg-white rounded-[1.75rem] overflow-hidden border border-[#d8eedd] shadow-sm flex flex-col h-full">
      {/* Image Skeleton */}
      <Skeleton className="h-52 md:h-56 w-full rounded-none" />

      {/* Content Skeleton */}
      <div className="p-6 md:p-8 flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-4 mb-4">
          <div className="flex-1 space-y-3">
            {/* Title */}
            <Skeleton className="h-6 w-3/4" />
            {/* Subtitle / Rating */}
            <Skeleton className="h-4 w-1/4" />
          </div>
          {/* Distance Badge */}
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>

        {/* Address */}
        <Skeleton className="h-4 w-5/6 mb-6" />

        <div className="mt-auto pt-6 border-t border-[#e8f5ea] flex justify-between items-center gap-4">
          {/* Services text */}
          <Skeleton className="h-4 w-1/3" />
          {/* Button */}
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
}
