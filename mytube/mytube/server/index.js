// Tiny proxy: keeps the API key on the server and caches results to save quota.
import 'dotenv/config';
import express from 'express';

const app = express();
const KEY = process.env.YOUTUBE_API_KEY;
const PORT = process.env.PORT || 8787;
const TTL = 60 * 60 * 1000; // 1h cache: search.list costs 100 quota units/call (10,000/day default)
const cache = new Map();

app.get('/api/search', async (req, res) => {
  if (!KEY) return res.status(503).json({ error: 'NO_API_KEY', message: 'Set YOUTUBE_API_KEY in .env' });
  const q = String(req.query.q || '').trim().slice(0, 200);
  if (!q) return res.status(400).json({ error: 'BAD_REQUEST', message: 'Missing q' });
  const max = Math.min(Number(req.query.max) || 12, 25);
  const cacheKey = `${q}|${max}`;
  const hit = cache.get(cacheKey);
  if (hit && Date.now() - hit.t < TTL) return res.json(hit.data);

  const url = new URL('https://www.googleapis.com/youtube/v3/search');
  url.search = new URLSearchParams({
    part: 'snippet', type: 'video', q, maxResults: String(max),
    videoEmbeddable: 'true', safeSearch: 'moderate', key: KEY,
  });
  try {
    const r = await fetch(url);
    const body = await r.json();
    if (!r.ok) {
      const reason = body?.error?.errors?.[0]?.reason;
      const quota = reason === 'quotaExceeded' || reason === 'dailyLimitExceeded';
      return res.status(quota ? 429 : r.status).json({
        error: quota ? 'QUOTA_EXCEEDED' : 'YOUTUBE_ERROR',
        message: body?.error?.message || 'YouTube API error',
      });
    }
    const data = {
      items: (body.items || []).map((i) => ({
        id: i.id.videoId,
        title: i.snippet.title,
        channel: i.snippet.channelTitle,
        publishedAt: i.snippet.publishedAt,
        thumbnail: i.snippet.thumbnails?.medium?.url || i.snippet.thumbnails?.default?.url,
      })),
    };
    cache.set(cacheKey, { t: Date.now(), data });
    res.json(data);
  } catch (e) {
    res.status(502).json({ error: 'NETWORK', message: 'Could not reach YouTube API' });
  }
});

app.listen(PORT, () => console.log(`MyTube API proxy on :${PORT} (key ${KEY ? 'loaded' : 'MISSING'})`));
