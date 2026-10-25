# MyTube — My Rules, My Feed
YouTube videos, filtered **only** by the categories you select. No YouTube recommendations, no filler.

## Structure
```
server/index.js            API proxy (holds the key, caches 1h, maps quota errors)
src/config/categories.js   ← EDIT: categories, icons, colors, search queries, keywords
src/engine/recommend.js    ← EDIT: classification + filtering rules (pure functions)
src/services/youtube.js    client for the proxy
src/hooks/useFeed.js       fetch/cache per category, loading + error state
src/utils/storage.js       localStorage (selection + theme)
src/components/            CategoryPanel, VideoGrid, PlayerModal
test/engine.test.js        rule tests (npm test)
```

## Setup
1. Install Node 18+ then `npm install`
2. Get a key: Google Cloud Console → create project → *APIs & Services → Library* → enable **YouTube Data API v3** → *Credentials → Create credentials → API key*. Restrict it to that API.
3. `cp .env.example .env` and paste the key into `YOUTUBE_API_KEY`
4. `npm run dev` → open http://localhost:5173 (API proxy runs on :8787)
5. `npm test` runs the recommendation-rule tests.

## Customising
- **Add a category:** append an object to `categories` in `src/config/categories.js` (`id`, `label`, `icon`, `color`, `queries`, `keywords`). It appears automatically.
- **Change rules:** edit `classify()` (e.g. require keywords, block channels) or `selectFeed()` (ordering, dedupe) in `src/engine/recommend.js`.
- **More results per category:** raise `queriesPerCategory` / `perQueryResults` (costs quota).

## YouTube API limits
- Default quota is 10,000 units/day; each `search.list` call costs **100** (~100 searches/day). The proxy caches for 1 hour, and the UI shows a message on quota errors.
- Results are keyword matches, so quality depends on your queries; use `keywords` to tighten.
- Only embeddable videos are requested; embedded playback uses YouTube's official iframe player.
- Do not deploy the key in client code; for production, host the proxy and restrict the key.
