import React from 'react';
import { motion } from 'framer-motion';
import { Clock, User, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

const statusConfig = {
  PENDING: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: AlertCircle, label: 'Pending' },
  CONFIRMED: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle, label: 'Confirmed' },
  COMPLETED: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle, label: 'Completed' },
  CANCELLED: { color: 'bg-red-100 text-red-600 border-red-200', icon: XCircle, label: 'Cancelled' },
};

export default function AppointmentsTab({ appointments, onUpdateStatus, isLoading }) {
  if (!appointments || appointments.length === 0) {
    return (
      <div className="space-y-6">
        <h3 className="font-serif text-2xl text-[#1a3d1f]">Appointments</h3>
        <div className="text-center py-16 bg-white border border-[#d0ead4] rounded-2xl">
          <Calendar size={24} className="mx-auto text-[#7aaa84] mb-3" />
          <p className="text-[#7aaa84] font-syne text-sm">No appointments yet.</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-2xl text-[#1a3d1f]">Appointments</h3>
        <p className="text-xs font-syne text-[#7aaa84] mt-1">{appointments.length} total appointments</p>
      </div>

      <div className="space-y-3">
        {appointments.map((appt, idx) => {
          const cfg = statusConfig[appt.status] || statusConfig.PENDING;
          const StatusIcon = cfg.icon;
          const canAct = !['COMPLETED', 'CANCELLED'].includes(appt.status);

          return (
            <motion.div
              key={appt.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="bg-white rounded-2xl p-5 border border-[#e0f0e3] shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Customer & Service Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <User size={14} className="text-[#7aaa84]" />
                    <span className="font-syne font-bold text-sm text-[#1a3d1f]">
                      {appt.customerName || appt.customers?.name || 'Unknown'}
                    </span>
                    <span className="text-xs text-[#7aaa84] font-syne">
                      {appt.customerEmail || appt.customers?.email}
                    </span>
                    {(appt.customerPhone || appt.customers?.phone) && (
                      <>
                        <span className="text-[#7aaa84]">•</span>
                        <span className="text-xs text-[#7aaa84] font-syne">
                          {appt.customerPhone || appt.customers?.phone}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-syne text-[#7aaa84]">
                    <Clock size={12} />
                    <span>{formatDate(appt.startTime)} • {formatTime(appt.startTime)} - {formatTime(appt.endTime)}</span>
                  </div>
                  <p className="text-xs font-syne text-[#4a9e5c] font-medium">
                    {appt.service?.name} • ₹{parseFloat(appt.service?.price || 0).toFixed(0)} • {appt.service?.duration}min
                  </p>
                  {appt.notes && (
                    <p className="text-xs font-syne text-[#7aaa84] italic">Note: {appt.notes}</p>
                  )}
                </div>

                {/* Status & Actions */}
                <div className="flex items-center gap-3">
                  <span className={`flex items-center gap-1.5 text-[10px] font-syne font-bold tracking-widest uppercase px-3 py-1.5 rounded-full border ${cfg.color}`}>
                    <StatusIcon size={12} /> {cfg.label}
                  </span>

                  {canAct && (
                    <div className="flex gap-2">
                      {appt.status === 'PENDING' && (
                        <button
                          onClick={() => onUpdateStatus(appt.id, 'CONFIRMED')}
                          className="text-[10px] font-syne font-bold tracking-widest uppercase text-blue-600 hover:text-blue-800 transition-colors px-2 py-1"
                        >
                          Confirm
                        </button>
                      )}
                      {['PENDING', 'CONFIRMED'].includes(appt.status) && (
                        <>
                          <button
                            onClick={() => onUpdateStatus(appt.id, 'COMPLETED')}
                            className="text-[10px] font-syne font-bold tracking-widest uppercase text-emerald-600 hover:text-emerald-800 transition-colors px-2 py-1"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => onUpdateStatus(appt.id, 'CANCELLED')}
                            className="text-[10px] font-syne font-bold tracking-widest uppercase text-red-400 hover:text-red-600 transition-colors px-2 py-1"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
