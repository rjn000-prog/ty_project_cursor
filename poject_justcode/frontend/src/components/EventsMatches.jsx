import "./EventsMatches.css";

const events = [
  {
    title: "Inter-Department Cricket Tournament",
    date: "15 Feb 2026",
    organizer: "Sports Club",
  },
  {
    title: "Annual Sports Meet",
    date: "22 Feb 2026",
    organizer: "Sports Department",
  },
  {
    title: "Badminton Doubles Championship",
    date: "5 Mar 2026",
    organizer: "Sports Club",
  },
];

const matches = [
  {
    title: "CS vs IT – Football Match",
    date: "18 Feb 2026",
    venue: "College Ground",
  },
  {
    title: "University Volleyball Qualifiers",
    date: "25 Feb 2026",
    venue: "Main Indoor Stadium",
  },
  {
    title: "Athletics 100m Finals",
    date: "3 Mar 2026",
    venue: "Sports Track",
  },
];

export default function EventsMatches() {
  return (
    <section className="events-matches-section">
      <h2 className="section-title">Upcoming Events & Matches</h2>
      <p className="section-subtitle">
        Stay updated with upcoming sports events and matches
      </p>

      <div className="events-matches-grid">
        {/* EVENTS */}
        <div className="events-box">
          <h3>🏟️ Events</h3>
          {events.map((event, index) => (
            <div className="item-card" key={index}>
              <h4>{event.title}</h4>
              <p>📅 {event.date}</p>
              <p>👥 {event.organizer}</p>
            </div>
          ))}
          <button className="view-btn">View All Events</button>
        </div>

        {/* MATCHES */}
        <div className="matches-box">
          <h3>⚽ Matches</h3>
          {matches.map((match, index) => (
            <div className="item-card" key={index}>
              <h4>{match.title}</h4>
              <p>📅 {match.date}</p>
              <p>📍 {match.venue}</p>
            </div>
          ))}
          <button className="view-btn">View All Matches</button>
        </div>
      </div>
    </section>
  );
}
