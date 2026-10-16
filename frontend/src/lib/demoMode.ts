// The Vercel deployment has no database or chat server, so some features run as a session-only demo there
export const isDemoMode = () => !import.meta.env.DEV && window.location.hostname.includes("vercel.app");
