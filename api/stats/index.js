// Stats for the admin dashboard in Vercel (admin only, like the backend's GET /api/stats).
// Songs, albums and artists are counted from the mock catalog; users are the real Clerk count.

import { albums } from '../albums.js';
import { allSongs } from '../_lib/catalog.js';
import { clerkGet, requireAdmin } from '../_lib/clerkAdmin.js';

export default async function handler(req, res) {
  if (!(await requireAdmin(req, res))) return;

  const songs = allSongs();
  let totalUsers = 0;
  try {
    totalUsers = (await clerkGet('/users/count')).total_count ?? 0;
  } catch (error) {
    console.error('Could not count Clerk users:', error.message);
  }

  return res.status(200).json({
    totalSongs: songs.length,
    totalAlbums: albums.length,
    totalArtists: new Set([...songs, ...albums].map((item) => item.artist)).size,
    totalUsers,
  });
}
