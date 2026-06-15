import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Globe, Clock, Image as ImageIcon, Save, Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function OverviewTab({ salon, onUpdate, isUpdating }) {
  const [form, setForm] = useState({
    name: salon?.name || '',
    description: salon?.description || '',
    address: salon?.address || '',
    category: salon?.category || '',
    image: salon?.image || '',
    website: salon?.website || '',
    isOpen: salon?.isOpen ?? true,
    openTime: salon?.openTime || '09:00',
    closeTime: salon?.closeTime || '21:00',
    closedDates: salon?.closedDates || [],
  });
  
  const [newClosedDate, setNewClosedDate] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('image', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddClosedDate = () => {
    if (newClosedDate && !form.closedDates.includes(newClosedDate)) {
      handleChange('closedDates', [...form.closedDates, newClosedDate]);
      setNewClosedDate('');
    }
  };

  const handleRemoveClosedDate = (dateToRemove) => {
    handleChange('closedDates', form.closedDates.filter(d => d !== dateToRemove));
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(form);
  };

  const stats = salon?._count || {};

  return (
    <div className="space-y-8">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Services', value: stats.services || 0, color: 'bg-emerald-500' },
          { label: 'Appointments', value: stats.appointments || 0, color: 'bg-blue-500' },
          { label: 'Stylists', value: stats.stylists || 0, color: 'bg-purple-500' },
          { label: 'Reviews', value: stats.reviews || 0, color: 'bg-amber-500' },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-5 border border-[#e0f0e3] shadow-sm"
          >
            <div className={`w-2 h-2 rounded-full ${stat.color} mb-3`} />
            <p className="text-3xl font-serif text-[#1a3d1f] font-semibold">{stat.value}</p>
            <p className="text-xs font-syne text-[#7aaa84] tracking-widest uppercase mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Open/Close Toggle */}
      <div className="bg-white rounded-2xl p-6 border border-[#e0f0e3] shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {form.isOpen ? (
              <CheckCircle size={20} className="text-emerald-500" />
            ) : (
              <XCircle size={20} className="text-red-400" />
            )}
            <div>
              <h3 className="font-syne font-bold text-sm text-[#1a3d1f]">Salon Status</h3>
              <p className="text-xs text-[#7aaa84] font-syne mt-0.5">
                {form.isOpen ? 'Your salon is currently accepting appointments' : 'Your salon is marked as closed'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              const newVal = !form.isOpen;
              handleChange('isOpen', newVal);
              onUpdate({ isOpen: newVal });
            }}
            className={`
              relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c] focus:ring-offset-2
              ${form.isOpen ? 'bg-emerald-500' : 'bg-gray-300'}
            `}
            role="switch"
            aria-checked={form.isOpen}
            aria-label="Toggle salon open/close"
          >
            <span
              className={`
                absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300
                ${form.isOpen ? 'translate-x-7' : 'translate-x-0'}
              `}
            />
          </button>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-[#e0f0e3] shadow-sm">
        <h3 className="font-syne font-bold text-sm text-[#1a3d1f] tracking-wider uppercase mb-6">Salon Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-syne font-bold tracking-wider text-[#2d5a34] uppercase">Salon Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full bg-[#f7faf7] border border-[#c8e6cc] text-[#2d5a34] text-sm font-syne rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c] focus:border-transparent transition-all"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-syne font-bold tracking-wider text-[#2d5a34] uppercase">Category</label>
            <input
              type="text"
              value={form.category}
              onChange={(e) => handleChange('category', e.target.value)}
              placeholder="e.g. Beauty Parlour, Spa"
              className="w-full bg-[#f7faf7] border border-[#c8e6cc] text-[#2d5a34] text-sm font-syne rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c] focus:border-transparent transition-all"
            />
          </div>

          {/* Address */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-syne font-bold tracking-wider text-[#2d5a34] uppercase flex items-center gap-1.5">
              <MapPin size={12} /> Address
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full bg-[#f7faf7] border border-[#c8e6cc] text-[#2d5a34] text-sm font-syne rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c] focus:border-transparent transition-all"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-syne font-bold tracking-wider text-[#2d5a34] uppercase">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              placeholder="Tell customers about your salon..."
              className="w-full bg-[#f7faf7] border border-[#c8e6cc] text-[#2d5a34] text-sm font-syne rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c] focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Image */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-syne font-bold tracking-wider text-[#2d5a34] uppercase flex items-center gap-1.5">
              <ImageIcon size={12} /> Salon Image
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={form.image}
                onChange={(e) => handleChange('image', e.target.value)}
                placeholder="Image URL or upload file..."
                className="flex-1 bg-[#f7faf7] border border-[#c8e6cc] text-[#2d5a34] text-sm font-syne rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c] focus:border-transparent transition-all"
              />
              <div className="relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button 
                  type="button" 
                  className="bg-[#e0f0e3] hover:bg-[#c8e6cc] text-[#2d5a34] font-syne font-bold text-sm px-4 py-3 rounded-xl transition-colors whitespace-nowrap h-full"
                >
                  Upload File
                </button>
              </div>
            </div>
          </div>

          {/* Website */}
          <div className="space-y-1.5">
            <label className="text-xs font-syne font-bold tracking-wider text-[#2d5a34] uppercase flex items-center gap-1.5">
              <Globe size={12} /> Website
            </label>
            <input
              type="url"
              value={form.website}
              onChange={(e) => handleChange('website', e.target.value)}
              placeholder="https://..."
              className="w-full bg-[#f7faf7] border border-[#c8e6cc] text-[#2d5a34] text-sm font-syne rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c] focus:border-transparent transition-all"
            />
          </div>

          {/* Opening Hours */}
          <div className="space-y-1.5">
            <label className="text-xs font-syne font-bold tracking-wider text-[#2d5a34] uppercase flex items-center gap-1.5">
              <Clock size={12} /> Opens At
            </label>
            <input
              type="time"
              value={form.openTime}
              onChange={(e) => handleChange('openTime', e.target.value)}
              className="w-full bg-[#f7faf7] border border-[#c8e6cc] text-[#2d5a34] text-sm font-syne rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c] focus:border-transparent transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-syne font-bold tracking-wider text-[#2d5a34] uppercase flex items-center gap-1.5">
              <Clock size={12} /> Closes At
            </label>
            <input
              type="time"
              value={form.closeTime}
              onChange={(e) => handleChange('closeTime', e.target.value)}
              className="w-full bg-[#f7faf7] border border-[#c8e6cc] text-[#2d5a34] text-sm font-syne rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c] focus:border-transparent transition-all"
            />
          </div>

          {/* Closed Dates */}
          <div className="space-y-1.5 md:col-span-2 mt-2">
            <label className="text-xs font-syne font-bold tracking-wider text-[#2d5a34] uppercase">Closed Dates</label>
            <p className="text-xs text-[#7aaa84] font-syne mb-2">Select specific dates when the salon will be closed (e.g., holidays). Customers will not be able to book on these dates.</p>
            <div className="flex gap-3 items-center">
              <input
                type="date"
                value={newClosedDate}
                onChange={(e) => setNewClosedDate(e.target.value)}
                className="bg-[#f7faf7] border border-[#c8e6cc] text-[#2d5a34] text-sm font-syne rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c] focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={handleAddClosedDate}
                className="bg-[#e0f0e3] hover:bg-[#c8e6cc] text-[#2d5a34] font-syne font-bold text-sm px-4 py-2 rounded-xl transition-colors"
              >
                Add Date
              </button>
            </div>
            {form.closedDates && form.closedDates.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {form.closedDates.map((date) => (
                  <span key={date} className="inline-flex items-center gap-1 bg-red-50 border border-red-100 text-red-700 font-syne text-xs px-3 py-1.5 rounded-full">
                    {new Date(date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    <button type="button" onClick={() => handleRemoveClosedDate(date)} className="hover:text-red-900 ml-1">
                      <XCircle size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Image Preview */}
        {form.image && (
          <div className="mt-5">
            <p className="text-xs font-syne font-bold tracking-wider text-[#2d5a34] uppercase mb-2">Preview</p>
            <img
              src={form.image}
              alt="Salon preview"
              className="w-full h-48 object-cover rounded-xl border border-[#c8e6cc]"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isUpdating}
          className="mt-6 flex items-center gap-2 bg-[#4a9e5c] text-white font-syne font-bold text-xs tracking-widest uppercase rounded-xl px-6 py-3 hover:bg-[#3d8a4f] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4a9e5c] focus:ring-offset-2 disabled:opacity-70"
        >
          {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Save Changes
        </button>
      </form>
    </div>
  );
}
