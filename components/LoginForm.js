'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }
      router.push('/admin');
      router.refresh();
    } catch {
      setError('Network error — try again');
      setLoading(false);
    }
  };

  return (
    <form className="login-card" onSubmit={submit}>
      <div className="login-h">Fine Leg Talk</div>
      <div className="login-sub">Admin Login</div>
      <input
        type="password"
        className="login-input"
        placeholder="Admin password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoFocus
        required
      />
      {error && <div className="login-err">{error}</div>}
      <button type="submit" className="admin-btn admin-btn-gold" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
        {loading ? 'Signing in…' : 'Sign In'}
      </button>
      <div className="login-msg">Only the site owner can access this page.</div>
    </form>
  );
}
