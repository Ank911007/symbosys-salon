import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { Clock } from 'lucide-react';

export function TimeSlotSelector({ selectedTime, onSelect, className, salon }) {
  const [period, setPeriod] = useState('AM'); // AM or PM

  // Function to convert "HH:mm" to minutes since midnight
  const timeToMinutes = (t) => {
    if (!t) return 0;
    const [h, m] = t.split(':').map(Number);
    return h * 60 + (m || 0);
  };

  // Function to convert minutes to "HH:mm AM/PM"
  const minutesToTime = (m) => {
    let h = Math.floor(m / 60);
    let min = m % 60;
    const isPM = h >= 12;
    if (h > 12) h -= 12;
    if (h === 0) h = 12;
    const pad = (num) => num.toString().padStart(2, '0');
    return `${pad(h)}:${pad(min)} ${isPM ? 'PM' : 'AM'}`;
  };

  // Generate slots
  const generateSlots = () => {
    // Default to 09:00 - 17:00 if not provided
    const openMin = timeToMinutes(salon?.openTime || "09:00");
    const closeMin = timeToMinutes(salon?.closeTime || "17:00");
    
    const slots = { AM: [], PM: [] };
    
    // Generate 60 min intervals
    for (let current = openMin; current <= closeMin; current += 60) {
      const timeStr = minutesToTime(current);
      if (timeStr.includes('AM')) {
        slots.AM.push(timeStr);
      } else {
        slots.PM.push(timeStr);
      }
    }
    return slots;
  };

  const timeSlots = generateSlots();

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex justify-between items-center">
        <label className="text-sm font-syne font-bold text-[#1a3d1f]">
          Preferred Time
        </label>
        
        {/* AM / PM Toggle */}
        <div className="flex bg-[#e8f5ea] rounded-full p-1 border border-[#d8eedd]">
          <button 
            type="button"
            onClick={() => setPeriod('AM')}
            className={cn(
              "px-4 py-1 rounded-full text-xs font-syne font-bold transition-all",
              period === 'AM' ? "bg-white text-[#1a3d1f] shadow-sm" : "text-[#7aaa84] hover:text-[#4a9e5c]"
            )}
          >
            AM
          </button>
          <button 
            type="button"
            onClick={() => setPeriod('PM')}
            className={cn(
              "px-4 py-1 rounded-full text-xs font-syne font-bold transition-all",
              period === 'PM' ? "bg-white text-[#1a3d1f] shadow-sm" : "text-[#7aaa84] hover:text-[#4a9e5c]"
            )}
          >
            PM
          </button>
        </div>
      </div>

      {/* Grid of Slots */}
      <div className="grid grid-cols-2 gap-3">
        {timeSlots[period]?.length > 0 ? (
          timeSlots[period].map(time => {
            const isSelected = selectedTime === time;

            return (
              <button
                key={time}
                type="button"
                onClick={() => onSelect(time)}
                className={cn(
                  "h-12 rounded-xl border flex items-center justify-center text-sm font-syne font-bold transition-all",
                  isSelected
                    ? "bg-[#0b5c3b] border-[#0b5c3b] text-white shadow-md"
                    : "bg-[#e8f5ea] border-[#c8e6cc] text-[#1a3d1f] hover:border-[#4a9e5c] hover:bg-[#d0ead4]"
                )}
              >
                {time}
              </button>
            );
          })
        ) : (
          <div className="col-span-2 text-center py-4 text-[#7aaa84] font-syne text-sm">
            No slots available in the {period}
          </div>
        )}
      </div>

      {/* Info Notice */}
      <div className="flex items-center gap-2 mt-2 bg-[#e0f9ec] text-[#2d5a34] p-3 rounded-xl border border-[#c6efdb]">
        <Clock size={14} className="shrink-0" />
        <span className="text-xs font-syne">Duration: 60 minutes session</span>
      </div>
    </div>
  );
}
