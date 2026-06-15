import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Loader2, IndianRupee } from 'lucide-react';

export default function ServicesTab({ services, onAdd, onUpdate, onDelete, isLoading }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newService, setNewService] = useState({ name: '', description: '', duration: 60, price: 0 });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleAdd = (e) => {
    e.preventDefault();
    onAdd({ ...newService, price: parseFloat(newService.price), duration: parseInt(newService.duration) });
    setNewService({ name: '', description: '', duration: 60, price: 0 });
    setShowAdd(false);
  };

  const startEdit = (service) => {
    setEditingId(service.id);
    setEditForm({
      name: service.name,
      price: parseFloat(service.price),
      duration: service.duration,
      isActive: service.isActive,
    });
  };

  const saveEdit = (id) => {
    onUpdate(id, editForm);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif text-2xl text-[#1a3d1f]">Services</h3>
          <p className="text-xs font-syne text-[#7aaa84] mt-1">Manage your salon's service menu</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 bg-[#4a9e5c] text-white font-syne font-bold text-xs tracking-widest uppercase rounded-xl px-5 py-3 hover:bg-[#3d8a4f] transition-colors"
        >
          <Plus size={14} /> Add Service
        </button>
      </div>

      {/* Add Service Form */}
      <AnimatePresence>
        {showAdd && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleAdd}
            className="bg-white rounded-2xl p-6 border border-[#e0f0e3] shadow-sm overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-syne font-bold tracking-wider text-[#2d5a34] uppercase">Name</label>
                <input
                  required
                  value={newService.name}
                  onChange={(e) => setNewService(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-[#f7faf7] border border-[#c8e6cc] text-[#2d5a34] text-sm font-syne rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c]"
                  placeholder="e.g. Signature Haircut"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-syne font-bold tracking-wider text-[#2d5a34] uppercase">Description</label>
                <input
                  value={newService.description}
                  onChange={(e) => setNewService(p => ({ ...p, description: e.target.value }))}
                  className="w-full bg-[#f7faf7] border border-[#c8e6cc] text-[#2d5a34] text-sm font-syne rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c]"
                  placeholder="Optional"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-syne font-bold tracking-wider text-[#2d5a34] uppercase">Duration (min)</label>
                <input
                  type="number"
                  required
                  min={5}
                  value={newService.duration}
                  onChange={(e) => setNewService(p => ({ ...p, duration: e.target.value }))}
                  className="w-full bg-[#f7faf7] border border-[#c8e6cc] text-[#2d5a34] text-sm font-syne rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-syne font-bold tracking-wider text-[#2d5a34] uppercase">Price (₹)</label>
                <input
                  type="number"
                  required
                  min={0}
                  step="0.01"
                  value={newService.price}
                  onChange={(e) => setNewService(p => ({ ...p, price: e.target.value }))}
                  className="w-full bg-[#f7faf7] border border-[#c8e6cc] text-[#2d5a34] text-sm font-syne rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c]"
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 bg-[#4a9e5c] text-white font-syne font-bold text-xs tracking-widest uppercase rounded-xl px-6 py-3 hover:bg-[#3d8a4f] transition-colors"
            >
              Add Service
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Services List */}
      {(!services || services.length === 0) ? (
        <div className="text-center py-16 bg-white border border-[#d0ead4] rounded-2xl">
          <Loader2 size={24} className="mx-auto text-[#7aaa84] mb-3 animate-pulse" />
          <p className="text-[#7aaa84] font-syne text-sm">No services yet. Add your first service above!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((service) => (
            <motion.div
              key={service.id}
              layout
              className={`
                bg-white rounded-2xl p-5 border shadow-sm transition-all
                ${service.isActive ? 'border-[#e0f0e3]' : 'border-red-200 opacity-60'}
              `}
            >
              {editingId === service.id ? (
                /* Edit Mode */
                <div className="flex flex-wrap items-end gap-4">
                  <div className="flex-1 min-w-[150px] space-y-1">
                    <label className="text-[10px] font-syne font-bold text-[#2d5a34] uppercase">Name</label>
                    <input
                      value={editForm.name}
                      onChange={(e) => setEditForm(p => ({ ...p, name: e.target.value }))}
                      className="w-full bg-[#f7faf7] border border-[#c8e6cc] text-sm font-syne rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c]"
                    />
                  </div>
                  <div className="w-24 space-y-1">
                    <label className="text-[10px] font-syne font-bold text-[#2d5a34] uppercase">Price ₹</label>
                    <input
                      type="number"
                      value={editForm.price}
                      onChange={(e) => setEditForm(p => ({ ...p, price: parseFloat(e.target.value) }))}
                      className="w-full bg-[#f7faf7] border border-[#c8e6cc] text-sm font-syne rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c]"
                    />
                  </div>
                  <div className="w-24 space-y-1">
                    <label className="text-[10px] font-syne font-bold text-[#2d5a34] uppercase">Min</label>
                    <input
                      type="number"
                      value={editForm.duration}
                      onChange={(e) => setEditForm(p => ({ ...p, duration: parseInt(e.target.value) }))}
                      className="w-full bg-[#f7faf7] border border-[#c8e6cc] text-sm font-syne rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c]"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-[10px] font-syne font-bold text-[#2d5a34] uppercase">Active</label>
                    <input
                      type="checkbox"
                      checked={editForm.isActive}
                      onChange={(e) => setEditForm(p => ({ ...p, isActive: e.target.checked }))}
                      className="accent-[#4a9e5c] w-4 h-4"
                    />
                  </div>
                  <button
                    onClick={() => saveEdit(service.id)}
                    className="bg-[#4a9e5c] text-white font-syne font-bold text-[10px] tracking-widest uppercase rounded-lg px-4 py-2 hover:bg-[#3d8a4f]"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-[#7aaa84] font-syne font-bold text-[10px] tracking-widest uppercase px-3 py-2 hover:text-red-400"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                /* Display Mode */
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-syne font-bold text-sm text-[#1a3d1f]">{service.name}</h4>
                      {!service.isActive && (
                        <span className="text-[9px] font-syne uppercase tracking-wider bg-red-100 text-red-500 px-2 py-0.5 rounded-full">Inactive</span>
                      )}
                    </div>
                    <p className="text-xs font-syne text-[#7aaa84] mt-1">
                      {service.duration} min • {service.description || 'No description'}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-syne font-bold text-lg text-[#4a9e5c] flex items-center">
                      <IndianRupee size={14} />{parseFloat(service.price).toFixed(0)}
                    </span>
                    <button
                      onClick={() => startEdit(service)}
                      className="text-[10px] font-syne font-bold tracking-widest uppercase text-[#4a9e5c] hover:text-[#2d5a34] transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(service.id)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                      aria-label={`Delete ${service.name}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
