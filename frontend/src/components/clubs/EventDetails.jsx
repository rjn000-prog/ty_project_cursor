import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getEventById } from "../../services/eventService";
import { getMyEvents } from "../../services/studentEventService";
import DynamicSchemaForm from "../../components/forms/DynamicSchemaForm";
import { generateGoogleCalendarLink, downloadICSFile } from "../../utils/calendarUtils";
import "./event-details.css";

const API = "http://localhost:5000/api";

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const timerComponents = [];
  Object.keys(timeLeft).forEach((interval) => {
    timerComponents.push(
      <div key={interval} className="countdown-item">
        <div className="countdown-value">{String(timeLeft[interval]).padStart(2, '0')}</div>
        <div className="countdown-label">{interval}</div>
      </div>
    );
  });

  if (!timerComponents.length) return null;

  return (
    <div className="event-countdown-box">
      <div className="countdown-header">🕒 Registration closes soon! Starts in:</div>
      <div className="countdown-timer-display">
        {timerComponents}
      </div>
    </div>
  );
};

const EventDetails = () => {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [note, setNote] = useState("");
  const [formValues, setFormValues] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [showCalendarDropdown, setShowCalendarDropdown] = useState(false);

  useEffect(() => {
    setLoading(true);
    getEventById(id)
      .then(data => setEvent(data))
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getMyEvents()
        .then(data => {
          const myEvents = Array.isArray(data) ? data : [];
          setRegistered(myEvents.some(e => String(e.id) === String(id)));
        })
        .catch(() => { });
    }
  }, [id]);

  const handleRegister = async (e) => {
    e?.preventDefault();
    if (!event) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/events/${event.id}/register`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          note: note.trim() || undefined,
          formData: formValues,
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      setRegistered(true);
      setShowRegisterForm(false);
      setNote("");
      setFormValues({});

      // Refresh event to update participant count
      const updated = await getEventById(id);
      setEvent(updated);
    } catch (err) {
      alert("Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="event-details-page">
        <div className="event-details-container">
          <div className="event-details-loading">Loading event...</div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="event-details-page">
        <div className="event-details-container">
          <div className="event-details-not-found">Event not found</div>
        </div>
      </div>
    );
  }

  const isPastEvent = new Date(event.date) < new Date();
  const isFull = event.availableSpots <= 0;
  const canRegister = !isPastEvent && !isFull && !registered;

  return (
    <div className="event-details-page">
      <div className="event-details-container">
        <div className="event-details-card animate-fade-scale">
          <div className="event-details-header animate-fade-up">
            <h1 className="event-details-title">{event.title}</h1>
            <p className="event-details-club">by {event.clubName}</p>
          </div>

          <div className="event-details-body animate-fade-up" style={{ animationDelay: '0.1s' }}>
            {!isPastEvent && <CountdownTimer targetDate={event.date} />}
            <p className="event-details-description">{event.description}</p>

            <div className="event-details-meta">
              <div className="event-details-meta-item">
                <div className="event-details-meta-label">Date</div>
                <div className="event-details-meta-value">
                  {new Date(event.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </div>
              </div>
              <div className="event-details-meta-item">
                <div className="event-details-meta-label">Time</div>
                <div className="event-details-meta-value">
                  {event.time}
                  {event.endTime ? ` – ${event.endTime}` : ""}
                </div>
              </div>
              <div className="event-details-meta-item">
                <div className="event-details-meta-label">Venue</div>
                <div className="event-details-meta-value">{event.venue}</div>
              </div>
              <div className="event-details-meta-item">
                <div className="event-details-meta-label">Participants</div>
                <div className="event-details-meta-value">
                  {event.participantCount} / {event.maxParticipants}
                </div>
              </div>
            </div>

            {/* Calendar Export */}
            {!isPastEvent && (
              <div className="calendar-export-section animate-fade-up" style={{ animationDelay: '0.2s' }}>
                <button
                  className="calendar-export-btn"
                  onClick={() => setShowCalendarDropdown(!showCalendarDropdown)}
                >
                  📅 Add to Calendar
                  <svg className={`chevron-icon ${showCalendarDropdown ? 'open' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {showCalendarDropdown && (
                  <div className="calendar-dropdown">
                    <button onClick={() => {
                      const link = generateGoogleCalendarLink({
                        title: event.title,
                        date: event.date,
                        startTime: event.time.split(' – ')[0] || "09:00",
                        endTime: event.time.split(' – ')[1] || "10:00",
                        venue: event.venue,
                        description: event.description
                      });
                      window.open(link, '_blank');
                      setShowCalendarDropdown(false);
                    }}>
                      Google Calendar
                    </button>
                    <button onClick={() => {
                      downloadICSFile({
                        title: event.title,
                        date: event.date,
                        startTime: event.time.split(' – ')[0] || "09:00",
                        endTime: event.time.split(' – ')[1] || "10:00",
                        venue: event.venue,
                        description: event.description
                      });
                      setShowCalendarDropdown(false);
                    }}>
                      Apple / Outlook (.ics)
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="event-details-actions">
              <Link to={`/clubs/${event.clubId}`} className="event-details-link">
                View Club
              </Link>

              {registered && (
                <span className="event-registered-badge">You are registered</span>
              )}

              {isFull && !registered && (
                <span className="event-details-full">Event Full</span>
              )}
            </div>

            {canRegister && !showRegisterForm && (
              <button
                onClick={() => setShowRegisterForm(true)}
                className="event-register-simple-btn"
              >
                Register for Event
              </button>
            )}

            {canRegister && showRegisterForm && (
              <form
                className="event-register-form"
                onSubmit={handleRegister}
              >
                <h3>Register for this event</h3>
                <DynamicSchemaForm
                  schema={event.registrationFormSchema || []}
                  values={formValues}
                  onChange={(k, v) =>
                    setFormValues((p) => ({ ...p, [k]: v }))
                  }
                  disabled={submitting}
                  hideSubmit={true}
                />
                <textarea
                  placeholder="Add a note (optional) – e.g. dietary requirements, accessibility needs"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  disabled={submitting}
                />
                <div className="event-register-form-actions">
                  <button
                    type="submit"
                    className="event-register-btn"
                    disabled={submitting}
                  >
                    {submitting ? "Registering..." : "Confirm Registration"}
                  </button>
                  <button
                    type="button"
                    className="event-register-btn event-register-btn--secondary"
                    onClick={() => {
                      setShowRegisterForm(false);
                      setNote("");
                      setFormValues({});
                    }}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
