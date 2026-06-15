import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Scissors, Calendar, Users, Star, LogOut, ChevronLeft, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'services', label: 'Services', icon: Scissors },
  { id: 'appointments', label: 'Appointments', icon: Calendar },
  { id: 'stylists', label: 'Stylists', icon: Users },
  { id: 'reviews', label: 'Reviews', icon: Star },
];

export default function DashboardSidebar({ activeTab, onTabChange, salonName }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={`
        fixed top-0 left-0 h-full z-40 flex flex-col
        bg-[#0b1c0f] text-white transition-all duration-300
        ${collapsed ? 'w-[72px]' : 'w-64'}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-6 border-b border-white/10">
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-w-0">
            <h2 className="font-serif text-lg text-white truncate">{salonName || 'My Salon'}</h2>
            <p className="text-[10px] font-syne tracking-widest uppercase text-[#7aaa84] mt-0.5 truncate">
              {user?.name || 'Owner'}
            </p>
          </motion.div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors shrink-0"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1" role="navigation" aria-label="Dashboard navigation">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-syne font-medium transition-all duration-200
                ${isActive
                  ? 'bg-[#4a9e5c] text-white shadow-lg shadow-[#4a9e5c]/30'
                  : 'text-white/60 hover:bg-white/8 hover:text-white'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
              aria-current={isActive ? 'page' : undefined}
              title={collapsed ? tab.label : undefined}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span className="tracking-wide">{tab.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-2 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className={`
            w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-syne font-medium
            text-red-400 hover:bg-red-500/10 transition-all duration-200
            ${collapsed ? 'justify-center' : ''}
          `}
          title={collapsed ? 'Log out' : undefined}
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span className="tracking-wide">Log Out</span>}
        </button>
      </div>
    </aside>
  );
}

export { tabs };
