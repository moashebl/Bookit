# BookIt — Full-Stack Booking System Implementation Plan

A monorepo booking system with Next.js 14 frontend, NestJS backend, shared Zod schemas, PostgreSQL via Drizzle ORM, and JWT auth. UI matches the provided Stitch designs pixel-perfectly.

## User Review Required

> [!IMPORTANT]
> **PostgreSQL**: You need a running PostgreSQL instance. The app will use credentials from `.env`. Please confirm you have PostgreSQL available or if you'd prefer SQLite for local dev.

> [!IMPORTANT]
> **Auth Seed Data**: The plan includes a seed script to create a demo user. Login credentials will be `demo@bookit.com` / `password123`.

---

## Proposed Changes

### Monorepo Root

#### [NEW] [package.json](file:///c:/Users/Royal/Desktop/bookit-v2/package.json)
pnpm workspace root with scripts to run both apps, install deps, and shared build.

#### [NEW] [pnpm-workspace.yaml](file:///c:/Users/Royal/Desktop/bookit-v2/pnpm-workspace.yaml)
Declares `apps/*` and `packages/*` as workspace members.

#### [NEW] [tsconfig.json](file:///c:/Users/Royal/Desktop/bookit-v2/tsconfig.json)
Base TypeScript config extended by all packages.

#### [NEW] [.env.example](file:///c:/Users/Royal/Desktop/bookit-v2/.env.example)
Template for all environment variables.

---

### Shared Package (`packages/shared`)

#### [NEW] [package.json](file:///c:/Users/Royal/Desktop/bookit-v2/packages/shared/package.json)
Package config with Zod dependency and TypeScript build.

#### [NEW] [src/schemas/booking.ts](file:///c:/Users/Royal/Desktop/bookit-v2/packages/shared/src/schemas/booking.ts)
Zod schemas: `createBookingSchema`, `availableSlotsQuerySchema`, `bookingResponseSchema`, `timeSlotSchema`.

#### [NEW] [src/schemas/auth.ts](file:///c:/Users/Royal/Desktop/bookit-v2/packages/shared/src/schemas/auth.ts)
Zod schemas: `loginSchema`, `registerSchema`, `authResponseSchema`.

#### [NEW] [src/schemas/index.ts](file:///c:/Users/Royal/Desktop/bookit-v2/packages/shared/src/schemas/index.ts)
Barrel export of all schemas and inferred types.

#### [NEW] [src/index.ts](file:///c:/Users/Royal/Desktop/bookit-v2/packages/shared/src/index.ts)
Package entry point.

---

### Backend API (`apps/api`)

#### [NEW] NestJS project scaffolding
Standard NestJS structure initialized via `@nestjs/cli`.

Key files:

#### [NEW] [src/database/schema.ts](file:///c:/Users/Royal/Desktop/bookit-v2/apps/api/src/database/schema.ts)
Drizzle ORM schema with 3 tables:
- **users**: `id` (UUID), `email` (unique), `passwordHash`, `name`, `title`, `bio`, `avatarUrl`, `createdAt`
- **time_slots**: `id` (UUID), `date` (date), `startTime` (time), `endTime` (time), `duration` (int, minutes), `createdAt`
- **bookings**: `id` (UUID), `userId` (FK→users), `timeSlotId` (FK→time_slots), `status` (enum: confirmed/cancelled), `createdAt`

#### [NEW] [src/database/drizzle.module.ts](file:///c:/Users/Royal/Desktop/bookit-v2/apps/api/src/database/drizzle.module.ts)
Global module providing the Drizzle DB instance via DI.

#### [NEW] [src/database/seed.ts](file:///c:/Users/Royal/Desktop/bookit-v2/apps/api/src/database/seed.ts)
Seed script: creates demo user + time slots for the next 30 days (9AM–5PM, hourly, 60min sessions).

#### [NEW] [src/auth/auth.module.ts](file:///c:/Users/Royal/Desktop/bookit-v2/apps/api/src/auth/auth.module.ts)
Auth module: JWT-based login, register, guards.

#### [NEW] [src/auth/auth.controller.ts](file:///c:/Users/Royal/Desktop/bookit-v2/apps/api/src/auth/auth.controller.ts)
- `POST /auth/login` — returns JWT + user
- `POST /auth/register` — creates user, returns JWT

#### [NEW] [src/auth/auth.service.ts](file:///c:/Users/Royal/Desktop/bookit-v2/apps/api/src/auth/auth.service.ts)
Password hashing (bcrypt), JWT sign/verify, user lookup.

#### [NEW] [src/auth/jwt.guard.ts](file:///c:/Users/Royal/Desktop/bookit-v2/apps/api/src/auth/jwt.guard.ts)
NestJS guard that validates JWT from `Authorization: Bearer <token>`.

#### [NEW] [src/auth/jwt.strategy.ts](file:///c:/Users/Royal/Desktop/bookit-v2/apps/api/src/auth/jwt.strategy.ts)
Passport JWT strategy extracting user from token payload.

#### [NEW] [src/bookings/bookings.module.ts](file:///c:/Users/Royal/Desktop/bookit-v2/apps/api/src/bookings/bookings.module.ts)
Bookings feature module.

#### [NEW] [src/bookings/bookings.controller.ts](file:///c:/Users/Royal/Desktop/bookit-v2/apps/api/src/bookings/bookings.controller.ts)
- `GET /bookings/available?date=YYYY-MM-DD` — returns available time slots (JWT-protected)
- `POST /bookings` — creates booking (JWT-protected)

#### [NEW] [src/bookings/bookings.service.ts](file:///c:/Users/Royal/Desktop/bookit-v2/apps/api/src/bookings/bookings.service.ts)
Core business logic:
- `getAvailableSessions(date)`: queries time_slots for date, filters out slots that have confirmed bookings, handles timezone conversion
- `bookSession(userId, timeSlotId)`: wraps in DB transaction, re-checks availability inside txn to prevent races, creates booking record

#### [NEW] [src/bookings/dto/](file:///c:/Users/Royal/Desktop/bookit-v2/apps/api/src/bookings/dto/)
DTOs using shared Zod schemas via `createZodDto`.

#### [NEW] [src/bookings/bookings.service.spec.ts](file:///c:/Users/Royal/Desktop/bookit-v2/apps/api/src/bookings/bookings.service.spec.ts)
Unit tests:
- Returns only unbooked slots for a date
- Successfully creates a booking
- Rejects booking for already-booked slot (double-booking prevention)
- Rejects booking with invalid date format

---

### Frontend (`apps/web`)

#### [NEW] Next.js 14 App Router project
Initialized via `create-next-app` with TypeScript + TailwindCSS.

#### [NEW] [tailwind.config.ts](file:///c:/Users/Royal/Desktop/bookit-v2/apps/web/tailwind.config.ts)
Custom color palette matching the design system exactly:
- `primary: "#000a1e"`, `primary-container: "#002147"`, `background: "#faf9fd"`, etc.
- All Material Design 3 tonal surface colors from the Stitch HTML
- Font family: Inter

#### [NEW] [src/app/globals.css](file:///c:/Users/Royal/Desktop/bookit-v2/apps/web/src/app/globals.css)
Global styles: skeleton shimmer animation, glassmorphism utilities, scrollbar hiding.

#### [NEW] [src/lib/api.ts](file:///c:/Users/Royal/Desktop/bookit-v2/apps/web/src/lib/api.ts)
API client with fetch wrapper, JWT token management, base URL config.

#### [NEW] [src/lib/auth-context.tsx](file:///c:/Users/Royal/Desktop/bookit-v2/apps/web/src/lib/auth-context.tsx)
React context for auth state (user, token, login/logout functions).

#### [NEW] [src/components/layout/TopNavBar.tsx](file:///c:/Users/Royal/Desktop/bookit-v2/apps/web/src/components/layout/TopNavBar.tsx)
Top navigation: "BookIt" brand, nav links (Schedule, Bookings, Availability, Analytics), Share Link button, avatar. Hidden on mobile.

#### [NEW] [src/components/layout/SideNavBar.tsx](file:///c:/Users/Royal/Desktop/bookit-v2/apps/web/src/components/layout/SideNavBar.tsx)
Desktop sidebar: "BookIt" branding, nav items (Dashboard, Calendar, Clients, Settings), "+ New Event" button, Help/Logout links. Uses Material Symbols icons. Hidden on mobile (`hidden md:flex`).

#### [NEW] [src/components/layout/BottomNavBar.tsx](file:///c:/Users/Royal/Desktop/bookit-v2/apps/web/src/components/layout/BottomNavBar.tsx)
Mobile bottom nav: Home, Book, Schedule, Profile tabs with active state highlighting. Visible only on mobile (`md:hidden`).

#### [NEW] [src/components/booking/ProfileSection.tsx](file:///c:/Users/Royal/Desktop/bookit-v2/apps/web/src/components/booking/ProfileSection.tsx)
Profile card: rounded avatar, name (bold black tracking-tight), title, bio, social links.

#### [NEW] [src/components/booking/Calendar.tsx](file:///c:/Users/Royal/Desktop/bookit-v2/apps/web/src/components/booking/Calendar.tsx)
Month calendar: "Select a Date" header, chevron nav, 7-column grid, selected date highlight (`primary-container` circle), availability dots (green `tertiary-fixed-dim`).

#### [NEW] [src/components/booking/TimeSlots.tsx](file:///c:/Users/Royal/Desktop/bookit-v2/apps/web/src/components/booking/TimeSlots.tsx)
Available time slots grid: date badge, 2×4 grid (desktop) / 2-col grid (mobile), selected state (`primary-container` bg), MORNING/AFTERNOON/EVENING labels on mobile, duration label.

#### [NEW] [src/components/booking/BookingWidget.tsx](file:///c:/Users/Royal/Desktop/bookit-v2/apps/web/src/components/booking/BookingWidget.tsx)
Combines Calendar + TimeSlots + "Book Session" CTA button. Manages selected date/slot state.

#### [NEW] [src/components/booking/ConfirmationModal.tsx](file:///c:/Users/Royal/Desktop/bookit-v2/apps/web/src/components/booking/ConfirmationModal.tsx)
Success modal: blurred backdrop, green check icon, "Booking Confirmed!" title, date/time pill, description, "Done" button, gradient top border.

#### [NEW] [src/components/booking/LoadingSkeleton.tsx](file:///c:/Users/Royal/Desktop/bookit-v2/apps/web/src/components/booking/LoadingSkeleton.tsx)
Skeleton loaders for calendar grid and time slots using shimmer animation.

#### [NEW] [src/components/booking/ErrorState.tsx](file:///c:/Users/Royal/Desktop/bookit-v2/apps/web/src/components/booking/ErrorState.tsx)
Error card: cloud_off icon, "System Interrupted" title, message, "Retry Connection" + "Cancel" buttons, error code detail box.

#### [NEW] [src/app/page.tsx](file:///c:/Users/Royal/Desktop/bookit-v2/apps/web/src/app/page.tsx)
Main booking page: layout with sidebar + profile + booking widget.

#### [NEW] [src/app/login/page.tsx](file:///c:/Users/Royal/Desktop/bookit-v2/apps/web/src/app/login/page.tsx)
Login page with email/password form.

#### [NEW] [src/app/layout.tsx](file:///c:/Users/Royal/Desktop/bookit-v2/apps/web/src/app/layout.tsx)
Root layout with Inter font, auth context provider, metadata.

---

## Verification Plan

### Automated Tests

**Backend unit tests** (booking service):
```bash
cd apps/api && npx jest --testPathPattern=bookings.service.spec
```
Tests: available slot filtering, booking creation, double-booking rejection, invalid date validation.

### Manual Verification

1. **Start the backend**: `cd apps/api && npm run start:dev` — verify it starts on port 3001 without errors
2. **Start the frontend**: `cd apps/web && npm run dev` — verify it starts on port 3000
3. **Login flow**: Navigate to `http://localhost:3000/login`, log in with `demo@bookit.com` / `password123`
4. **Check desktop layout**: Verify sidebar, top nav, profile section, and booking widget match the design screenshots
5. **Book a session**: Select a date, pick a time slot, click "Book Session", verify confirmation modal appears
6. **Responsive check**: Resize browser to mobile width — sidebar should hide, bottom nav should appear, layout should match mobile design
7. **Loading states**: Throttle network in DevTools — verify skeleton loaders appear
8. **Error states**: Stop the backend, try to load available slots — verify error card appears with "Retry Connection" button

> [!NOTE]
> Since this is a new project with no existing codebase, all tests are new. The user will need PostgreSQL running locally for the backend to function.
