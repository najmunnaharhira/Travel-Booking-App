# Travel Booking App (React + Redux + Express)

A full-stack flight booking app with React/Redux frontend and Express backend.

## Tech Stack

- **Frontend**: React 18, Redux, Vite, Tailwind CSS, DaisyUI
- **Backend**: Node.js, Express
- **Storage**: JSON file (persisted to `Backend/data/bookings.json`)

## Setup

```bash
# Install all dependencies (root, backend, frontend)
npm run install:all

# Or manually:
npm install
cd Backend && npm install
cd ../Frontend && npm install
```

## Running the App

**Option 1: Run both together** (recommended)
```bash
npm run dev
```
This starts the backend (port 3001) and frontend (port 5173) concurrently.

**Option 2: Run separately**
```bash
# Terminal 1 - Backend
cd Backend && npm run dev

# Terminal 2 - Frontend
cd Frontend && npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/bookings | Fetch all bookings |
| POST | /api/bookings | Create a booking |
| DELETE | /api/bookings/:id | Delete a booking |

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Vercel will use the root `vercel.json` (builds Frontend, serves API from `/api`)
4. Deploy — the app includes serverless API routes (data resets on cold start; use a DB for production persistence)

## Features

- Create flight bookings (max 3 per user)
- Delete bookings
- Loading and error states
- Responsive UI
