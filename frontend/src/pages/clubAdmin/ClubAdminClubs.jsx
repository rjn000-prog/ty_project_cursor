import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllClubsForAdmin, deleteClubForAdmin, createClubForAdmin } from "../../services/clubAdminService";
import "../dashboard/ClubAdminDashboard.css";

export default function ClubAdminClubs() {
  const [loading, setLoading] = useState(true);
  const [clubs, setClubs] = useState([]);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: "",
    description: "",
    presidentName: "",
    contactEmail: "",
    capacity: "",
    location: "",
  });

  const loadClubs = () => {
    setLoading(true);
    getAllClubsForAdmin()
      .then((data) => setClubs(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadClubs();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      await createClubForAdmin(form);
      setForm({
        name: "",
        type: "",
        description: "",
        presidentName: "",
        contactEmail: "",
        capacity: "",
        location: "",
      });
      loadClubs();
    } catch (error) {
      alert("Failed to create club");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this club?")) return;
    try {
      await deleteClubForAdmin(id);
      loadClubs();
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
            <h1>Clubs</h1>
            <p>View, edit, and manage members and join forms</p>
          </div>
          <div className="club-admin-header-meta">
            <div className="header-stat-pill">
              <span className="pill-label">Total Clubs</span>
              <span className="pill-value">{clubs.length}</span>
            </div>
          </div>
        </header>

        <div className="club-admin-grid">
          <section className="club-admin-card">
            <div className="club-admin-section-title">
              <h2>Create New Club</h2>
              <span className="club-admin-badge">Launcher</span>
            </div>

            <form className="admin-modern-form" onSubmit={handleCreate}>
              <div className="form-row">
                <div className="form-group">
                  <label>Club Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Robotics Club"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Type / Category</label>
                  <input
                    value={form.type}
                    onChange={(e) => setForm(p => ({ ...p, type: e.target.value }))}
                    placeholder="e.g. Technical, Cultural"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>President Name</label>
                  <input
                    value={form.presidentName}
                    onChange={(e) => setForm(p => ({ ...p, presidentName: e.target.value }))}
                    placeholder="e.g. John Doe"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Contact Email</label>
                  <input
                    type="email"
                    value={form.contactEmail}
                    onChange={(e) => setForm(p => ({ ...p, contactEmail: e.target.value }))}
                    placeholder="e.g. club@college.edu"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Capacity</label>
                  <input
                    type="number"
                    value={form.capacity}
                    onChange={(e) => setForm(p => ({ ...p, capacity: e.target.value }))}
                    placeholder="0 for unlimited"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    value={form.location}
                    onChange={(e) => setForm(p => ({ ...p, location: e.target.value }))}
                    placeholder="e.g. Block C, Room 202"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="What is this club about?..."
                  rows={3}
                  required
                />
              </div>

              <div className="admin-form-actions">
                <button
                  type="submit"
                  className="club-admin-button club-admin-button--primary full-width"
                  disabled={creating}
                >
                  {creating ? "Creating..." : "Register Club"}
                </button>
              </div>
            </form>
          </section>

          <section className="club-admin-card">
            <div className="club-admin-section-title">
              <h2>Existing Clubs</h2>
              <span className="club-admin-pill">{clubs.length}</span>
            </div>

            {loading ? (
              <div className="admin-loader-mini">Fetching clubs...</div>
            ) : clubs.length === 0 ? (
              <div className="club-admin-empty">No clubs registered yet.</div>
            ) : (
              <div className="admin-item-grid">
                {clubs.map((c) => (
                  <div className="admin-item-card" key={c.id}>
                    <div className="item-card-header">
                      <span className="item-category">{c.type}</span>
                      <button
                        className="delete-icon-btn"
                        onClick={() => handleDelete(c.id)}
                        title="Delete Club"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="item-card-body">
                      <h3>{c.name}</h3>
                      <p className="item-club">{c.location}</p>
                      <div className="item-stats-row">
                        <span>👤 {c.membersCount} members</span>
                        <span>📅 {c.eventsCount} events</span>
                      </div>
                    </div>
                    <div className="item-card-footer">
                      <Link to={`/club-admin/clubs/${c.id}`} className="manage-btn">
                        Manage Club →
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
