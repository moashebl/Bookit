'use client';

interface ErrorStateProps {
  /** Error message to display */
  message?: string;
  /** Callback for the "Retry Connection" button */
  onRetry: () => void;
  /** Callback for the "Cancel" button */
  onCancel?: () => void;
}

/**
 * ErrorState — Error interaction card.
 * 
 * Displays when API calls fail:
 * - Cloud_off icon in error-container background
 * - "System Interrupted" title
 * - Descriptive error message
 * - "Retry Connection" and "Cancel" buttons
 * - Subtle ghost-border error detail box with error code/timestamp
 * 
 * Matches the Stitch loading_error_states_desktop design.
 */
export default function ErrorState({ message, onRetry, onCancel }: ErrorStateProps) {
  const errorMessage =
    message ||
    'Failed to load availability. Please check your connection and try again.';

  const timestamp = new Date().toISOString();

  return (
    <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
      <div className="p-12 flex flex-col items-center text-center space-y-6">
        {/* Error Icon */}
        <div className="w-16 h-16 rounded-full bg-error-container/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-error text-4xl">
            cloud_off
          </span>
        </div>

        {/* Error Message */}
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-on-surface tracking-tight">
            System Interrupted
          </h3>
          <p className="text-secondary max-w-sm leading-relaxed">
            {errorMessage}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex gap-3">
          <button
            onClick={onRetry}
            className="px-8 py-3 bg-primary-container text-white font-bold rounded-lg hover:shadow-lg hover:shadow-primary-container/20 transition-all active:scale-95 duration-100"
          >
            Retry Connection
          </button>
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-6 py-3 bg-surface-container-high text-on-surface font-semibold rounded-lg hover:bg-surface-dim transition-colors"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Ghost Border Error Detail */}
        <div className="w-full mt-8 p-4 bg-error-container/5 rounded-lg border border-error/10 flex items-start gap-4 text-left">
          <span className="material-symbols-outlined text-error text-xl">
            info
          </span>
          <div className="text-[11px] font-medium text-on-error-container/80 font-mono leading-tight">
            ERROR_CODE: TIMEOUT_AVAILABILITY_GRID_0x82
            <br />
            TIMESTAMP: {timestamp}
          </div>
        </div>
      </div>
    </div>
  );
}
