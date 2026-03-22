import { z } from 'zod';

// ============================================
// Booking Schemas
// ============================================

/** Schema for querying available time slots by date */
export const availableSlotsQuerySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

/** Schema for a single time slot returned from the API */
export const timeSlotSchema = z.object({
  id: z.string().uuid(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  duration: z.number().int().positive(),
  isAvailable: z.boolean().optional(),
});

/** Schema for creating a new booking */
export const createBookingSchema = z.object({
  timeSlotId: z.string().uuid('Invalid time slot ID'),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

/** Booking status enum values */
export const bookingStatusEnum = z.enum(['confirmed', 'cancelled']);

/** Schema for a booking record returned from the API */
export const bookingResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  timeSlotId: z.string().uuid(),
  status: bookingStatusEnum,
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  duration: z.number().int().positive(),
  createdAt: z.string(),
});

/** Schema for the available slots API response */
export const availableSlotsResponseSchema = z.object({
  date: z.string(),
  slots: z.array(timeSlotSchema),
});

// ============================================
// Inferred TypeScript types
// ============================================

export type AvailableSlotsQuery = z.infer<typeof availableSlotsQuerySchema>;
export type TimeSlot = z.infer<typeof timeSlotSchema>;
export type CreateBooking = z.infer<typeof createBookingSchema>;
export type BookingStatus = z.infer<typeof bookingStatusEnum>;
export type BookingResponse = z.infer<typeof bookingResponseSchema>;
export type AvailableSlotsResponse = z.infer<typeof availableSlotsResponseSchema>;
