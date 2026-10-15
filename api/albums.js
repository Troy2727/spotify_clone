// Mock API handler for albums in Vercel

export default function handler(req, res) {
  // Return mock albums data
  const albums = [
    {
      _id: "album1",
      title: "Confessions",
      artist: "Usher",
      imageUrl: "/cover-images/15.jpg",
      releaseYear: 2004,
      songs: [
        {
          _id: "song1",
          title: "Caught Up",
          artist: "Usher",
          imageUrl: "/cover-images/15.jpg",
          audioUrl: "/songs/1.mp3",
          duration: 240,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: "song2",
          title: "Confessions Part II",
          artist: "Usher",
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
      title: "Kamikaze",
      artist: "Eminem",
      imageUrl: "/cover-images/9.jpg",
      releaseYear: 2018,
      songs: [
        {
          _id: "song3",
          title: "The Ringer",
          artist: "Eminem",
          imageUrl: "/cover-images/9.jpg",
          audioUrl: "/songs/3.mp3",
          duration: 210,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: "song4",
          title: "Fall",
          artist: "Eminem",
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
      title: "Illuminate",
      artist: "Shawn Mendes",
      imageUrl: "/cover-images/10.jpg",
      releaseYear: 2016,
      songs: [
        {
          _id: "song5",
          title: "Mercy",
          artist: "Shawn Mendes",
          imageUrl: "/cover-images/10.jpg",
          audioUrl: "/songs/5.mp3",
          duration: 240,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: "song6",
          title: "Ruin",
          artist: "Shawn Mendes",
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
      title: "The Resistance",
      artist: "Muse",
      imageUrl: "/cover-images/3.jpg",
      releaseYear: 2009,
      songs: [
        {
          _id: "song7",
          title: "Resistance",
          artist: "Muse",
          imageUrl: "/cover-images/3.jpg",
          audioUrl: "/songs/7.mp3",
          duration: 230,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: "song8",
          title: "Undisclosed Desires",
          artist: "Muse",
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
