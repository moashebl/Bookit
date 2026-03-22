'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary">
            Analytics Overview
          </h1>
          <p className="text-secondary mt-2">
            Track your mentoring engagement and booking history over time.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-outline-variant/20 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-primary-container/10 flex items-center justify-center text-primary-container mb-4">
              <span className="material-symbols-outlined font-bold">trending_up</span>
            </div>
            <p className="text-sm font-bold text-secondary">Total Sessions</p>
            <div className="flex items-end gap-3 mt-1">
              <h3 className="text-3xl font-black text-primary">128</h3>
              <span className="text-sm font-bold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-lg mb-1">+12%</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-outline-variant/20 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#FFF3E0] flex items-center justify-center text-[#E65100] mb-4">
              <span className="material-symbols-outlined font-bold">schedule</span>
            </div>
            <p className="text-sm font-bold text-secondary">Hours Mentored</p>
            <div className="flex items-end gap-3 mt-1">
              <h3 className="text-3xl font-black text-primary">84</h3>
              <span className="text-sm font-bold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-lg mb-1">+5%</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-outline-variant/20 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#E3F2FD] flex items-center justify-center text-[#002147] mb-4">
              <span className="material-symbols-outlined font-bold">group</span>
            </div>
            <p className="text-sm font-bold text-secondary">Unique Mentors</p>
            <div className="flex items-end gap-3 mt-1">
              <h3 className="text-3xl font-black text-primary">45</h3>
              <span className="text-sm font-bold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-lg mb-1">+8%</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-outline-variant/20 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#FCE4EC] flex items-center justify-center text-[#C2185B] mb-4">
              <span className="material-symbols-outlined font-bold">event_upcoming</span>
            </div>
            <p className="text-sm font-bold text-secondary">No-Shows</p>
            <div className="flex items-end gap-3 mt-1">
              <h3 className="text-3xl font-black text-primary">2</h3>
              <span className="text-sm font-bold text-secondary bg-surface-container px-2 py-0.5 rounded-lg mb-1">-1</span>
            </div>
          </div>
        </div>

        {/* Charts Mock Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-3xl border border-outline-variant/20 shadow-sm p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-primary">Engagement Over Time</h2>
              <select className="bg-surface-container border-none text-sm font-bold text-primary rounded-xl px-4 py-2 focus:ring-0">
                <option>Last 6 Months</option>
                <option>This Year</option>
                <option>All Time</option>
              </select>
            </div>
            
            {/* Mock Chart using Tailwind grids */}
            <div className="h-64 flex items-end justify-between gap-2 md:gap-4 mt-8">
              {[40, 60, 45, 80, 55, 90].map((height, i) => (
                <div key={i} className="w-full flex flex-col items-center gap-2 group">
                  <div className="w-full relative bg-surface-container rounded-t-xl overflow-hidden h-full flex items-end">
                    <div 
                      className="w-full bg-primary-container rounded-t-xl transition-all duration-500 group-hover:opacity-80"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-secondary">
                    {['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-outline-variant/20 shadow-sm p-8">
            <h2 className="text-xl font-bold text-primary mb-8">Popular Times</h2>
            
            <div className="space-y-6">
              {[
                { time: 'Morning (9AM - 12PM)', pct: 45 },
                { time: 'Afternoon (12PM - 4PM)', pct: 35 },
                { time: 'Evening (4PM - 7PM)', pct: 20 },
              ].map((slot, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-primary">{slot.time}</span>
                    <span className="text-secondary">{slot.pct}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-surface-container rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: `${slot.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-outline-variant/10">
              <p className="text-sm text-secondary leading-relaxed">
                Most of your mentees prefer scheduling sessions in the morning between 9 AM and 11 AM on Tuesdays and Thursdays.
              </p>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
