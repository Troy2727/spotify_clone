// Mock API handler for featured songs in Vercel

export default function handler(req, res) {
  // Return mock featured songs data
  const featuredSongs = [
    {
      _id: "featured1",
      title: "Believer",
      artist: "Imagine Dragons",
      imageUrl: "/cover-images/17.jpg",
      audioUrl: "/songs/1.mp3",
      duration: 180,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: "featured2",
      title: "Burn",
      artist: "Usher",
      imageUrl: "/cover-images/15.jpg",
      audioUrl: "/songs/2.mp3",
      duration: 210,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: "featured3",
      title: "Uprising",
      artist: "Muse",
      imageUrl: "/cover-images/3.jpg",
      audioUrl: "/songs/3.mp3",
      duration: 195,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: "featured4",
      title: "New Americana",
      artist: "Halsey",
      imageUrl: "/cover-images/5.jpg",
      audioUrl: "/songs/4.mp3",
      duration: 225,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: "featured5",
      title: "Dancing Queen",
      artist: "ABBA",
      imageUrl: "/cover-images/14.jpg",
      audioUrl: "/songs/5.mp3",
      duration: 240,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: "featured6",
      title: "Venom",
      artist: "Eminem",
      imageUrl: "/cover-images/9.jpg",
      audioUrl: "/songs/6.mp3",
      duration: 200,
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
  return res.status(200).json(featuredSongs);
}
