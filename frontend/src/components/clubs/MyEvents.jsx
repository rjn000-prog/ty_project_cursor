import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import FeedbackForm from './FeedbackForm';
import { getMyEvents, submitFeedback, getMyTicket, downloadCertificate } from '../../services/studentEventService';
import './my-events.css';

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFeedbackFor, setShowFeedbackFor] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [ticketData, setTicketData] = useState(null);
  const [loadingTicket, setLoadingTicket] = useState(false);

  useEffect(() => {
    getMyEvents()
      .then(data => setEvents(Array.isArray(data) ? data : []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const handleFeedbackSubmit = async (eventId, feedbackData) => {
    await submitFeedback(eventId, feedbackData);
    setEvents(prev =>
      prev.map(e =>
        e.id === eventId
          ? { ...e, feedbackSubmitted: true }
          : e
      )
    );
    setShowFeedbackFor(null);
  };

  const handleShowTicket = async (regId) => {
    console.log("[MyEvents] Fetching ticket for Registration ID:", regId);
    if (!regId) {
      alert("Registration ID is missing. Try refreshing the page.");
      return;
    }

    try {
      setLoadingTicket(true);
      const data = await getMyTicket(regId);
      setTicketData(data);
    } catch (error) {
      alert("Failed to load ticket");
    } finally {
      setLoadingTicket(false);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });

  const upcomingEvents = useMemo(() =>
    events.filter(e => new Date(e.date) >= new Date()),
    [events]
  );

  const pastEvents = useMemo(() =>
    events.filter(e => new Date(e.date) < new Date()),
    [events]
  );

  const filterBySearch = (list) => {
    if (!searchTerm.trim()) return list;
    const term = searchTerm.toLowerCase();
    return list.filter(e =>
      e.title?.toLowerCase().includes(term) ||
      e.clubName?.toLowerCase().includes(term) ||
      e.venue?.toLowerCase().includes(term)
    );
  };

  const filteredUpcoming = useMemo(() =>
    filterBySearch(upcomingEvents).sort((a, b) => new Date(a.date) - new Date(b.date)),
    [upcomingEvents, searchTerm]
  );

  const filteredPast = useMemo(() =>
    filterBySearch(pastEvents).sort((a, b) => new Date(b.date) - new Date(a.date)),
    [pastEvents, searchTerm]
  );

  const displayUpcoming = activeTab === 'all' || activeTab === 'upcoming';
  const displayPast = activeTab === 'all' || activeTab === 'past';

  if (loading) {
    return (
      <div className="my-events-page">
        <div className="my-events-container">
          <div className="my-events-header">
            <h1>My Events</h1>
            <p>All events you registered for</p>
          </div>
          <div className="my-events-loading">Loading your events...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-events-page">
      <div className="my-events-container">

        <div className="my-events-header animate-fade-up">
          <h1>My Events</h1>
          <p>All events you registered for</p>
        </div>

        <div className="my-events-filter-bar">
          <div className="my-events-filter-row">
            <div className="my-events-tabs">
              <button
                onClick={() => setActiveTab('all')}
                className={`my-events-tab ${activeTab === 'all' ? 'my-events-tab--active' : ''}`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`my-events-tab ${activeTab === 'upcoming' ? 'my-events-tab--active' : ''}`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`my-events-tab ${activeTab === 'past' ? 'my-events-tab--active' : ''}`}
              >
                Past
              </button>
            </div>

            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="my-events-search"
            />
          </div>
        </div>

        {displayUpcoming && (
          <div className="my-events-section">
            <h2>Upcoming Events</h2>
            {upcomingEvents.length === 0 ? (
              <div className="my-events-empty">
                <svg className="my-events-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3>No upcoming events</h3>
                <p>Register for events from the Events page to see them here</p>
              </div>
            ) : (
              filteredUpcoming.map(event => (
                <div key={event.id} className="my-events-row">
                  <div className="my-events-row-content">
                    <div className="my-events-row-info">
                      <Link to={`/events/${event.id}`}>{event.title}</Link>
                      <div className="my-events-row-meta">
                        {event.clubName} • {formatDate(event.date)} • {event.venue}
                      </div>
                    </div>
                    <div className="my-events-row-status-ticket">
                      <StatusBadge status={event.registrationStatus} />
                      {event.registrationStatus?.toUpperCase() === 'APPROVED' && (
                        <button
                          className="view-ticket-btn"
                          onClick={() => handleShowTicket(event.registrationId)}
                          disabled={loadingTicket}
                        >
                          🎟 Ticket
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {displayPast && (
          <div className="my-events-section">
            <h2>Past Events</h2>
            {pastEvents.length === 0 ? (
              <div className="my-events-empty">
                <svg className="my-events-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3>No past events</h3>
                <p>Events you attended will appear here</p>
              </div>
            ) : (
              filteredPast.map(event => (
                <div key={event.id} className="my-events-row">
                  <div className="my-events-row-content">
                    <div className="my-events-row-info">
                      <h3>{event.title}</h3>
                      <p className="my-events-row-meta">
                        {formatDate(event.date)} • {event.venue}
                      </p>
                    </div>
                    <div className="my-events-row-actions">
                      {event.registrationStatus?.toUpperCase() === 'APPROVED' && event.certIssued && (
                        <button
                          className="view-ticket-btn download-cert-btn"
                          onClick={() => downloadCertificate(event.registrationId)}
                          style={{ marginRight: '10px', background: '#059669' }}
                        >
                          📜 Certificate
                        </button>
                      )}
                      {event.attended && !event.feedbackSubmitted && (
                        <button
                          onClick={() => setShowFeedbackFor(event.id)}
                          className="my-events-feedback-btn"
                        >
                          Give Feedback
                        </button>
                      )}
                      {event.feedbackSubmitted && (
                        <span className="my-events-feedback-submitted">Feedback Submitted</span>
                      )}
                    </div>
                  </div>
                  {showFeedbackFor === event.id && (
                    <div className="my-events-feedback-form">
                      <FeedbackForm
                        eventName={event.title}
                        onSubmit={(data) => handleFeedbackSubmit(event.id, data)}
                        onCancel={() => setShowFeedbackFor(null)}
                      />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

      </div>

      {/* TICKET MODAL */}
      {ticketData && (
        <div className="ticket-modal-overlay" onClick={() => setTicketData(null)}>
          <div className="ticket-modal" onClick={e => e.stopPropagation()}>
            <div className="ticket-modal-header">
              <h2>Event Entry Ticket</h2>
              <button onClick={() => setTicketData(null)}>✕</button>
            </div>
            <div className="ticket-modal-body">
              <div className="ticket-qr-container">
                <img src={ticketData.qrCode} alt="QR Code" />
              </div>
              <div className="ticket-info">
                <h3>{ticketData.event}</h3>
                <p className="student-name">{ticketData.student}</p>
                <div className="ticket-token">{ticketData.ticketToken}</div>
                <p className="ticket-hint">Show this QR code at the event entrance</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEvents;
