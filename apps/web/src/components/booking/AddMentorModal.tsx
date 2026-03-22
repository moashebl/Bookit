import React, { useState } from 'react';
import { addMentor } from '@/lib/api';

interface AddMentorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddMentorModal({ isOpen, onClose, onSuccess }: AddMentorModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    role: '',
    email: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await addMentor(formData);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to add mentor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#000a1e]/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-extrabold text-[#002147] tracking-tight">Add Mentor</h2>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-[#5c5f60] hover:bg-outline-variant/30 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] font-bold tracking-widest uppercase text-[#5c5f60] mb-1.5 px-0.5">
                Full Name
              </label>
              <input
                required
                type="text"
                placeholder="Sarah Jenkins"
                className="w-full px-4 py-3 bg-surface-container rounded-xl text-primary font-medium focus:outline-none focus:ring-2 focus:ring-primary-container/20 transition-all placeholder:font-normal placeholder:text-secondary text-sm"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold tracking-widest uppercase text-[#5c5f60] mb-1.5 px-0.5">
                Company
              </label>
              <input
                required
                type="text"
                placeholder="Google"
                className="w-full px-4 py-3 bg-surface-container rounded-xl text-primary font-medium focus:outline-none focus:ring-2 focus:ring-primary-container/20 transition-all placeholder:font-normal placeholder:text-secondary text-sm"
                value={formData.company}
                onChange={e => setFormData({ ...formData, company: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold tracking-widest uppercase text-[#5c5f60] mb-1.5 px-0.5">
                Role
              </label>
              <input
                required
                type="text"
                placeholder="Senior Engineer"
                className="w-full px-4 py-3 bg-surface-container rounded-xl text-primary font-medium focus:outline-none focus:ring-2 focus:ring-primary-container/20 transition-all placeholder:font-normal placeholder:text-secondary text-sm"
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold tracking-widest uppercase text-[#5c5f60] mb-1.5 px-0.5">
                Email Address
              </label>
              <input
                required
                type="email"
                placeholder="sarah@example.com"
                className="w-full px-4 py-3 bg-surface-container rounded-xl text-primary font-medium focus:outline-none focus:ring-2 focus:ring-primary-container/20 transition-all placeholder:font-normal placeholder:text-secondary text-sm"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3.5 bg-surface-container text-[#002147] font-bold rounded-full hover:bg-outline-variant/30 text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-3.5 bg-[#002147] text-white font-bold rounded-full text-sm shadow-md hover:shadow-lg transition-all ${loading ? 'opacity-70 flex items-center justify-center gap-2' : ''}`}
              >
                {loading ? (
                  <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                ) : 'Save Mentor'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
