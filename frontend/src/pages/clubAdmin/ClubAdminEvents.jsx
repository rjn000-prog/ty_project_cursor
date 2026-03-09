import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAllClubsForAdmin,
  getAllEventsForAdmin,
  createEventForAdmin,
  deleteEventForAdmin,
} from "../../services/clubAdminService";
import "../dashboard/ClubAdminDashboard.css";

export default function ClubAdminEvents() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [clubId, setClubId] = useState("");
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    clubId: "",
    name: "",
    type: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    maxParticipants: "",
  });

  useEffect(() => {
    Promise.all([getAllClubsForAdmin(), getAllEventsForAdmin()])
      .then(([c, e]) => {
        setClubs(Array.isArray(c) ? c : []);
        setEvents(Array.isArray(e) ? e : []);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setLoading(true);
    getAllEventsForAdmin({ clubId: clubId ? Number(clubId) : undefined })
      .then((e) => setEvents(Array.isArray(e) ? e : []))
      .finally(() => setLoading(false));
  }, [clubId]);

  const clubOptions = useMemo(
    () => clubs.map((c) => ({ id: c.id, name: c.name })),
    [clubs]
  );

  const handleCreate = async (e) => {
    e.preventDefault();
    if (
      !form.clubId ||
      !form.name ||
      !form.type ||
      !form.description ||
      !form.date ||
      !form.startTime ||
      !form.endTime ||
      !form.maxParticipants
    )
      return;

    try {
      setCreating(true);
      const res = await createEventForAdmin({
        clubId: Number(form.clubId),
        name: form.name,
        type: form.type,
        description: form.description,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        maxParticipants: Number(form.maxParticipants),
      });
      if (res?.event?.id) {
        navigate(`/club-admin/events/${res.event.id}`);
      } else {
        const refreshed = await getAllEventsForAdmin();
        setEvents(Array.isArray(refreshed) ? refreshed : []);
      }
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteEventForAdmin(id);
      const refreshed = await getAllEventsForAdmin({
        clubId: clubId ? Number(clubId) : undefined,
      });
      setEvents(Array.isArray(refreshed) ? refreshed : []);
    } catch {
      // ignore for now
    }
  };

  return (
    <div className="club-admin-dashboard">
      <nav className="dashboard-nav dashboard-nav--admin">
        <Link to="/" className="dashboard-nav-logo">
          PCCAS
        </Link>
        <div className="dashboard-nav-links">
          <Link to="/" className="portal-link">Return to Portal</Link>
          <Link to="/clubs">Public Clubs</Link>
          <Link to="/events">Public Events</Link>
          <Link to="/club-admin">Dashboard</Link>
          <Link to="/club-admin/clubs">Clubs</Link>
          <Link to="/club-admin/events">Events</Link>
          <Link to="/club-admin/news">News</Link>
          <Link to="/club-admin/gallery">Gallery</Link>
        </div>
      </nav>

      <div className="club-admin-dashboard-container">
        <header className="club-admin-header">
          <div className="club-admin-header-title">
            <h1>Events</h1>
            <p>Create, edit, and view registrations</p>
          </div>
          <div className="club-admin-header-meta">
            <select
              value={clubId}
              onChange={(e) => setClubId(e.target.value)}
              style={{
                padding: "8px 10px",
                borderRadius: 10,
                border: "1px solid rgba(148,163,184,0.5)",
                background: "rgba(15,23,42,0.9)",
                color: "white",
              }}
            >
              <option value="">All clubs</option>
              {clubOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </header>

        <div className="club-admin-grid club-admin-grid--events">
          <section className="club-admin-card event-creator-card">
            <div className="club-admin-section-title">
              <h2>Create New Event</h2>
              <span className="club-admin-badge">Launcher</span>
            </div>

            <form className="admin-modern-form" onSubmit={handleCreate}>
              <div className="form-row">
                <div className="form-group">
                  <label>Organizing Club</label>
                  <select
                    value={form.clubId}
                    onChange={(e) => setForm((p) => ({ ...p, clubId: e.target.value }))}
                    className="admin-select"
                    required
                  >
                    <option value="">Select a club</option>
                    {clubOptions.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Event Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Annual Sports Meet"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category / Type</label>
                  <input
                    value={form.type}
                    onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                    placeholder="e.g. Workshop, Tournament"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Time</label>
                  <input
                    type="time"
                    value={form.startTime}
                    onChange={(e) => setForm((p) => ({ ...p, startTime: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Time</label>
                  <input
                    type="time"
                    value={form.endTime}
                    onChange={(e) => setForm((p) => ({ ...p, endTime: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Max participants</label>
                  <input
                    type="number"
                    value={form.maxParticipants}
                    onChange={(e) => setForm((p) => ({ ...p, maxParticipants: e.target.value }))}
                    placeholder="0 for unlimited"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Tell students what this event is about..."
                  rows={4}
                  required
                />
              </div>

              <div className="admin-form-actions">
                <button
                  type="submit"
                  className="club-admin-button club-admin-button--primary full-width"
                  disabled={creating}
                >
                  {creating ? "Launching..." : "Launch Event"}
                </button>
              </div>
            </form>
          </section>

          <section className="club-admin-card event-list-card">
            <div className="club-admin-section-title">
              <h2>Existing Events</h2>
              <span className="club-admin-pill">{events.length}</span>
            </div>

            {loading ? (
              <div className="admin-loader-mini">Fetching events...</div>
            ) : events.length === 0 ? (
              <div className="club-admin-empty">No events found for this selection.</div>
            ) : (
              <div className="admin-item-grid">
                {events.slice(0, 20).map((e) => (
                  <div className="admin-item-card" key={e.id}>
                    <div className="item-card-header">
                      <span className="item-category">{e.type}</span>
                      <button
                        className="delete-icon-btn"
                        onClick={() => handleDelete(e.id)}
                        title="Delete Event"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="item-card-body">
                      <h3>{e.name}</h3>
                      <p className="item-club">{e.clubName}</p>
                      <p className="item-date">{new Date(e.date).toLocaleDateString()}</p>
                    </div>
                    <div className="item-card-footer">
                      <Link to={`/club-admin/events/${e.id}`} className="manage-btn">
                        Manage Registrations →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

