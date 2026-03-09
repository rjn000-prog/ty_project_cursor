import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  getAdminDashboard,
  createClubAdmin,
  createClubWithAdmin,
  createSportsAdmin,
} from "../../services/adminService";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  const [creatingSportsAdmin, setCreatingSportsAdmin] = useState(false);
  const [creatingClub, setCreatingClub] = useState(false);

  const [adminForm, setAdminForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [sportsAdminForm, setSportsAdminForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [clubForm, setClubForm] = useState({
    name: "",
    type: "",
    description: "",
    presidentName: "",
    contactEmail: "",
    capacity: "",
    location: "",
  });

  useEffect(() => {
    getAdminDashboard()
      .then((dashboard) => {
        setData(dashboard);
      })
      .catch(() => {
        setData(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleAdminChange = (field, value) => {
    setAdminForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSportsAdminChange = (field, value) => {
    setSportsAdminForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleClubChange = (field, value) => {
    setClubForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateClubAdmin = async (e) => {
    e.preventDefault();
    if (!adminForm.name || !adminForm.email || !adminForm.password) return;
    try {
      setCreatingAdmin(true);
      await createClubAdmin({
        name: adminForm.name,
        email: adminForm.email,
        password: adminForm.password,
      });
      setAdminForm({
        name: "",
        email: "",
        password: "",
      });
    } catch {
      // ignore for now
    } finally {
      setCreatingAdmin(false);
    }
  };

  const handleCreateSportsAdmin = async (e) => {
    e.preventDefault();
    if (
      !sportsAdminForm.name ||
      !sportsAdminForm.email ||
      !sportsAdminForm.password
    )
      return;
    try {
      setCreatingSportsAdmin(true);
      await createSportsAdmin({
        name: sportsAdminForm.name,
        email: sportsAdminForm.email,
        password: sportsAdminForm.password,
      });
      setSportsAdminForm({
        name: "",
        email: "",
        password: "",
      });
    } catch {
      // ignore for now
    } finally {
      setCreatingSportsAdmin(false);
    }
  };

  const handleCreateClubWithAdmin = async (e) => {
    e.preventDefault();
    if (
      !clubForm.name ||
      !clubForm.type ||
      !clubForm.description ||
      !clubForm.presidentName ||
      !clubForm.contactEmail ||
      !clubForm.capacity ||
      !clubForm.location
    ) {
      return;
    }

    try {
      setCreatingClub(true);
      await createClubWithAdmin({
        name: clubForm.name,
        type: clubForm.type,
        description: clubForm.description,
        presidentName: clubForm.presidentName,
        contactEmail: clubForm.contactEmail,
        capacity: Number(clubForm.capacity),
        location: clubForm.location,
      });

      setClubForm({
        name: "",
        type: "",
        description: "",
        presidentName: "",
        contactEmail: "",
        capacity: "",
        location: "",
      });
    } catch {
      // ignore for now
    } finally {
      setCreatingClub(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-dashboard-container">
          <div className="admin-loader">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  const stats = data || {
    totalEvents: 0,
    totalClubs: 0,
    totalRegistrations: 0,
    totalSports: 0,
    recentEvents: [],
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-container">
        <header className="admin-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Portal Overview & Management</p>
          </div>
        </header>

        <section className="admin-stats">
          <div className="admin-stat-card admin-stat-card--events">
            <h3>Total Events</h3>
            <div className="admin-stat-value">{stats.totalEvents}</div>
          </div>
          <div className="admin-stat-card admin-stat-card--clubs">
            <h3>Active Clubs</h3>
            <div className="admin-stat-value">{stats.totalClubs}</div>
          </div>
          <div className="admin-stat-card admin-stat-card--registrations">
            <h3>Registrations</h3>
            <div className="admin-stat-value">{stats.totalRegistrations}</div>
          </div>
          <div className="admin-stat-card admin-stat-card--registrations">
            <h3>Sports</h3>
            <div className="admin-stat-value">{stats.totalSports}</div>
          </div>
        </section>

        <section className="admin-section">
          <h2>Management Actions</h2>
          <div className="admin-actions-grid">
            <Link to="/admin/clubs" className="admin-action-btn">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Manage Clubs
            </Link>
            <Link to="/admin/events" className="admin-action-btn">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Manage Events
            </Link>
            <Link to="/clubs" className="admin-action-btn">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Public Club View
            </Link>
            <Link to="/events" className="admin-action-btn">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Public Event View
            </Link>
          </div>
        </section>

        <section className="admin-section">
          <h2>Create Club Admin (Existing Club)</h2>
          <form
            className="admin-actions-grid"
            onSubmit={handleCreateClubAdmin}
          >
            <div className="admin-action-btn" style={{ flexDirection: "column", alignItems: "stretch" }}>
              <label style={{ fontSize: "0.8rem", opacity: 0.8 }}>Name</label>
              <input
                type="text"
                value={adminForm.name}
                onChange={(e) => handleAdminChange("name", e.target.value)}
                style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(148,163,184,0.5)", background: "rgba(15,23,42,0.9)", color: "white" }}
              />
            </div>
            <div className="admin-action-btn" style={{ flexDirection: "column", alignItems: "stretch" }}>
              <label style={{ fontSize: "0.8rem", opacity: 0.8 }}>Email</label>
              <input
                type="email"
                value={adminForm.email}
                onChange={(e) => handleAdminChange("email", e.target.value)}
                style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(148,163,184,0.5)", background: "rgba(15,23,42,0.9)", color: "white" }}
              />
            </div>
            <div className="admin-action-btn" style={{ flexDirection: "column", alignItems: "stretch" }}>
              <label style={{ fontSize: "0.8rem", opacity: 0.8 }}>Password</label>
              <input
                type="password"
                value={adminForm.password}
                onChange={(e) => handleAdminChange("password", e.target.value)}
                style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(148,163,184,0.5)", background: "rgba(15,23,42,0.9)", color: "white" }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
              <button
                type="submit"
                className="dashboard-nav-logout"
                disabled={creatingAdmin}
              >
                {creatingAdmin ? "Creating..." : "Create Club Admin"}
              </button>
            </div>
          </form>
        </section>

        <section className="admin-section">
          <h2>Create Sports Admin</h2>
          <form
            className="admin-actions-grid"
            onSubmit={handleCreateSportsAdmin}
          >
            <div
              className="admin-action-btn"
              style={{ flexDirection: "column", alignItems: "stretch" }}
            >
              <label style={{ fontSize: "0.8rem", opacity: 0.8 }}>Name</label>
              <input
                type="text"
                value={sportsAdminForm.name}
                onChange={(e) =>
                  handleSportsAdminChange("name", e.target.value)
                }
                style={{
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: "1px solid rgba(148,163,184,0.5)",
                  background: "rgba(15,23,42,0.9)",
                  color: "white",
                }}
              />
            </div>
            <div
              className="admin-action-btn"
              style={{ flexDirection: "column", alignItems: "stretch" }}
            >
              <label style={{ fontSize: "0.8rem", opacity: 0.8 }}>Email</label>
              <input
                type="email"
                value={sportsAdminForm.email}
                onChange={(e) =>
                  handleSportsAdminChange("email", e.target.value)
                }
                style={{
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: "1px solid rgba(148,163,184,0.5)",
                  background: "rgba(15,23,42,0.9)",
                  color: "white",
                }}
              />
            </div>
            <div
              className="admin-action-btn"
              style={{ flexDirection: "column", alignItems: "stretch" }}
            >
              <label style={{ fontSize: "0.8rem", opacity: 0.8 }}>
                Password
              </label>
              <input
                type="password"
                value={sportsAdminForm.password}
                onChange={(e) =>
                  handleSportsAdminChange("password", e.target.value)
                }
                style={{
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: "1px solid rgba(148,163,184,0.5)",
                  background: "rgba(15,23,42,0.9)",
                  color: "white",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="submit"
                className="dashboard-nav-logout"
                disabled={creatingSportsAdmin}
              >
                {creatingSportsAdmin ? "Creating..." : "Create Sports Admin"}
              </button>
            </div>
          </form>
        </section>

        <section className="admin-section">
          <h2>Create Club</h2>
          <form className="admin-actions-grid" onSubmit={handleCreateClubWithAdmin}>
            <div className="admin-action-btn" style={{ flexDirection: "column", alignItems: "stretch" }}>
              <label style={{ fontSize: "0.8rem", opacity: 0.8 }}>Club Name</label>
              <input
                type="text"
                value={clubForm.name}
                onChange={(e) => handleClubChange("name", e.target.value)}
                style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(148,163,184,0.5)", background: "rgba(15,23,42,0.9)", color: "white" }}
              />
            </div>
            <div className="admin-action-btn" style={{ flexDirection: "column", alignItems: "stretch" }}>
              <label style={{ fontSize: "0.8rem", opacity: 0.8 }}>Type</label>
              <input
                type="text"
                value={clubForm.type}
                onChange={(e) => handleClubChange("type", e.target.value)}
                style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(148,163,184,0.5)", background: "rgba(15,23,42,0.9)", color: "white" }}
              />
            </div>
            <div className="admin-action-btn" style={{ flexDirection: "column", alignItems: "stretch" }}>
              <label style={{ fontSize: "0.8rem", opacity: 0.8 }}>President Name</label>
              <input
                type="text"
                value={clubForm.presidentName}
                onChange={(e) => handleClubChange("presidentName", e.target.value)}
                style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(148,163,184,0.5)", background: "rgba(15,23,42,0.9)", color: "white" }}
              />
            </div>
            <div className="admin-action-btn" style={{ flexDirection: "column", alignItems: "stretch" }}>
              <label style={{ fontSize: "0.8rem", opacity: 0.8 }}>Contact Email</label>
              <input
                type="email"
                value={clubForm.contactEmail}
                onChange={(e) => handleClubChange("contactEmail", e.target.value)}
                style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(148,163,184,0.5)", background: "rgba(15,23,42,0.9)", color: "white" }}
              />
            </div>
            <div className="admin-action-btn" style={{ flexDirection: "column", alignItems: "stretch" }}>
              <label style={{ fontSize: "0.8rem", opacity: 0.8 }}>Capacity</label>
              <input
                type="number"
                value={clubForm.capacity}
                onChange={(e) => handleClubChange("capacity", e.target.value)}
                style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(148,163,184,0.5)", background: "rgba(15,23,42,0.9)", color: "white" }}
              />
            </div>
            <div className="admin-action-btn" style={{ flexDirection: "column", alignItems: "stretch" }}>
              <label style={{ fontSize: "0.8rem", opacity: 0.8 }}>Location</label>
              <input
                type="text"
                value={clubForm.location}
                onChange={(e) => handleClubChange("location", e.target.value)}
                style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(148,163,184,0.5)", background: "rgba(15,23,42,0.9)", color: "white" }}
              />
            </div>
            <div className="admin-action-btn" style={{ flexDirection: "column", alignItems: "stretch", gridColumn: "1 / -1" }}>
              <label style={{ fontSize: "0.8rem", opacity: 0.8 }}>Description</label>
              <textarea
                value={clubForm.description}
                onChange={(e) => handleClubChange("description", e.target.value)}
                style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(148,163,184,0.5)", background: "rgba(15,23,42,0.9)", color: "white", minHeight: 60, resize: "vertical" }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gridColumn: "1 / -1" }}>
              <button
                type="submit"
                className="dashboard-nav-logout"
                disabled={creatingClub}
              >
                {creatingClub ? "Creating..." : "Create Club"}
              </button>
            </div>
          </form>
        </section>

        <section className="admin-section">
          <h2>Recent Events</h2>
          <ul className="admin-activity-list">
            {stats.recentEvents?.length > 0 ? (
              stats.recentEvents.map((e) => (
                <li key={e.id}>
                  <span className="activity-icon" />
                  {e.name} • {e.clubName}
                  <span className="activity-date">
                    {new Date(e.date).toLocaleDateString("en-US")}
                  </span>
                </li>
              ))
            ) : (
              <li>No events yet</li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
