// Mock API handler for all songs in Vercel (admin only, like the backend's GET /api/songs)

import { requireAdmin } from '../_lib/clerkAdmin.js';
import { allSongs } from '../_lib/catalog.js';

export default async function handler(req, res) {
  if (!(await requireAdmin(req, res))) return;
  return res.status(200).json(allSongs());
}
