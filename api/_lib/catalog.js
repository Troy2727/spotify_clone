// The whole mock catalog as one deduplicated song list (album tracks carry their albumId)

import { albums } from '../albums.js';
import { featuredSongs } from '../songs/featured.js';
import { madeForYouSongs } from '../songs/made-for-you.js';
import { trendingSongs } from '../songs/trending.js';

export function allSongs() {
  const singles = [...featuredSongs, ...madeForYouSongs, ...trendingSongs].map((song) => ({ ...song, albumId: null }));
  const albumTracks = albums.flatMap((album) => album.songs.map((song) => ({ ...song, albumId: album._id })));

  const seen = new Set();
  return [...singles, ...albumTracks].filter((song) => !seen.has(song._id) && seen.add(song._id));
}
