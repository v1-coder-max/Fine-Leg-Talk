import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="foot-grid">
          <div>
            <div className="foot-logo">Fine Leg <span>Talk</span></div>
            <div className="foot-tag">Cricket. Analysed. Honestly.</div>
            <p className="foot-desc">A passion project for cricket fans who want more than scorecards. Match reviews, analysis, and honest takes from the boundary rope.</p>
            <div className="foot-social">
              <a href="https://youtube.com/@FineLegTalk" target="_blank" rel="noopener" title="YouTube">▶</a>
              <a href="#" title="Twitter / X">𝕏</a>
              <a href="#" title="Instagram">📷</a>
            </div>
          </div>
          <div className="foot-col">
            <h4>Navigate</h4>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/blogs">Blog</Link></li>
              <li><Link href="/matches">Match Centre</Link></li>
              <li><Link href="/videos">Videos</Link></li>
              <li><Link href="/stats">Stats</Link></li>
            </ul>
          </div>
          <div className="foot-col">
            <h4>Topics</h4>
            <ul>
              <li><Link href="/blogs">Match Reviews</Link></li>
              <li><Link href="/blogs">Analysis</Link></li>
              <li><Link href="/blogs">IPL Coverage</Link></li>
              <li><Link href="/blogs">Test Cricket</Link></li>
              <li><Link href="/blogs">Opinion</Link></li>
              <li><Link href="/blogs">Cricket History</Link></li>
            </ul>
          </div>
          <div className="foot-col">
            <h4>Watch</h4>
            <ul>
              <li><Link href="/videos">All Videos</Link></li>
              <li><Link href="/videos">Shorts</Link></li>
              <li><Link href="/videos">Full Reviews</Link></li>
              <li><a href="https://youtube.com/@FineLegTalk" target="_blank" rel="noopener">YouTube Channel</a></li>
            </ul>
          </div>
        </div>
        <div className="foot-btm">
          <div className="foot-copy">© 2026 Fine Leg Talk. All rights reserved.</div>
          <div className="foot-note">Not affiliated with any cricket board. All opinions are personal. Stats sourced manually.</div>
        </div>
      </div>
    </footer>
  );
}
