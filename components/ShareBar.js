'use client';

export default function ShareBar({ title }) {
  const share = (platform) => {
    if (typeof window === 'undefined') return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(title);
    const links = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
    };
    window.open(links[platform], '_blank', 'width=600,height=400');
  };

  return (
    <div className="share-bar">
      <span className="share-lbl">Share:</span>
      <a href="https://youtube.com/@FineLegTalk" target="_blank" rel="noopener" className="share-btn share-yt">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
        YouTube
      </a>
      <a href="#" onClick={(e) => { e.preventDefault(); share('twitter'); }} className="share-btn share-tw">𝕏 Twitter</a>
      <a href="#" onClick={(e) => { e.preventDefault(); share('whatsapp'); }} className="share-btn share-wa">📱 WhatsApp</a>
    </div>
  );
}
