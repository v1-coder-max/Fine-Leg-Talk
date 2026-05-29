'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetch('/api/posts')
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || 'Failed to load');
        setPosts(data.posts || []);
      })
      .catch((e) => setError(e.message));
  }, []);

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const remove = async (id, title) => {
    if (!confirm(`Delete "${title}"? This commits to GitHub and cannot be undone from here.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/posts/${encodeURIComponent(id)}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      alert('Delete failed: ' + e.message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <div className="admin-bar">
        <div className="admin-title">
          <span>Posts</span>
          <small>{posts ? `${posts.length} live` : ''}</small>
        </div>
        <div className="admin-actions">
          <Link href="/" className="admin-btn admin-btn-out">View site</Link>
          <Link href="/admin/new" className="admin-btn admin-btn-gold">+ New post</Link>
          <button className="admin-btn admin-btn-out" onClick={logout}>Logout</button>
        </div>
      </div>

      {error && (
        <div style={{ background: 'rgba(232,76,76,0.1)', border: '1px solid rgba(232,76,76,0.3)', borderRadius: 8, padding: 14, marginBottom: 18, color: '#e84c4c', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      {!posts && !error && (
        <div className="loading-state"><div className="loading-spinner"></div><p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>Loading posts…</p></div>
      )}

      {posts && posts.length === 0 && (
        <div style={{ textAlign: 'center', padding: 50, color: 'var(--muted)' }}>No posts yet. Click <strong>+ New post</strong> to write your first one.</div>
      )}

      {posts && posts.length > 0 && (
        <div className="admin-grid">
          {posts.map((p) => (
            <div key={p.id} className="admin-row">
              <div className="admin-row-top">
                <span className={`badge ${p.badgeClass || 'b-gold'}`}>{p.badge || 'Read'}</span>
                {p.featured && <span className="badge b-gold">Featured</span>}
              </div>
              <div className="admin-row-title">{p.title}</div>
              <div className="admin-row-meta">
                <span>{p.date}</span>
                <span>{p.readTime}</span>
                <span style={{ color: 'var(--gold)' }}>/{p.id}</span>
              </div>
              <div className="admin-row-actions">
                <Link href={`/admin/edit/${encodeURIComponent(p.id)}`} className="admin-btn admin-btn-out">Edit</Link>
                <a href={`/${p.id}`} target="_blank" rel="noopener" className="admin-btn admin-btn-out">View</a>
                <button
                  className="admin-btn admin-btn-red"
                  onClick={() => remove(p.id, p.title)}
                  disabled={deleting === p.id}
                >
                  {deleting === p.id ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
