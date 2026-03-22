'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function AvailabilityPage() {
  const [schedule, setSchedule] = useState(
    DAYS.reduce((acc, day) => {
      // Default: Mon-Fri 9-5, Sat-Sun off
      const isWeekend = day === 'Saturday' || day === 'Sunday';
      acc[day] = { enabled: !isWeekend, start: '09:00', end: '17:00' };
      return acc;
    }, {} as Record<string, { enabled: boolean; start: string; end: string }>)
  );

  const toggleDay = (day: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled }
    }));
  };

  const updateTime = (day: string, field: 'start' | 'end', value: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-primary">
              Availability
            </h1>
            <p className="text-secondary mt-2">
              Set your weekly working hours. Clients can only book sessions during these times.
            </p>
          </div>
          <button className="bg-primary-container text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 text-sm hover:opacity-90 active:scale-[0.98] transition-all">
            <span className="material-symbols-outlined text-sm">save</span>
            Save Schedule
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-outline-variant/20 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-outline-variant/10 bg-surface-container/30">
            <h2 className="text-xl font-bold text-primary">Weekly Hours</h2>
          </div>
          
          <div className="divide-y divide-outline-variant/10">
            {DAYS.map((day) => {
              const { enabled, start, end } = schedule[day];
              
              return (
                <div key={day} className={`p-6 flex flex-col sm:flex-row sm:items-center gap-4 transition-colors ${!enabled ? 'bg-surface-container/20' : ''}`}>
                  {/* Day Toggle */}
                  <div className="flex items-center gap-4 w-40 shrink-0">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        value="" 
                        className="sr-only peer" 
                        checked={enabled}
                        onChange={() => toggleDay(day)}
                      />
                      <div className="w-11 h-6 bg-surface-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2E7D32]"></div>
                    </label>
                    <span className={`font-bold ${enabled ? 'text-primary' : 'text-secondary line-through'}`}>
                      {day}
                    </span>
                  </div>

                  {/* Time Inputs */}
                  {enabled ? (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
                      <div className="flex items-center gap-2">
                        <select 
                          className="bg-surface-container border-none rounded-xl text-primary font-bold px-4 py-2.5 focus:ring-2 focus:ring-primary-container/20"
                          value={start}
                          onChange={(e) => updateTime(day, 'start', e.target.value)}
                        >
                          {/* Generate time options */}
                          {Array.from({ length: 24 }).map((_, i) => (
                            <option key={`start-${i}`} value={`${i.toString().padStart(2, '0')}:00`}>
                              {i === 0 ? '12:00 AM' : i < 12 ? `${i}:00 AM` : i === 12 ? '12:00 PM' : `${i - 12}:00 PM`}
                            </option>
                          ))}
                        </select>
                        <span className="text-secondary font-medium">-</span>
                        <select 
                          className="bg-surface-container border-none rounded-xl text-primary font-bold px-4 py-2.5 focus:ring-2 focus:ring-primary-container/20"
                          value={end}
                          onChange={(e) => updateTime(day, 'end', e.target.value)}
                        >
                          {Array.from({ length: 24 }).map((_, i) => (
                            <option key={`end-${i}`} value={`${i.toString().padStart(2, '0')}:00`}>
                              {i === 0 ? '12:00 AM' : i < 12 ? `${i}:00 AM` : i === 12 ? '12:00 PM' : `${i - 12}:00 PM`}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <button className="text-secondary hover:text-error-container ml-auto hidden sm:block">
                        <span className="material-symbols-outlined text-[20px]">content_copy</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1 text-sm font-medium text-secondary">
                      Unavailable
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Date Overrides Placeholder */}
        <div className="bg-white rounded-3xl border border-outline-variant/20 shadow-sm p-8 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">event_busy</span>
            </div>
            <div>
              <h3 className="font-bold text-primary text-lg">Date Overrides</h3>
              <p className="text-sm text-secondary mt-0.5">Add days when you are unavailable, like holidays.</p>
            </div>
          </div>
          <button className="bg-surface-container text-primary px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-outline-variant/20 transition-all text-sm">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Date Override
          </button>
        </div>

      </div>
    </DashboardLayout>
  );
}
