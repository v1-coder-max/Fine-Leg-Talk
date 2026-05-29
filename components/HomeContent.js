'use client';

import { useEffect, useRef, useState } from 'react';

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID;

const STATIC_VIDEOS = [
  { bg: 'vg1', badge: ['b-gold', 'Analysis'], dur: '14:22', title: "Jasprit Bumrah's Bowling Masterclass — Breaking Down Every Wicket vs England", views: '18.4K views', date: 'May 14, 2025' },
  { bg: 'vg2', badge: ['b-dark', 'Shorts'], dur: '0:58', title: 'This Rohit Sharma Pull Shot is Pure Elegance 🏏', views: '42.1K views', date: 'May 11, 2025' },
  { bg: 'vg3', badge: ['b-green', 'Review'], dur: '22:07', title: 'India vs England 4th Test Full Review — How Did Anderson Outfox Kohli?', views: '9.2K views', date: 'May 8, 2025' },
  { bg: 'vg4', badge: ['b-gold', 'Analysis'], dur: '18:44', title: "IPL 2025 Mid-Season Report Card — Who's Winning the Auction War?", views: '11.7K views', date: 'May 5, 2025' },
  { bg: 'vg5', badge: ['b-dark', 'Shorts'], dur: '0:45', title: "Can Shubman Gill Become India's Next Big Test Batter?", views: '28.9K views', date: 'May 2, 2025' },
  { bg: 'vg6', badge: ['b-green', 'Review'], dur: '16:33', title: "Champions Trophy Final Breakdown — India's Perfect Chase Explained", views: '15.3K views', date: 'Apr 28, 2025' },
];

const TICKER_ITEMS = [
  '🎬 New Video: Jasprit Bumrah\'s Bowling Masterclass — Breaking Down Every Wicket vs England',
  '📱 Short: This Rohit Sharma Pull Shot is Pure Elegance 🏏',
  '🎬 New Video: India vs England 4th Test Full Review — How Did Anderson Outfox Kohli?',
  '🎬 New Video: IPL 2025 Mid-Season Report Card — Who\'s Winning the Auction War?',
  '📱 Short: Can Shubman Gill Become India\'s Next Big Test Batter?',
  '🎬 New Video: Champions Trophy Final Breakdown — India\'s Perfect Chase Explained',
];

function fmtN(n) { return n>=1e6?(n/1e6).toFixed(1)+'M':n>=1e3?(n/1e3).toFixed(1)+'K':String(n); }
function fmtDate(iso) { if(!iso) return ''; return new Date(iso).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}); }
function parseDur(iso) {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return '—';
  const h = +(m[1]||0), mn = +(m[2]||0), s = +(m[3]||0);
  return h ? `${h}:${String(mn).padStart(2,'0')}:${String(s).padStart(2,'0')}` : `${mn}:${String(s).padStart(2,'0')}`;
}
function videoType(title, iso) {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const secs = m ? (+(m[1]||0)*3600)+(+(m[2]||0)*60)+(+(m[3]||0)) : 999;
  if (secs <= 60) return 'shorts';
  const t = title.toLowerCase();
  if (t.includes('review')||t.includes('breakdown')||t.includes('match')) return 'review';
  return 'analysis';
}

export default function HomeContent({ featured, popular }) {
  const [stats, setStats] = useState({ videos: '—', subs: '—', views: '—' });
  const [videos, setVideos] = useState(null);
  const [ticker, setTicker] = useState(TICKER_ITEMS);
  const heroRef = useRef(null);
  const heroVisRef = useRef(null);

  useEffect(() => {
    [heroRef.current, heroVisRef.current].forEach((el, i) => {
      if (!el) return;
      el.style.cssText = `opacity:0;transform:translateY(20px);transition:opacity 0.8s ease ${i*0.15}s,transform 0.8s ease ${i*0.15}s`;
      requestAnimationFrame(() => requestAnimationFrame(() => { el.style.opacity='1'; el.style.transform='translateY(0)'; }));
    });
  }, []);

  useEffect(() => {
    if (!API_KEY || !CHANNEL_ID) return;
    const B = 'https://www.googleapis.com/youtube/v3';
    (async () => {
      try {
        const ch = await (await fetch(`${B}/channels?part=contentDetails,statistics&id=${CHANNEL_ID}&key=${API_KEY}`)).json();
        if (ch.error) throw ch.error;
        const item = ch.items[0];
        const uplId = item.contentDetails.relatedPlaylists.uploads;
        const s = item.statistics || {};
        setStats({
          videos: fmtN(parseInt(s.videoCount||0)),
          subs: fmtN(parseInt(s.subscriberCount||0)),
          views: fmtN(parseInt(s.viewCount||0)),
        });

        const pl = await (await fetch(`${B}/playlistItems?part=snippet&playlistId=${uplId}&maxResults=10&key=${API_KEY}`)).json();
        const items = pl.items || [];
        if (!items.length) return;
        const ids = items.map(i => i.snippet.resourceId.videoId).join(',');
        const snips = {};
        items.forEach(i => { snips[i.snippet.resourceId.videoId] = i.snippet; });

        const vd = await (await fetch(`${B}/videos?part=snippet,contentDetails,statistics&id=${ids}&key=${API_KEY}`)).json();
        const vids = vd.items || [];

        if (vids.length) {
          const newTicker = vids.map(v => {
            const title = v.snippet?.title || '';
            const live = v.snippet?.liveBroadcastContent;
            const dur = v.contentDetails?.duration || '';
            const m = dur.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
            const secs = m ? (+(m[1]||0)*3600)+(+(m[2]||0)*60)+(+(m[3]||0)) : 999;
            const prefix = live==='live' ? '🔴 LIVE NOW' : live==='upcoming' ? '🔔 Upcoming' : secs<=60 ? '📱 Short' : '🎬 New Video';
            return `${prefix}: ${title}`;
          });
          setTicker(newTicker);
        }

        setVideos(vids.slice(0,6).map(v => {
          const sn = snips[v.id] || v.snippet || {};
          return {
            id: v.id,
            title: sn.title || '',
            thumb: sn.thumbnails?.medium?.url || sn.thumbnails?.default?.url || '',
            dur: parseDur(v.contentDetails?.duration || ''),
            type: videoType(sn.title||'', v.contentDetails?.duration||''),
            views: fmtN(parseInt(v.statistics?.viewCount||0)) + ' views',
            date: fmtDate(sn.publishedAt||''),
          };
        }));
      } catch (e) {
        console.error('Homepage YT fetch failed:', e);
      }
    })();
  }, []);

  const renderVideoCard = (v, key) => {
    const badge = v.type === 'shorts'
      ? <span className="badge b-dark">Short</span>
      : v.type === 'review'
        ? <span className="badge b-green">Review</span>
        : <span className="badge b-gold">Analysis</span>;
    const [embed, setEmbed] = [false, () => {}];
    return (
      <div key={key} className="vid-card fade-up">
        <a href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener" style={{display:'block'}}>
          <div className="v-thumb">
            {v.thumb && <img src={v.thumb} alt={v.title} loading="lazy" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}} />}
            <div className="v-inner">
              <div className="v-play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>
              <div className="v-bdg">{badge}</div>
              <div className="v-dur">{v.dur}</div>
            </div>
          </div>
          <div className="v-info">
            <h3 className="v-title">{v.title}</h3>
            <div className="v-meta"><span>👁 {v.views}</span><span>{v.date}</span></div>
          </div>
        </a>
      </div>
    );
  };

  const tickerHtml = [...ticker, ...ticker];

  return (
    <>
      <div className="ticker-wrap">
        <div className="ticker-lbl">LIVE</div>
        <div className="ticker-track">
          {tickerHtml.map((t, i) => (
            <span key={i}>
              <span className="t-item">{t}</span>
              <span className="t-dot">•</span>
            </span>
          ))}
        </div>
      </div>

      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content" ref={heroRef}>
              <div className="hero-tag">🏏 Cricket. Analysed. Honestly.</div>
              <h1>Your Pitch.<br /><em>Our Take.</em></h1>
              <p className="hero-sub">Match reviews, player deep-dives, and cricket conversations worth having. Test, ODI, T20 and everything in between — with passion, not press releases.</p>
              <div className="hero-ctas">
                <a href="/videos" className="btn btn-gold">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  Watch Videos
                </a>
                <a href="/blogs" className="btn btn-out">Read the Blog</a>
              </div>
              <div className="hero-stats">
                <div><div className="hs-num">{stats.videos}</div><div className="hs-lbl">Videos</div></div>
                <div><div className="hs-num">{stats.subs}</div><div className="hs-lbl">Subscribers</div></div>
                <div><div className="hs-num">{stats.views}</div><div className="hs-lbl">Total Views</div></div>
                <div><div className="hs-num">24</div><div className="hs-lbl">Blog Posts</div></div>
              </div>
            </div>
            <div className="hero-vis" ref={heroVisRef}>
              <div className="hero-card-stack">
                <div className="hc hc1"></div>
                <div className="hc hc2">
                  <div className="hc2-img">🏏</div>
                  <div className="hc2-title">Latest Match Review</div>
                  <div className="hc2-sub">Read the full breakdown →</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-dark2">
        <div className="container">
          <div className="sec-hdr fade-up">
            <div className="sec-hdr-l">
              <div className="lbl">Latest Videos</div>
              <h2 className="h2">Watch Fine Leg Talk</h2>
              <p className="sub">Analysis, reviews and shorts — straight from the channel.</p>
            </div>
            <a href="/videos" className="view-all">All videos</a>
          </div>
          <div className="vid-grid">
            {videos
              ? videos.map((v, i) => renderVideoCard(v, i))
              : STATIC_VIDEOS.map((v, i) => (
                  <div key={i} className="vid-card fade-up">
                    <div className="v-thumb">
                      <div className="v-inner">
                        <div className={`v-bg ${v.bg}`}></div>
                        <div className="v-play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>
                        <div className="v-bdg"><span className={`badge ${v.badge[0]}`}>{v.badge[1]}</span></div>
                        <div className="v-dur">{v.dur}</div>
                      </div>
                    </div>
                    <div className="v-info">
                      <h3 className="v-title">{v.title}</h3>
                      <div className="v-meta"><span>👁 {v.views}</span><span>{v.date}</span></div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>

      <section className="section section-cream">
        <div className="container">
          <div className="sec-hdr fade-up">
            <div className="sec-hdr-l">
              <div className="lbl dark">From the Blog</div>
              <h2 className="h2 dark">Latest Writing</h2>
              <p className="sub dark">Long reads, opinions, analysis — because some cricket conversations deserve more than 60 seconds.</p>
            </div>
            <a href="/blogs" className="view-all dk">All posts</a>
          </div>
          <div className="blog-grid">
            {featured && (
              <a href={`/${featured.id}`} className="blog-feat fade-up">
                <div className="blog-feat-img">
                  <div className="blog-feat-icon">{featured.emoji || '🏏'}</div>
                </div>
                <div className="blog-body">
                  <div className="blog-meta">
                    <span className={`badge ${featured.badgeClass||'b-gold'}`}>{featured.badge||'Featured'}</span>
                    <span className="blog-date">{featured.date}</span>
                    <span className="blog-read">{featured.readTime}</span>
                  </div>
                  <h3 className="blog-title big dk">{featured.title}</h3>
                  <p className="blog-exc dk">{featured.excerpt}</p>
                  <span className="blog-link dk">Read full piece</span>
                </div>
              </a>
            )}
            <div className="blog-stack">
              {popular.slice(0, 3).map((p) => (
                <a key={p.id} href={`/${p.id}`} className="blog-sm fade-up">
                  <div className="blog-sm-thumb" style={{background: 'linear-gradient(135deg,#1a3320,#0a1510)'}}>{p.emoji || '📝'}</div>
                  <div>
                    <div className="blog-meta" style={{marginBottom: 5}}>
                      <span className={`badge ${p.badgeClass||'b-gold'}`}>{p.badge||'Read'}</span>
                      <span className="blog-date">{p.date}</span>
                    </div>
                    <div className="blog-sm-title">{p.title}</div>
                    <span className="blog-link dk" style={{fontSize:'0.75rem'}}>Read →</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <div className="sec-hdr fade-up">
            <div className="sec-hdr-l">
              <div className="lbl">Match Centre</div>
              <h2 className="h2">Cricket History Search</h2>
              <p className="sub">Explore historical series, tournaments, and iconic matches from across the game.</p>
            </div>
            <a href="/matches" className="view-all">Explore</a>
          </div>
          <div className="promo-grid fade-up">
            <div className="promo-card"><div className="promo-icon">🏆</div><h3 className="promo-title">World Cups</h3><p className="promo-desc">Every ICC World Cup — ODI, T20, and WTC finals — from 1975 to today. Search any tournament and get the full story.</p></div>
            <div className="promo-card"><div className="promo-icon">🏏</div><h3 className="promo-title">Test Series</h3><p className="promo-desc">The Ashes, Border-Gavaskar, Bazball — search any historic series and relive the defining moments and stats.</p></div>
            <div className="promo-card"><div className="promo-icon">🔥</div><h3 className="promo-title">IPL & T20 Leagues</h3><p className="promo-desc">IPL seasons, PSL, BBL, SA20 and more. Look up any franchise tournament from the last two decades.</p></div>
            <div className="promo-card"><div className="promo-icon">🔍</div><h3 className="promo-title">Search Anything</h3><p className="promo-desc">Type any series, team, or tournament name and get instant results powered by Wikipedia's cricket archives.</p></div>
          </div>
          <div style={{textAlign:'center',marginTop:32}}><a href="/matches" className="btn btn-gold fade-up">Go to Match Centre →</a></div>
        </div>
      </section>

      <section className="section section-dark2">
        <div className="container">
          <div className="sec-hdr fade-up">
            <div className="sec-hdr-l">
              <div className="lbl">Stats Spotlight</div>
              <h2 className="h2">Player Search</h2>
              <p className="sub">Search any cricketer and get their career profile, biography, and stats instantly.</p>
            </div>
            <a href="/stats" className="view-all">Search players</a>
          </div>
          <div className="promo-grid fade-up">
            <div className="promo-card"><div className="promo-icon">🏏</div><h3 className="promo-title">Batters</h3><p className="promo-desc">Search Kohli, Root, Williamson, Jaiswal or any batter across all formats. Get career profiles pulled straight from cricket archives.</p></div>
            <div className="promo-card"><div className="promo-icon">🎯</div><h3 className="promo-title">Bowlers</h3><p className="promo-desc">Bumrah, Cummins, Shaheen, Anderson — search any bowler and explore their Test, ODI and T20 career in depth.</p></div>
            <div className="promo-card"><div className="promo-icon">⭐</div><h3 className="promo-title">All-Rounders</h3><p className="promo-desc">Stokes, Jadeja, Hardik, Shakib — the players who do it all. Search and discover what makes them unique.</p></div>
            <div className="promo-card"><div className="promo-icon">🔍</div><h3 className="promo-title">Search Anyone</h3><p className="promo-desc">From legends like Sachin and Lara to today's stars — type any name and get instant results from Wikipedia's cricket database.</p></div>
          </div>
          <div style={{textAlign:'center',marginTop:32}}><a href="/stats" className="btn btn-gold fade-up">Search Players →</a></div>
        </div>
      </section>

      <Polls />

      <div className="about-strip">
        <div className="container">
          <div className="about-layout">
            <div className="fade-up">
              <div className="lbl">About the Channel</div>
              <h2 className="about-h2">Cricket Through the Eyes of a Fan Who Actually Watches</h2>
              <p className="about-p">Fine Leg Talk started because we were frustrated — frustrated with surface-level takes, frustrated with hot air. We wanted to talk about cricket the way real fans do: with stats, with history, with honesty.</p>
              <p className="about-p">No co-commentary fluff. No clickbait. Just the game, broken down properly.</p>
              <div className="about-feats">
                <div className="af"><div className="af-icon">🎙️</div><div><h4>Match Reviews</h4><p>Every Test, key ODIs and T20s broken down ball-by-ball if needed.</p></div></div>
                <div className="af"><div className="af-icon">📊</div><div><h4>Stats-Driven</h4><p>Numbers that tell a story — not numbers for the sake of it.</p></div></div>
                <div className="af"><div className="af-icon">📝</div><div><h4>Written Pieces</h4><p>Long-form posts for when YouTube isn't enough.</p></div></div>
                <div className="af"><div className="af-icon">🏏</div><div><h4>All Formats</h4><p>Test purist? IPL lover? We cover it all without apology.</p></div></div>
              </div>
            </div>
            <div className="about-box fade-up">
              <div className="ab-icon">🎬</div>
              <div className="ab-name">Fine Leg Talk</div>
              <p className="ab-desc">Your home for passionate, honest cricket analysis on YouTube and the web.</p>
              <div className="ab-num">{stats.subs}</div>
              <div className="ab-nl">Subscribers</div>
              <a href="https://youtube.com/@FineLegTalk" target="_blank" rel="noopener" className="btn btn-yt" style={{width:'100%',justifyContent:'center',marginBottom:12}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                Subscribe on YouTube
              </a>
              <a href="/blogs" className="btn btn-out" style={{width:'100%',justifyContent:'center'}}>Read the Blog</a>
            </div>
          </div>
        </div>
      </div>

      <div className="tags-strip">
        <div className="container">
          <div className="tags-inner">
            <span className="tags-lbl">Trending:</span>
            {['IPL 2025','India vs England','Jasprit Bumrah','WTC Final 2025','Virat Kohli centuries','Rohit Sharma ODI','Shubman Gill','Champions Trophy','Test cricket 2025','Bazball England','Ben Stokes','Cricket analysis'].map(t => (
              <a key={t} href="/blogs" className="tag-pill">{t}</a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function Polls() {
  const POLLS = [
    { id: 'p1', q: "Who is India's most valuable Test cricketer right now?", total: 2847, opts: [
      { label: 'Jasprit Bumrah', v: 58 },
      { label: 'Virat Kohli', v: 24 },
      { label: 'Rohit Sharma', v: 12 },
      { label: 'Ravindra Jadeja', v: 6 },
    ]},
    { id: 'p2', q: 'Which cricket format produces the best analysis content?', total: 1523, opts: [
      { label: 'Test Cricket', v: 52 },
      { label: 'IPL / T20', v: 21 },
      { label: 'ODIs / World Cups', v: 18 },
      { label: 'All Formats Equally', v: 9 },
    ]},
  ];

  const [state, setState] = useState(POLLS.map(p => ({
    voted: false,
    opts: p.opts.map(o => o.v),
    total: p.total,
  })));

  const vote = (pi, oi) => {
    setState(prev => prev.map((s, i) => {
      if (i !== pi || s.voted) return s;
      const newOpts = [...s.opts];
      newOpts[oi]++;
      return { voted: oi, opts: newOpts, total: s.total + 1 };
    }));
  };

  const calcPcts = (opts) => {
    const total = opts.reduce((a, b) => a + b, 0);
    const pcts = opts.map(v => Math.round(v / total * 100));
    const diff = 100 - pcts.reduce((a, b) => a + b, 0);
    pcts[0] += diff;
    return pcts;
  };

  return (
    <section className="section section-dark">
      <div className="container">
        <div className="sec-hdr fade-up">
          <div className="sec-hdr-l">
            <div className="lbl">Fan Polls</div>
            <h2 className="h2">Have Your Say</h2>
            <p className="sub">Cricket's biggest debates — your verdict.</p>
          </div>
        </div>
        <div className="polls-grid">
          {POLLS.map((p, pi) => {
            const pcts = calcPcts(state[pi].opts);
            const isDone = state[pi].voted !== false;
            return (
              <div key={p.id} className={`poll-card fade-up${isDone ? ' done' : ''}`}>
                <div className="poll-q">{p.q}</div>
                <div className="poll-tot">{state[pi].total.toLocaleString()} votes</div>
                <div className="poll-opts">
                  {p.opts.map((o, oi) => (
                    <div
                      key={oi}
                      className={`poll-opt${state[pi].voted === oi ? ' voted' : ''}`}
                      onClick={() => vote(pi, oi)}
                    >
                      <div className="poll-bar" style={{ width: `${pcts[oi]}%` }}></div>
                      <div className="poll-inner">
                        <span className="poll-lbl">{o.label}</span>
                        <span className="poll-pct">{pcts[oi]}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="poll-msg">Thanks for voting! 🏏</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
