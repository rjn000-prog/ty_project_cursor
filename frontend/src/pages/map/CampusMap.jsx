import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./campus-map.css";

const API = "http://localhost:5000/api/map/events";

const CampusMap = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredEvent, setHoveredEvent] = useState(null);
    const [hoverTimer, setHoverTimer] = useState(null);

    const handleMouseEnter = (event) => {
        if (hoverTimer) clearTimeout(hoverTimer);
        setHoveredEvent(event);
    };

    const handleMouseLeave = () => {
        const timer = setTimeout(() => {
            setHoveredEvent(null);
        }, 150); // Small 150ms buffer
        setHoverTimer(timer);
    };

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await axios.get(API, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                setEvents(res.data);
            } catch (err) {
                console.error("Failed to fetch map events", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    // Filter to only include events that have coordinates
    const mappedEvents = events.filter(e => e.club && e.club.lat && e.club.lng);

    if (loading) return <div className="map-loading">Initializing Map...</div>;

    return (
        <div className="map-page animate-fade-in">
            <div className="map-header">
                <h1 className="map-title">Interactive Campus Map</h1>
                <p className="map-subtitle">See live events and club locations across the campus.</p>
            </div>

            <div className="map-container">
                {/* STYLIZED SVG MAP BASE */}
                <svg viewBox="0 0 800 600" className="campus-svg">
                    {/* DEFINITIONS FOR GRADIENTS/SHADOWS */}
                    <defs>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                        <linearGradient id="grid-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#1e293b" />
                            <stop offset="100%" stopColor="#0f172a" />
                        </linearGradient>
                    </defs>

                    {/* BACKGROUND GRID */}
                    <rect width="800" height="600" fill="url(#grid-grad)" rx="20" />
                    <path d="M0,100 L800,100 M0,200 L800,200 M0,300 L800,300 M0,400 L800,400 M0,500 L800,500" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    <path d="M100,0 L100,600 M200,0 L200,600 M300,0 L300,600 M400,0 L400,600 M500,0 L500,600 M600,0 L600,600 M700,0 L700,600" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

                    {/* MAIN CAMPUS BUILDINGS (STYLIZED BLOCKS) */}
                    {/* Green zones */}
                    <rect x="50" y="50" width="150" height="120" className="campus-building woods-zone" rx="15" />
                    <text x="125" y="115" className="building-label">Woods</text>

                    {/* Academic Block 1 */}
                    <rect x="220" y="200" width="100" height="80" className="campus-building academic-zone" rx="8" />
                    <text x="270" y="245" className="building-label">B Block</text>

                    {/* Main Block */}
                    <rect x="350" y="160" width="100" height="120" className="campus-building main-zone" rx="8" />
                    <text x="400" y="225" className="building-label">Main Block</text>

                    {/* Academic Block 2 */}
                    <rect x="480" y="200" width="100" height="80" className="campus-building academic-zone" rx="8" />
                    <text x="530" y="245" className="building-label">G Block</text>

                    {/* Central Plaza */}
                    <rect x="350" y="300" width="100" height="80" className="campus-building quad-zone" rx="20" />
                    <text x="400" y="345" className="building-label">Quad</text>

                    {/* Auditoriums */}
                    <rect x="600" y="80" width="130" height="65" className="campus-building audi-upper" rx="8" />
                    <text x="665" y="115" className="building-label">Upper Audi</text>

                    <rect x="600" y="155" width="130" height="65" className="campus-building audi-lower" rx="8" />
                    <text x="665" y="190" className="building-label">Lower Audi</text>

                    {/* New Indoor Zones */}
                    <rect x="480" y="70" width="100" height="60" className="campus-building music-zone" rx="8" />
                    <text x="530" y="105" className="building-label">Music Room</text>

                    <rect x="220" y="70" width="120" height="80" className="campus-building gym-zone" rx="8" />
                    <text x="280" y="115" className="building-label">Gym Hall</text>

                    {/* Sports Cluster */}
                    <rect x="50" y="350" width="280" height="220" className="campus-zone-border" rx="15" />

                    <rect x="70" y="370" width="100" height="60" className="campus-building sports-zone" rx="8" />
                    <text x="120" y="405" className="building-label">Footsul</text>

                    <rect x="190" y="370" width="110" height="60" className="campus-building sports-zone" rx="8" />
                    <text x="245" y="405" className="building-label">Volleyball Ground</text>

                    <rect x="70" y="450" width="230" height="100" className="campus-building sports-zone" rx="8" />
                    <text x="185" y="505" className="building-label">Basketball Ground</text>

                    {/* EVENT PINS */}
                    {mappedEvents.map(event => (
                        <g
                            key={event.id}
                            className={`map-pin-group ${event.isLive ? 'live' : ''}`}
                            onMouseEnter={() => handleMouseEnter(event)}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => window.location.href = `/events/${event.id}`}
                        >
                            <circle
                                cx={event.club.lng}
                                cy={event.club.lat}
                                r={event.isLive ? 12 : 8}
                                className="pin-pulse"
                            />
                            <circle
                                cx={event.club.lng}
                                cy={event.club.lat}
                                r="6"
                                className="pin-core"
                            />
                        </g>
                    ))}
                </svg>

                {/* TOOLTIP ON HOVER */}
                {hoveredEvent && (
                    <div
                        className="map-tooltip animate-scale-in"
                        onMouseEnter={() => handleMouseEnter(hoveredEvent)}
                        onMouseLeave={handleMouseLeave}
                        style={{
                            left: `${(hoveredEvent.club.lng / 800) * 100}%`,
                            top: `${(hoveredEvent.club.lat / 600) * 100}%`
                        }}
                    >
                        <div className="tooltip-header">
                            {hoveredEvent.isLive && <span className="live-status">LIVE NOW</span>}
                            <span className="tooltip-type">{hoveredEvent.type}</span>
                        </div>
                        <h3 className="tooltip-title">{hoveredEvent.title}</h3>
                        <p className="tooltip-location">📍 {hoveredEvent.club.name}</p>
                        <p className="tooltip-time">⏰ {hoveredEvent.startTime} - {hoveredEvent.endTime}</p>
                        <Link to={`/events/${hoveredEvent.id}`} className="tooltip-btn">View Event</Link>
                    </div>
                )}
            </div>

            <div className="map-legend">
                <div className="legend-item">
                    <span className="dot core"></span> Upcoming Event
                </div>
                <div className="legend-item">
                    <span className="dot pulse"></span> Live Event (Now)
                </div>
            </div>
        </div>
    );
};

export default CampusMap;
