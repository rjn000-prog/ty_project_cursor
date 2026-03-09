import "./ClubDetails.css";

export default function ClubDetails({ club, onClose }) {
  if (!club) return null;

  return (
    <div className="club-details-overlay">
      <div className="club-details-card">
        <h2>{club.name}</h2>
        <p>{club.desc}</p>

        {/* static extra info */}
        <ul>
          <li>Active Members: 50+</li>
          <li>Events per Year: 10+</li>
          <li>Status: Active</li>
        </ul>

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
