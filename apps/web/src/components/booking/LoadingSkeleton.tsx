'use client';

/**
 * LoadingSkeleton — Shimmer loading state.
 * 
 * Shows placeholder skeleton UI while data is loading:
 * - Calendar skeleton: weekday headers + day grid with shimmer
 * - Time slots skeleton: 2-column grid with shimmer blocks
 * - Action button skeleton
 * 
 * Uses the skeleton-shimmer CSS animation (surface-container to surface-container-high gradient).
 */
export default function LoadingSkeleton() {
  return (
    <div className="space-y-10">
      {/* Calendar Skeleton */}
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="h-6 w-32 skeleton-shimmer rounded" />
          <div className="flex gap-2">
            <div className="h-8 w-8 skeleton-shimmer rounded-full" />
            <div className="h-8 w-8 skeleton-shimmer rounded-full" />
          </div>
        </div>

        {/* Weekday labels */}
        <div className="grid grid-cols-7 gap-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-4 w-8 skeleton-shimmer rounded mx-auto" />
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 gap-4">
          {/* Row 1 — static background */}
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={`r1-${i}`}
              className="h-12 w-12 bg-surface-container-low rounded-lg mx-auto"
            />
          ))}
          {/* Row 2 — static background */}
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={`r2-${i}`}
              className="h-12 w-12 bg-surface-container-low rounded-lg mx-auto"
            />
          ))}
          {/* Row 3 — shimmer */}
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={`r3-${i}`}
              className="h-12 w-12 skeleton-shimmer rounded-lg mx-auto"
            />
          ))}
        </div>
      </div>

      {/* Time Slots Skeleton */}
      <div className="space-y-6">
        {/* Section header */}
        <div className="space-y-2">
          <div className="h-4 w-24 skeleton-shimmer rounded" />
          <div className="h-8 w-48 skeleton-shimmer rounded" />
        </div>

        {/* Slot grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-14 skeleton-shimmer rounded-xl" />
          ))}
        </div>

        {/* Action button */}
        <div className="pt-4">
          <div className="h-14 w-full skeleton-shimmer rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
