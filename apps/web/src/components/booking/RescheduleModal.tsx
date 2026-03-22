'use client';

import { useState, useEffect, useCallback } from 'react';
import Calendar from './Calendar';
import TimeSlots from './TimeSlots';
import LoadingSkeleton from './LoadingSkeleton';
import ErrorState from './ErrorState';
import { getAvailableSlots, rescheduleBooking, ApiError } from '@/lib/api';
import type { TimeSlot } from '@bookit/shared';

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string | null;
  onRescheduleSuccess: () => void;
}

export default function RescheduleModal({
  isOpen,
  onClose,
  bookingId,
  onRescheduleSuccess,
}: RescheduleModalProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Reset state when modal opens/closes */
  useEffect(() => {
    if (isOpen) {
      setSelectedDate(null);
      setSelectedSlotId(null);
      setSlots([]);
      setError(null);
    }
  }, [isOpen]);

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
    if (selectedDate && isOpen) {
      fetchSlots(selectedDate);
    }
  }, [selectedDate, fetchSlots, isOpen]);

  if (!isOpen || !bookingId) return null;

  const handleDateSelect = (date: string) => setSelectedDate(date);
  const handleSlotSelect = (slotId: string) => setSelectedSlotId(slotId);

  const handleReschedule = async () => {
    if (!selectedSlotId || !selectedDate || !bookingId) return;

    setIsRescheduling(true);
    setError(null);

    try {
      await rescheduleBooking(bookingId, selectedSlotId, selectedDate);
      alert('Booking rescheduled successfully!');
      onRescheduleSuccess();
      onClose();
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Failed to reschedule booking. Please try again.';
      setError(message);
    } finally {
      setIsRescheduling(false);
    }
  };

  const handleRetry = () => {
    if (selectedDate) fetchSlots(selectedDate);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#000a1e]/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-surface-container-lowest rounded-[2rem] w-full max-w-2xl shadow-2xl border border-outline-variant/10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-8 py-6 border-b border-outline-variant/10 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-black text-primary tracking-tight">Reschedule Session</h2>
            <p className="text-secondary text-sm mt-1">Select a new date and time for your booking.</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary hover:bg-outline-variant/20 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-8 overflow-y-auto">
          <div className="space-y-10">
            {error && !isLoadingSlots ? (
              <ErrorState
                message={error}
                onRetry={handleRetry}
                onCancel={() => setError(null)}
              />
            ) : isLoadingSlots ? (
              <LoadingSkeleton />
            ) : (
              <>
                <Calendar
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect}
                />

                {selectedDate && (
                  <TimeSlots
                    slots={slots}
                    selectedSlotId={selectedSlotId}
                    onSlotSelect={handleSlotSelect}
                    selectedDate={selectedDate}
                  />
                )}

                {/* Confirm Button */}
                <div className="pt-6">
                  <button
                    onClick={handleReschedule}
                    disabled={!selectedSlotId || isRescheduling}
                    className={`w-full py-5 bg-gradient-to-br from-primary to-primary-container text-white rounded-2xl font-black text-lg tracking-tight hover:shadow-2xl hover:shadow-primary-container/40 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 ${
                      !selectedSlotId || isRescheduling
                        ? 'opacity-50 cursor-not-allowed hover:shadow-none hover:scale-100'
                        : ''
                    }`}
                  >
                    {isRescheduling ? (
                      <>
                        <span className="material-symbols-outlined animate-spin">
                          progress_activity
                        </span>
                        Confirming...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined">
                          event_available
                        </span>
                        Confirm New Time
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
