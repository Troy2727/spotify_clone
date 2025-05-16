// Mock API handler for albums in Vercel

export default function handler(req, res) {
  // Return mock albums data
  const albums = [
    {
      _id: "album1",
      title: "Urban Nights",
      artist: "Various Artists",
      imageUrl: "/cover-images/15.jpg",
      releaseYear: 2023,
      songs: [
        {
          _id: "song1",
          title: "Urban Nights",
          artist: "Various Artists",
          imageUrl: "/cover-images/15.jpg",
          audioUrl: "/songs/1.mp3",
          duration: 240,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: "song2",
          title: "City Lights",
          artist: "Various Artists",
          imageUrl: "/cover-images/15.jpg",
          audioUrl: "/songs/2.mp3",
          duration: 195,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    },
    {
      _id: "album2",
      title: "Coastal Dreaming",
      artist: "Various Artists",
      imageUrl: "/cover-images/9.jpg",
      releaseYear: 2022,
      songs: [
        {
          _id: "song3",
          title: "Ocean Breeze",
          artist: "Various Artists",
          imageUrl: "/cover-images/9.jpg",
          audioUrl: "/songs/3.mp3",
          duration: 210,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: "song4",
          title: "Sunset Dreams",
          artist: "Various Artists",
          imageUrl: "/cover-images/9.jpg",
          audioUrl: "/songs/4.mp3",
          duration: 225,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    },
    {
      _id: "album3",
      title: "Midnight Sessions",
      artist: "Various Artists",
      imageUrl: "/cover-images/10.jpg",
      releaseYear: 2023,
      songs: [
        {
          _id: "song5",
          title: "Midnight Drive",
          artist: "Various Artists",
          imageUrl: "/cover-images/10.jpg",
          audioUrl: "/songs/5.mp3",
          duration: 240,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: "song6",
          title: "Neon City",
          artist: "Various Artists",
          imageUrl: "/cover-images/10.jpg",
          audioUrl: "/songs/6.mp3",
          duration: 200,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    },
    {
      _id: "album4",
      title: "Eastern Dreams",
      artist: "Various Artists",
      imageUrl: "/cover-images/3.jpg",
      releaseYear: 2021,
      songs: [
        {
          _id: "song7",
          title: "Eastern Winds",
          artist: "Various Artists",
          imageUrl: "/cover-images/3.jpg",
          audioUrl: "/songs/7.mp3",
          duration: 230,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: "song8",
          title: "Tokyo Nights",
          artist: "Various Artists",
          imageUrl: "/cover-images/3.jpg",
          audioUrl: "/songs/8.mp3",
          duration: 215,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
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
  return res.status(200).json(albums);
}
