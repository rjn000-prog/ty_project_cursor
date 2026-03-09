import { useEffect, useState } from "react";
import "./NewsSection.css";

const CATEGORY_LABELS = {
  news: "News",
  sports: "Sports",
  club: "Clubs",
  notice: "Notice",
};

export default function NewsSection() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/news")
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data) && data.length) setItems(data); })
      .catch(() => setItems([]));
  }, []);

  return (
    <section className="news-section">
      <div className="section-label">Updates</div>
      <h2 className="section-title">Sports, Clubs, Notices &amp; News</h2>
      <p className="section-subtitle">
        One place for every update across sports, clubs and college notices.
      </p>

      <div className="news-grid">
        {items.length === 0 ? (
          <div className="news-card">
            <div className="news-card-header">
              <span className="news-category news-category--news">News</span>
              <span className="news-date">Coming soon</span>
            </div>
            <h3>Stay tuned</h3>
            <p>No news published yet. Check back soon for the latest updates.</p>
            <div className="news-card-footer">Read more →</div>
          </div>
        ) : (
          items.map((n) => (
            <div className="news-card" key={n.id}>
              <div className="news-card-header">
                <span className={`news-category news-category--${(n.category || "news").toLowerCase()}`}>
                  {CATEGORY_LABELS[(n.category || "news").toLowerCase()] || "News"}
                </span>
                <span className="news-date">
                  {new Date(n.publishedAt).toLocaleDateString("en-US", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </span>
              </div>
              <h3>{n.title}</h3>
              <p>{n.summary}</p>
              <div className="news-card-footer">Read more →</div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
