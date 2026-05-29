'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

export default function BlogsList({ posts, popular }) {
  const [cat, setCat] = useState('all');

  const featured = useMemo(() => posts.find(p => p.featured) || posts[0], [posts]);
  const others = useMemo(() => posts.filter(p => p.id !== featured?.id), [posts, featured]);

  const filtered = useMemo(() => {
    if (cat === 'all') return others;
    return others.filter(p => p.category === cat);
  }, [others, cat]);

  return (
    <>
      <div className="filter-section">
        <div className="container">
          <div className="filter-wrap">
            {[
              ['all', 'All Posts'],
              ['review', 'Match Reviews'],
              ['analysis', 'Analysis'],
              ['opinion', 'Opinion'],
              ['ipl', 'IPL'],
              ['history', 'History'],
            ].map(([key, label]) => (
              <button
                key={key}
                className={`filter-btn${cat === key ? ' active' : ''}`}
                onClick={() => setCat(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main>
        <div className="container">
          <div className="blog-layout">
            <div>
              {featured && cat === 'all' && (
                <Link href={`/${featured.id}`} className="feat-post fade-up">
                  <div className={`feat-img ${featured.bgClass || 'bg1'}`}>
                    <div className="feat-badge-wrap">
                      <span className={`badge ${featured.badgeClass || 'b-gold'}`}>{featured.badge || 'Featured'}</span>
                    </div>
                    <div className="feat-img-icon">{featured.emoji || '🏏'}</div>
                  </div>
                  <div className="feat-body">
                    <div className="feat-meta">
                      <span className="feat-date">{featured.date}</span>
                      <span className="feat-read">{featured.readTime}</span>
                    </div>
                    <h2 className="feat-title">{featured.title}</h2>
                    <p className="feat-exc">{featured.excerpt}</p>
                    <span className="feat-link">Read full piece</span>
                  </div>
                </Link>
              )}

              <div className="posts-grid">
                {filtered.length === 0 && (
                  <div style={{gridColumn:'1/-1',textAlign:'center',padding:'40px 0',color:'var(--muted)',fontSize:'0.9rem'}}>
                    No posts in this category yet.
                  </div>
                )}
                {filtered.map(post => (
                  <Link key={post.id} href={`/${post.id}`} className="post-card fade-up">
                    <div className={`pc-img ${post.bgClass || 'bg1'}`}>
                      <div className="pc-bdg">
                        <span className={`badge ${post.badgeClass || 'b-gold'}`}>{post.badge || 'Read'}</span>
                      </div>
                      <div className="pc-img-icon">{post.emoji || '📝'}</div>
                    </div>
                    <div className="pc-body">
                      <div className="pc-meta">
                        <span className="pc-date">{post.date}</span>
                        <span className="pc-read">{post.readTime}</span>
                      </div>
                      <h3 className="pc-title">{post.title}</h3>
                      <p className="pc-exc">{post.excerpt}</p>
                      <span className="pc-link">Read more</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <aside className="sidebar">
              <div className="side-card">
                <div className="side-title">Popular Posts</div>
                <div className="pop-list">
                  {popular.map((p, i) => (
                    <Link key={p.id} href={`/${p.id}`} className="pop-item">
                      <div className="pop-num">{i + 1}</div>
                      <div>
                        <div className="pop-item-title">{p.title}</div>
                        <div className="pop-item-date">{p.date}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="side-card">
                <div className="side-title">Browse by Topic</div>
                <div className="tag-cloud">
                  {[
                    ['review', 'Match Reviews'],
                    ['analysis', 'Analysis'],
                    ['opinion', 'Opinion'],
                    ['ipl', 'IPL'],
                    ['history', 'History'],
                  ].map(([key, label]) => (
                    <span key={key} className="tag-pill" onClick={() => setCat(key)}>{label}</span>
                  ))}
                  {['Test Cricket','Bumrah','Kohli','Rohit','England','Australia','WTC'].map(t => (
                    <span key={t} className="tag-pill" onClick={() => setCat('all')}>{t}</span>
                  ))}
                </div>
              </div>

              <div className="side-card">
                <div className="yt-cta">
                  <div className="yt-cta-icon">🎬</div>
                  <div className="side-title" style={{marginBottom:6,border:'none',padding:0}}>Watch on YouTube</div>
                  <p className="yt-cta-text">Every post has a companion video — deeper dives, analysis clips and Shorts on the channel.</p>
                  <a href="https://youtube.com/@FineLegTalk" target="_blank" rel="noopener" className="btn btn-yt" style={{width:'100%',justifyContent:'center'}}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    Subscribe Free
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
