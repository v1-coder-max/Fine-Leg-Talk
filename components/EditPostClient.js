'use client';

import { useEffect, useState } from 'react';
import PostEditor from './PostEditor';

export default function EditPostClient({ id }) {
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/posts/${encodeURIComponent(id)}`)
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || 'Failed to load');
        setPost(data.post);
      })
      .catch((e) => setError(e.message));
  }, [id]);

  if (error) {
    return (
      <div style={{ background: 'rgba(232,76,76,0.1)', border: '1px solid rgba(232,76,76,0.3)', borderRadius: 8, padding: 14, color: '#e84c4c', fontSize: '0.9rem' }}>
        {error}
      </div>
    );
  }

  if (!post) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>Loading post…</p>
      </div>
    );
  }

  return <PostEditor mode="edit" initialPost={post} />;
}
