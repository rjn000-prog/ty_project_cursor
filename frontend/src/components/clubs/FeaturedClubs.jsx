import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllClubs } from '../../services/clubService';
import './featured-clubs.css';

const FeaturedClubs = ({ scrollToSection }) => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllClubs()
      .then((data) => setClubs(Array.isArray(data) ? data : []))
      .catch(() => setError("Failed to load clubs"))
      .finally(() => setLoading(false));
  }, []);

  const scrollTo = (id) => {
    if (scrollToSection) scrollToSection(id);
    else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const featuredClubs = clubs.slice(0, 3);

  return (
    <section className="featured-clubs-section">
      <div className="container">
        <div className="section-label" style={{ color: 'var(--clr-accent)' }}>Clubs</div>
        <h2 className="section-title">Featured Clubs</h2>
        <p className="section-subtitle">
          Discover and join student-led clubs and organizations
        </p>

        {loading && <p className="section-subtitle">Loading featured clubs...</p>}
        {error && <p className="section-subtitle">{error}</p>}

        {!loading && !error && featuredClubs.length > 0 && (
          <>
            <div className="featured-clubs-grid">
              {featuredClubs.map((club) => (
                <div className="club-card" key={club.id}>
                  <div className="club-content">
                    <h3>{club.name}</h3>
                    <span className="club-type">{club.type || 'Club'}</span>
                    <p>{club.description || ''}</p>
                    <div className="club-info">
                      {club.capacity != null && <span>Capacity: {club.capacity}</span>}
                    </div>
                    <Link to={`/clubs/${club.id}`} className="club-btn">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="view-all-container">
              <button
                type="button"
                className="view-all-btn"
                onClick={() => scrollTo('clubs-all')}
              >
                Explore All Clubs
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedClubs;
