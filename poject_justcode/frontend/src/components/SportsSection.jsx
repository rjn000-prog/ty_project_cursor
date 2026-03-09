import "./SportsSection.css";

const sports = [
  { name: "Cricket", desc: "Inter-department & inter-college tournaments" },
  { name: "Football", desc: "League & knockout matches" },
  { name: "Volleyball", desc: "Indoor & outdoor competitions" },
  { name: "Badminton", desc: "Singles & doubles championships" },
  { name: "Athletics", desc: "Track & field events" },
  { name: "Kabaddi", desc: "Traditional team sport events" },
];

export default function SportsSection() {
  return (
    <section className="sports-section">
      <h2 className="section-title">Our Sports</h2>
      <p className="section-subtitle">
        Explore sports activities conducted by the college sports department
      </p>

      <div className="sports-grid">
        {sports.map((sport, index) => (
          <div className="sport-card" key={index}>
            <h3>{sport.name}</h3>
            <p>{sport.desc}</p>
            <button>View Details</button>
          </div>
        ))}
      </div>
    </section>
  );
}
