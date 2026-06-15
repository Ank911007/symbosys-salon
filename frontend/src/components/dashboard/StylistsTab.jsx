import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, UserCircle } from 'lucide-react';

export default function StylistsTab({ stylists, onAdd, onDelete }) {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    onAdd({ name, bio });
    setName('');
    setBio('');
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif text-2xl text-[#1a3d1f]">Stylists</h3>
          <p className="text-xs font-syne text-[#7aaa84] mt-1">Manage your team</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 bg-[#4a9e5c] text-white font-syne font-bold text-xs tracking-widest uppercase rounded-xl px-5 py-3 hover:bg-[#3d8a4f] transition-colors"
        >
          <Plus size={14} /> Add Stylist
        </button>
      </div>

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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#f7faf7] border border-[#c8e6cc] text-[#2d5a34] text-sm font-syne rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c]"
                  placeholder="Stylist name"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-syne font-bold tracking-wider text-[#2d5a34] uppercase">Bio (optional)</label>
                <input
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-[#f7faf7] border border-[#c8e6cc] text-[#2d5a34] text-sm font-syne rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4a9e5c]"
                  placeholder="Expert in modern cuts..."
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 bg-[#4a9e5c] text-white font-syne font-bold text-xs tracking-widest uppercase rounded-xl px-6 py-3 hover:bg-[#3d8a4f] transition-colors"
            >
              Add Stylist
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {(!stylists || stylists.length === 0) ? (
        <div className="text-center py-16 bg-white border border-[#d0ead4] rounded-2xl">
          <UserCircle size={24} className="mx-auto text-[#7aaa84] mb-3" />
          <p className="text-[#7aaa84] font-syne text-sm">No stylists yet. Add your first team member!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stylists.map((stylist, idx) => (
            <motion.div
              key={stylist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-2xl p-5 border border-[#e0f0e3] shadow-sm group hover:border-[#4a9e5c] transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#e8f5ea] flex items-center justify-center">
                    <UserCircle size={20} className="text-[#4a9e5c]" />
                  </div>
                  <div>
                    <h4 className="font-syne font-bold text-sm text-[#1a3d1f]">{stylist.name}</h4>
                    <p className="text-xs font-syne text-[#7aaa84] mt-0.5 line-clamp-1">{stylist.bio || 'No bio'}</p>
                  </div>
                </div>
                <button
                  onClick={() => onDelete(stylist.id)}
                  className="text-red-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  aria-label={`Remove ${stylist.name}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
