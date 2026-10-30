<h1 align="center"><img src="frontend/public/spotify.png" alt="" width="36" height="36"> Spotify Clone</h1>

<p align="center">
  <b>A full-stack music streaming app — playback, albums, social listening, chat and an admin dashboard.</b><br>
  React · TypeScript · Express · MongoDB · Socket.IO · Clerk · Vercel
</p>

<p align="center">
  <a href="https://spotify-clone-jade-pi-29.vercel.app"><img src="https://img.shields.io/badge/Live_demo-spotify--clone-1db954?style=for-the-badge&logo=vercel&logoColor=white" alt="Live demo"></a>
</p>

<p align="center">
  <a href="https://react.dev"><img alt="React 18" src="https://img.shields.io/badge/React%2018-61DAFB?style=flat-square&logo=react&logoColor=black" /></a>
  <a href="https://www.typescriptlang.org"><img alt="TypeScript 5.6" src="https://img.shields.io/badge/TypeScript%205.6-3178C6?style=flat-square&logo=typescript&logoColor=white" /></a>
  <a href="https://vite.dev"><img alt="Vite 4" src="https://img.shields.io/badge/Vite%204-9135FF?style=flat-square&logo=vite&logoColor=white" /></a>
  <a href="https://tailwindcss.com"><img alt="Tailwind CSS 3" src="https://img.shields.io/badge/Tailwind%20CSS%203-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" /></a>
  <a href="https://ui.shadcn.com"><img alt="shadcn/ui" src="https://img.shields.io/badge/shadcn%2Fui-000000?style=flat-square&logo=shadcnui&logoColor=white" /></a>
  <a href="https://www.radix-ui.com"><img alt="Radix UI" src="https://img.shields.io/badge/Radix%20UI-161618?style=flat-square&logo=radixui&logoColor=white" /></a>
  <a href="https://zustand.docs.pmnd.rs"><img alt="Zustand 5" src="https://img.shields.io/badge/Zustand%205-555555?style=flat-square" /></a>
  <a href="https://reactrouter.com"><img alt="React Router 6" src="https://img.shields.io/badge/React%20Router%206-CA4245?style=flat-square&logo=reactrouter&logoColor=white" /></a>
  <a href="https://axios-http.com"><img alt="Axios" src="https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white" /></a>
  <a href="https://lucide.dev"><img alt="Lucide" src="https://img.shields.io/badge/Lucide-F56565?style=flat-square&logo=lucide&logoColor=white" /></a>
  <a href="https://nodejs.org"><img alt="Node.js" src="https://img.shields.io/badge/Node.js-5FA04E?style=flat-square&logo=nodedotjs&logoColor=white" /></a>
  <a href="https://expressjs.com"><img alt="Express 4" src="https://img.shields.io/badge/Express%204-0A0A0A?style=flat-square&logo=express&logoColor=white" /></a>
  <a href="https://www.mongodb.com"><img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" /></a>
  <a href="https://mongoosejs.com"><img alt="Mongoose 8" src="https://img.shields.io/badge/Mongoose%208-880000?style=flat-square&logo=mongoose&logoColor=white" /></a>
  <a href="https://socket.io"><img alt="Socket.IO 4" src="https://img.shields.io/badge/Socket.IO%204-010101?style=flat-square&logo=socketdotio&logoColor=white" /></a>
  <a href="https://cloudinary.com"><img alt="Cloudinary" src="https://img.shields.io/badge/Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white" /></a>
  <a href="https://github.com/node-cron/node-cron"><img alt="node-cron" src="https://img.shields.io/badge/node--cron-555555?style=flat-square" /></a>
  <a href="https://clerk.com"><img alt="Clerk 5" src="https://img.shields.io/badge/Clerk%205-6C47FF?style=flat-square&logo=clerk&logoColor=white" /></a>
  <a href="https://vercel.com"><img alt="Vercel" src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white" /></a>
  <a href="https://github.com/features/actions"><img alt="GitHub Actions" src="https://img.shields.io/badge/GitHub%20Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white" /></a>
  <a href="https://codeql.github.com"><img alt="CodeQL" src="https://img.shields.io/badge/CodeQL-181717?style=flat-square&logo=github&logoColor=white" /></a>
  <a href="https://eslint.org"><img alt="ESLint 9" src="https://img.shields.io/badge/ESLint%209-4B32C3?style=flat-square&logo=eslint&logoColor=white" /></a>
</p>

<p align="center">
  <a href="https://github.com/Troy2727/spotify_clone/blob/main/docs/animated/renders/home.gif" title="Open this image full size">
    <img src="docs/animated/renders/home.gif" alt="Home page: greeting, featured songs grid, Made For You, friends listening panel and the player bar on a midnight-blue background" width="100%">
  </a>
  <br />
  <sub>Click the image to see it full size.</sub>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-screenshots">Screenshots</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-getting-started">Getting started</a> •
  <a href="#-deployment">Deployment</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-contributing">Contributing</a>
</p>

---

## <img src="docs/icons/sparkles.svg" width="24" height="24" alt="" /> Features

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

## <img src="docs/icons/image.svg" width="24" height="24" alt="" /> Screenshots

<table>
  <tr>
    <td width="33%"><a href="https://github.com/Troy2727/spotify_clone/blob/main/docs/animated/renders/album.gif" title="Open this image full size"><img src="docs/animated/renders/album.gif" alt="Album page with blurred cover header, play button and track list with equalizer"></a></td>
    <td width="33%"><a href="https://github.com/Troy2727/spotify_clone/blob/main/docs/animated/renders/chat.gif" title="Open this image full size"><img src="docs/animated/renders/chat.gif" alt="Chat page with friends list and a conversation"></a></td>
    <td width="33%"><a href="https://github.com/Troy2727/spotify_clone/blob/main/docs/animated/renders/admin.gif" title="Open this image full size"><img src="docs/animated/renders/admin.gif" alt="Admin dashboard overview with stat cards, top artists chart and recently added songs"></a></td>
  </tr>
  <tr>
    <td align="center"><b>Album</b></td>
    <td align="center"><b>Chat</b></td>
    <td align="center"><b>Admin dashboard</b></td>
  </tr>
</table>

<p align="center"><sub>Click an image to see it full size.</sub></p>

## <img src="docs/icons/network.svg" width="24" height="24" alt="" /> Architecture

<p align="center">
  <a href="https://github.com/Troy2727/spotify_clone/blob/main/docs/animated/renders/architecture-dark.gif" title="Open this image full size">
    <img src="docs/animated/renders/architecture-dark.gif" alt="Architecture: the React app talks to an Express server with MongoDB and Socket.IO in local development, and to Vercel serverless functions serving a mock catalog in production; both verify sign-ins with Clerk, and local uploads go to Cloudinary." width="100%">
  </a>
  <br />
  <sub>Click the image to see it full size.</sub>
</p>

| | Local development | Live demo (Vercel) |
|---|---|---|
| **API** | Express server (`backend/`) | Serverless functions (`api/`) |
| **Data** | MongoDB via Mongoose | Mock catalog (`api/_lib/catalog.js`) |
| **Chat** | Socket.IO, real users | Simulated friends (`frontend/src/lib/demoChat.ts`) |
| **Admin edits** | Saved to MongoDB, uploads to Cloudinary | Session-only demo |
| **Auth** | Clerk | Clerk |

### How an admin request is verified

<p align="center">
  <a href="https://github.com/Troy2727/spotify_clone/blob/main/docs/animated/renders/admin-auth-dark.gif" title="Open this image full size">
    <img src="docs/animated/renders/admin-auth-dark.gif" alt="Sequence: the browser calls a Vercel function with a Clerk session token; the function fetches Clerk's public keys, verifies the RS256 signature and expiry, looks up the user's primary email and returns the stats only if it matches ADMIN_EMAIL, otherwise 401 or 403." width="100%">
  </a>
  <br />
  <sub>Click the image to see it full size.</sub>
</p>

The check lives in [`api/_lib/clerkAdmin.js`](api/_lib/clerkAdmin.js) and uses only `node:crypto` — no extra dependencies. It mirrors the backend's [`requireAdmin`](backend/src/middleware/auth.middleware.js) rule: primary email equals `ADMIN_EMAIL`, or the user id is listed in `ADMIN_USER_IDS`.

## <img src="docs/icons/layers.svg" width="24" height="24" alt="" /> Tech stack

**Frontend**<br/>
<a href="https://react.dev"><img alt="React 18" src="https://img.shields.io/badge/React%2018-61DAFB?style=flat-square&logo=react&logoColor=black" /></a>
<a href="https://www.typescriptlang.org"><img alt="TypeScript 5.6" src="https://img.shields.io/badge/TypeScript%205.6-3178C6?style=flat-square&logo=typescript&logoColor=white" /></a>
<a href="https://vite.dev"><img alt="Vite 4" src="https://img.shields.io/badge/Vite%204-9135FF?style=flat-square&logo=vite&logoColor=white" /></a>
<a href="https://tailwindcss.com"><img alt="Tailwind CSS 3" src="https://img.shields.io/badge/Tailwind%20CSS%203-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" /></a>
<a href="https://ui.shadcn.com"><img alt="shadcn/ui" src="https://img.shields.io/badge/shadcn%2Fui-000000?style=flat-square&logo=shadcnui&logoColor=white" /></a>
<a href="https://www.radix-ui.com"><img alt="Radix UI" src="https://img.shields.io/badge/Radix%20UI-161618?style=flat-square&logo=radixui&logoColor=white" /></a>
<a href="https://zustand.docs.pmnd.rs"><img alt="Zustand 5" src="https://img.shields.io/badge/Zustand%205-555555?style=flat-square" /></a>
<a href="https://reactrouter.com"><img alt="React Router 6" src="https://img.shields.io/badge/React%20Router%206-CA4245?style=flat-square&logo=reactrouter&logoColor=white" /></a>
<a href="https://axios-http.com"><img alt="Axios" src="https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white" /></a>
<a href="https://lucide.dev"><img alt="Lucide" src="https://img.shields.io/badge/Lucide-F56565?style=flat-square&logo=lucide&logoColor=white" /></a>

**Backend**<br/>
<a href="https://nodejs.org"><img alt="Node.js" src="https://img.shields.io/badge/Node.js-5FA04E?style=flat-square&logo=nodedotjs&logoColor=white" /></a>
<a href="https://expressjs.com"><img alt="Express 4" src="https://img.shields.io/badge/Express%204-0A0A0A?style=flat-square&logo=express&logoColor=white" /></a>
<a href="https://www.mongodb.com"><img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" /></a>
<a href="https://mongoosejs.com"><img alt="Mongoose 8" src="https://img.shields.io/badge/Mongoose%208-880000?style=flat-square&logo=mongoose&logoColor=white" /></a>
<a href="https://socket.io"><img alt="Socket.IO 4" src="https://img.shields.io/badge/Socket.IO%204-010101?style=flat-square&logo=socketdotio&logoColor=white" /></a>
<a href="https://cloudinary.com"><img alt="Cloudinary" src="https://img.shields.io/badge/Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white" /></a>
<a href="https://github.com/node-cron/node-cron"><img alt="node-cron" src="https://img.shields.io/badge/node--cron-555555?style=flat-square" /></a>

**Auth**<br/>
<a href="https://clerk.com"><img alt="Clerk 5" src="https://img.shields.io/badge/Clerk%205-6C47FF?style=flat-square&logo=clerk&logoColor=white" /></a>

**Hosting & CI**<br/>
<a href="https://vercel.com"><img alt="Vercel" src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white" /></a>
<a href="https://github.com/features/actions"><img alt="GitHub Actions" src="https://img.shields.io/badge/GitHub%20Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white" /></a>
<a href="https://codeql.github.com"><img alt="CodeQL" src="https://img.shields.io/badge/CodeQL-181717?style=flat-square&logo=github&logoColor=white" /></a>
<a href="https://eslint.org"><img alt="ESLint 9" src="https://img.shields.io/badge/ESLint%209-4B32C3?style=flat-square&logo=eslint&logoColor=white" /></a>

| Layer | Tools |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui (Radix), Zustand, React Router, Socket.IO client, lucide-react |
| **Backend** | Node.js, Express, MongoDB + Mongoose, Socket.IO, Cloudinary, `express-fileupload`, node-cron |
| **Auth** | Clerk (Google OAuth) |
| **Hosting & CI** | Vercel (static frontend + serverless `api/`), GitHub Actions, CodeQL |

## <img src="docs/icons/rocket.svg" width="24" height="24" alt="" /> Getting started

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

## <img src="docs/icons/cloud-upload.svg" width="24" height="24" alt="" /> Deployment

The repo deploys to **Vercel** as one project: `frontend/dist` as static files plus every file in `api/` as a serverless function (`vercel.json` holds the build settings and rewrites). Pushes to `main` deploy to production automatically.

1. Import the repo in Vercel (or run `vercel` from the project root).
2. Add the environment variables from above in **Project → Settings → Environment Variables** (`CLERK_SECRET_KEY` and `ADMIN_EMAIL` are what the admin check needs).
3. Deploy.

Good to know:

- **Function limit** — the Hobby plan allows at most **12 serverless functions** per deployment. Helpers in `api/_lib/` don't count; any other new file in `api/` does.
- **Demo mode** turns on automatically on `*.vercel.app` hosts ([`frontend/src/lib/demoMode.ts`](frontend/src/lib/demoMode.ts)). If you add a custom domain without a real backend, update that check first.

## <img src="docs/icons/folder-tree.svg" width="24" height="24" alt="" /> Project structure

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

## <img src="docs/icons/workflow.svg" width="24" height="24" alt="" /> CI/CD

Every pull request runs:

| Workflow | Checks |
|---|---|
| `git-workflow.yml` | Lint · [Conventional Commits](https://www.conventionalcommits.org/) · branch naming |
| `node-ci-cd.yml` | Build and test on Node 18.x and 20.x · `npm audit` security scan |
| `codeql-analysis.yml` | CodeQL security analysis (JavaScript/TypeScript, GitHub Actions) |
| Vercel | Preview deployment for the PR; merges to `main` go to production |

## <img src="docs/icons/git-pull-request.svg" width="24" height="24" alt="" /> Contributing

1. Branch from `main` using `feature/<name>`, `bugfix/<name>`, `hotfix/<name>`, `chore/<name>` or `release/<version>` (lowercase, hyphens).
2. Write [Conventional Commits](https://www.conventionalcommits.org/) with a sentence-case subject, at most 72 characters — e.g. `fix: Serve single albums so album pages load`.
3. Open a pull request; all checks must pass before merging.

## <img src="docs/icons/user.svg" width="24" height="24" alt="" /> Author

**Alex Mieses** — [@Troy2727](https://github.com/Troy2727)

This project began as Burak Orkmez's [realtime-spotify-clone](https://github.com/burakorkmez/realtime-spotify-clone) MERN course project. The codebase has since been rewritten, and the Vercel demo catalog, demo mode, the mobile player and layout, and the server-side checks on chat senders and sign-up were built for this version.

## <img src="docs/icons/scale.svg" width="24" height="24" alt="" /> License

Released under the [MIT License](LICENSE).

> Album artwork and song titles in the demo catalog belong to their respective artists and labels; they're used only to make the demo realistic and aren't covered by this license.
