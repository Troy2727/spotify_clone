// Mock API handler for user messages in Vercel

export default function handler(req, res) {
  const { userId } = req.query;

  // Return mock messages data
  const messages = [
    {
      _id: "mock1",
      senderId: "user_2x74anfpqe1ITRS49EiPbTS6jaE",
      receiverId: userId,
      content: "Hey there! How are you?",
      createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      updatedAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      _id: "mock2",
      senderId: userId,
      receiverId: "user_2x74anfpqe1ITRS49EiPbTS6jaE",
      content: "I'm doing great! How about you?",
      createdAt: new Date(Date.now() - 3500000).toISOString(), // 58 minutes ago
      updatedAt: new Date(Date.now() - 3500000).toISOString()
    },
    {
      _id: "mock3",
      senderId: "user_2x74anfpqe1ITRS49EiPbTS6jaE",
      receiverId: userId,
      content: "Just listening to some music on Spotify Clone!",
      createdAt: new Date(Date.now() - 3400000).toISOString(), // 56 minutes ago
      updatedAt: new Date(Date.now() - 3400000).toISOString()
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
  return res.status(200).json(messages);
}
