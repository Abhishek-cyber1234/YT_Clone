// Only talks to OUR proxy (/api/search); the API key never reaches the browser.
export class ApiError extends Error {
  constructor(code, message) { super(message); this.code = code; }
}
export async function searchVideos(q, max = 12) {
  let res;
  try { res = await fetch(`/api/search?${new URLSearchParams({ q, max })}`); }
  catch { throw new ApiError('NETWORK', 'Cannot reach the MyTube server. Is it running?'); }
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(body.error || 'ERROR', body.message || `Request failed (${res.status})`);
  return body.items || [];
}
