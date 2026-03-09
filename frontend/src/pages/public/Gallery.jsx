import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Gallery.css";

export default function Gallery() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:5000/api/gallery")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) setItems(data);
            })
            .catch((err) => console.error("Gallery fetch error:", err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="gallery-page">
            <nav className="gallery-nav">
                <div className="gallery-nav-container">
                    <Link to="/" className="back-portal-btn">
                        ← Return to Portal
                    </Link>
                </div>
            </nav>

            <main className="gallery-main">
                <div className="gallery-header">
                    <div className="section-label">Gallery</div>
                    <h1 className="gallery-title">Visual Highlights</h1>
                    <p className="gallery-subtitle">
                        A showcase of sportsmanship, victory, and student activities at PCCAS.
                    </p>
                </div>

                {loading ? (
                    <div className="gallery-loading">Loading gallery...</div>
                ) : (
                    <div className="gallery-full-grid">
                        {items.length === 0 ? (
                            <div className="gallery-empty">No images found in the gallery.</div>
                        ) : (
                            items.map((item) => (
                                <div className="gallery-item-card" key={item.id}>
                                    <div className="gallery-img-wrapper">
                                        <img src={item.imageUrl} alt={item.title || "Gallery Item"} loading="lazy" />
                                    </div>
                                    {(item.title || item.caption) && (
                                        <div className="gallery-item-info">
                                            {item.title && <h3>{item.title}</h3>}
                                            {item.caption && <p>{item.caption}</p>}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
