import { Link } from 'react-router-dom';
import './ClubsEvents.css';

const FeaturedClubs = () => {
  const featuredClubs = [
    {
      id: '1',
      name: 'Basketball Club',
      type: 'Technical',
      description: 'For basketball enthusiasts to train and compete',
      logo: '🏀',
      memberCount: 45,
    },
    {
      id: '2',
      name: 'Dance Society',
      type: 'Cultural',
      description: 'Celebrating dance forms from around the world',
      logo: '💃',
      memberCount: 68,
    },
    {
      id: '3',
      name: 'Robotics Club',
      type: 'Technical',
      description: 'Innovation in robotics and automation',
      logo: '🤖',
      memberCount: 52,
    },
  ];

  return (
    <section className="clubs-section">
      <div className="navbar-container"> {/* Reusing container width logic */}
        <div className="section-header">
          <div className="section-label">Featured Communities</div>
          <h2 className="section-title">Join Campus Clubs</h2>
          <p className="section-subtitle">
            Participate in technical, cultural, sports and social activities.
            Build skills beyond classroom.
          </p>
        </div>

        <div className="clubs-grid">
          {featuredClubs.map((club) => (
            <div key={club.id} className="club-card">
              <div className="club-card-icon">{club.logo}</div>
              <h3>{club.name}</h3>
              <p>{club.description}</p>

              <div className="club-actions" style={{ marginTop: 'auto' }}>
                <Link to={`/clubs/${club.id}`} className="clubs-section-view-btn">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="view-all-container">
          <Link to="/clubs" className="view-all-btn">
            Explore All Clubs <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedClubs;