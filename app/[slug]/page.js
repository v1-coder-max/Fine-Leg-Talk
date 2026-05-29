import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllPosts, getPostBySlug, SITE_URL } from '@/lib/posts';
import PostBody from '@/components/PostBody';
import ShareBar from '@/components/ShareBar';
import SubCount from '@/components/SubCount';

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }) {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  const url = `${SITE_URL}/${post.id}`;
  return {
    title: post.title,
    description: post.excerpt || '',
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: `${post.title} — Fine Leg Talk`,
      description: post.excerpt || '',
      url,
      images: ['/FineLegTalk.jpeg'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} — Fine Leg Talk`,
      description: post.excerpt || '',
      images: ['/FineLegTalk.jpeg'],
    },
  };
}

export default function PostPage({ params }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const all = getAllPosts();
  const related = all.filter((p) => p.id !== post.id).slice(0, 4);

  const ldJson = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || '',
    datePublished: post.dateISO || '',
    author: { '@type': 'Organization', name: 'Fine Leg Talk' },
    publisher: { '@type': 'Organization', name: 'Fine Leg Talk', url: SITE_URL },
    url: `${SITE_URL}/${post.id}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }} />
      <div className="post-wrap">
        <div className="container">
          <div className="post-layout">
            <article>
              <nav className="breadcrumb" aria-label="Breadcrumb">
                <Link href="/">Home</Link><span>›</span>
                <Link href="/blogs">Blog</Link><span>›</span>
                <span>{post.badge}</span>
              </nav>
              <div className="post-cat"><span className={`badge ${post.badgeClass || 'b-gold'}`}>{post.badge}</span></div>
              <h1 className="post-h1">{post.title}</h1>
              {post.standfirst && <p className="post-standfirst">{post.standfirst}</p>}
              <div className="post-meta">
                <span className="post-author">Fine Leg Talk</span>
                <span className="meta-dot">·</span>
                <span className="post-date">📅 {post.date}</span>
                <span className="meta-dot">·</span>
                <span className="post-read">⏱ {post.readTime} read</span>
              </div>
              <div className={`post-hero ${post.bgClass || 'bg1'}`}>
                <div className="post-hero-icon">{post.emoji || '🏏'}</div>
              </div>
              <PostBody blocks={post.content} />
              {post.tags && post.tags.length > 0 && (
                <div className="post-tags">
                  <span className="post-tags-lbl">Tags:</span>
                  {post.tags.map((t) => (
                    <Link key={t} href="/blogs" className="post-tag">{t}</Link>
                  ))}
                </div>
              )}
              <ShareBar title={post.title} />
              {related.length > 0 && (
                <section className="related">
                  <h2 className="related-title">More from the Blog</h2>
                  <div className="related-grid">
                    {related.map((p) => (
                      <Link key={p.id} href={`/${p.id}`} className="rel-card">
                        <div className={`rel-img ${p.bgClass || 'bg1'}`}>{p.emoji || '🏏'}</div>
                        <div className="rel-body">
                          <div className="rel-meta">
                            <span className={`badge ${p.badgeClass || 'b-gold'}`} style={{fontSize:9}}>{p.badge}</span>
                            <span className="rel-date">{p.date}</span>
                          </div>
                          <div className="rel-title">{p.title}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </article>
            <aside className="sidebar">
              <div className="side-card">
                <div className="yt-side">
                  <div className="yt-side-icon">🎬</div>
                  <div className="yt-side-sub"><SubCount /></div>
                  <div className="yt-side-lbl">Subscribers</div>
                  <p className="yt-side-p">Every article has a companion video on the channel. Subscribe so you don't miss it.</p>
                  <a href="https://youtube.com/@FineLegTalk" target="_blank" rel="noopener" className="btn btn-yt" style={{width:'100%',justifyContent:'center',marginTop:4}}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    Subscribe Free
                  </a>
                </div>
              </div>
              {post.toc && post.toc.length > 0 && (
                <div className="side-card">
                  <div className="side-h">Table of Contents</div>
                  <ul className="toc-list">
                    {post.toc.map((item) => (
                      <li key={item.id}><a href={`#${item.id}`} className="toc-link">{item.text}</a></li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
