import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./GallerySection.css";

export default function GallerySection() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/gallery")
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data) && data.length) setItems(data); })
      .catch(() => setItems([]));
  }, []);

  return (
    <section className="gallery-section">
      <div className="section-label" style={{ color: 'var(--clr-accent)' }}>Gallery</div>
      <h2 className="section-title">Gallery</h2>
      <p className="section-subtitle">
        Moments from sports events, tournaments and college activities
      </p>

      <div className="gallery-grid">
        {items.length === 0 ? (
          <div className="gallery-card">
            <div className="gallery-card-placeholder">
              📷 No images yet — admins can upload from the panel.
            </div>
          </div>
        ) : (
          items.map((g) => (
            <div className="gallery-card" key={g.id}>
              <img src={g.imageUrl} alt={g.title || "Gallery"} loading="lazy" />
              {(g.title || g.caption) && (
                <div className="gallery-card-caption">
                  {g.title && <h3>{g.title}</h3>}
                  {g.caption && <p>{g.caption}</p>}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <Link to="/gallery" className="view-gallery-btn">
        View Full Gallery →
      </Link>
    </section>
  );
}
