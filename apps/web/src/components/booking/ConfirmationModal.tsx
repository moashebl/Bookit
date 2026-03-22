'use client';

interface ConfirmationModalProps {
  /** Whether the modal is visible */
  isOpen: boolean;
  /** The confirmed booking date/time string */
  dateTime: string;
  /** Callback to close the modal */
  onClose: () => void;
}

/**
 * ConfirmationModal — Booking success modal.
 * 
 * Displays after a successful booking with:
 * - Blurred backdrop overlay (glassmorphism)
 * - Green check circle icon
 * - "Booking Confirmed!" title
 * - Date/time pill badge
 * - Description text
 * - "Done" CTA button
 * - Decorative gradient top border (tertiary-fixed-dim → primary-container)
 */
export default function ConfirmationModal({
  isOpen,
  dateTime,
  onClose,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 glass-overlay"
      onClick={onClose}
    >
      <div
        className="bg-surface-container-lowest w-full max-w-md rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col items-center text-center p-10 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Gradient Top Border */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-tertiary-fixed-dim via-primary-container to-tertiary-fixed-dim" />

        {/* Success Icon */}
        <div className="mb-8 flex items-center justify-center w-20 h-20 bg-tertiary-fixed-dim/20 rounded-full">
          <span
            className="material-symbols-outlined text-[48px] text-on-tertiary-container filled"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
        </div>

        {/* Content */}
        <div className="space-y-6 mb-10">
          <div>
            <h2 className="text-3xl font-black tracking-tighter text-primary mb-2">
              Booking Confirmed!
            </h2>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-surface-container text-on-surface-variant rounded-full text-sm font-semibold">
              <span className="material-symbols-outlined text-sm">
                calendar_today
              </span>
              {dateTime}
            </div>
          </div>

          <p className="text-secondary text-sm leading-relaxed px-4">
            You&apos;ll receive a calendar invitation shortly with all the
            session details.
          </p>
        </div>

        {/* Done Button */}
        <button
          onClick={onClose}
          className="w-full py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-lg font-bold text-sm tracking-tight shadow-lg shadow-primary/10 active:scale-95 transition-all duration-150"
        >
          Done
        </button>
      </div>
    </div>
  );
}
