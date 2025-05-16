// Mock API handler for users in Vercel

export default function handler(req, res) {
  // Return mock users data
  const users = [
    {
      _id: "user1",
      clerkId: "test_user_1",
      fullName: "Test User",
      imageUrl: "/cover-images/1.jpg"
    },
    {
      _id: "user2",
      clerkId: "test_user_2",
      fullName: "Another Test User",
      imageUrl: "/cover-images/2.jpg"
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
  return res.status(200).json(users);
}
