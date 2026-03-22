'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getMyBookings } from '@/lib/api';
import type { BookingResponse } from '@bookit/shared';
import dayjs from 'dayjs';

export default function DashboardPage() {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllBookings() {
      try {
        const data = await getMyBookings();
        setBookings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAllBookings();
  }, []);

  const totalSessions = bookings.length;
  const upcomingBookings = bookings.filter(b => {
    const slotTime = dayjs(`${b.date}T${b.startTime}`);
    return slotTime.isAfter(dayjs());
  });
  const upcomingCount = upcomingBookings.length;
  
  // Sort upcoming to get the "Next Session"
  upcomingBookings.sort((a, b) => {
    return dayjs(`${a.date}T${a.startTime}`).diff(dayjs(`${b.date}T${b.startTime}`));
  });
  
  const nextSession = upcomingBookings[0] || null;
  const recentBookings = [...bookings]
    .filter(b => dayjs(`${b.date}T${b.startTime}`).isBefore(dayjs()))
    .sort((a, b) => dayjs(`${b.date}T${b.startTime}`).diff(dayjs(`${a.date}T${a.startTime}`)))
    .slice(0, 3);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-primary">
              Welcome back
            </h1>
            <p className="text-secondary mt-1">
              Here is what's happening with your bookings today.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="bg-white border border-outline-variant/30 text-primary px-5 py-2.5 rounded-xl font-bold hover:bg-surface-container active:scale-[0.98] transition-all flex items-center gap-2 text-sm shadow-sm">
              <span className="material-symbols-outlined text-[18px]">calendar_add_on</span>
              Manage Availability
            </button>
            <button className="bg-primary-container text-white px-5 py-2.5 rounded-xl font-bold hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2 text-sm shadow-sm">
              <span className="material-symbols-outlined text-[18px]">add</span>
              New Session
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-outline-variant/20 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-primary-container/10 flex items-center justify-center text-primary-container">
              <span className="material-symbols-outlined text-3xl">event_upcoming</span>
            </div>
            <div>
              <p className="text-sm font-medium text-secondary">Upcoming Sessions</p>
              <h3 className="text-3xl font-black text-primary">
                {loading ? '--' : upcomingCount}
              </h3>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-3xl border border-outline-variant/20 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32]">
              <span className="material-symbols-outlined text-3xl">task_alt</span>
            </div>
            <div>
              <p className="text-sm font-medium text-secondary">Total Completed</p>
              <h3 className="text-3xl font-black text-primary">
                {loading ? '--' : Math.max(0, totalSessions - upcomingCount)}
              </h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-outline-variant/20 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF3E0] flex items-center justify-center text-[#E65100]">
              <span className="material-symbols-outlined text-3xl">schedule</span>
            </div>
            <div>
              <p className="text-sm font-medium text-secondary">Hours Mentored</p>
              <h3 className="text-3xl font-black text-primary">
                {loading ? '--' : Math.round(bookings.filter(b => dayjs(`${b.date}T${b.startTime}`).isBefore(dayjs())).reduce((acc, curr) => acc + curr.duration, 0) / 60)}
              </h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="xl:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl border border-outline-variant/20 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-outline-variant/10">
                <h2 className="text-xl font-bold text-primary">Next Up</h2>
              </div>
              <div className="p-8">
                {loading ? (
                  <div className="h-24 bg-surface-container rounded-xl skeleton-shimmer" />
                ) : nextSession ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-surface-container/50 p-6 rounded-2xl border border-primary-container/20">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-full bg-[#E3F2FD] text-[#002147] font-black text-xl flex items-center justify-center shrink-0">
                        {dayjs(`${nextSession.date}T${nextSession.startTime}`).format('D')}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-primary">
                          {dayjs(`${nextSession.date}T${nextSession.startTime}`).format('dddd, MMMM YYYY')}
                        </h3>
                        <p className="text-secondary font-medium mt-1">
                          {dayjs(`${nextSession.date}T${nextSession.startTime}`).format('h:mm A')} - {dayjs(`${nextSession.date}T${nextSession.startTime}`).add(nextSession.duration, 'minute').format('h:mm A')}
                        </p>
                      </div>
                    </div>
                    <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm w-full sm:w-auto hover:bg-primary/90 transition-colors">
                      Join Session
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-4 text-secondary">
                      <span className="material-symbols-outlined text-3xl">event_busy</span>
                    </div>
                    <h3 className="text-lg font-bold text-primary">No Upcoming Sessions</h3>
                    <p className="text-sm text-secondary mt-1">You have no sessions scheduled for the future.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-outline-variant/20 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-outline-variant/10 flex items-center justify-between">
                <h2 className="text-xl font-bold text-primary">Recent Activity</h2>
                <button className="text-primary-container text-sm font-bold hover:underline">View All</button>
              </div>
              <div className="divide-y divide-outline-variant/10">
                {loading ? (
                  <div className="p-6 space-y-4">
                    <div className="h-16 bg-surface-container rounded-xl skeleton-shimmer" />
                    <div className="h-16 bg-surface-container rounded-xl skeleton-shimmer" />
                  </div>
                ) : recentBookings.length > 0 ? (
                  recentBookings.map((b) => (
                    <div key={b.id} className="p-6 flex items-center justify-between hover:bg-surface-container/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary">
                          <span className="material-symbols-outlined text-[20px]">check_circle</span>
                        </div>
                        <div>
                          <p className="font-bold text-primary">Mentoring Session</p>
                          <p className="text-xs text-secondary font-medium mt-0.5">
                            {dayjs(`${b.date}T${b.startTime}`).format('MMM D, YYYY • h:mm A')}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-[#2E7D32] bg-[#E8F5E9] px-3 py-1 rounded-full">Completed</span>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-sm text-secondary font-medium">
                    No recent activity to show.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            <div className="bg-primary/5 rounded-3xl border border-primary/10 p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl">share</span>
              </div>
              <h3 className="text-lg font-bold text-primary mb-2">Share Your Link</h3>
              <p className="text-sm text-secondary mb-6">
                Send your unique booking link to clients so they can schedule time with you instantly.
              </p>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.origin);
                  alert('Link copied to clipboard!');
                }}
                className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors"
              >
                Copy Link
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-outline-variant/20 shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-primary text-lg">Quick Setup</h3>
              
              <div className="space-y-3">
                <div className="flex gap-3 items-start p-3 bg-surface-container rounded-xl">
                  <span className="material-symbols-outlined text-[#2E7D32] mt-0.5">check_circle</span>
                  <div>
                    <p className="text-sm font-bold text-primary">Create Profile</p>
                    <p className="text-xs text-secondary mt-0.5">Your basic information is set.</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start p-3 hover:bg-surface-container rounded-xl transition-colors cursor-pointer border border-transparent hover:border-outline-variant/20">
                  <span className="material-symbols-outlined text-secondary mt-0.5">radio_button_unchecked</span>
                  <div>
                    <p className="text-sm font-bold text-primary">Set Availability</p>
                    <p className="text-xs text-secondary mt-0.5">Define your working hours.</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start p-3 hover:bg-surface-container rounded-xl transition-colors cursor-pointer border border-transparent hover:border-outline-variant/20">
                  <span className="material-symbols-outlined text-secondary mt-0.5">radio_button_unchecked</span>
                  <div>
                    <p className="text-sm font-bold text-primary">Connect Calendar</p>
                    <p className="text-xs text-secondary mt-0.5">Sync with Google Calendar.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
