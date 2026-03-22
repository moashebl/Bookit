'use client';

import { useState, useEffect, useCallback } from 'react';
import Calendar from './Calendar';
import TimeSlots from './TimeSlots';
import ConfirmationModal from './ConfirmationModal';
import LoadingSkeleton from './LoadingSkeleton';
import ErrorState from './ErrorState';
import { getAvailableSlots, bookSession, ApiError } from '@/lib/api';
import type { TimeSlot } from '@bookit/shared';

/**
 * BookingWidget — Main booking interface.
 * 
 * Composes Calendar + TimeSlots + "Book Session" button + ConfirmationModal.
 * Manages all booking state: selected date, selected slot, loading, errors.
 * 
 * State machine:
 * idle → (select date) → loading → (slots loaded) → slot-selection
 * → (click Book) → booking → (success) → confirmation-modal
 * → (error at any step) → error-state
 */
export default function BookingWidget() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedDateTime, setConfirmedDateTime] = useState('');

  /** Fetch available slots when a date is selected */
  const fetchSlots = useCallback(async (date: string) => {
    setIsLoadingSlots(true);
    setError(null);
    setSelectedSlotId(null);
    setSlots([]);

    try {
      const response = await getAvailableSlots(date);
      setSlots(response.slots);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Failed to load available slots. Please try again.';
      setError(message);
    } finally {
      setIsLoadingSlots(false);
    }
  }, []);

  /** Refresh slots when date changes */
  useEffect(() => {
    if (selectedDate) {
      fetchSlots(selectedDate);
    }
  }, [selectedDate, fetchSlots]);

  /** Handle date selection from the calendar */
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  /** Handle slot selection */
  const handleSlotSelect = (slotId: string) => {
    setSelectedSlotId(slotId);
  };

  /** Handle booking submission */
  const handleBookSession = async () => {
    if (!selectedSlotId || !selectedDate) return;

    setIsBooking(true);
    setError(null);

    try {
      const booking = await bookSession(selectedSlotId, selectedDate);

      // Format the confirmed date/time for the modal
      const date = new Date(booking.date + 'T00:00:00');
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      const monthDay = date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
      });

      // Format time from 24h to 12h
      const [hours, minutes] = booking.startTime.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      const timeStr = `${displayHour}:${String(minutes).padStart(2, '0')} ${period}`;

      setConfirmedDateTime(`${dayName}, ${monthDay} at ${timeStr}`);
      setShowConfirmation(true);

      // Refresh available slots (the booked slot should now be gone)
      fetchSlots(selectedDate);
      setSelectedSlotId(null);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Failed to create booking. Please try again.';
      setError(message);
    } finally {
      setIsBooking(false);
    }
  };

  /** Handle retry from error state */
  const handleRetry = () => {
    if (selectedDate) {
      fetchSlots(selectedDate);
    }
  };

  return (
    <section className="lg:col-span-7 bg-surface-container-lowest rounded-[2rem] p-8 lg:p-10 shadow-[0_24px_64px_rgba(0,0,0,0.04)] border border-outline-variant/10">
      <div className="space-y-10">
        {/* Error State */}
        {error && !isLoadingSlots ? (
          <ErrorState
            message={error}
            onRetry={handleRetry}
            onCancel={() => setError(null)}
          />
        ) : isLoadingSlots ? (
          /* Loading Skeleton */
          <LoadingSkeleton />
        ) : (
          /* Normal State: Calendar + Time Slots */
          <>
            {/* Calendar */}
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />

            {/* Available Time Slots */}
            <TimeSlots
              slots={slots}
              selectedSlotId={selectedSlotId}
              onSlotSelect={handleSlotSelect}
              selectedDate={selectedDate}
            />

            {/* Book Session Button */}
            <div className="pt-6">
              <button
                onClick={handleBookSession}
                disabled={!selectedSlotId || isBooking}
                className={`w-full py-5 bg-gradient-to-br from-primary to-primary-container text-white rounded-2xl font-black text-lg tracking-tight hover:shadow-2xl hover:shadow-primary-container/40 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 ${
                  !selectedSlotId || isBooking
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
              >
                {isBooking ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">
                      progress_activity
                    </span>
                    Booking...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">
                      verified_user
                    </span>
                    Book Session
                  </>
                )}
              </button>
              <p className="text-center mt-4 text-xs text-secondary/60">
                No payment required until after the session.
              </p>
            </div>
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        dateTime={confirmedDateTime}
        onClose={() => setShowConfirmation(false)}
      />
    </section>
  );
}
