# IDMS Employee Management Module

Production-oriented MERN stack application for the IDMS Infotech technical assessment — JWT authentication with HTTP-only cookies, employee CRUD, search/filter/pagination, and UI aligned to provided design assets.

## Tech Stack

- **Frontend:** React (Vite), React Router, Context API, Axios
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, Multer
- **Database:** MongoDB Atlas (or local MongoDB)

## Project Structure

```
/client                    → React frontend
/client/public/fonts       → Inter font files served by the app (18pt Regular/Medium/SemiBold/Bold)
/client/src/styles/fonts.css → @font-face definitions
/server                    → Express API
/Assets                    → Design SVG assets (reference)
/Screens                   → Design screen references
```

The full Inter font package (`static/`, variable `.ttf` files at repo root) is optional local reference only and is not required to run or build the app.

## Prerequisites

- Node.js 18+
- MongoDB Atlas cluster (connection string)
- npm

## Setup

### 1. Clone and install

```bash
cd server
npm install

cd ../client
npm install
```

### 2. Server environment

Copy `server/.env.example` to `server/.env` and fill in:

| Variable | Description |
|----------|-------------|
| `PORT` | API port (default `5000`) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Strong secret (min 32 characters recommended) |
| `JWT_EXPIRES_IN` | Token expiry (e.g. `24h`) |
| `CLIENT_URL` | Frontend URL (`http://localhost:5173` for dev) |
| `SEED_ADMIN_EMAIL` | Default admin email for testing |
| `SEED_ADMIN_PASSWORD` | Default admin password for testing |
| `SEED_ADMIN_USERNAME` | Default admin username for testing |

### 3. Client environment

Copy `client/.env.example` to `client/.env`:

```
VITE_API_URL=http://localhost:5000/api
```

For local dev with Vite proxy, you can also use `/api` as the base URL.

### 4. Seed admin user

```bash
cd server
npm run seed
```

### 5. Run locally

Terminal 1 — API:

```bash
cd server
npm run dev
```

Terminal 2 — Frontend:

```bash
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Default Login Credentials (Testing)

After running `npm run seed` in `server/`:

| Field | Value |
|-------|-------|
| Email | `admin@idms.com` |
| Username | `admin` |
| Password | `Admin@123` |

You can log in with **either** email or username.

## API Overview

| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/logout` | Public |
| GET | `/api/auth/me` | Cookie |
| GET | `/api/employees` | Cookie |
| GET | `/api/employees/lookups` | Cookie |
| POST | `/api/employees` | Cookie |
| PUT | `/api/employees/:id` | Cookie |
| DELETE | `/api/employees/:id` | Cookie |

### Employee list query parameters

- `search` — name, email, or department (case-insensitive)
- `department`, `designation`, `gender` — filters (stackable)
- `page`, `limit` — pagination

## Features Checklist

- Database-driven login (no hardcoded credentials in code)
- JWT in HTTP-only cookie with expiry handling
- Protected routes (frontend + backend)
- Employee create/edit modal with validation
- Seeded department & designation dropdowns
- Image upload (Multer, 2MB, images only)
- Toast notifications for success/error
- Delete confirmation dialog
- Responsive layout (tablet/desktop)

## Production Notes

- Set `NODE_ENV=production`
- Use HTTPS and set `secure: true` on cookies (configured when `NODE_ENV=production`)
- Set `CLIENT_URL` to your deployed frontend origin
- Store uploads on persistent disk or migrate to cloud storage for production

### Deploy on Vercel (full stack)

The repo includes `vercel.json` so the React build and Express API deploy together. In the Vercel project, set **Root Directory** to the repository root (not `server/` alone).

**Server environment variables** (Project → Settings → Environment Variables):

| Variable | Example |
|----------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Strong secret (32+ chars) |
| `JWT_EXPIRES_IN` | `24h` |
| `NODE_ENV` | `production` |
| `CLIENT_URL` | `https://your-app.vercel.app` |

**Client build variable** (required at build time):

| Variable | Value |
|----------|--------|
| `VITE_API_URL` | `https://your-app.vercel.app/api` |

Redeploy after changing env vars. Health check: `GET /api/health`.

## License

Design assets are provided by IDMS Infotech for assessment use only. Inter font is under SIL Open Font License (see `OFL.txt`).
