const fmt = (d) => (d ? new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '');
const decode = (s = '') => { const t = document.createElement('textarea'); t.innerHTML = s; return t.value; };

export default function VideoGrid({ videos, categories, onPlay }) {
  return (
    <div className="grid">
      {videos.map((v) => {
        const cat = categories.find((c) => c.id === v.categoryId);
        return (
          <article key={v.id} className="card" onClick={() => onPlay(v)} tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onPlay(v)}>
            <img src={v.thumbnail} alt="" loading="lazy" />
            <div className="meta">
              <h3>{decode(v.title)}</h3>
              <p>{decode(v.channel)}</p>
              <p className="sub">{fmt(v.publishedAt)} · <span className="tag" style={{ '--c': cat?.color }}>{cat?.icon} {cat?.label}</span></p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
