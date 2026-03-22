'use client';

import type { TimeSlot } from '@bookit/shared';

interface TimeSlotsProps {
  /** Array of available time slots to display */
  slots: TimeSlot[];
  /** Currently selected slot ID */
  selectedSlotId: string | null;
  /** Callback when a slot is selected */
  onSlotSelect: (slotId: string) => void;
  /** The selected date string (for display in the header badge) */
  selectedDate: string | null;
  /** Whether slots are loading */
  isLoading?: boolean;
}

/**
 * TimeSlots — Available time slots grid.
 * 
 * Shows a grid of bookable time slots for the selected date.
 * Desktop: 4-column grid with time + duration.
 * Mobile: 2-column grid with period label (MORNING/AFTERNOON/EVENING) + time.
 * Selected slot gets the primary-container dark background.
 */
export default function TimeSlots({
  slots,
  selectedSlotId,
  onSlotSelect,
  selectedDate,
}: TimeSlotsProps) {
  /** Format the date for the header badge (e.g., "Oct 7") */
  const formatDateBadge = (dateStr: string | null): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  /** Format a 24h time string to 12h format (e.g., "09:00:00" → "9:00 AM") */
  const formatTime = (timeStr: string): string => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHour}:${String(minutes).padStart(2, '0')} ${period}`;
  };

  /** Get period label (MORNING/AFTERNOON/EVENING) based on hour */
  const getPeriodLabel = (timeStr: string): string => {
    const hour = parseInt(timeStr.split(':')[0], 10);
    if (hour < 12) return 'MORNING';
    if (hour < 17) return 'AFTERNOON';
    return 'EVENING';
  };

  if (!selectedDate) {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-primary">Available Slots</h3>
        <p className="text-secondary text-sm">Select a date to view available time slots.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with date badge */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-primary">Available Slots</h3>
        <span className="text-xs font-bold text-on-primary-container bg-primary-fixed px-3 py-1 rounded-full uppercase tracking-widest">
          {formatDateBadge(selectedDate)}
        </span>
      </div>

      {/* Slots Grid */}
      {slots.length === 0 ? (
        <p className="text-secondary text-sm py-8 text-center">
          No available slots for this date. Try another day.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {slots.map((slot) => {
            const isSelected = slot.id === selectedSlotId;

            return (
              <button
                key={slot.id}
                onClick={() => onSlotSelect(slot.id)}
                className={`group p-4 rounded-xl transition-all duration-200 text-center active:scale-95 ${
                  isSelected
                    ? 'bg-primary-container border border-primary-container shadow-lg shadow-primary-container/20'
                    : 'bg-surface-container-low border border-transparent hover:border-primary-container'
                }`}
              >
                {/* Mobile: Show period label */}
                <span
                  className={`block sm:hidden text-[10px] font-black mb-1 ${
                    isSelected
                      ? 'text-on-primary-container opacity-80'
                      : 'text-secondary'
                  }`}
                >
                  {getPeriodLabel(slot.startTime)}
                </span>

                {/* Time */}
                <span
                  className={`block text-sm font-bold ${
                    isSelected
                      ? 'text-white'
                      : 'text-primary group-hover:text-primary-container'
                  }`}
                >
                  {formatTime(slot.startTime)}
                </span>

                {/* Duration */}
                <span
                  className={`text-[10px] ${
                    isSelected
                      ? 'text-primary-fixed opacity-70'
                      : 'text-secondary'
                  }`}
                >
                  {slot.duration} min
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
