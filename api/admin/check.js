// Admin check for Vercel: verifies the Clerk session and applies the backend's admin rule

import { checkAdmin } from '../_lib/clerkAdmin.js';

export default async function handler(req, res) {
  try {
    const { status, admin, message } = await checkAdmin(req);
    return res.status(status).json({ admin, message });
  } catch (error) {
    console.error('Admin check failed:', error.message);
    return res.status(500).json({ admin: false, message: 'Could not verify admin status' });
  }
}
