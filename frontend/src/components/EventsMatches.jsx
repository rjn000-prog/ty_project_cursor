import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllEvents } from "../services/eventService";
import { getAllMatches } from "../services/matchService";
import "./EventsMatches.css";

function formatEventDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return isNaN(d.getTime())
    ? String(dateStr)
    : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function EventsMatches() {
  const [events, setEvents] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([getAllEvents(), getAllMatches()])
      .then(([eventsData, matchesData]) => {
        setEvents(Array.isArray(eventsData) ? eventsData : []);
        setMatches(Array.isArray(matchesData) ? matchesData : []);
      })
      .catch(() => setError("Failed to load schedule"))
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const upcomingEvents = events.filter((e) => new Date(e.date) >= now).slice(0, 3);
  // Show matches sorted by date desc (most recent or upcoming first)
  const sortedMatches = [...matches].sort((a, b) => new Date(b.date) - new Date(a.date));
  const displayMatches = sortedMatches.slice(0, 3);

  return (
    <section className="events-matches-section">
      <div className="section-label">Schedule</div>
      <h2 className="section-title">Upcoming Events &amp; Matches</h2>
      <p className="section-subtitle">
        Stay updated with upcoming sports events and matches
      </p>

      {loading && <p className="section-subtitle">Loading events...</p>}
      {error && <p className="section-subtitle">{error}</p>}

      {!loading && !error && (
        <div className="events-matches-grid">
          {/* Events box */}
          <div className="events-box">
            <h3>🗓️ Events</h3>
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <div className="item-card" key={event.id}>
                  <h4>{event.title}</h4>
                  <p>📅 {formatEventDate(event.date)}</p>
                  <p>👥 {event.clubName || "—"}</p>
                </div>
              ))
            ) : (
              <p className="no-items">No upcoming events</p>
            )}
            <Link to="/events" className="view-btn">View All Events →</Link>
          </div>

          {/* Matches box */}
          <div className="matches-box">
            <h3>⚡ Matches</h3>
            {displayMatches.length > 0 ? (
              displayMatches.map((match) => (
                <div className="item-card" key={match.id}>
                  <h4>{match.teamAName} vs {match.teamBName}</h4>
                  <div className="item-card-score">
                    {match.scoreA} - {match.scoreB}
                  </div>
                  <p>📅 {formatEventDate(match.date)}</p>
                  <p>📍 {match.venue || "—"}</p>
                </div>
              ))
            ) : (
              <p className="no-items">No upcoming matches</p>
            )}
            <Link to="/sports" className="view-btn">View All Matches →</Link>
          </div>
        </div>
      )}
    </section>
  );
}
