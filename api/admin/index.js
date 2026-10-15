// Mock API handler for admin endpoints in Vercel

import { checkAdmin } from '../_lib/clerkAdmin.js';

export default async function handler(req, res) {
  try {
    const { status, admin, message } = await checkAdmin(req);
    if (status !== 200) return res.status(status).json({ message });
    if (!admin) return res.status(403).json({ message: 'Unauthorized - you must be an admin' });
  } catch (error) {
    console.error('Admin check failed:', error.message);
    return res.status(500).json({ message: 'Could not verify admin status' });
  }

  // Return mock admin data based on the request
  return res.status(200).json({ 
    message: 'Admin API is working (mock response)',
    endpoint: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });
}
