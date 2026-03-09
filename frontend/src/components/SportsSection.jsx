import { Link } from "react-router-dom";
import "./SportsSection.css";

const sports = [
  { name: "Cricket", icon: "🏏", desc: "Inter-department & inter-college tournaments" },
  { name: "Football", icon: "⚽", desc: "League & knockout matches" },
  { name: "Volleyball", icon: "🏐", desc: "Indoor & outdoor competitions" },
  { name: "Badminton", icon: "🏸", desc: "Singles & doubles championships" },
  { name: "Athletics", icon: "🏃", desc: "Track & field events" },
  { name: "Kabaddi", icon: "🤼", desc: "Traditional team sport events" },
];

export default function SportsSection() {
  return (
    <section className="sports-section">
      <div className="section-label">Sports</div>
      <h2 className="section-title">Our Sports</h2>
      <p className="section-subtitle">
        Explore sports activities conducted by the college sports department
      </p>

      <div className="sports-grid">
        {sports.map((sport, index) => (
          <div className="sport-card" key={index}>
            <div className="sport-icon">{sport.icon}</div>
            <h3>{sport.name}</h3>
            <p>{sport.desc}</p>
            <Link to="/sports" className="sport-card-button">
              View Sports →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
