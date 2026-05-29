'use client';

import { useState, useRef } from 'react';

async function searchWikipedia(query, suffix = '') {
  const searchQuery = suffix ? `${query} ${suffix}` : query;
  const searchRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchQuery)}&format=json&origin=*&srlimit=3`);
  const searchData = await searchRes.json();
  const results = searchData.query?.search || [];
  if (!results.length) return null;

  const tryResult = async (title) => {
    const r = await (await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`)).json();
    return (r.type !== 'disambiguation' && r.extract) ? r : null;
  };

  for (const r of results) {
    const data = await tryResult(r.title);
    if (data) return data;
  }
  return null;
}

export default function WikiSearch({
  placeholder,
  searchSuffix = '',
  hintText,
  sourceLabel,
  fallbackIcon = '🏏',
  searchHeroStyle = false,
  buttonLabel = 'Search',
  children,
}) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorQuery, setErrorQuery] = useState(null);
  const [active, setActive] = useState(false);
  const inputRef = useRef(null);

  const doSearch = async (q) => {
    const term = (q || '').trim();
    if (term.length < 2) return;
    setActive(true);
    setLoading(true);
    setResult(null);
    setErrorQuery(null);
    try {
      const data = await searchWikipedia(term, searchSuffix);
      if (data) setResult(data);
      else setErrorQuery(term);
    } catch {
      setErrorQuery(term);
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setActive(false);
    setResult(null);
    setErrorQuery(null);
    setQuery('');
  };

  const quickSearch = (term) => {
    setQuery(term);
    doSearch(term);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = (e) => {
    e.preventDefault();
    doSearch(query);
  };

  const SearchForm = searchHeroStyle ? (
    <form className="search-hero" onSubmit={submit}>
      <div className="search-box">
        <span className="search-icon">🏏</span>
        <input
          ref={inputRef}
          type="search"
          className="search-input"
          placeholder={placeholder}
          autoComplete="off"
          spellCheck="false"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="search-btn">{buttonLabel}</button>
      </div>
      {hintText && <p className="search-hint">{hintText}</p>}
    </form>
  ) : (
    <form className="search-form" onSubmit={submit}>
      <input
        ref={inputRef}
        type="search"
        className="search-input"
        placeholder={placeholder}
        autoComplete="off"
        spellCheck="false"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" className="search-btn">{buttonLabel}</button>
    </form>
  );

  return (
    <>
      {SearchForm}

      {active && (
        <section className="result-section">
          <div className="container">
            {loading && (
              <div className="state-box">
                <span className="wiki-spinner"></span>
                <span style={{color:'var(--muted)',fontSize:'0.9rem'}}>Searching for <strong style={{color:'var(--cream)'}}>{query}</strong>…</span>
              </div>
            )}
            {!loading && result && (
              <div className="wiki-card">
                <button className="wiki-close" onClick={clear} title="Clear">✕</button>
                <div className="wiki-img">
                  {result.thumbnail?.source ? <img src={result.thumbnail.source} alt={result.title} /> : fallbackIcon}
                </div>
                <div>
                  <div className="wiki-source">{sourceLabel}</div>
                  <div className="wiki-name">{result.title}</div>
                  <div className="wiki-desc">{result.description || ''}</div>
                  <p className="wiki-extract">{result.extract || ''}</p>
                  <div className="wiki-links">
                    <a
                      href={result.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(result.title || '')}`}
                      target="_blank" rel="noopener" className="wiki-link"
                    >
                      📖 Full Wikipedia article →
                    </a>
                  </div>
                  <div className="wiki-note">ℹ️ Content from Wikipedia (CC BY-SA 4.0). May not reflect the very latest matches.</div>
                </div>
              </div>
            )}
            {!loading && !result && errorQuery && (
              <div className="state-box">
                <div className="state-icon">{fallbackIcon}</div>
                <div className="state-title">No Wikipedia article found for "{errorQuery}"</div>
                <p className="state-sub">Try a slightly different spelling or full name.</p>
                <button className="back-btn" onClick={clear}>← Back to browse</button>
              </div>
            )}
          </div>
        </section>
      )}

      {!active && typeof children === 'function' && children(quickSearch)}
    </>
  );
}
