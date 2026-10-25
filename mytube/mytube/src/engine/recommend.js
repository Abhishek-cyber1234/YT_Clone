// Pure functions: the ONLY place that decides what appears in the feed. Edit rules here.

/** Tag a video with the category it was fetched for. Optional keyword check per category. */
export function classify(video, category) {
  const kw = category.keywords || [];
  if (kw.length) {
    const hay = `${video.title} ${video.channel}`.toLowerCase();
    if (!kw.some((k) => hay.includes(k.toLowerCase()))) return null;
  }
  return { ...video, categoryId: category.id };
}

export function classifyAll(videos, category) {
  return videos.map((v) => classify(v, category)).filter(Boolean);
}

/** Strict rule: keep ONLY videos whose categoryId is selected. Optional text filter. */
export function selectFeed(pool, selectedIds, text = '') {
  const sel = new Set(selectedIds);
  const t = text.trim().toLowerCase();
  const seen = new Set();
  const byCat = new Map();
  for (const v of pool) {
    if (!sel.has(v.categoryId) || seen.has(v.id)) continue;
    if (t && !`${v.title} ${v.channel}`.toLowerCase().includes(t)) continue;
    seen.add(v.id);
    if (!byCat.has(v.categoryId)) byCat.set(v.categoryId, []);
    byCat.get(v.categoryId).push(v);
  }
  // Round-robin interleave so one category doesn't dominate. No filler videos are added.
  const lists = selectedIds.map((id) => byCat.get(id)).filter(Boolean);
  const out = [];
  for (let i = 0; lists.some((l) => i < l.length); i++) for (const l of lists) if (i < l.length) out.push(l[i]);
  return out;
}
