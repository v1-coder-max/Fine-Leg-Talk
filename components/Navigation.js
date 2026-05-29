'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navbarRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (navbarRef.current && !navbarRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`} id="navbar" ref={navbarRef}>
      <div className="nav-wrap">
        <Link href="/" className="nav-logo">
          <span className="logo-m">Fine Leg</span>
          <span className="logo-s">Talk</span>
        </Link>
        <button
          className={`hamburger${open ? ' active' : ''}`}
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span></span><span></span><span></span>
        </button>
        <ul className={`nav-links${open ? ' open' : ''}`}>
          <li><Link href="/" className={isActive('/') ? 'active' : ''} onClick={() => setOpen(false)}>Home</Link></li>
          <li><Link href="/blogs" className={isActive('/blogs') ? 'active' : ''} onClick={() => setOpen(false)}>Blog</Link></li>
          <li><Link href="/matches" className={isActive('/matches') ? 'active' : ''} onClick={() => setOpen(false)}>Match Centre</Link></li>
          <li><Link href="/videos" className={isActive('/videos') ? 'active' : ''} onClick={() => setOpen(false)}>Videos</Link></li>
          <li><Link href="/stats" className={isActive('/stats') ? 'active' : ''} onClick={() => setOpen(false)}>Stats</Link></li>
        </ul>
        <a href="https://youtube.com/@FineLegTalk" target="_blank" rel="noopener" className="nav-yt">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          Subscribe
        </a>
      </div>
    </nav>
  );
}
