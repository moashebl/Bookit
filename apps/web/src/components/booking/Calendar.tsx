'use client';

import { useState, useMemo } from 'react';

interface CalendarProps {
  /** Currently selected date (YYYY-MM-DD format) */
  selectedDate: string | null;
  /** Callback when a date is selected */
  onDateSelect: (date: string) => void;
  /** Dates that have available slots (dots shown below them) */
  availableDates?: string[];
}

/**
 * Calendar — Monthly calendar for date selection.
 * 
 * Features:
 * - Month navigation with chevron buttons
 * - 7-column grid (Sun–Sat)
 * - Selected date highlighted with primary-container circle
 * - Green dots under dates with available slots (tertiary-fixed-dim)
 * - Previous month days shown in faded text
 */
export default function Calendar({
  selectedDate,
  onDateSelect,
  availableDates = [],
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  /** Navigate to previous month */
  const goToPrevMonth = () => {
    setCurrentMonth((prev) => {
      if (prev.month === 0) {
        return { year: prev.year - 1, month: 11 };
      }
      return { ...prev, month: prev.month - 1 };
    });
  };

  /** Navigate to next month */
  const goToNextMonth = () => {
    setCurrentMonth((prev) => {
      if (prev.month === 11) {
        return { year: prev.year + 1, month: 0 };
      }
      return { ...prev, month: prev.month + 1 };
    });
  };

  /** Generate calendar grid data for the current month */
  const calendarDays = useMemo(() => {
    const { year, month } = currentMonth;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay(); // 0 = Sunday
    const daysInMonth = lastDay.getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days: Array<{
      day: number;
      date: string;
      isCurrentMonth: boolean;
      isToday: boolean;
    }> = [];

    // Previous month trailing days
    for (let i = startDay - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      days.push({
        day: d,
        date: `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    // Current month days
    const today = new Date();
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        day: d,
        date: dateStr,
        isCurrentMonth: true,
        isToday:
          d === today.getDate() &&
          month === today.getMonth() &&
          year === today.getFullYear(),
      });
    }

    return days;
  }, [currentMonth]);

  /** Set of available dates for O(1) lookup */
  const availableDateSet = useMemo(
    () => new Set(availableDates),
    [availableDates],
  );

  const monthName = new Date(
    currentMonth.year,
    currentMonth.month,
  ).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      {/* Header: "Select a Date" + month navigation */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-primary">Select a Date</h2>
        <div className="flex gap-2">
          <button
            onClick={goToPrevMonth}
            className="p-2 hover:bg-surface-container rounded-lg transition-colors"
            aria-label="Previous month"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-surface-container rounded-lg transition-colors"
            aria-label="Next month"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Month/Year label */}
      <div className="text-sm font-semibold text-secondary text-center">
        {monthName}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-y-4 text-center">
        {/* Weekday headers */}
        {weekdays.map((day) => (
          <div
            key={day}
            className="text-[10px] font-bold uppercase tracking-widest text-secondary opacity-50"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarDays.map((dayInfo, index) => {
          const isSelected = dayInfo.date === selectedDate;
          const hasAvailability = availableDateSet.has(dayInfo.date);

          if (!dayInfo.isCurrentMonth) {
            return (
              <div key={index} className="p-3 text-sm text-secondary/30">
                {dayInfo.day}
              </div>
            );
          }

          return (
            <button
              key={index}
              onClick={() => onDateSelect(dayInfo.date)}
              className={`p-3 text-sm font-semibold rounded-full relative transition-colors ${
                isSelected
                  ? 'bg-primary-container text-white shadow-lg shadow-primary-container/30'
                  : 'hover:bg-surface-container'
              }`}
            >
              {dayInfo.day}
              {/* Green dot indicator for dates with available slots */}
              {hasAvailability && !isSelected && (
                <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-tertiary-fixed-dim rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
