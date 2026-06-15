import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import OverviewTab from '../components/dashboard/OverviewTab';
import ServicesTab from '../components/dashboard/ServicesTab';
import AppointmentsTab from '../components/dashboard/AppointmentsTab';
import StylistsTab from '../components/dashboard/StylistsTab';
import ReviewsTab from '../components/dashboard/ReviewsTab';

const API_URL = import.meta.env.VITE_API_URL || '/api';

function useOwnerApi(token) {
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const request = async (endpoint, options = {}) => {
    const res = await fetch(`${API_URL}/owner${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
  };

  return {
    getSalon: () => request('/salon'),
    updateSalon: (body) => request('/salon', { method: 'PATCH', body: JSON.stringify(body) }),
    getServices: () => request('/salon/services'),
    addService: (body) => request('/salon/services', { method: 'POST', body: JSON.stringify(body) }),
    updateService: (id, body) => request(`/salon/services/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    deleteService: (id) => request(`/salon/services/${id}`, { method: 'DELETE' }),
    getStylists: () => request('/salon/stylists'),
    addStylist: (body) => request('/salon/stylists', { method: 'POST', body: JSON.stringify(body) }),
    deleteStylist: (id) => request(`/salon/stylists/${id}`, { method: 'DELETE' }),
    getAppointments: () => request('/salon/appointments'),
    updateAppointmentStatus: (id, status) => request(`/salon/appointments/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    getReviews: () => request('/salon/reviews'),
  };
}

export default function DashboardPage() {
  const { user, token, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isNewRegistration = location.state?.isNewRegistration;
  const api = useOwnerApi(token);

  const [activeTab, setActiveTab] = useState('overview');
  const [salon, setSalon] = useState(null);
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Auth guard
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== 'SALON_OWNER')) {
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, user, navigate]);

  // Load all data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [salonRes, apptRes] = await Promise.all([
        api.getSalon(),
        api.getAppointments()
      ]);
      
      setSalon(salonRes.data);
      setServices(salonRes.data.services || []);
      setStylists(salonRes.data.stylists || []);
      setReviews(salonRes.data.reviews || []);
      setAppointments(apptRes.data || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
      if (err.message.includes('No salon')) {
        toast.error('No salon linked to your account.');
      } else {
        toast.error('Failed to load data. The server might be unreachable.');
      }
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'SALON_OWNER') {
      loadData();
    }
  }, [isAuthenticated, user]);

  // ─── Action Handlers ──────────────────────────────────────────────────

  const handleUpdateSalon = async (data) => {
    try {
      setIsUpdating(true);
      const res = await api.updateSalon(data);
      setSalon(prev => ({ ...prev, ...res.data }));
      toast.success('Salon updated!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddService = async (data) => {
    try {
      const res = await api.addService(data);
      setServices(prev => [res.data, ...prev]);
      toast.success('Service added!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleUpdateService = async (id, data) => {
    try {
      const res = await api.updateService(id, data);
      setServices(prev => prev.map(s => s.id === id ? res.data : s));
      toast.success('Service updated!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteService = async (id) => {
    try {
      await api.deleteService(id);
      setServices(prev => prev.filter(s => s.id !== id));
      toast.success('Service deleted!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleAddStylist = async (data) => {
    try {
      const res = await api.addStylist(data);
      setStylists(prev => [res.data, ...prev]);
      toast.success('Stylist added!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteStylist = async (id) => {
    try {
      await api.deleteStylist(id);
      setStylists(prev => prev.filter(s => s.id !== id));
      toast.success('Stylist removed!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleUpdateAppointmentStatus = async (id, status) => {
    try {
      const res = await api.updateAppointmentStatus(id, status);
      setAppointments(prev => prev.map(a => a.id === id ? res.data : a));
      toast.success(`Appointment ${status.toLowerCase()}!`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(160deg, #e8f5ea 0%, #f7fbf7 40%, #ffffff 100%)' }}>
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-[#4a9e5c] mx-auto mb-4" />
          <p className="font-syne text-sm text-[#7aaa84]">
            {isNewRegistration ? 'Setting up your salon workspace...' : 'Loading your dashboard...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-6">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center border border-red-100">
          <h2 className="text-2xl font-syne text-red-600 mb-4">Connection Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={loadData}
            className="bg-red-600 text-white px-6 py-2 rounded-full font-medium hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab salon={salon} onUpdate={handleUpdateSalon} isUpdating={isUpdating} />;
      case 'services':
        return <ServicesTab services={services} onAdd={handleAddService} onUpdate={handleUpdateService} onDelete={handleDeleteService} />;
      case 'appointments':
        return <AppointmentsTab appointments={appointments} onUpdateStatus={handleUpdateAppointmentStatus} />;
      case 'stylists':
        return <StylistsTab stylists={stylists} onAdd={handleAddStylist} onDelete={handleDeleteStylist} />;
      case 'reviews':
        return <ReviewsTab reviews={reviews} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #e8f5ea 0%, #f7fbf7 40%, #ffffff 100%)' }}>
      <DashboardSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        salonName={salon?.name}
      />

      {/* Main Content */}
      <main className="ml-64 p-8 transition-all duration-300">
        <div className="max-w-5xl mx-auto">
          {renderTab()}
        </div>
      </main>
    </div>
  );
}
