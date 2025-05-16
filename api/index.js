// This file serves as an entry point for Vercel serverless functions
// It will redirect API requests to your backend

import { createProxyMiddleware } from 'http-proxy-middleware';

// Create proxy instance outside of handler to reuse
const apiProxy = createProxyMiddleware({
  target: process.env.BACKEND_URL || 'http://localhost:5000',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '', // Remove /api prefix when forwarding to backend
  },
  logLevel: 'debug',
});

export default function handler(req, res) {
  // Return API status if it's a simple GET request
  if (req.method === 'GET' && req.url === '/api') {
    return res.status(200).json({
      message: 'API is working!',
      status: 'success',
      timestamp: new Date().toISOString()
    });
  }

  // Forward all other requests to the backend
  return apiProxy(req, res);
}
