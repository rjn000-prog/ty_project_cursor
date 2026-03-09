import { events } from "../data/events";
import "./Events.css";

const Events = () => {
  return (
    <section className="events-section">
      <h2>All Events</h2>

      <div className="events-grid">
        {events.map(event => (
          <div key={event.id} className="event-card">
            <h3>{event.title}</h3>

            <p><strong>Date:</strong> {event.date}</p>
            <p><strong>Venue:</strong> {event.venue}</p>
            <p><strong>Organized By:</strong> {event.organizedBy}</p>

            <p className="event-desc">{event.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Events;
