'use client';

import { useState } from 'react';
import WikiSearch from './WikiSearch';

const SERIES = {
  test: [
    ['Ashes 2005 cricket series', '🏴󠁧󠁢󠁥󠁮󠁧󠁿🇦🇺', 'The Ashes 2005', 'England vs Australia'],
    ['Ashes 2023 cricket series', '🏴󠁧󠁢󠁥󠁮󠁧󠁿🇦🇺', 'The Ashes 2023', 'England vs Australia'],
    ['India vs Australia 2020-21 Test series Border-Gavaskar', '🇮🇳🇦🇺', 'Border-Gavaskar 2020–21', 'India vs Australia'],
    ['India vs England 2021 Test series', '🇮🇳🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'India vs England 2021', 'India vs England'],
    ['West Indies cricket team 1980s dominance', '🏝️', 'West Indies Dominance', '1980s Era'],
    ['2023 World Test Championship Final', '🏆', 'WTC Final 2023', 'Australia vs India'],
    ['Pakistan vs England 2022 Test series Bazball', '🇵🇰🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Pakistan vs England 2022', 'The Bazball Revolution'],
    ['Ashes cricket series history', '🏺', 'The Ashes — History', '1882 — present'],
  ],
  wc: [
    ['2011 ICC Cricket World Cup India', '🏆', 'World Cup 2011', 'India lift the trophy'],
    ['2019 ICC Cricket World Cup Final', '🏆', 'World Cup Final 2019', 'England vs New Zealand'],
    ['2023 ICC Cricket World Cup', '🏆', 'World Cup 2023', 'Hosted in India'],
    ['ICC Champions Trophy 2025', '🥇', 'Champions Trophy 2025', 'Pakistan & UAE'],
    ['2024 ICC T20 World Cup', '🏆', 'T20 World Cup 2024', 'West Indies & USA'],
    ['1983 Cricket World Cup India Kapil Dev', '🏆', 'World Cup 1983', "India's first triumph"],
    ['2007 ICC World Twenty20 first', '🏆', 'T20 World Cup 2007', 'First-ever T20 WC'],
    ['2022 ICC T20 World Cup Australia', '🏆', 'T20 World Cup 2022', 'Australia'],
  ],
  ipl: [
    ['Indian Premier League 2024', '🏏', 'IPL 2024', 'Season 17'],
    ['Indian Premier League 2023', '🏏', 'IPL 2023', 'Season 16'],
    ['Indian Premier League 2022', '🏏', 'IPL 2022', 'Two new teams'],
    ['Indian Premier League history founding 2008', '📜', 'IPL History', '2008 — present'],
  ],
  t20: [
    ['Big Bash League cricket Australia', '🇦🇺', 'Big Bash League', 'Australia'],
    ['Pakistan Super League cricket', '🇵🇰', 'Pakistan Super League', 'Pakistan'],
    ['SA20 cricket South Africa league', '🇿🇦', 'SA20', 'South Africa'],
    ['The Hundred cricket competition England Wales', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'The Hundred', 'England & Wales'],
  ],
};

const LABELS = {
  test: ['Test Series', 'tag-test', 'Test'],
  wc: ['World Cups & Major Tournaments', 'tag-wc', 'WC'],
  ipl: ['Indian Premier League', 'tag-ipl', 'IPL'],
  t20: ['T20 Leagues', 'tag-t20', 'T20'],
};

export default function MatchesClient() {
  const [cat, setCat] = useState('all');

  return (
    <>
      <section className="search-section">
        <div className="container">
          <div className="search-wrap">
            <WikiSearch
              placeholder="e.g. Ashes 2005, IPL 2024, 2011 World Cup…"
              hintText="Works for any series, match or tournament in cricket history"
              sourceLabel="Wikipedia · Cricket"
              fallbackIcon="🏏"
              searchHeroStyle={true}
            >
              {(quickSearch) => (
                <section className="categories-section">
                  <div className="container">
                    <div className="cat-row">
                      <span className="cat-label">Browse by:</span>
                      {[['all','All'],['test','Test Series'],['wc','World Cups'],['ipl','IPL'],['t20','T20 Leagues']].map(([k,l]) => (
                        <button key={k} className={`cat-btn${cat===k?' active':''}`} onClick={() => setCat(k)}>{l}</button>
                      ))}
                    </div>

                    {Object.entries(SERIES).map(([key, items]) => {
                      if (cat !== 'all' && cat !== key) return null;
                      const [label, tagCls, tagLabel] = LABELS[key];
                      return (
                        <div key={key}>
                          <div className="chips-label">{label}</div>
                          <div className="chips-grid">
                            {items.map(([query, icon, name, year]) => (
                              <div key={query} className="series-chip" onClick={() => quickSearch(query)}>
                                <span className="chip-icon">{icon}</span>
                                <div className="chip-name">{name}</div>
                                <div className="chip-year">{year}</div>
                                <span className={`chip-tag ${tagCls}`}>{tagLabel}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
            </WikiSearch>
          </div>
        </div>
      </section>
    </>
  );
}
