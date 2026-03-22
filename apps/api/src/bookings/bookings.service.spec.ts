import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { DRIZZLE } from '../database/database.module';
import { ConflictException, NotFoundException } from '@nestjs/common';

/**
 * Unit tests for BookingsService.
 * Uses a mock Drizzle database instance to test business logic in isolation.
 */
describe('BookingsService', () => {
  let service: BookingsService;

  // Mock time slots
  const mockSlots = [
    {
      id: 'slot-1',
      date: '2024-10-07',
      startTime: '09:00:00',
      endTime: '10:00:00',
      duration: 60,
      createdAt: new Date(),
    },
    {
      id: 'slot-2',
      date: '2024-10-07',
      startTime: '10:00:00',
      endTime: '11:00:00',
      duration: 60,
      createdAt: new Date(),
    },
    {
      id: 'slot-3',
      date: '2024-10-07',
      startTime: '11:00:00',
      endTime: '12:00:00',
      duration: 60,
      createdAt: new Date(),
    },
  ];

  // Mock bookings (slot-2 is booked)
  const mockBookings = [
    { timeSlotId: 'slot-2' },
  ];

  // --- Mock DB builder pattern ---
  // This creates a chainable mock that simulates Drizzle's query builder
  const createChainMock = (data: unknown[] = []) => {
    const chain: Record<string, jest.Mock> = {};
    chain.from = jest.fn().mockReturnValue(chain);
    chain.where = jest.fn().mockReturnValue(chain);
    chain.innerJoin = jest.fn().mockReturnValue(chain);
    chain.orderBy = jest.fn().mockReturnValue(chain);
    chain.limit = jest.fn().mockResolvedValue(data);
    // If no limit is called, resolve the chain itself
    chain.then = jest.fn((resolve) => resolve(data));
    return chain;
  };

  // Mock database instance
  const mockDb = {
    select: jest.fn(),
    insert: jest.fn(),
    transaction: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: DRIZZLE,
          useValue: mockDb,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
  });

  describe('getAvailableSessions', () => {
    it('should return only unbooked slots for a given date', async () => {
      // First select() call: get all slots for the date
      const allSlotsChain = createChainMock(mockSlots);
      // Second select() call: get booked slot IDs
      const bookedChain = createChainMock(mockBookings);

      mockDb.select
        .mockReturnValueOnce(allSlotsChain)
        .mockReturnValueOnce(bookedChain);

      const result = await service.getAvailableSessions('2024-10-07');

      expect(result.date).toBe('2024-10-07');
      expect(result.slots).toHaveLength(2); // slot-1 and slot-3 (slot-2 is booked)
      expect(result.slots.map((s) => s.id)).toEqual(['slot-1', 'slot-3']);
      expect(result.slots.every((s) => s.isAvailable === true)).toBe(true);
    });

    it('should return all slots when none are booked', async () => {
      const allSlotsChain = createChainMock(mockSlots);
      const bookedChain = createChainMock([]); // No bookings

      mockDb.select
        .mockReturnValueOnce(allSlotsChain)
        .mockReturnValueOnce(bookedChain);

      const result = await service.getAvailableSessions('2024-10-07');

      expect(result.slots).toHaveLength(3);
    });

    it('should return empty array when all slots are booked', async () => {
      const allSlotsChain = createChainMock(mockSlots);
      const bookedChain = createChainMock([
        { timeSlotId: 'slot-1' },
        { timeSlotId: 'slot-2' },
        { timeSlotId: 'slot-3' },
      ]);

      mockDb.select
        .mockReturnValueOnce(allSlotsChain)
        .mockReturnValueOnce(bookedChain);

      const result = await service.getAvailableSessions('2024-10-07');

      expect(result.slots).toHaveLength(0);
    });

    it('should return empty array for a date with no slots', async () => {
      const allSlotsChain = createChainMock([]); // No slots for this date
      const bookedChain = createChainMock([]);

      mockDb.select
        .mockReturnValueOnce(allSlotsChain)
        .mockReturnValueOnce(bookedChain);

      const result = await service.getAvailableSessions('2024-12-25');

      expect(result.date).toBe('2024-12-25');
      expect(result.slots).toHaveLength(0);
    });
  });

  describe('bookSession', () => {
    const mockUserId = 'user-123';
    const mockTimeSlotId = 'slot-1';

    it('should successfully create a booking', async () => {
      const mockBooking = {
        id: 'booking-1',
        userId: mockUserId,
        timeSlotId: mockTimeSlotId,
        status: 'confirmed',
        createdAt: new Date('2024-10-07T12:00:00Z'),
      };

      const mockSlot = mockSlots[0];

      // Mock the transaction callback
      mockDb.transaction.mockImplementation(async (callback: Function) => {
        const txMock = {
          select: jest.fn(),
          insert: jest.fn(),
        };

        // 1. Slot lookup
        const slotChain = createChainMock([mockSlot]);
        txMock.select.mockReturnValueOnce(slotChain);

        // 2. Existing booking check
        const bookingChain = createChainMock([]); // No existing booking
        txMock.select.mockReturnValueOnce(bookingChain);

        // 3. Insert booking
        const insertChain: Record<string, jest.Mock> = {};
        insertChain.values = jest.fn().mockReturnValue(insertChain);
        insertChain.returning = jest.fn().mockResolvedValue([mockBooking]);
        txMock.insert.mockReturnValue(insertChain);

        return callback(txMock);
      });

      const result = await service.bookSession(mockUserId, mockTimeSlotId);

      expect(result.id).toBe('booking-1');
      expect(result.status).toBe('confirmed');
      expect(result.userId).toBe(mockUserId);
      expect(result.timeSlotId).toBe(mockTimeSlotId);
    });

    it('should throw NotFoundException for non-existent time slot', async () => {
      mockDb.transaction.mockImplementation(async (callback: Function) => {
        const txMock = {
          select: jest.fn(),
        };

        // Slot lookup returns empty
        const slotChain = createChainMock([]);
        txMock.select.mockReturnValueOnce(slotChain);

        return callback(txMock);
      });

      await expect(
        service.bookSession(mockUserId, 'non-existent-slot'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException for already-booked slot', async () => {
      mockDb.transaction.mockImplementation(async (callback: Function) => {
        const txMock = {
          select: jest.fn(),
        };

        // Slot exists
        const slotChain = createChainMock([mockSlots[0]]);
        txMock.select.mockReturnValueOnce(slotChain);

        // Existing booking found
        const bookingChain = createChainMock([
          { id: 'existing-booking', status: 'confirmed' },
        ]);
        txMock.select.mockReturnValueOnce(bookingChain);

        return callback(txMock);
      });

      await expect(
        service.bookSession(mockUserId, mockTimeSlotId),
      ).rejects.toThrow(ConflictException);
    });

    it('should handle concurrent double booking via unique constraint', async () => {
      mockDb.transaction.mockRejectedValue(
        new Error('unique_active_booking constraint violated'),
      );

      await expect(
        service.bookSession(mockUserId, mockTimeSlotId),
      ).rejects.toThrow(ConflictException);
    });
  });
});
