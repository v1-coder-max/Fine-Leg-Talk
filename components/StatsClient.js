'use client';

import WikiSearch from './WikiSearch';

const POPULAR = [
  ['Virat Kohli', '🇮🇳', 'Batting'],
  ['Jasprit Bumrah', '🇮🇳', 'Bowling'],
  ['Joe Root', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Batting'],
  ['Ben Stokes', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'All-round'],
  ['Rohit Sharma', '🇮🇳', 'Batting'],
  ['Steve Smith', '🇦🇺', 'Batting'],
  ['Pat Cummins', '🇦🇺', 'Bowling'],
  ['Babar Azam', '🇵🇰', 'Batting'],
  ['Kane Williamson', '🇳🇿', 'Batting'],
  ['Ravindra Jadeja', '🇮🇳', 'All-round'],
  ['Suryakumar Yadav', '🇮🇳', 'Batting'],
  ['MS Dhoni', '🇮🇳', 'Wicket-keeper'],
  ['Sachin Tendulkar', '🇮🇳', 'Batting'],
  ['Shaheen Afridi', '🇮🇳', 'Batting'],
  ['Yashasvi Jaiswal', '🇮🇳', 'Batting'],
];

export default function StatsClient() {
  return (
    <>
      <section className="search-section">
        <div className="container">
          <div className="search-wrap">
            <WikiSearch
              placeholder="e.g. Jasprit Bumrah, Steve Smith, MS Dhoni…"
              searchSuffix="cricketer"
              hintText="Press Enter or click Search — works for any cricketer, past or present"
              sourceLabel="Wikipedia · Cricket Player"
              fallbackIcon="🏏"
              searchHeroStyle={true}
            >
              {(quickSearch) => (
                <section className="popular-section">
                  <div className="container">
                    <div className="pop-label">Popular Searches</div>
                    <div className="pop-grid">
                      {POPULAR.map(([name, flag, role]) => (
                        <div key={name} className="pop-chip" onClick={() => quickSearch(name)}>
                          <span className="pop-flag">{flag}</span>
                          <div className="pop-name">{name}</div>
                          <div className="pop-role">{role}</div>
                        </div>
                      ))}
                    </div>
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
