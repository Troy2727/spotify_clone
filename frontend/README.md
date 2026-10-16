# Spotify Clone — Frontend

React 18 + TypeScript app built with Vite, Tailwind CSS and shadcn/ui. See the [root README](../README.md) for the full project, architecture diagrams and setup.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build into dist/
```

Set `VITE_CLERK_PUBLISHABLE_KEY` in `frontend/.env`. In development the API is expected on `http://localhost:5000` (start it with `npm run dev` from the repo root to run both).

## Where things live

| Path | Contents |
|---|---|
| `src/pages/` | Route pages — home, album, chat, admin, auth callback, 404 |
| `src/layout/` | Main layout, sidebar, friends panel, player bar, audio player, waveform, ambient background |
| `src/components/` | Shared UI; generated shadcn/ui primitives in `components/ui/` |
| `src/stores/` | Zustand stores: `useMusicStore`, `usePlayerStore`, `useChatStore`, `useAuthStore` |
| `src/lib/` | Axios instance, demo-mode helpers (`demoMode.ts`, `demoChat.ts`), audio analyser, file previews |
| `src/types/` | Shared TypeScript types |

## Notes

- **Demo mode** — on `*.vercel.app` hosts the app runs chat and admin edits as a session-only demo, because the deployment has no database or socket server (`src/lib/demoMode.ts`).
- **Styling** — the Midnight glass theme lives in `src/index.css` (`.glass-panel`, `.ambient-glow`); accent color is Spotify green.
