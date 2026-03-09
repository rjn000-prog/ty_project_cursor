import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllClubs } from '../../services/clubService';
import { getStudentDashboard } from '../../services/studentService';
import './clubs.css';

const ClubsList = () => {

  const [clubs, setClubs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [student, setStudent] = useState(null);

  useEffect(() => {
    getStudentDashboard()
      .then(res => setStudent(res.student))
      .catch(() => setStudent(null));

    getAllClubs().then(setClubs);
  }, []);

  const filteredClubs = clubs.filter(club =>
    club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* HERO */}
      <section className="clubs-hero">
        <div className="clubs-overlay"></div>

        <div className="clubs-hero-content" style={{ textAlign: 'center' }}>
          {student && (
            <div style={{ marginBottom: "15px", opacity: .8, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.85rem' }}>
              {student.name} • {student.department} • Year {student.year}
            </div>
          )}

          <h1>Discover College Communities</h1>
          <p style={{ margin: '0 auto 2rem' }}>
            Participate in technical, cultural, sports and social activities.
            Build skills beyond classroom.
          </p>

          <div className="search-card" style={{ margin: '0 auto' }}>
            <input
              placeholder="Search clubs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* CLUBS */}
      <section className="clubs-section">
        <div className="clubs-grid">
          {filteredClubs.map(club => (
            <div className="club-card" key={club.id}>
              <div className="club-type">{club.type}</div>
              <h3>{club.name}</h3>
              <p>{club.description}</p>

              <div className="club-meta">
                <div><strong>President:</strong> <span>{club.presidentName}</span></div>
                <div><strong>Location:</strong> <span>{club.location}</span></div>
                <div><strong>Capacity:</strong> <span>{club.capacity} members</span></div>
              </div>

              <Link to={`/clubs/${club.id}`} className="club-btn">
                View Club Details
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default ClubsList;
