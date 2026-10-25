export default function CategoryPanel({ categories, selected, onToggle, onAll, onClear }) {
  return (
    <section className="panel" aria-label="Categories">
      <div className="panel-head">
        <h2>Choose your categories <span className="count">{selected.length}/{categories.length}</span></h2>
        <div className="btns"><button onClick={onAll}>Select all</button><button onClick={onClear}>Clear all</button></div>
      </div>
      <div className="cats">
        {categories.map((c) => {
          const on = selected.includes(c.id);
          return (
            <button key={c.id} className={`cat ${on ? 'on' : ''}`} style={{ '--c': c.color }}
              aria-pressed={on} onClick={() => onToggle(c.id)}>
              <span className="ico">{c.icon}</span><span>{c.label}</span>{on && <span className="tick">✓</span>}
            </button>
          );
        })}
      </div>
    </section>
  );
}
