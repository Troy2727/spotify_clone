// Mock API handler for admin endpoints in Vercel

export default function handler(req, res) {
  // Get the authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      message: 'Unauthorized - missing or invalid token'
    });
  }

  // Return mock admin data based on the request
  return res.status(200).json({ 
    message: 'Admin API is working (mock response)',
    endpoint: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });
}
