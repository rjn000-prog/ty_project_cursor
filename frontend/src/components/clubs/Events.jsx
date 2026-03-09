import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EventCard from './EventCard';
import EmptyState from './EmptyState';
import { EventCardSkeleton } from './LoadingSkeleton';
import { getAllEvents } from '../../services/eventService';
import './events.css';

const Events = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllEvents()
      .then(data => setEvents(data || []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const now = new Date();

    let filtered = [...events];

    if (activeTab === 'upcoming')
      filtered = filtered.filter(e => new Date(e.date) >= now);
    else
      filtered = filtered.filter(e => new Date(e.date) < now);

    if (searchTerm)
      filtered = filtered.filter(e =>
        e.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.clubName?.toLowerCase().includes(searchTerm.toLowerCase())
      );

    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));

    setFilteredEvents(filtered);
  }, [events, activeTab, searchTerm]);

  return (
    <div className="events-page">
      <div className="events-container">

        <div className="events-header">
          <h1>Events</h1>
          <p>Participate in workshops, competitions and activities organised by clubs</p>
        </div>

        <div className="events-filter-bar">
          <div className="events-filter-row">
            <div className="events-tabs">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`events-tab ${activeTab === 'upcoming' ? 'events-tab--active' : ''}`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`events-tab ${activeTab === 'past' ? 'events-tab--active' : ''}`}
              >
                Past
              </button>
            </div>

            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="events-search"
            />
          </div>

          <p className="events-count">
            {filteredEvents.length} events found
          </p>
        </div>

        {loading ? (
          <div className="events-grid">
            {[...Array(6)].map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="events-grid">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="events-empty-wrapper">
            <EmptyState
              title="No events found"
              message="Try changing filters or search term"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
