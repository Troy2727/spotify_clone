// Shared admin check for Vercel functions (the "_" prefix keeps this out of the routes).
// Mirrors backend/src/middleware/auth.middleware.js: a user is admin when their
// primary email equals ADMIN_EMAIL or their Clerk user id is listed in ADMIN_USER_IDS.

import { createPublicKey, verify } from 'node:crypto';

const CLERK_API = 'https://api.clerk.com/v1';
const CLOCK_SKEW_SECONDS = 5;

async function clerkGet(path) {
  const response = await fetch(`${CLERK_API}${path}`, {
    headers: { Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}` },
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error(`Clerk API ${path} responded ${response.status}`);
  return response.json();
}

const decodeJson = (part) => JSON.parse(Buffer.from(part, 'base64url').toString('utf8'));

// Returns the Clerk user id for a validly signed, unexpired session token, otherwise null
export async function verifySessionToken(token) {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  let header, payload;
  try {
    header = decodeJson(parts[0]);
    payload = decodeJson(parts[1]);
  } catch {
    return null;
  }
  if (header.alg !== 'RS256' || !header.kid) return null;

  const { keys = [] } = await clerkGet('/jwks');
  const jwk = keys.find((key) => key.kid === header.kid);
  if (!jwk) return null;

  const signedData = Buffer.from(`${parts[0]}.${parts[1]}`);
  const signature = Buffer.from(parts[2], 'base64url');
  if (!verify('RSA-SHA256', signedData, createPublicKey({ key: jwk, format: 'jwk' }), signature)) return null;

  const now = Math.floor(Date.now() / 1000);
  if (typeof payload.exp !== 'number' || payload.exp < now - CLOCK_SKEW_SECONDS) return null;
  if (typeof payload.nbf === 'number' && payload.nbf > now + CLOCK_SKEW_SECONDS) return null;

  return typeof payload.sub === 'string' ? payload.sub : null;
}

export async function isAdminUser(userId) {
  const adminUserIds = process.env.ADMIN_USER_IDS ? process.env.ADMIN_USER_IDS.split(',') : [];
  if (adminUserIds.includes(userId)) return true;

  const user = await clerkGet(`/users/${encodeURIComponent(userId)}`);
  const primaryEmail = user.email_addresses?.find((email) => email.id === user.primary_email_address_id);
  return Boolean(process.env.ADMIN_EMAIL) && primaryEmail?.email_address === process.env.ADMIN_EMAIL;
}

// Resolves { status, admin, message } for a request: 401 without a valid session, else 200 with admin true/false
export async function checkAdmin(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { status: 401, admin: false, message: 'Unauthorized - missing or invalid token' };
  }

  const userId = await verifySessionToken(authHeader.slice('Bearer '.length));
  if (!userId) {
    return { status: 401, admin: false, message: 'Unauthorized - invalid or expired token' };
  }

  const admin = await isAdminUser(userId);
  return { status: 200, admin, message: admin ? 'Admin check successful' : 'Not an admin' };
}
