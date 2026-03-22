'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getMyBookings, cancelBooking } from '@/lib/api';
import type { BookingResponse } from '@bookit/shared';
import dayjs from 'dayjs';
import RescheduleModal from '@/components/booking/RescheduleModal';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      const data = await getMyBookings();
      setBookings(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    setCancellingId(id);
    try {
      await cancelBooking(id);
      await fetchBookings();
    } catch (err: any) {
      alert(err.message || 'Failed to cancel');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-primary">
              My Bookings
            </h1>
            <p className="text-secondary mt-2">
              View your upcoming and past bookings below.
            </p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 rounded-2xl bg-surface-container skeleton-shimmer" />
              ))}
            </div>
          ) : error ? (
            <div className="p-6 bg-error-container text-on-error-container rounded-2xl">
              {error}
            </div>
          ) : bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-surface-container rounded-3xl border border-outline-variant/20">
              <span className="material-symbols-outlined text-4xl text-secondary mb-4">
                event_busy
              </span>
              <h3 className="text-xl font-bold text-primary">No Bookings Found</h3>
              <p className="text-secondary mt-2">
                You haven't booked any sessions yet. Check the calendar to find an available time.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const dateObj = dayjs(`${booking.date}T${booking.startTime}`);
                const isPast = dateObj.isBefore(dayjs());
                const isCancelled = booking.status === 'cancelled';

                return (
                  <div 
                    key={booking.id}
                    className={`flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl border transition-shadow ${
                      isCancelled ? 'bg-surface-container/30 border-outline-variant/10 opacity-70' : 'bg-white border-outline-variant/20 shadow-sm hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCancelled ? 'bg-surface-container text-secondary' : 'bg-primary-container text-white'
                      }`}>
                        <span className="material-symbols-outlined">
                          {isCancelled ? 'event_busy' : 'event'}
                        </span>
                      </div>
                      <div>
                        <h3 className={`font-bold text-lg ${isCancelled ? 'text-secondary line-through' : 'text-primary'}`}>
                          {dateObj.format('dddd, MMMM D, YYYY')}
                        </h3>
                        <p className="text-secondary font-medium">
                          {dateObj.format('h:mm A')} - {dateObj.add(booking.duration, 'minute').format('h:mm A')} ({booking.duration} min)
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 items-center justify-end grid grid-cols-[1fr_auto] gap-3 self-end md:self-center">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-center ${
                        booking.status === 'confirmed' 
                          ? 'bg-[#E3F2FD] text-[#002147]' 
                          : 'bg-error-container text-on-error-container opacity-100'
                      }`}>
                        {booking.status}
                      </span>
                      
                      {!isPast && !isCancelled && (
                        <div className="flex items-center gap-2">
                          <button 
                            className="text-sm font-bold text-primary bg-surface-container hover:bg-outline-variant/20 px-4 py-1.5 rounded-full transition-colors"
                            onClick={() => setReschedulingId(booking.id)}
                          >
                            Reschedule
                          </button>
                          <button 
                            onClick={() => handleCancel(booking.id)}
                            disabled={cancellingId === booking.id}
                            className="text-sm font-bold text-on-error-container bg-error-container hover:opacity-80 px-4 py-1.5 rounded-full transition-colors disabled:opacity-50"
                          >
                            {cancellingId === booking.id ? '...' : 'Cancel'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DashboardLayout>

      <RescheduleModal 
        isOpen={!!reschedulingId} 
        onClose={() => setReschedulingId(null)} 
        bookingId={reschedulingId}
        onRescheduleSuccess={() => {
          setReschedulingId(null);
          fetchBookings();
        }}
      />
    </>
  );
}
