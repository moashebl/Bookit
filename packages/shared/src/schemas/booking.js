"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.availableSlotsResponseSchema = exports.bookingResponseSchema = exports.bookingStatusEnum = exports.createBookingSchema = exports.timeSlotSchema = exports.availableSlotsQuerySchema = void 0;
const zod_1 = require("zod");
// ============================================
// Booking Schemas
// ============================================
/** Schema for querying available time slots by date */
exports.availableSlotsQuerySchema = zod_1.z.object({
    date: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});
/** Schema for a single time slot returned from the API */
exports.timeSlotSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    date: zod_1.z.string(),
    startTime: zod_1.z.string(),
    endTime: zod_1.z.string(),
    duration: zod_1.z.number().int().positive(),
    isAvailable: zod_1.z.boolean().optional(),
});
/** Schema for creating a new booking */
exports.createBookingSchema = zod_1.z.object({
    timeSlotId: zod_1.z.string().uuid('Invalid time slot ID'),
    date: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});
/** Booking status enum values */
exports.bookingStatusEnum = zod_1.z.enum(['confirmed', 'cancelled']);
/** Schema for a booking record returned from the API */
exports.bookingResponseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    userId: zod_1.z.string().uuid(),
    timeSlotId: zod_1.z.string().uuid(),
    status: exports.bookingStatusEnum,
    date: zod_1.z.string(),
    startTime: zod_1.z.string(),
    endTime: zod_1.z.string(),
    duration: zod_1.z.number().int().positive(),
    createdAt: zod_1.z.string(),
});
/** Schema for the available slots API response */
exports.availableSlotsResponseSchema = zod_1.z.object({
    date: zod_1.z.string(),
    slots: zod_1.z.array(exports.timeSlotSchema),
});
//# sourceMappingURL=booking.js.map