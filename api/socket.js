// This file serves as a WebSocket proxy for Vercel serverless functions

import { createProxyMiddleware } from 'http-proxy-middleware';

// Create proxy instance outside of handler to reuse
const socketProxy = createProxyMiddleware({
  target: process.env.BACKEND_URL || 'http://localhost:5000',
  changeOrigin: true,
  ws: true, // Enable WebSocket proxy
  logLevel: 'debug',
});

export default function handler(req, res) {
  // Forward WebSocket requests to the backend
  return socketProxy(req, res);
}
