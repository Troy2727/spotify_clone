# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack music streaming app (Spotify clone) with real-time chat and activity tracking.

**Stack:**
- Frontend: React 18 + TypeScript + Vite + Tailwind + shadcn/ui
- Backend: Node.js + Express + MongoDB + Socket.IO
- Auth: Clerk
- Storage: Cloudinary
- State: Zustand stores
- Deployment: Vercel (monorepo with serverless functions)

## Development Commands

```bash
# Install all dependencies (root + backend + frontend)
npm run install-all

# Development (runs both backend and frontend concurrently)
npm run dev

# Run individually
npm run dev:backend    # localhost:5000 (or next available port)
npm run dev:frontend   # localhost:5173 (Vite default)

# Build
npm run build          # Frontend only
npm run build:frontend
npm run build:backend  # No-op (Node.js doesn't need build)

# Testing
npm test               # Runs tests in both backend and frontend
                       # Currently: "No tests specified yet"

# Seeding
cd backend
npm run seed:songs
npm run seed:albums
```

## Architecture

### Monorepo Structure
```
spotify_clone/
├── api/                    # Vercel serverless functions (production API)
│   ├── index.js            # Main API proxy
│   ├── albums.js, songs/, users/, etc.
│   └── socket.js           # Socket.IO for Vercel
├── backend/                # Development Express server
│   ├── src/
│   │   ├── controller/     # Business logic
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # Express routes
│   │   ├── lib/            # db.js, socket.js, cloudinary.js
│   │   ├── middleware/     # auth.middleware.js (Clerk)
│   │   └── index.js        # Express server entry
└── frontend/
    ├── src/
    │   ├── stores/         # Zustand state (useMusicStore, useChatStore, etc.)
    │   ├── pages/          # Route components
    │   ├── components/     # UI components
    │   ├── lib/            # axios.ts (configured instance)
    │   └── types/          # TypeScript types
```

### Deployment Architecture
- **Development**: Express backend (backend/src/index.js) + Vite dev server
- **Production (Vercel)**: Serverless functions (api/) + static frontend (frontend/dist)
- `vercel.json` rewrites map `/api/*` to serverless functions
- Socket.IO works via api/socket.js in production

### State Management (Zustand)
- `useMusicStore`: albums, songs, featured/trending/madeForYou collections, stats
- `usePlayerStore`: playback state, queue, current song
- `useChatStore`: messages, users, real-time chat
- `useAuthStore`: Clerk authentication state

### Real-Time Features (Socket.IO)
**Events:**
- `user_connected` / `user_disconnected`: User online status
- `update_activity`: What user is listening to
- `send_message` / `receive_message`: Chat messages
- Connection tracking: `userSockets` Map (userId → socketId)
- Activity tracking: `userActivities` Map (userId → activity)

**Implementation:**
- Development: backend/src/lib/socket.js
- Production: api/socket.js (Vercel serverless)
- CORS configured for localhost:3000, localhost:5173, and Vercel URL

### API Structure
All routes prefixed with `/api`:
- `/api/auth` - Clerk webhook, auth callback
- `/api/users` - User management, messages
- `/api/songs` - CRUD, /featured, /trending, /made-for-you
- `/api/albums` - CRUD, album songs
- `/api/admin` - Album/song management (requires admin role)
- `/api/stats` - Dashboard stats

### Admin Access
Admin determined by `ADMIN_EMAIL` env var in backend. Check via `/api/admin/check` endpoint.

### Fallback Data
Frontend stores (useMusicStore) include hardcoded fallback data for albums/songs when API fails. Production hides errors from users; dev mode shows them.

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=<connection_string>
ADMIN_EMAIL=<admin_email>
NODE_ENV=development

CLOUDINARY_API_KEY=<key>
CLOUDINARY_API_SECRET=<secret>
CLOUDINARY_CLOUD_NAME=<name>

CLERK_PUBLISHABLE_KEY=<key>
CLERK_SECRET_KEY=<secret>

# Production only
FRONTEND_URL=<vercel_url>
VERCEL_URL=<auto_set_by_vercel>
```

### Frontend (.env)
```env
VITE_CLERK_PUBLISHABLE_KEY=<key>

# Optional: backend URL for dev (defaults to /api)
VITE_API_URL=http://localhost:5000/api
```

## Key Patterns

### API Calls
Use pre-configured `axiosInstance` from `@/lib/axios`:
- Base URL: `/api` (relative, works with Vercel rewrites)
- 10s timeout
- Request/response interceptors for logging
- Error handling built-in

### Authentication Middleware
Backend: `protectRoute` and `requireAdmin` from `middleware/auth.middleware.js`
- Uses Clerk's `@clerk/express` middleware
- Checks `req.auth.userId` (populated by clerkMiddleware)
- Admin check: compares `req.auth.user.emailAddresses[0]` to `ADMIN_EMAIL`

Frontend: Clerk components `<SignedIn>`, `<SignedOut>`, `useAuth()` hook

### File Uploads
- Backend uses `express-fileupload` with temp files
- Cron job cleans `/tmp` directory hourly
- Cloudinary integration for persistent storage
- Max file size: 10MB

### Port Auto-Increment
Backend tries PORT from env, auto-increments if in use (backend/src/index.js:147-160)

### Test Users
Backend auto-creates test users on startup for chat functionality:
- `test_user_1`, `test_user_2` with Clerk IDs
- See backend/src/index.js:117-143

## CI/CD (GitHub Actions)

### Workflows
- `git-workflow.yml`: Linting, conventional commits validation, branch naming checks
- `codeql-analysis.yml`: Security scanning (JavaScript/TypeScript)
- `node-ci-cd.yml`: Build, test, security scan, deploy to Vercel

### Branch Naming Convention
- `feature/<name>`: New features
- `bugfix/<name>`: Bug fixes
- `hotfix/<name>`: Critical fixes
- `release/<version>`: Releases
- `chore/<name>`: Maintenance

### Commit Format
Conventional Commits enforced via `.commitlintrc.json`:
- `feat:`, `fix:`, `chore:`, `docs:`, etc.
