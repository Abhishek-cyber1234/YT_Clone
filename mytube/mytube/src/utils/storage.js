const KEY = 'mytube:selected';
const THEME = 'mytube:theme';
export function loadSelected(validIds) {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(v) ? v.filter((id) => validIds.includes(id)) : [];
  } catch { return []; }
}
export function saveSelected(ids) { try { localStorage.setItem(KEY, JSON.stringify(ids)); } catch {} }
export function loadTheme() { try { return localStorage.getItem(THEME) || 'dark'; } catch { return 'dark'; } }
export function saveTheme(t) { try { localStorage.setItem(THEME, t); } catch {} }
