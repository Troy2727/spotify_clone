// Mock API handler for trending songs in Vercel

export default function handler(req, res) {
  // Return mock trending songs data
  const trendingSongs = [
    {
      _id: "trending1",
      title: "Midnight Drive",
      artist: "The Weekenders",
      imageUrl: "/cover-images/10.jpg",
      audioUrl: "/songs/1.mp3",
      duration: 240,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: "trending2",
      title: "Starlight",
      artist: "Luna Ray",
      imageUrl: "/cover-images/11.jpg",
      audioUrl: "/songs/2.mp3",
      duration: 195,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: "trending3",
      title: "City Rain",
      artist: "Urban Lofi",
      imageUrl: "/cover-images/12.jpg",
      audioUrl: "/songs/3.mp3",
      duration: 210,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: "trending4",
      title: "Neon Lights",
      artist: "Night Express",
      imageUrl: "/cover-images/13.jpg",
      audioUrl: "/songs/4.mp3",
      duration: 225,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

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
