import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllClubs } from "../services/clubService";
import "./ClubsSection.css";

export default function ClubsSection() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllClubs()
      .then((data) => setClubs(Array.isArray(data) ? data : []))
      .catch(() => setError("Failed to load clubs"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="clubs-section">
        <div className="section-label">🎭 Clubs</div>
        <h2 className="section-title">Our Clubs</h2>
        <p className="section-subtitle">Loading clubs...</p>
      </section>
    );
  }

  if (error || !clubs.length) {
    return (
      <section className="clubs-section">
        <div className="section-label">🎭 Clubs</div>
        <h2 className="section-title">Our Clubs</h2>
        <p className="section-subtitle">{error || "No clubs to display."}</p>
      </section>
    );
  }

  return (
    <section className="clubs-section">
      <div className="section-label">🎭 Clubs</div>
      <h2 className="section-title">Our Clubs</h2>
      <p className="section-subtitle">
        Student clubs that actively organize events and activities
      </p>

      <div className="clubs-grid">
        {clubs.map((club) => (
          <div className="club-card" key={club.id}>
            <div className="club-card-icon">🎯</div>
            <h3>{club.name}</h3>
            <p>{club.description || ""}</p>
            <Link to="/clubs" className="clubs-section-view-btn">
              View Club →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
