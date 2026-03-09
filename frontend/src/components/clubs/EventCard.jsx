import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  const isPast = new Date(event.date) < new Date();

  return (
    <div className="events-event-card">
      <div className="events-event-card-header">
        <h3 className="events-event-card-title">{event.title}</h3>
        <span className={`events-event-card-badge ${
          isPast ? 'events-event-card-badge--past' : 'events-event-card-badge--upcoming'
        }`}>
          {isPast ? 'Completed' : 'Upcoming'}
        </span>
      </div>

      <p className="events-event-card-club">by {event.clubName}</p>

      <div className="events-event-card-meta">
        <div className="events-event-card-meta-item">
          <svg className="events-event-card-meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {new Date(event.date).toDateString()}
        </div>
        <div className="events-event-card-meta-item">
          <svg className="events-event-card-meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {event.venue}
        </div>
        <div className="events-event-card-meta-item">
          <svg className="events-event-card-meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {event.participantCount ?? event.registeredCount ?? 0}/{event.maxParticipants ?? event.participantsLimit ?? 0} participants
        </div>
      </div>

      <p className="events-event-card-desc">{event.description}</p>

      <Link to={`/events/${event.id}`} className="events-event-card-link">
        View Details
      </Link>
    </div>
  );
};

export default EventCard;
