// Mock API handler for stats in Vercel

export default function handler(req, res) {
  // Return mock stats data
  return res.status(200).json({ 
    totalSongs: 42,
    totalAlbums: 12,
    totalArtists: 18,
    totalUsers: 256,
    message: 'Stats API is working (mock response)',
    timestamp: new Date().toISOString()
  });
}
