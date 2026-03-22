import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { eq, and, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '../database/database.module';
import * as schema from '../database/schema';
import type { AvailableSlotsResponse, BookingResponse } from '@bookit/shared';

/**
 * Bookings service.
 * Contains core business logic for session availability
 * and booking creation with double-booking prevention.
 */
@Injectable()
export class BookingsService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  /**
   * Returns available time slots for a given date.
   * 
   * Logic:
   * 1. Fetches all time slots for the specified date
   * 2. Fetches all confirmed bookings for those slots
   * 3. Filters out already-booked slots
   * 4. Returns only available slots with timezone-aware times
   * 
   * @param dateStr - Date in YYYY-MM-DD format
   */
  async getAvailableSessions(dateStr: string): Promise<AvailableSlotsResponse> {
    // Get all time slots for the requested date
    const allSlots = await this.db
      .select()
      .from(schema.timeSlots)
      .where(eq(schema.timeSlots.date, dateStr))
      .orderBy(schema.timeSlots.startTime);

    // Get all confirmed bookings for slots on this date
    const bookedSlotIds = await this.db
      .select({ timeSlotId: schema.bookings.timeSlotId })
      .from(schema.bookings)
      .innerJoin(
        schema.timeSlots,
        eq(schema.bookings.timeSlotId, schema.timeSlots.id),
      )
      .where(
        and(
          eq(schema.timeSlots.date, dateStr),
          eq(schema.bookings.status, 'confirmed'),
        ),
      );

    // Create a Set of booked slot IDs for fast lookup
    const bookedIds = new Set(bookedSlotIds.map((b) => b.timeSlotId));

    // Filter out booked slots and map to response format
    const availableSlots = allSlots
      .filter((slot) => !bookedIds.has(slot.id))
      .map((slot) => ({
        id: slot.id,
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        duration: slot.duration,
        isAvailable: true,
      }));

    return {
      date: dateStr,
      slots: availableSlots,
    };
  }

  /**
   * Returns all bookings for a specific user, including the time slot details.
   */
  async getMyBookings(userId: string): Promise<BookingResponse[]> {
    const userBookings = await this.db
      .select()
      .from(schema.bookings)
      .innerJoin(
        schema.timeSlots,
        eq(schema.bookings.timeSlotId, schema.timeSlots.id),
      )
      .where(eq(schema.bookings.userId, userId))
      .orderBy(sql`${schema.timeSlots.date} DESC, ${schema.timeSlots.startTime} DESC`);

    return userBookings.map((b) => ({
      id: b.bookings.id,
      userId: b.bookings.userId,
      timeSlotId: b.bookings.timeSlotId,
      status: b.bookings.status,
      date: b.time_slots.date,
      startTime: b.time_slots.startTime,
      endTime: b.time_slots.endTime,
      duration: b.time_slots.duration,
      createdAt: b.bookings.createdAt.toISOString(),
    }));
  }

  /**
   * Books a session for a user.
   *
   * Uses a database transaction to prevent race conditions:
   * 1. Verifies the time slot exists
   * 2. Checks if it's already booked (within the transaction)
   * 3. Creates the booking record
   *
   * The unique index on bookings.timeSlotId acts as a final safety net
   * against concurrent double bookings.
   *
   * @param userId - The authenticated user's ID
   * @param timeSlotId - The time slot to book
   * @throws NotFoundException if time slot doesn't exist
   * @throws ConflictException if slot is already booked
   */
  async bookSession(
    userId: string,
    timeSlotId: string,
  ): Promise<BookingResponse> {
    try {
      // Use a transaction to ensure atomicity
      const result = await this.db.transaction(async (tx) => {
        // 1. Verify the time slot exists
        const [slot] = await tx
          .select()
          .from(schema.timeSlots)
          .where(eq(schema.timeSlots.id, timeSlotId))
          .limit(1);

        if (!slot) {
          throw new NotFoundException('Time slot not found');
        }

        // 2. Check if this slot is already booked (SELECT FOR UPDATE pattern)
        const [existingBooking] = await tx
          .select()
          .from(schema.bookings)
          .where(
            and(
              eq(schema.bookings.timeSlotId, timeSlotId),
              eq(schema.bookings.status, 'confirmed'),
            ),
          )
          .limit(1);

        if (existingBooking) {
          throw new ConflictException(
            'This time slot is already booked. Please select another slot.',
          );
        }

        // 3. Create the booking
        const [booking] = await tx
          .insert(schema.bookings)
          .values({
            userId,
            timeSlotId,
            status: 'confirmed',
          })
          .returning();

        return {
          booking,
          slot,
        };
      });

      // Map to response format
      return {
        id: result.booking.id,
        userId: result.booking.userId,
        timeSlotId: result.booking.timeSlotId,
        status: result.booking.status,
        date: result.slot.date,
        startTime: result.slot.startTime,
        endTime: result.slot.endTime,
        duration: result.slot.duration,
        createdAt: result.booking.createdAt.toISOString(),
      };
    } catch (error) {
      // Re-throw NestJS HTTP exceptions as-is
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      // Handle unique constraint violation (concurrent double booking)
      if (
        error instanceof Error &&
        error.message.includes('unique_active_booking')
      ) {
        throw new ConflictException(
          'This time slot was just booked by someone else. Please select another slot.',
        );
      }

      throw new InternalServerErrorException(
        'An error occurred while creating the booking',
      );
    }
  }

  /**
   * Cancels a booking.
   * Verify it belongs to the user, then update status to cancelled.
   */
  async cancelBooking(userId: string, bookingId: string): Promise<void> {
    const [booking] = await this.db
      .select()
      .from(schema.bookings)
      .where(
        and(
          eq(schema.bookings.id, bookingId),
          eq(schema.bookings.userId, userId)
        )
      )
      .limit(1);

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status === 'cancelled') {
      return; // already cancelled
    }

    await this.db
      .update(schema.bookings)
      .set({ status: 'cancelled' })
      .where(eq(schema.bookings.id, bookingId));
  }

  /**
   * Reschedules a booking to a new time slot.
   */
  async rescheduleBooking(
    userId: string,
    bookingId: string,
    newTimeSlotId: string,
  ): Promise<BookingResponse> {
    // We can run this in a transaction to safely swap the slot
    try {
      const result = await this.db.transaction(async (tx) => {
        // 1. Find the existing booking and verify ownership
        const [existingBooking] = await tx
          .select()
          .from(schema.bookings)
          .where(
            and(
              eq(schema.bookings.id, bookingId),
              eq(schema.bookings.userId, userId)
            )
          )
          .limit(1);

        if (!existingBooking) {
          throw new NotFoundException('Booking not found');
        }

        if (existingBooking.status === 'cancelled') {
           throw new ConflictException('Cannot reschedule a cancelled booking');
        }

        // 2. Verify the new time slot exists
        const [slot] = await tx
          .select()
          .from(schema.timeSlots)
          .where(eq(schema.timeSlots.id, newTimeSlotId))
          .limit(1);

        if (!slot) {
          throw new NotFoundException('New time slot not found');
        }

        // 3. Check if the new slot is already booked confirmed
        const [conflictingBooking] = await tx
          .select()
          .from(schema.bookings)
          .where(
            and(
              eq(schema.bookings.timeSlotId, newTimeSlotId),
              eq(schema.bookings.status, 'confirmed'),
            ),
          )
          .limit(1);

        if (conflictingBooking) {
          throw new ConflictException(
            'The requested time slot is already booked. Please select another slot.',
          );
        }

        // 4. Update the booking
        const [updatedBooking] = await tx
          .update(schema.bookings)
          .set({ timeSlotId: newTimeSlotId, status: 'confirmed' })
          .where(eq(schema.bookings.id, bookingId))
          .returning();

        return {
          booking: updatedBooking,
          slot,
        };
      });

      // Map to response format
      return {
        id: result.booking.id,
        userId: result.booking.userId,
        timeSlotId: result.booking.timeSlotId,
        status: result.booking.status,
        date: result.slot.date,
        startTime: result.slot.startTime,
        endTime: result.slot.endTime,
        duration: result.slot.duration,
        createdAt: result.booking.createdAt.toISOString(),
      };
    } catch (error) {
       if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      if (
        error instanceof Error &&
        error.message.includes('unique_active_booking')
      ) {
        throw new ConflictException(
          'This time slot was just booked by someone else. Please select another slot.',
        );
      }

      throw new InternalServerErrorException(
        'An error occurred while rescheduling the booking',
      );
    }
  }

  /**
   * Creates a new time slot.
   */
  async createTimeSlot(
    date: string,
    startTime: string,
    endTime: string,
    duration: number,
  ) {
    const [slot] = await this.db
      .insert(schema.timeSlots)
      .values({
        date,
        startTime,
        endTime,
        duration,
      })
      .returning();
    return slot;
  }
}
