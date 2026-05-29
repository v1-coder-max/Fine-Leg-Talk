'use client';

import { useEffect, useState } from 'react';

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID;
const MAX_VIDEOS = 12;

function parseDuration(iso) {
  if (!iso) return '';
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return '';
  const h = parseInt(m[1]||0), min = parseInt(m[2]||0), s = parseInt(m[3]||0);
  if (h > 0) return `${h}:${String(min).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  return `${min}:${String(s).padStart(2,'0')}`;
}
function isShort(iso) {
  if (!iso) return false;
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return false;
  const total = (parseInt(m[1]||0)*3600) + (parseInt(m[2]||0)*60) + parseInt(m[3]||0);
  return total <= 60;
}
function getType(title, duration) {
  if (isShort(duration)) return 'shorts';
  const t = (title||'').toLowerCase();
  if (t.includes('review') || t.includes('breakdown') || t.includes('match')) return 'review';
  return 'analysis';
}
function fmtViews(n) {
  n = parseInt(n||0);
  if (n >= 1000000) return (n/1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n/1000).toFixed(1) + 'K';
  return String(n);
}
function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
function badgeFor(type) {
  if (type === 'shorts') return ['b-dark', 'Shorts'];
  if (type === 'review') return ['b-green', 'Review'];
  return ['b-gold', 'Analysis'];
}

function VideoCard({ video, onPlay, embedded }) {
  const type = getType(video.title, video.duration);
  const [bcls, blabel] = badgeFor(type);
  return (
    <div className="vid-card">
      <div className="v-thumb" onClick={() => !embedded && onPlay(video.id)} style={{cursor: embedded ? 'default' : 'pointer'}}>
        {embedded ? (
          <div className="vid-embed">
            <iframe
              src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <>
            {video.thumbnail && <img src={video.thumbnail} alt={video.title} loading="lazy" />}
            <div className="v-overlay">
              <div className="v-play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>
            </div>
            <div className="v-bdg"><span className={`badge ${bcls}`}>{blabel}</span></div>
            {video.duration && <div className="v-dur">{parseDuration(video.duration)}</div>}
          </>
        )}
      </div>
      <div className="v-info">
        <h3 className="v-title">{video.title}</h3>
        <div className="v-meta">
          <span>👁 {fmtViews(video.viewCount)} views</span>
          <span>{fmtDate(video.publishedAt)}</span>
        </div>
      </div>
    </div>
  );
}

export default function VideosClient() {
  const [videos, setVideos] = useState(null);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [embeds, setEmbeds] = useState({});
  const [featuredEmbed, setFeaturedEmbed] = useState(false);

  useEffect(() => {
    if (!API_KEY || !CHANNEL_ID) {
      setError('YouTube API not configured. Set NEXT_PUBLIC_YOUTUBE_API_KEY and NEXT_PUBLIC_YOUTUBE_CHANNEL_ID.');
      return;
    }
    const B = 'https://www.googleapis.com/youtube/v3';
    (async () => {
      try {
        const ch = await (await fetch(`${B}/channels?part=contentDetails,snippet&id=${CHANNEL_ID}&key=${API_KEY}`)).json();
        if (ch.error) throw new Error(ch.error.message);
        if (!ch.items?.length) throw new Error('Channel not found');
        const uploadsId = ch.items[0].contentDetails.relatedPlaylists.uploads;

        const pl = await (await fetch(`${B}/playlistItems?part=snippet&playlistId=${uploadsId}&maxResults=${MAX_VIDEOS + 1}&key=${API_KEY}`)).json();
        const items = pl.items || [];
        if (!items.length) throw new Error('No videos found in this channel');

        const ids = items.map(i => i.snippet.resourceId.videoId).join(',');
        const vd = await (await fetch(`${B}/videos?part=statistics,contentDetails&id=${ids}&key=${API_KEY}`)).json();
        const details = Object.fromEntries((vd.items||[]).map(v => [v.id, v]));

        const all = items.map(item => {
          const id = item.snippet.resourceId.videoId;
          const d = details[id] || {};
          const thumb = item.snippet.thumbnails;
          return {
            id,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: (thumb.maxres || thumb.standard || thumb.high || thumb.medium || thumb.default || {}).url || '',
            publishedAt: item.snippet.publishedAt,
            viewCount: d.statistics?.viewCount,
            duration: d.contentDetails?.duration,
          };
        }).filter(v => v.title !== 'Private video' && v.title !== 'Deleted video');

        setVideos(all);
      } catch (e) {
        setError(e.message || 'Failed to load videos');
      }
    })();
  }, []);

  if (error) {
    return (
      <section className="videos-section">
        <div className="container">
          <div className="error-state">
            <div className="err-icon">📡</div>
            <h3>Couldn't load videos</h3>
            <p>{error} — visit the channel directly.</p>
          </div>
        </div>
      </section>
    );
  }

  if (!videos) {
    return (
      <section className="videos-section">
        <div className="container">
          <div className="loading-state"><div className="loading-spinner"></div><p style={{color:'var(--muted)',fontSize:'0.88rem'}}>Loading videos…</p></div>
        </div>
      </section>
    );
  }

  const featured = videos[0];
  const rest = videos.slice(1);
  const filtered = filter === 'all' ? rest : rest.filter(v => getType(v.title, v.duration) === filter);

  return (
    <>
      <div className="filter-section">
        <div className="container">
          <div className="filter-wrap">
            <div className="filter-left">
              {[['all','All Videos'],['shorts','Shorts'],['analysis','Analysis'],['review','Full Reviews']].map(([k,l]) => (
                <button key={k} className={`filter-btn${filter===k?' active':''}`} onClick={() => setFilter(k)}>{l}</button>
              ))}
            </div>
            <span className="video-count">{filtered.length} {filter === 'all' ? 'videos' : filter}</span>
          </div>
        </div>
      </div>

      <section className="videos-section">
        <div className="container">
          {featured && (
            <div className="featured-wrap">
              <div className="featured-label">Latest Video</div>
              <div className="featured-card">
                <div className="feat-thumb" onClick={() => setFeaturedEmbed(true)} style={{cursor: featuredEmbed ? 'default' : 'pointer'}}>
                  {featuredEmbed ? (
                    <div className="vid-embed">
                      <iframe
                        src={`https://www.youtube.com/embed/${featured.id}?autoplay=1`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <>
                      {featured.thumbnail && <img src={featured.thumbnail} alt={featured.title} />}
                      <div className="feat-thumb-overlay">
                        <div className="feat-play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>
                      </div>
                      <div className="feat-bdg"><span className={`badge ${badgeFor(getType(featured.title, featured.duration))[0]}`}>{badgeFor(getType(featured.title, featured.duration))[1]}</span></div>
                      {featured.duration && <div className="feat-dur">{parseDuration(featured.duration)}</div>}
                    </>
                  )}
                </div>
                <div className="feat-body">
                  <div className="feat-type">Newest Upload</div>
                  <h2 className="feat-title">{featured.title}</h2>
                  <p className="feat-desc">{featured.description || ''}</p>
                  <div className="feat-meta">
                    <span>👁 {fmtViews(featured.viewCount)} views</span>
                    <span>📅 {fmtDate(featured.publishedAt)}</span>
                  </div>
                  <a href={`https://www.youtube.com/watch?v=${featured.id}`} target="_blank" rel="noopener" className="feat-yt-link">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                    Watch on YouTube
                  </a>
                </div>
              </div>
            </div>
          )}

          <div className="vid-grid">
            {filtered.map(v => (
              <VideoCard
                key={v.id}
                video={v}
                embedded={!!embeds[v.id]}
                onPlay={(id) => setEmbeds(prev => ({...prev, [id]: true}))}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="yt-strip">
        <div className="container">
          <h2>Watch on YouTube</h2>
          <p>Subscribe to Fine Leg Talk for cricket analysis, match reviews and Shorts.</p>
          <a href="https://youtube.com/@FineLegTalk" target="_blank" rel="noopener" className="yt-strip-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            Subscribe on YouTube
          </a>
        </div>
      </div>
    </>
  );
}
