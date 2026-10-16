// Mock API handler for trending songs in Vercel

// Mock trending songs data (also used by api/songs/index.js)
export const trendingSongs = [
  {
    _id: "trending1",
    title: "Treat You Better",
    artist: "Shawn Mendes",
    imageUrl: "/cover-images/10.jpg",
    audioUrl: "/songs/1.mp3",
    duration: 240,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: "trending2",
    title: "Happier Than Ever",
    artist: "Billie Eilish",
    imageUrl: "/cover-images/11.jpg",
    audioUrl: "/songs/2.mp3",
    duration: 195,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: "trending3",
    title: "The Hills",
    artist: "The Weeknd",
    imageUrl: "/cover-images/12.jpg",
    audioUrl: "/songs/3.mp3",
    duration: 210,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: "trending4",
    title: "The Best",
    artist: "AWOLNATION",
    imageUrl: "/cover-images/13.jpg",
    audioUrl: "/songs/4.mp3",
    duration: 225,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Return the mock data
  return res.status(200).json(trendingSongs);
}
