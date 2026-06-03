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

Database
- The app reads MONGO_URI from the environment. Ensure MongoDB is reachable.

Notes
- If you rename environment variables, update src/db/index.ts and src/server.ts.