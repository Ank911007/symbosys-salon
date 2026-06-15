import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { PhoneInput } from '../ui/PhoneInput';
import { DatePicker } from './DatePicker';
import { TimeSlotSelector } from './TimeSlotSelector';
import { useSubmitBooking } from '../../hooks/useMutations';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

export function BookingForm({ salon, onCancel }) {
  const navigate = useNavigate();
  const { user, isAuthenticated, isCustomer } = useAuth();
  const { mutate: submitBooking, isPending } = useSubmitBooking();
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerGender, setCustomerGender] = useState('');
  
  // Auto-fill from signed-in customer's profile
  useEffect(() => {
    if (isAuthenticated && isCustomer && user) {
      if (user.name) setCustomerName(user.name);
      if (user.phone) setCustomerPhone(user.phone);
      if (user.email) setCustomerEmail(user.email);
      if (user.gender) setCustomerGender(user.gender);
    }
  }, [isAuthenticated, isCustomer, user]);

  // Create dynamic service options from the real salon data
  const serviceOptions = salon?.services?.length > 0 
    ? salon.services.map(s => ({
        value: s.id,
        label: `${s.name} ($${s.price}) - ${s.duration} mins`
      }))
    : [];

  const [serviceId, setServiceId] = useState('');

  // Form submission logic
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!time) {
      toast.error("Please select a preferred time.");
      return;
    }
    if (!serviceId) {
      toast.error("Please select a service.");
      return;
    }
    
    // Combine date and time string to ISO
    const [hours, minutes, period] = time.match(/(\d+):(\d+) (AM|PM)/).slice(1);
    let hour = parseInt(hours);
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    
    const startTime = new Date(date);
    startTime.setHours(hour, parseInt(minutes), 0, 0);

    submitBooking({
      serviceId,
      startTime: startTime.toISOString(),
      customerName,
      customerPhone,
      customerEmail,
      notes: "Booked via Minta Web App"
    }, {
      onSuccess: () => {
        toast.success(`Successfully booked at ${salon?.name || 'the salon'}!`);
        navigate('/');
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to book appointment');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto bg-white rounded-[2rem] shadow-[0_8px_40px_rgba(74,158,92,0.08)] overflow-hidden border border-[#e0f0e3]">
      
      <div className="bg-[#fcfdfc] p-8 md:px-12 border-b border-[#f0f7f1]">
        <h2 className="font-serif text-3xl md:text-4xl text-[#0b5c3b] mb-2">Book Your Appointment</h2>
        <p className="font-syne text-[#5a8c63] text-sm">
          Fill in the details below to schedule your session
        </p>
      </div>

      <div className="p-8 md:px-12 md:py-10 flex flex-col gap-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label="Full Name" 
            placeholder="e.g. Elena Gilbert" 
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required 
          />
          <Select 
            label="Gender" 
            placeholder="Select Gender"
            value={customerGender}
            onChange={(e) => setCustomerGender(e.target.value)}
            options={[
              { value: 'female', label: 'Female' },
              { value: 'male', label: 'Male' },
              { value: 'other', label: 'Other' },
              { value: 'prefer_not', label: 'Prefer not to say' },
            ]}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PhoneInput 
            label="Contact Number" 
            value={customerPhone}
            onChange={(val) => setCustomerPhone(val)}
            required 
          />
          <Input 
            label="Email ID" 
            type="email" 
            placeholder="elena.g@example.com" 
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            required 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select 
            label="Service Type" 
            placeholder={serviceOptions.length ? "Choose a Service" : "No services available"}
            options={serviceOptions}
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            required
            disabled={!serviceOptions.length}
          />
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-syne font-bold text-[#1a3d1f]">Location</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0c2a8]">
                <MapPin size={16} />
              </div>
              <input 
                type="text" 
                readOnly
                value={salon?.address || 'Search branch location...'}
                className="flex h-12 w-full rounded-xl border border-[#d8eedd] bg-[#f8fbf9] pl-11 pr-4 py-2 text-sm font-syne text-[#5a8c63] cursor-not-allowed focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-8 mt-2">
          <div className="flex flex-col gap-3">
            <label className="text-sm font-syne font-bold text-[#1a3d1f]">Preferred Date</label>
            <DatePicker 
              selectedDate={date} 
              onSelect={setDate} 
              disabledDates={salon?.closedDates || []}
            />
          </div>
          
          <div className="flex flex-col">
            <TimeSlotSelector selectedTime={time} onSelect={setTime} salon={salon} />
          </div>
        </div>

        <div className="w-full h-px bg-[#f0f7f1] my-4" />

        <div className="flex justify-end items-center gap-4">
          <button 
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="px-6 py-3 rounded-xl font-syne font-bold text-[#4a9e5c] hover:bg-[#f0f7f1] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-8 py-3 rounded-xl font-syne font-bold text-white bg-[#0b5c3b] hover:bg-[#08422a] transition-colors shadow-lg shadow-[#0b5c3b]/20 disabled:opacity-70"
          >
            {isPending ? 'Confirming...' : 'Confirm Booking'}
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </form>
  );
}
