import { useState } from "react";
import "./ClubsSection.css";
import ClubDetails from "./ClubDetails";

const clubs = [
  {
    name: "Sports Club",
    desc: "Manages all inter-department and inter-college sports events",
  },
  {
    name: "Cultural Club",
    desc: "Organizes cultural fests, competitions and celebrations",
  },
  {
    name: "Technical Club",
    desc: "Conducts hackathons, workshops and technical events",
  },
  {
    name: "NSS / NCC",
    desc: "Community service, leadership and discipline activities",
  },
];

export default function ClubsSection() {
  const [selectedClub, setSelectedClub] = useState(null);

  return (
    <section className="clubs-section">
      <h2 className="section-title">Our Clubs</h2>
      <p className="section-subtitle">
        Student clubs that actively organize events and activities
      </p>

      <div className="clubs-grid">
        {clubs.map((club, index) => (
          <div className="club-card" key={index}>
            <h3>{club.name}</h3>
            <p>{club.desc}</p>
            <button onClick={() => setSelectedClub(club)}>
              View Club
            </button>
          </div>
        ))}
      </div>

      {/* Club Details Popup */}
      <ClubDetails
        club={selectedClub}
        onClose={() => setSelectedClub(null)}
      />
    </section>
  );
}
