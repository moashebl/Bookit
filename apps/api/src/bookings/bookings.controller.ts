import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Query,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import {
  availableSlotsQuerySchema,
  createBookingSchema,
  type AvailableSlotsQuery,
  type CreateBooking,
} from '@bookit/shared';

/**
 * Bookings controller.
 * All routes are protected by JWT authentication.
 */
@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  /**
   * GET /api/bookings/available?date=YYYY-MM-DD
   * Returns available time slots for the specified date,
   * filtering out already-booked sessions.
   */
  @Get('available')
  async getAvailableSessions(
    @Query(new ZodValidationPipe(availableSlotsQuerySchema))
    query: AvailableSlotsQuery,
  ) {
    return this.bookingsService.getAvailableSessions(query.date);
  }

  /**
   * GET /api/bookings
   * Returns all bookings for the authenticated user.
   */
  @Get()
  async getMyBookings(@Request() req: { user: { id: string } }) {
    return this.bookingsService.getMyBookings(req.user.id);
  }

  /**
   * POST /api/bookings
   * Creates a new booking for the authenticated user.
   * Validates availability and prevents double bookings via DB transactions.
   */
  @Post()
  async bookSession(
    @Body(new ZodValidationPipe(createBookingSchema))
    body: CreateBooking,
    @Request() req: { user: { id: string } },
  ) {
    return this.bookingsService.bookSession(req.user.id, body.timeSlotId);
  }

  /**
   * DELETE /api/bookings/:id
   * Cancels a booking.
   */
  @Delete(':id')
  async cancelBooking(
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
  ) {
    await this.bookingsService.cancelBooking(req.user.id, id);
    return { success: true };
  }

  /**
   * PATCH /api/bookings/:id
   * Reschedules a booking to a new time slot.
   */
  @Patch(':id')
  async rescheduleBooking(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(createBookingSchema))
    body: CreateBooking,
    @Request() req: { user: { id: string } },
  ) {
    return this.bookingsService.rescheduleBooking(req.user.id, id, body.timeSlotId);
  }

  /**
   * POST /api/bookings/time-slots
   * Creates a new time slot
   */
  @Post('time-slots')
  async createTimeSlot(
    @Body() body: { date: string; startTime: string; endTime: string; duration: number },
  ) {
    return this.bookingsService.createTimeSlot(
      body.date,
      body.startTime,
      body.endTime,
      body.duration,
    );
  }
}
