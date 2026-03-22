'use client';

import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AddMentorModal from '@/components/booking/AddMentorModal';
import { getMentors } from '@/lib/api';

const COLORS = [
  'bg-[#FFD600]/20 text-[#002147]',
  'bg-primary-container/20 text-[#002147]',
  'bg-[#E3F2FD] text-[#002147]',
  'bg-[#F3E5F5] text-[#4A148C]',
  'bg-[#E8F5E9] text-[#1B5E20]',
  'bg-[#FFF3E0] text-[#E65100]',
];

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

function getColorForName(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

export default function ClientsPage() {
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchMentors = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMentors();
      setMentors(data);
    } catch (err) {
      console.error('Failed to load mentors:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMentors();
  }, [fetchMentors]);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-primary">
              Mentors Directory
            </h1>
            <p className="text-secondary mt-2">
              People you manage or have booked sessions with.
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary-container text-white px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 text-sm shadow-sm hover:shadow-md hover:bg-primary-container/90 active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-sm">person_add</span>
            Add Mentor
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-outline-variant/20 h-56 flex flex-col items-center justify-center space-y-4">
                <div className="w-20 h-20 bg-surface-container rounded-full" />
                <div className="w-32 h-5 bg-surface-container rounded" />
                <div className="w-24 h-4 bg-surface-container rounded" />
              </div>
            ))}
          </div>
        ) : mentors.length === 0 ? (
          <div className="bg-white rounded-3xl border border-outline-variant/20 p-12 text-center flex flex-col items-center justify-center h-64">
            <span className="material-symbols-outlined text-5xl text-secondary/50 mb-4">group_off</span>
            <h3 className="text-xl font-bold text-primary mb-2">No mentors found</h3>
            <p className="text-secondary mb-6">You haven't added any mentors to your directory yet.</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-primary-container font-bold hover:underline text-sm"
            >
              Add your first mentor
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mentors.map((mentor) => (
              <div key={mentor.id} className="bg-white p-6 rounded-3xl border border-outline-variant/20 hover:shadow-md transition-shadow flex flex-col items-center text-center space-y-4">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black tracking-tighter ${getColorForName(mentor.name)}`}>
                  {getInitials(mentor.name)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary">{mentor.name}</h3>
                  <p className="text-sm text-secondary font-medium">{mentor.role}</p>
                  <p className="text-xs text-secondary mt-1 opacity-70">{mentor.company}</p>
                </div>
                <button className="w-full mt-4 py-2 text-xs font-bold text-[#002147] bg-surface-container rounded-lg truncate px-2 hover:bg-outline-variant/30 transition-colors">
                  {mentor.email}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddMentorModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => {
          setIsModalOpen(false);
          fetchMentors();
        }}
      />
    </DashboardLayout>
  );
}
