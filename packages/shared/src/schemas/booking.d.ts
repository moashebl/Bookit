import { z } from 'zod';
/** Schema for querying available time slots by date */
export declare const availableSlotsQuerySchema: z.ZodObject<{
    date: z.ZodString;
}, "strip", z.ZodTypeAny, {
    date: string;
}, {
    date: string;
}>;
/** Schema for a single time slot returned from the API */
export declare const timeSlotSchema: z.ZodObject<{
    id: z.ZodString;
    date: z.ZodString;
    startTime: z.ZodString;
    endTime: z.ZodString;
    duration: z.ZodNumber;
    isAvailable: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    date: string;
    id: string;
    startTime: string;
    endTime: string;
    duration: number;
    isAvailable?: boolean | undefined;
}, {
    date: string;
    id: string;
    startTime: string;
    endTime: string;
    duration: number;
    isAvailable?: boolean | undefined;
}>;
/** Schema for creating a new booking */
export declare const createBookingSchema: z.ZodObject<{
    timeSlotId: z.ZodString;
    date: z.ZodString;
}, "strip", z.ZodTypeAny, {
    date: string;
    timeSlotId: string;
}, {
    date: string;
    timeSlotId: string;
}>;
/** Booking status enum values */
export declare const bookingStatusEnum: z.ZodEnum<["confirmed", "cancelled"]>;
/** Schema for a booking record returned from the API */
export declare const bookingResponseSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timeSlotId: z.ZodString;
    status: z.ZodEnum<["confirmed", "cancelled"]>;
    date: z.ZodString;
    startTime: z.ZodString;
    endTime: z.ZodString;
    duration: z.ZodNumber;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    date: string;
    id: string;
    createdAt: string;
    startTime: string;
    endTime: string;
    duration: number;
    userId: string;
    timeSlotId: string;
    status: "confirmed" | "cancelled";
}, {
    date: string;
    id: string;
    createdAt: string;
    startTime: string;
    endTime: string;
    duration: number;
    userId: string;
    timeSlotId: string;
    status: "confirmed" | "cancelled";
}>;
/** Schema for the available slots API response */
export declare const availableSlotsResponseSchema: z.ZodObject<{
    date: z.ZodString;
    slots: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        date: z.ZodString;
        startTime: z.ZodString;
        endTime: z.ZodString;
        duration: z.ZodNumber;
        isAvailable: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        date: string;
        id: string;
        startTime: string;
        endTime: string;
        duration: number;
        isAvailable?: boolean | undefined;
    }, {
        date: string;
        id: string;
        startTime: string;
        endTime: string;
        duration: number;
        isAvailable?: boolean | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    date: string;
    slots: {
        date: string;
        id: string;
        startTime: string;
        endTime: string;
        duration: number;
        isAvailable?: boolean | undefined;
    }[];
}, {
    date: string;
    slots: {
        date: string;
        id: string;
        startTime: string;
        endTime: string;
        duration: number;
        isAvailable?: boolean | undefined;
    }[];
}>;
export type AvailableSlotsQuery = z.infer<typeof availableSlotsQuerySchema>;
export type TimeSlot = z.infer<typeof timeSlotSchema>;
export type CreateBooking = z.infer<typeof createBookingSchema>;
export type BookingStatus = z.infer<typeof bookingStatusEnum>;
export type BookingResponse = z.infer<typeof bookingResponseSchema>;
export type AvailableSlotsResponse = z.infer<typeof availableSlotsResponseSchema>;
//# sourceMappingURL=booking.d.ts.map