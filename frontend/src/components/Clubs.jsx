import { clubs } from "../data/clubs";
import "./Clubs.css";

const Clubs = () => {
  return (
    <section className="clubs-section">
      <h2>Our Clubs</h2>

      <div className="clubs-grid">
        {clubs.map(club => (
          <div key={club.id} className="club-card">
            <h3>{club.name}</h3>
            <p>{club.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Clubs;
