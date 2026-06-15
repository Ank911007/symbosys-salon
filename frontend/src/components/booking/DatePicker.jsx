import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { format, addDays, isSameDay, startOfWeek, startOfMonth, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function DatePicker({ selectedDate, onSelect, className, disabledDates = [] }) {
  const [viewDate, setViewDate] = useState(new Date());
  const today = new Date();
  today.setHours(0,0,0,0);

  // Parse disabled dates into a format we can easily compare
  const parsedDisabledDates = disabledDates.map(d => {
    // d is typically "YYYY-MM-DD", manually split to avoid UTC timezone shifts
    const [year, month, day] = d.split('-');
    const date = new Date(year, parseInt(month) - 1, day);
    date.setHours(0,0,0,0);
    return date.getTime();
  });

  // Generate 42 days (6 weeks) for a standard calendar view
  const monthStart = startOfMonth(viewDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // Start on Sunday
  
  const days = Array.from({ length: 42 }).map((_, i) => addDays(startDate, i));
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const handlePrevMonth = () => {
    setViewDate(subMonths(viewDate, 1));
  };

  const handleNextMonth = () => {
    setViewDate(addMonths(viewDate, 1));
  };

  const currentMonthLabel = format(viewDate, 'MMMM yyyy');

  return (
    <div className={cn("bg-[#f4f9f5] rounded-2xl p-6 border border-[#e0f0e3]", className)}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-serif text-[#1a3d1f] text-lg">{currentMonthLabel}</h3>
        <div className="flex gap-2">
          <button 
            type="button" 
            onClick={handlePrevMonth}
            className="p-1 text-[#4a9e5c] hover:bg-[#e0f0e3] rounded-full transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            type="button" 
            onClick={handleNextMonth}
            className="p-1 text-[#4a9e5c] hover:bg-[#e0f0e3] rounded-full transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center">
        {weekDays.map(day => (
          <div key={day} className="text-xs font-syne font-bold text-[#7aaa84]">
            {day}
          </div>
        ))}

        {days.map((day, i) => {
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isPast = day < today;
          
          const dayZero = new Date(day);
          dayZero.setHours(0,0,0,0);
          const isDisabledDay = parsedDisabledDates.includes(dayZero.getTime());
          
          const isCurrentMonth = day.getMonth() === viewDate.getMonth();
          const isDisabled = isPast || isDisabledDay;

          return (
            <button
              key={i}
              type="button"
              onClick={() => !isDisabled && onSelect(day)}
              disabled={isDisabled}
              className={cn(
                "w-8 h-8 mx-auto rounded-lg font-syne text-sm flex items-center justify-center transition-all",
                !isCurrentMonth && !isSelected ? "opacity-30" : "",
                isSelected 
                  ? "bg-[#0b5c3b] text-white font-bold shadow-md" 
                  : isDisabled 
                    ? isDisabledDay ? "text-red-300 line-through cursor-not-allowed" : "text-[#c8e6cc] cursor-not-allowed"
                    : "text-[#1a3d1f] hover:bg-[#d8eedd] font-semibold"
              )}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
      
      <div className="mt-4 text-center">
        <button className="text-xs font-syne font-bold text-[#0b5c3b] hover:underline">
          More available...
        </button>
      </div>
    </div>
  );
}
