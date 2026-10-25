<h1 align="center">🎵 Spotify Clone</h1>

<p align="center">
  <b>A full-stack music streaming app — playback, albums, social listening, chat and an admin dashboard.</b><br>
  React · TypeScript · Express · MongoDB · Socket.IO · Clerk · Vercel
</p>

<p align="center">
  <a href="https://spotify-clone-jade-pi-29.vercel.app"><img src="https://img.shields.io/badge/Live_demo-spotify--clone-1db954?style=for-the-badge&logo=vercel&logoColor=white" alt="Live demo"></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white" alt="React 18">
  <img src="https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white" alt="TypeScript 5">
  <img src="https://img.shields.io/badge/Vite-4-646cff?logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-06b6d4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47a248?logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/Socket.IO-4-010101?logo=socketdotio&logoColor=white" alt="Socket.IO">
  <img src="https://img.shields.io/badge/Clerk-auth-6c47ff?logo=clerk&logoColor=white" alt="Clerk">
</p>

<p align="center">
  <img src="docs/animated/renders/home.gif" alt="Home page: greeting, featured songs grid, Made For You, friends listening panel and the player bar on a midnight-blue background" width="100%">
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-screenshots">Screenshots</a> •
  <a href="#️-architecture">Architecture</a> •
  <a href="#-getting-started">Getting started</a> •
  <a href="#-deployment">Deployment</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-contributing">Contributing</a>
</p>

---

## ✨ Features

| | |
|---|---|
| 🎧 **Music player** | Play, pause, skip, seek and volume — plus a **live audio waveform** that reacts to the song (Web Audio API). |
| 💿 **Album pages** | Hero header over the album's blurred cover, total length, keyboard-friendly track list with a now-playing equalizer. |
| 👥 **Social listening** | See which friends are online and what they're playing. |
| 💬 **Chat** | Real-time messages over Socket.IO in local development. |
| 🛠️ **Admin dashboard** | Catalog overview (stats, top artists, recently added), searchable songs table, album grid, uploads with artwork preview and auto-detected duration, confirm-to-delete. |
| 🔐 **Authentication** | Google sign-in with Clerk. Admin access is verified **server-side** — the Clerk session token's signature is checked against Clerk's keys, then the user's email is compared to `ADMIN_EMAIL`. |
| 🌌 **Design** | Midnight glass theme, responsive down to phone width, WCAG AA contrast for text, `prefers-reduced-motion` respected. |

> **About the live demo** — the deployed site has no database or chat server, so it serves a mock catalog. Chat friends are simulated and admin edits work for your session only (both are labelled *Demo mode*). Running locally gives you the full stack with MongoDB and Socket.IO.

## 📸 Screenshots

<table>
  <tr>
    <td width="33%"><img src="docs/animated/renders/album.gif" alt="Album page with blurred cover header, play button and track list with equalizer"></td>
    <td width="33%"><img src="docs/animated/renders/chat.gif" alt="Chat page with friends list and a conversation"></td>
    <td width="33%"><img src="docs/animated/renders/admin.gif" alt="Admin dashboard overview with stat cards, top artists chart and recently added songs"></td>
  </tr>
  <tr>
    <td align="center"><b>Album</b></td>
    <td align="center"><b>Chat</b></td>
    <td align="center"><b>Admin dashboard</b></td>
  </tr>
</table>

## 🏗️ Architecture

<img src="docs/animated/renders/architecture-dark.gif" alt="Architecture: the React app talks to an Express server with MongoDB and Socket.IO in local development, and to Vercel serverless functions serving a mock catalog in production; both verify sign-ins with Clerk, and local uploads go to Cloudinary." width="100%">

| | Local development | Live demo (Vercel) |
|---|---|---|
| **API** | Express server (`backend/`) | Serverless functions (`api/`) |
| **Data** | MongoDB via Mongoose | Mock catalog (`api/_lib/catalog.js`) |
| **Chat** | Socket.IO, real users | Simulated friends (`frontend/src/lib/demoChat.ts`) |
| **Admin edits** | Saved to MongoDB, uploads to Cloudinary | Session-only demo |
| **Auth** | Clerk | Clerk |

### How an admin request is verified

<img src="docs/animated/renders/admin-auth-dark.gif" alt="Sequence: the browser calls a Vercel function with a Clerk session token; the function fetches Clerk's public keys, verifies the RS256 signature and expiry, looks up the user's primary email and returns the stats only if it matches ADMIN_EMAIL, otherwise 401 or 403." width="100%">

The check lives in [`api/_lib/clerkAdmin.js`](api/_lib/clerkAdmin.js) and uses only `node:crypto` — no extra dependencies. It mirrors the backend's [`requireAdmin`](backend/src/middleware/auth.middleware.js) rule: primary email equals `ADMIN_EMAIL`, or the user id is listed in `ADMIN_USER_IDS`.

## 🧰 Tech stack

| Layer | Tools |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui (Radix), Zustand, React Router, Socket.IO client, lucide-react |
| **Backend** | Node.js, Express, MongoDB + Mongoose, Socket.IO, Cloudinary, `express-fileupload`, node-cron |
| **Auth** | Clerk (Google OAuth) |
| **Hosting & CI** | Vercel (static frontend + serverless `api/`), GitHub Actions, CodeQL |

## 🚀 Getting started

### Prerequisites

- **Node.js 18.17+** and npm
- **MongoDB** — local or [Atlas](https://www.mongodb.com/atlas)
- A **[Clerk](https://clerk.com)** application (Google sign-in enabled)
- A **[Cloudinary](https://cloudinary.com)** account (for uploads)

### 1. Install

```bash
git clone https://github.com/Troy2727/spotify_clone.git
cd spotify_clone
npm run install-all   # root + backend + frontend
```

### 2. Configure environment

`backend/.env`

```env
PORT=5000
MONGODB_URI=<your MongoDB connection string>
ADMIN_EMAIL=<the email you sign in with>
NODE_ENV=development

CLOUDINARY_API_KEY=<key>
CLOUDINARY_API_SECRET=<secret>
CLOUDINARY_CLOUD_NAME=<cloud name>

CLERK_PUBLISHABLE_KEY=<pk_...>
CLERK_SECRET_KEY=<sk_...>
```

`frontend/.env`

```env
VITE_CLERK_PUBLISHABLE_KEY=<pk_...>
```

### 3. Seed sample data (optional)

```bash
cd backend
npm run seed   # loads the same catalog the live demo serves (api/)
```

### 4. Run

```bash
npm run dev   # backend + frontend together
```

- App → http://localhost:3000
- API → http://localhost:5000/api

### Scripts

| Command | What it does |
|---|---|
| `npm run install-all` | Install root, backend and frontend dependencies |
| `npm run dev` | Run backend (nodemon) and frontend (Vite) together |
| `npm run dev:backend` / `npm run dev:frontend` | Run one side only |
| `npm run build` | Production build of the frontend |
| `npm test` | Run backend and frontend tests |

## 🌍 Deployment

The repo deploys to **Vercel** as one project: `frontend/dist` as static files plus every file in `api/` as a serverless function (`vercel.json` holds the build settings and rewrites). Pushes to `main` deploy to production automatically.

1. Import the repo in Vercel (or run `vercel` from the project root).
2. Add the environment variables from above in **Project → Settings → Environment Variables** (`CLERK_SECRET_KEY` and `ADMIN_EMAIL` are what the admin check needs).
3. Deploy.

Good to know:

- **Function limit** — the Hobby plan allows at most **12 serverless functions** per deployment. Helpers in `api/_lib/` don't count; any other new file in `api/` does.
- **Demo mode** turns on automatically on `*.vercel.app` hosts ([`frontend/src/lib/demoMode.ts`](frontend/src/lib/demoMode.ts)). If you add a custom domain without a real backend, update that check first.

## 📂 Project structure

```text
spotify_clone/
├── api/                      # Vercel serverless functions (production API)
│   ├── _lib/                 #   shared helpers — Clerk admin check, mock catalog
│   ├── admin/  albums/  songs/  stats/  users/
│   └── albums.js  users.js  index.js
├── backend/                  # Express API for local development
│   └── src/
│       ├── controller/       #   route handlers
│       ├── models/           #   Mongoose schemas
│       ├── routes/           #   Express routers
│       ├── middleware/       #   Clerk auth + requireAdmin
│       ├── lib/              #   db, Socket.IO, Cloudinary
│       ├── seeds/            #   sample data scripts
│       └── index.js          #   server entry
├── frontend/                 # React + Vite app
│   ├── public/               #   cover art, audio, icons
│   └── src/
│       ├── pages/            #   home, album, chat, admin, auth callback, 404
│       ├── layout/           #   main layout, player, sidebar, friends panel
│       ├── components/       #   shared UI (shadcn/ui in components/ui)
│       ├── stores/           #   Zustand stores (music, player, chat, auth)
│       ├── lib/              #   axios, demo mode, audio analyser, helpers
│       └── types/
├── docs/                     # README diagrams (HTML sources + PNG exports) and screenshots
├── .github/workflows/        # CI: lint & commit rules, build/test/audit, CodeQL
└── vercel.json
```

## 🔄 CI/CD

Every pull request runs:

| Workflow | Checks |
|---|---|
| `git-workflow.yml` | Lint · [Conventional Commits](https://www.conventionalcommits.org/) · branch naming |
| `node-ci-cd.yml` | Build and test on Node 18.x and 20.x · `npm audit` security scan |
| `codeql-analysis.yml` | CodeQL security analysis (JavaScript/TypeScript, GitHub Actions) |
| Vercel | Preview deployment for the PR; merges to `main` go to production |

## 🤝 Contributing

1. Branch from `main` using `feature/<name>`, `bugfix/<name>`, `hotfix/<name>`, `chore/<name>` or `release/<version>` (lowercase, hyphens).
2. Write [Conventional Commits](https://www.conventionalcommits.org/) with a sentence-case subject, at most 72 characters — e.g. `fix: Serve single albums so album pages load`.
3. Open a pull request; all checks must pass before merging.

## 👨‍💻 Author

**Alex Mieses** — [@Troy2727](https://github.com/Troy2727)

This project began as Burak Orkmez's [realtime-spotify-clone](https://github.com/burakorkmez/realtime-spotify-clone) MERN course project. The codebase has since been rewritten, and the Vercel demo catalog, demo mode, the mobile player and layout, and the server-side checks on chat senders and sign-up were built for this version.

## 📄 License

Released under the [MIT License](LICENSE).

> Album artwork and song titles in the demo catalog belong to their respective artists and labels; they're used only to make the demo realistic and aren't covered by this license.
