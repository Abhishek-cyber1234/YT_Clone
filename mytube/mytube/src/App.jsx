import { useEffect, useMemo, useState } from 'react';
import { categories } from './config/categories.js';
import { loadSelected, saveSelected, loadTheme, saveTheme } from './utils/storage.js';
import { selectFeed } from './engine/recommend.js';
import { useFeedPool } from './hooks/useFeed.js';
import CategoryPanel from './components/CategoryPanel.jsx';
import VideoGrid from './components/VideoGrid.jsx';
import PlayerModal from './components/PlayerModal.jsx';

const ids = categories.map((c) => c.id);

export default function App() {
  const [selected, setSelected] = useState(() => loadSelected(ids));
  const [text, setText] = useState('');
  const [theme, setTheme] = useState(loadTheme);
  const [playing, setPlaying] = useState(null);
  const [menu, setMenu] = useState(false);

  useEffect(() => saveSelected(selected), [selected]);
  useEffect(() => { document.documentElement.dataset.theme = theme; saveTheme(theme); }, [theme]);

  const { videos, isLoading, errors } = useFeedPool(selected, text.trim());
  // Final gate: even if the pool holds other categories, only selected ones render.
  const feed = useMemo(() => selectFeed(videos, selected), [videos, selected]);

  const toggle = (id) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const quota = errors.find((e) => e.code === 'QUOTA_EXCEEDED');
  const noKey = errors.find((e) => e.code === 'NO_API_KEY');
  const other = errors.find((e) => !['NO_API_KEY', 'QUOTA_EXCEEDED'].includes(e.code));

  return (
    <div className="app">
      <header>
        <button className="icon-btn menu" onClick={() => setMenu(!menu)} aria-label="Menu">☰</button>
        <div className="brand"><span className="logo">▶</span> MyTube <small>My Rules, My Feed</small></div>
        <input className="search" placeholder="Search within selected categories…" value={text}
          onChange={(e) => setText(e.target.value)} aria-label="Search" />
        <button className="icon-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </header>
      <div className="body">
        <nav className={`sidebar ${menu ? 'open' : ''}`}>
          <a className="active" href="#feed">🏠 My Feed</a>
          <p>Selected</p>
          {selected.length === 0 && <span className="muted">None</span>}
          {selected.map((id) => { const c = categories.find((x) => x.id === id); return (
            <button key={id} className="chip" onClick={() => toggle(id)} title="Remove">{c.icon} {c.label} ✕</button>); })}
        </nav>
        <main id="feed">
          <CategoryPanel categories={categories} selected={selected} onToggle={toggle}
            onAll={() => setSelected(ids)} onClear={() => setSelected([])} />
          {selected.length === 0 ? (
            <div className="empty"><span>🗂️</span><h3>No categories selected</h3><p>Pick one or more categories above to build your feed. Nothing else will be shown.</p></div>
          ) : (
            <>
              {noKey && <div className="notice">Server has no YouTube API key. Add <code>YOUTUBE_API_KEY</code> to <code>.env</code> and restart.</div>}
              {quota && <div className="notice">YouTube API daily quota reached. Try again later (it resets at midnight Pacific Time).</div>}
              {other && <div className="notice">{other.message}</div>}
              {isLoading && <div className="spinner" role="status" aria-label="Loading" />}
              {feed.length > 0 && <VideoGrid videos={feed} categories={categories} onPlay={setPlaying} />}
              {!isLoading && feed.length === 0 && errors.length === 0 && (
                <div className="empty"><span>🔍</span><h3>No videos found</h3><p>Try a different search or add more categories.</p></div>
              )}
            </>
          )}
        </main>
      </div>
      <PlayerModal video={playing} onClose={() => setPlaying(null)} />
    </div>
  );
}
