import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  date,
  time,
  integer,
  pgEnum,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

// ============================================
// Enums
// ============================================

/** Booking status enum — maps to PostgreSQL ENUM type */
export const bookingStatusEnum = pgEnum('booking_status', [
  'confirmed',
  'cancelled',
]);

// ============================================
// Users Table
// ============================================

/**
 * Users table — stores registered user profiles.
 * Each user can make multiple bookings.
 */
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  title: varchar('title', { length: 100 }),
  bio: text('bio'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================
// Time Slots Table
// ============================================

/**
 * Time slots table — represents bookable appointment windows.
 * Each slot has a date, start/end time, and duration in minutes.
 */
export const timeSlots = pgTable('time_slots', {
  id: uuid('id').defaultRandom().primaryKey(),
  date: date('date').notNull(),
  startTime: time('start_time').notNull(),
  endTime: time('end_time').notNull(),
  duration: integer('duration').notNull(), // Duration in minutes
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================
// Bookings Table
// ============================================

/**
 * Bookings table — links a user to a time slot.
 * Unique constraint on timeSlotId prevents double bookings.
 */
export const bookings = pgTable(
  'bookings',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    timeSlotId: uuid('time_slot_id')
      .notNull()
      .references(() => timeSlots.id, { onDelete: 'cascade' }),
    status: bookingStatusEnum('status').notNull().default('confirmed'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    // Ensure each time slot can only be booked once (prevent double bookings at DB level)
    uniqueTimeSlotBooking: uniqueIndex('unique_active_booking').on(
      table.timeSlotId,
    ),
  }),
);

// ============================================
// Mentors Table
// ============================================

/**
 * Mentors table — stores mentors added by a user.
 * Each user has their own isolated directory of mentors.
 */
export const mentors = pgTable('mentors', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 100 }).notNull(),
  company: varchar('company', { length: 100 }).notNull(),
  role: varchar('role', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================
// Type Inference Helpers
// ============================================

export type UserRecord = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type TimeSlotRecord = typeof timeSlots.$inferSelect;
export type NewTimeSlot = typeof timeSlots.$inferInsert;
export type BookingRecord = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
export type MentorRecord = typeof mentors.$inferSelect;
export type NewMentor = typeof mentors.$inferInsert;
