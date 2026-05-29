import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signAdminToken, AUTH_COOKIE, AUTH_MAX_AGE } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(request) {
  const { password } = await request.json().catch(() => ({}));
  if (!password) {
    return NextResponse.json({ error: 'Password required' }, { status: 400 });
  }

  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) {
    return NextResponse.json({ error: 'Admin password not configured on server' }, { status: 500 });
  }

  const ok = bcrypt.compareSync(password, hash);
  if (!ok) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const token = await signAdminToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: AUTH_MAX_AGE,
    path: '/',
  });
  return res;
}
