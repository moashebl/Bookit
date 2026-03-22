'use client';

import { useState } from 'react';
import { createTimeSlot } from '@/lib/api';

interface NewEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewEventModal({ isOpen, onClose }: NewEventModalProps) {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [duration, setDuration] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      setError('Please select a date');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createTimeSlot(date, startTime, endTime, duration);
      onClose(); // Close modal on success
      alert('Time slot created successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to create time slot. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-[#000a1e]/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal dialog */}
      <div className="relative bg-white rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden border-t-4 border-t-primary-container">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-black text-primary tracking-tight">New Event</h2>
              <p className="text-secondary text-sm mt-1">Create a new bookable time slot.</p>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-secondary hover:bg-outline-variant/20 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 rounded-xl bg-error-container text-on-error-container text-sm font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-primary mb-2">Date</label>
              <input 
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-surface-container border-none rounded-xl px-4 py-3.5 text-primary font-medium focus:ring-2 focus:ring-primary-container/20 transition-shadow outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-primary mb-2">Start Time</label>
                <input 
                  type="time"
                  required
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="w-full bg-surface-container border-none rounded-xl px-4 py-3.5 text-primary font-medium focus:ring-2 focus:ring-primary-container/20 transition-shadow outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-2">End Time</label>
                <input 
                  type="time"
                  required
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  className="w-full bg-surface-container border-none rounded-xl px-4 py-3.5 text-primary font-medium focus:ring-2 focus:ring-primary-container/20 transition-shadow outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-primary mb-2">Duration (minutes)</label>
              <select 
                value={duration}
                onChange={e => setDuration(Number(e.target.value))}
                className="w-full bg-surface-container border-none rounded-xl px-4 py-3.5 text-primary font-medium focus:ring-2 focus:ring-primary-container/20 transition-shadow outline-none"
              >
                <option value={15}>15 mins</option>
                <option value={30}>30 mins</option>
                <option value={60}>60 mins</option>
                <option value={90}>90 mins</option>
                <option value={120}>120 mins</option>
              </select>
            </div>

            <div className="pt-4">
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-primary-container text-white py-4 rounded-xl font-bold text-sm shadow-xl shadow-primary-container/20 hover:shadow-2xl hover:shadow-primary-container/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm transition-all disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
              >
                {loading ? 'Creating...' : 'Create Time Slot'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
