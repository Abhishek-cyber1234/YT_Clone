import { useEffect, useState } from 'react';
import { categories, settings } from '../config/categories.js';
import { searchVideos } from '../services/youtube.js';
import { classifyAll } from '../engine/recommend.js';

// Pool keyed by `${categoryId}|${searchText}`. Deselecting never refetches; it just filters.
export function useFeedPool(selectedIds, searchText) {
  const [pool, setPool] = useState({});
  const [pending, setPending] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const t = setTimeout(() => {
      selectedIds.forEach(async (id) => {
        const key = `${id}|${searchText}`;
        if (pool[key] || pending[key]) return;
        const cat = categories.find((c) => c.id === id);
        if (!cat) return;
        setPending((p) => ({ ...p, [key]: true }));
        try {
          const results = [];
          for (const q of cat.queries.slice(0, settings.queriesPerCategory)) {
            results.push(...(await searchVideos(`${searchText} ${q}`.trim(), settings.perQueryResults)));
          }
          setPool((p) => ({ ...p, [key]: classifyAll(results, cat) }));
          setErrors((e) => { const n = { ...e }; delete n[id]; return n; });
        } catch (err) {
          setErrors((e) => ({ ...e, [id]: err }));
        } finally {
          setPending((p) => ({ ...p, [key]: false }));
        }
      });
    }, searchText ? 500 : 0); // debounce typing
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIds.join(','), searchText]);

  const videos = selectedIds.flatMap((id) => pool[`${id}|${searchText}`] || []);
  const isLoading = selectedIds.some((id) => pending[`${id}|${searchText}`]);
  return { videos, isLoading, errors: selectedIds.filter((id) => errors[id]).map((id) => errors[id]) };
}
