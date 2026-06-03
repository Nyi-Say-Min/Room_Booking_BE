# Room Booking BE

Simple backend for room bookings (TypeScript + Express + Mongoose).

# Requirements
- Node.js 18+ and npm
- MongoDB instance (connection URI)

# Environment
Create a `.env` file in the repository root with:
MONGO_URI (required) — e.g. mongodb://localhost:27017/room_booking
PORT (optional) — default 3000

# Quick setup
1. Install dependencies:
npm install

Run (development)
npm run dev

Build & Run (production)
npm run build
npm start

Type checking
npm run lint

API Routes
- GET /api/health

Auth routes:
- POST /api/auth/signup
- POST /api/auth/signin

Booking routes (authenticated):
- POST /api/bookings/
- GET /api/bookings/
- DELETE /api/bookings/:id
- GET /api/bookings/by-user (requires owner or admin)
- GET /api/bookings/summary (requires owner or admin)

User routes (authenticated + admin):
- GET /api/users/
- POST /api/users/
- PATCH /api/users/:id/role
- DELETE /api/users/:id

Deployed endpoint is at `https://roombookingbe-production.up.railway.app`

Database
- The app reads MONGO_URI from the environment. Ensure MongoDB is reachable.

Notes
- If you rename environment variables, update src/db/index.ts and src/server.ts.