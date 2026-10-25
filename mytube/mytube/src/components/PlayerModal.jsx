import { useEffect } from 'react';
export default function PlayerModal({ video, onClose }) {
  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  if (!video) return null;
  return (
    <div className="modal" onClick={onClose}>
      <div className="player" onClick={(e) => e.stopPropagation()}>
        <iframe src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`} title={video.title}
          allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
        <button className="close" onClick={onClose} aria-label="Close">✕</button>
      </div>
    </div>
  );
}
