import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2, Store, LogOut, ShieldCheck, Pencil } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SalonResultCard from '../components/salons/SalonResultCard';

const API_URL = import.meta.env.VITE_API_URL || '/api';

function useAdminApi(token) {
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const request = async (endpoint, options = {}) => {
    const res = await fetch(`${API_URL}/admin${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
  };

  return {
    getSalons: () => request('/salons'),
    registerSalon: (body) => request('/salons', { method: 'POST', body: JSON.stringify(body) }),
    updateSalon: (id, body) => request(`/salons/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    deleteSalon: (id) => request(`/salons/${id}`, { method: 'DELETE' }),
  };
}

export default function AdminDashboardPage() {
  const { user, token, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const api = useAdminApi(token);

  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSalonId, setEditingSalonId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    ownerPassword: '',
    salonName: '',
    salonAddress: '',
    salonCategory: 'Beauty Parlour',
  });

  // Auth guard
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== 'ADMIN')) {
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, user, navigate]);

  const loadSalons = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getSalons();
      setSalons(res.data || []);
    } catch (err) {
      toast.error('Failed to load salons');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'ADMIN') {
      loadSalons();
    }
  }, [isAuthenticated, user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openAddModal = () => {
    setFormData({
      ownerName: '',
      ownerEmail: '',
      ownerPhone: '',
      ownerPassword: '',
      salonName: '',
      salonAddress: '',
      salonCategory: 'Beauty Parlour',
    });
    setShowAddModal(true);
  };

  const openEditModal = (salon) => {
    setFormData({
      ownerName: salon.owner?.name || '',
      ownerEmail: salon.owner?.email || '',
      ownerPhone: salon.owner?.phone || '',
      ownerPassword: '', // Don't prefill password
      salonName: salon.name || '',
      salonAddress: salon.salonAddress?.address || '',
      salonCategory: salon.category || 'Beauty Parlour',
    });
    setEditingSalonId(salon.id);
    setShowEditModal(true);
  };

  const handleRegisterSalon = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await api.registerSalon(formData);
      toast.success('Salon and Owner successfully registered!');
      setShowAddModal(false);
      loadSalons();
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSalon = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      // Omit ownerEmail as we don't allow changing it
      const { ownerEmail, ...updateData } = formData;
      await api.updateSalon(editingSalonId, updateData);
      toast.success('Salon details updated successfully!');
      setShowEditModal(false);
      loadSalons();
    } catch (err) {
      toast.error(err.message || 'Update failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSalon = async (id) => {
    if (!window.confirm('Are you sure you want to delete this salon? This action cannot be undone.')) return;
    try {
      await api.deleteSalon(id);
      toast.success('Salon deleted successfully');
      loadSalons();
    } catch (err) {
      toast.error(err.message || 'Failed to delete salon');
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f9f5]">
        <Loader2 size={32} className="animate-spin text-[#4a9e5c]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f9f5]">
      {/* Admin Navbar */}
      <nav className="bg-[#0b1c0f] text-white px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck size={24} className="text-[#4a9e5c]" />
          <div>
            <h1 className="font-serif text-xl tracking-wide">System Admin</h1>
            <p className="text-[10px] font-syne text-[#7aaa84] tracking-widest uppercase">Minta Platform Management</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-syne text-red-400 hover:text-red-300 transition-colors"
        >
          <LogOut size={16} /> Log Out
        </button>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-serif text-3xl text-[#1a3d1f]">Registered Salons</h2>
            <p className="text-sm font-syne text-[#7aaa84] mt-1">Manage all salons and their owners across the platform.</p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-[#4a9e5c] text-white font-syne font-bold text-xs tracking-widest uppercase rounded-xl px-6 py-3 hover:bg-[#3d8a4f] transition-colors shadow-lg shadow-[#4a9e5c]/20"
          >
            <Plus size={16} /> Register New Salon
          </button>
        </div>

        {/* Salons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {salons.map((salon, idx) => {
            const formattedSalon = {
              id: salon.id,
              name: salon.name,
              category: salon.category || 'Beauty Parlour',
              address: salon.salonAddress?.address || 'Unknown',
              city: 'Local Area',
              distance: null,
              rating: salon.rating ? salon.rating.toFixed(1) : '5.0',
              reviews: salon.totalReviews || 0,
              image: salon.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80',
              services: [],
              stylists: [],
            };

            return (
              <div key={salon.id} className="relative group h-full">
                <SalonResultCard salon={formattedSalon} index={idx} isAdminMode={true} />
                
                {/* Actions Overlay */}
                <div className="absolute top-3.5 right-3.5 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={(e) => { e.stopPropagation(); openEditModal(salon); }}
                    className="bg-white/95 backdrop-blur-md text-[#4a9e5c] hover:text-white hover:bg-[#4a9e5c] p-2 rounded-full shadow-sm transition-all duration-300"
                    title="Edit Salon"
                    aria-label="Edit Salon"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteSalon(salon.id); }}
                    className="bg-white/95 backdrop-blur-md text-red-500 hover:text-white hover:bg-red-500 p-2 rounded-full shadow-sm transition-all duration-300"
                    title="Delete Salon"
                    aria-label="Delete Salon"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
          {salons.length === 0 && (
            <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-[#e0f0e3]">
              <p className="text-[#7aaa84] font-syne text-sm">No salons registered yet. Click "Register New Salon" to add one.</p>
            </div>
          )}
        </div>
      </main>

      {/* Add Salon Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0b1c0f]/60 backdrop-blur-sm"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
            >
              <div className="bg-[#0b1c0f] px-8 py-6 text-white flex justify-between items-center">
                <div>
                  <h3 className="font-serif text-2xl">Register New Salon</h3>
                  <p className="text-xs font-syne text-[#7aaa84] mt-1">This will create a new salon and an owner account.</p>
                </div>
                <button onClick={() => setShowAddModal(false)} className="text-white/60 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleRegisterSalon} className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                {/* Owner Section */}
                <div>
                  <h4 className="font-syne font-bold text-xs tracking-widest uppercase text-[#4a9e5c] border-b border-[#e0f0e3] pb-2 mb-4">1. Owner Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-syne font-bold tracking-wider text-[#2d5a34] uppercase">Full Name</label>
                      <input required name="ownerName" value={formData.ownerName} onChange={handleChange} className="w-full bg-[#f7faf7] border border-[#c8e6cc] text-[#2d5a34] text-sm font-syne rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c]" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-syne font-bold tracking-wider text-[#2d5a34] uppercase">Email</label>
                      <input required type="email" name="ownerEmail" value={formData.ownerEmail} onChange={handleChange} className="w-full bg-[#f7faf7] border border-[#c8e6cc] text-[#2d5a34] text-sm font-syne rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c]" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-syne font-bold tracking-wider text-[#2d5a34] uppercase">Phone</label>
                      <input name="ownerPhone" value={formData.ownerPhone} onChange={handleChange} className="w-full bg-[#f7faf7] border border-[#c8e6cc] text-[#2d5a34] text-sm font-syne rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c]" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-syne font-bold tracking-wider text-[#2d5a34] uppercase">Password</label>
                      <input required type="password" name="ownerPassword" value={formData.ownerPassword} onChange={handleChange} minLength={6} className="w-full bg-[#f7faf7] border border-[#c8e6cc] text-[#2d5a34] text-sm font-syne rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c]" />
                    </div>
                  </div>
                </div>

                {/* Salon Section */}
                <div>
                  <h4 className="font-syne font-bold text-xs tracking-widest uppercase text-[#4a9e5c] border-b border-[#e0f0e3] pb-2 mb-4">2. Salon Details</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-syne font-bold tracking-wider text-[#2d5a34] uppercase">Salon Name</label>
                        <input required name="salonName" value={formData.salonName} onChange={handleChange} className="w-full bg-[#f7faf7] border border-[#c8e6cc] text-[#2d5a34] text-sm font-syne rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c]" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-syne font-bold tracking-wider text-[#2d5a34] uppercase">Category</label>
                        <input name="salonCategory" value={formData.salonCategory} onChange={handleChange} placeholder="e.g. Beauty Parlour" className="w-full bg-[#f7faf7] border border-[#c8e6cc] text-[#2d5a34] text-sm font-syne rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c]" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-syne font-bold tracking-wider text-[#2d5a34] uppercase">Address</label>
                      <input required name="salonAddress" value={formData.salonAddress} onChange={handleChange} className="w-full bg-[#f7faf7] border border-[#c8e6cc] text-[#2d5a34] text-sm font-syne rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c]" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-6 py-3 rounded-xl font-syne font-bold text-xs tracking-widest uppercase text-[#7aaa84] hover:bg-gray-100 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-[#4a9e5c] text-white font-syne font-bold text-xs tracking-widest uppercase rounded-xl px-6 py-3 hover:bg-[#3d8a4f] transition-colors disabled:opacity-70">
                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                    Register Salon
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Salon Modal */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0b1c0f]/60 backdrop-blur-sm"
              onClick={() => setShowEditModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
            >
              <div className="bg-[#0b1c0f] px-8 py-6 text-white flex justify-between items-center">
                <div>
                  <h3 className="font-serif text-2xl">Edit Salon Details</h3>
                  <p className="text-xs font-syne text-[#7aaa84] mt-1">Update salon or owner information.</p>
                </div>
                <button onClick={() => setShowEditModal(false)} className="text-white/60 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleUpdateSalon} className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                {/* Owner Section */}
                <div>
                  <h4 className="font-syne font-bold text-xs tracking-widest uppercase text-[#4a9e5c] border-b border-[#e0f0e3] pb-2 mb-4">1. Owner Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-syne font-bold tracking-wider text-[#2d5a34] uppercase">Full Name</label>
                      <input required name="ownerName" value={formData.ownerName} onChange={handleChange} className="w-full bg-[#f7faf7] border border-[#c8e6cc] text-[#2d5a34] text-sm font-syne rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c]" />
                    </div>
                    <div className="space-y-1.5 opacity-50">
                      <label className="text-[10px] font-syne font-bold tracking-wider text-[#2d5a34] uppercase">Email (Cannot be changed)</label>
                      <input disabled type="email" name="ownerEmail" value={formData.ownerEmail} className="w-full bg-gray-100 border border-[#c8e6cc] text-[#2d5a34] text-sm font-syne rounded-xl px-4 py-2.5 cursor-not-allowed" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-syne font-bold tracking-wider text-[#2d5a34] uppercase">Phone</label>
                      <input name="ownerPhone" value={formData.ownerPhone} onChange={handleChange} className="w-full bg-[#f7faf7] border border-[#c8e6cc] text-[#2d5a34] text-sm font-syne rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c]" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-syne font-bold tracking-wider text-[#2d5a34] uppercase">New Password</label>
                      <input type="password" name="ownerPassword" value={formData.ownerPassword} onChange={handleChange} minLength={6} placeholder="Leave blank to keep current" className="w-full bg-[#f7faf7] border border-[#c8e6cc] text-[#2d5a34] text-sm font-syne rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c]" />
                    </div>
                  </div>
                </div>

                {/* Salon Section */}
                <div>
                  <h4 className="font-syne font-bold text-xs tracking-widest uppercase text-[#4a9e5c] border-b border-[#e0f0e3] pb-2 mb-4">2. Salon Details</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-syne font-bold tracking-wider text-[#2d5a34] uppercase">Salon Name</label>
                        <input required name="salonName" value={formData.salonName} onChange={handleChange} className="w-full bg-[#f7faf7] border border-[#c8e6cc] text-[#2d5a34] text-sm font-syne rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c]" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-syne font-bold tracking-wider text-[#2d5a34] uppercase">Category</label>
                        <input name="salonCategory" value={formData.salonCategory} onChange={handleChange} placeholder="e.g. Beauty Parlour" className="w-full bg-[#f7faf7] border border-[#c8e6cc] text-[#2d5a34] text-sm font-syne rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c]" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-syne font-bold tracking-wider text-[#2d5a34] uppercase">Address</label>
                      <input required name="salonAddress" value={formData.salonAddress} onChange={handleChange} className="w-full bg-[#f7faf7] border border-[#c8e6cc] text-[#2d5a34] text-sm font-syne rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c]" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowEditModal(false)} className="px-6 py-3 rounded-xl font-syne font-bold text-xs tracking-widest uppercase text-[#7aaa84] hover:bg-gray-100 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-[#4a9e5c] text-white font-syne font-bold text-xs tracking-widest uppercase rounded-xl px-6 py-3 hover:bg-[#3d8a4f] transition-colors disabled:opacity-70">
                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Pencil size={16} />}
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
