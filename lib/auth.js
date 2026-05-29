import { SignJWT, jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-only-insecure-secret-change-me');
const COOKIE_NAME = 'flt_admin';
const SEVEN_DAYS = 7 * 24 * 60 * 60;

export async function signAdminToken() {
  return await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SEVEN_DAYS}s`)
    .sign(SECRET);
}

export async function verifyAdminToken(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload?.role === 'admin' ? payload : null;
  } catch {
    return null;
  }
}

export const AUTH_COOKIE = COOKIE_NAME;
export const AUTH_MAX_AGE = SEVEN_DAYS;
