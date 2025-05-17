// Mock API handler for admin check in Vercel

export default function handler(req, res) {
  // Get the authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      message: 'Unauthorized - missing or invalid token',
      admin: false 
    });
  }

  // In a real implementation, you would verify the token
  // For now, we'll just return admin: true for all authenticated requests
  return res.status(200).json({ 
    admin: true,
    message: 'Admin check successful (mock response)'
  });
}
