// Mock API handler for made-for-you songs in Vercel

export default function handler(req, res) {
  // Return mock made-for-you songs data
  const madeForYouSongs = [
    {
      _id: "mfy1",
      title: "Starboy",
      artist: "The Weeknd",
      imageUrl: "/cover-images/4.jpg",
      audioUrl: "/songs/7.mp3",
      duration: 230,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: "mfy2",
      title: "Enemy",
      artist: "Imagine Dragons & JID",
      imageUrl: "/cover-images/6.jpg",
      audioUrl: "/songs/8.mp3",
      duration: 215,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: "mfy3",
      title: "Yeah!",
      artist: "Usher",
      imageUrl: "/cover-images/7.jpg",
      audioUrl: "/songs/9.mp3",
      duration: 250,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: "mfy4",
      title: "Shape of You",
      artist: "Ed Sheeran",
      imageUrl: "/cover-images/8.jpg",
      audioUrl: "/songs/10.mp3",
      duration: 235,
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
  return res.status(200).json(madeForYouSongs);
}
