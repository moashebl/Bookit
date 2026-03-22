# BookIt — Full-Stack Booking System

A premium booking platform built with **Next.js 14**, **NestJS**, **PostgreSQL (Drizzle ORM)**, and shared **Zod** validation schemas. Features JWT authentication, double-booking prevention via database transactions, and a pixel-perfect UI matching the "Precision Architect" design system.

---

## ⚡ Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **pnpm** ≥ 8 (`npm install -g pnpm`)
- **PostgreSQL** ≥ 14 (running locally or remotely)

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL connection string:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/bookit
JWT_SECRET=your-super-secret-jwt-key
```

### 3. Set Up Database

Create the database:

```bash
createdb bookit
```

Run migrations:

```bash
pnpm db:generate
pnpm db:migrate
```

Seed demo data:

```bash
pnpm db:seed
```

### 4. Start Development Servers

```bash
# Start both API (port 3001) and frontend (port 3000):
pnpm dev

# Or start individually:
pnpm dev:api   # NestJS on http://localhost:3001
pnpm dev:web   # Next.js on http://localhost:3000
```

### 5. Login

Open `http://localhost:3000` and use the demo credentials:

- **Email:** `demo@bookit.com`
- **Password:** `password123`

---

## 🏗 Project Structure

```
bookit-v2/
├── apps/
│   ├── api/                    # NestJS Backend
│   │   └── src/
│   │       ├── auth/           # JWT authentication module
│   │       ├── bookings/       # Booking logic + endpoints
│   │       ├── common/         # Shared utilities (Zod pipe)
│   │       └── database/       # Drizzle ORM schema + seed
│   └── web/                    # Next.js Frontend
│       └── src/
│           ├── app/            # App Router pages
│           ├── components/     # UI components
│           │   ├── booking/    # Calendar, TimeSlots, Modal, etc.
│           │   └── layout/     # TopNav, SideNav, BottomNav
│           └── lib/            # API client + auth context
├── packages/
│   └── shared/                 # Shared Zod schemas + types
│       └── src/schemas/        # booking.ts, auth.ts
├── .env.example
├── package.json
└── pnpm-workspace.yaml
```

---

## 📡 API Documentation

Base URL: `http://localhost:3001/api`

### Authentication

#### POST `/api/auth/login`

Login with email and password.

**Request:**
```json
{
  "email": "demo@bookit.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "demo@bookit.com",
    "name": "Alex Carter",
    "title": "Senior Product Designer",
    "bio": "...",
    "avatarUrl": "...",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Errors:**
| Status | Message |
|--------|---------|
| 401 | Invalid email or password |

---

#### POST `/api/auth/register`

Create a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "mypassword",
  "name": "Jane Doe"
}
```

**Response (201):** Same shape as login response.

**Errors:**
| Status | Message |
|--------|---------|
| 400 | Validation failed (with field-level errors) |
| 409 | Email already registered |

---

### Bookings

> All booking endpoints require `Authorization: Bearer <token>` header.

#### GET `/api/bookings/available?date=YYYY-MM-DD`

Get available time slots for a specific date.

**Query Parameters:**
| Param | Type | Required | Format |
|-------|------|----------|--------|
| date | string | Yes | YYYY-MM-DD |

**Response (200):**
```json
{
  "date": "2024-10-07",
  "slots": [
    {
      "id": "uuid",
      "date": "2024-10-07",
      "startTime": "09:00:00",
      "endTime": "10:00:00",
      "duration": 60,
      "isAvailable": true
    }
  ]
}
```

**Errors:**
| Status | Message |
|--------|---------|
| 400 | Date must be in YYYY-MM-DD format |
| 401 | Unauthorized |

---

#### POST `/api/bookings`

Book a session at a specific time slot.

**Request:**
```json
{
  "timeSlotId": "uuid",
  "date": "2024-10-07"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "timeSlotId": "uuid",
  "status": "confirmed",
  "date": "2024-10-07",
  "startTime": "09:00:00",
  "endTime": "10:00:00",
  "duration": 60,
  "createdAt": "2024-10-07T12:00:00.000Z"
}
```

**Errors:**
| Status | Message |
|--------|---------|
| 400 | Validation failed |
| 401 | Unauthorized |
| 404 | Time slot not found |
| 409 | This time slot is already booked |

---

## 🧪 Testing

### Unit Tests

```bash
# Run booking service unit tests
pnpm test

# Run with coverage
cd apps/api && npx jest --coverage
```

Tests cover:
- ✅ Returns only unbooked slots for a date
- ✅ Returns all slots when none are booked
- ✅ Returns empty array when all slots are booked
- ✅ Returns empty array for dates with no slots
- ✅ Successfully creates a booking
- ✅ Rejects booking for non-existent time slot (404)
- ✅ Rejects booking for already-booked slot (409)
- ✅ Handles concurrent double booking via unique constraint

---

## 🎨 Design System

The UI follows the **"Precision Architect"** design system from the Stitch exports:

| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#000a1e` | Text, headings |
| `primary-container` | `#002147` | CTA buttons, selected states |
| `background` | `#faf9fd` | Page background |
| `surface-container` | `#efedf1` | Sidebar, nested elements |
| `tertiary-fixed-dim` | `#4edea3` | Availability dots, success |
| `error` | `#ba1a1a` | Error states |
| Font | Inter | All typography |

Key design rules:
- **No 1px borders** — Use background shifts for hierarchy
- **Gradient CTAs** — `from-primary to-primary-container`
- **Tonal surfaces** — Stacked sheets (lowest → low → container → high)
- **Glassmorphism modals** — Blurred backdrop with 70% opacity

---

## 🌍 Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | ✅ | — | PostgreSQL connection string |
| `JWT_SECRET` | ✅ | `bookit-dev-secret` | JWT signing secret |
| `JWT_EXPIRATION` | ❌ | `7d` | Token expiration |
| `API_PORT` | ❌ | `3001` | API server port |
| `NEXT_PUBLIC_API_URL` | ❌ | `http://localhost:3001` | API URL for frontend |

---

## 🚀 Vercel Deployment Guide

To deploy this exact project structure to **Vercel** for production:

### 1. Database Hosting
Vercel is a serverless platform, meaning you need an external PostgreSQL database. 
- You can create a free PostgreSQL database directly on Vercel using **Vercel Postgres** or through external providers like **Supabase** or **Neon**.
- Once created, get your production `DATABASE_URL`.

### 2. Frontend Deployment (`apps/web`)
1. Push this repository to exactly your GitHub: `https://github.com/moashebl/Bookit.git`
2. Go to your Vercel Dashboard and click **Add New Project**.
3. Import the `Bookit` repository.
4. **Important Config**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
5. **Environment Variables**: Add `NEXT_PUBLIC_API_URL` pointing to your deployed backend URL.
6. Click **Deploy**. Vercel will automatically detect `pnpm` and build your Next.js application.

### 3. Backend Deployment (`apps/api`)
Since Vercel is optimized for Frontend/Serverless, the standard approach for a long-running Express/NestJS backend is to deploy it using **Render**, **Railway**, or **Fly.io**:
1. Connect your Github Repo to Render/Railway.
2. Root Directory: `apps/api`
3. Start Command: `npm run start:prod`
4. Make sure to supply the production `DATABASE_URL` and `JWT_SECRET` environment variables. 
5. Also add `FRONTEND_URL` corresponding to your new Vercel domain to secure CORS!

Once the backend is live, update the Vercel frontend `NEXT_PUBLIC_API_URL` to point to the backend domain, and your full-stack app will be perfectly connected!

---

## 📄 License
