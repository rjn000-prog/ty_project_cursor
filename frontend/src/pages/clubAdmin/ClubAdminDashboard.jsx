import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getClubAdminDashboard,
  getClubAdminAnalytics,
} from "../../services/clubAdminService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import * as XLSX from "xlsx";
import "../dashboard/ClubAdminDashboard.css";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function ClubAdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  const exportToExcel = () => {
    if (!analytics?.clubs) return;

    const ws = XLSX.utils.json_to_sheet(analytics.clubs.map(c => ({
      "Club Name": c.clubName,
      "Type": c.type,
      "Total Members": c.members,
      "Total Events": c.events,
      "Total Registrations": c.registrations
    })));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Club Analytics");
    XLSX.writeFile(wb, "Club_Admin_Report.xlsx");
  };

  useEffect(() => {
    Promise.all([getClubAdminDashboard(), getClubAdminAnalytics()])
      .then(([dash, a]) => {
        setDashboard(dash);
        setAnalytics(a);
      })
      .catch(() => {
        setDashboard(null);
        setAnalytics(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="club-admin-dashboard">
        <div className="club-admin-dashboard-container">
          <div className="admin-loader">Loading club admin dashboard...</div>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="club-admin-dashboard">
        <div className="club-admin-dashboard-container">
          <div className="admin-loader">Failed to load club admin dashboard</div>
        </div>
      </div>
    );
  }

  const stats = dashboard.stats || {};
  const clubs = analytics?.clubs || [];

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
          <button
            type="button"
            className="dashboard-nav-logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="club-admin-dashboard-container">
        <header className="club-admin-header">
          <div className="club-admin-header-title">
            <h1>Club Admin (GS)</h1>
            <p>Manage all clubs, events, registrations, and forms</p>
          </div>
          <div className="club-admin-header-meta">
            <div className="header-stat-pill">
              <span className="pill-label">Clubs</span>
              <span className="pill-value">{stats.totalClubs || 0}</span>
            </div>
            <div className="header-stat-pill">
              <span className="pill-label">Events</span>
              <span className="pill-value">{stats.totalEvents || 0}</span>
            </div>
            <div className="header-stat-pill">
              <span className="pill-label">News</span>
              <span className="pill-value">{analytics?.summary?.totalNews || 0}</span>
            </div>
            <div className="header-stat-pill">
              <span className="pill-label">Gallery</span>
              <span className="pill-value">{analytics?.summary?.totalGallery || 0}</span>
            </div>
          </div>
        </header>

        {/* --- PERFORMANCE GRID --- */}
        <div className="club-admin-grid">
          <section className="club-admin-card">
            <div className="club-admin-section-title">
              <h2>Top Performing Events</h2>
              <span className="club-admin-badge">Popularity</span>
            </div>
            <div className="admin-recent-list" style={{ marginTop: '20px' }}>
              {(analytics?.topEvents || []).map((e, idx) => (
                <div className="admin-recent-item" key={idx}>
                  <div className="recent-item-info">
                    <h3>{e.name}</h3>
                    <p>{e.club} • {e.registrations} Registrations</p>
                  </div>
                  <div className="item-trend-stat">
                    <span>Rank #{idx + 1}</span>
                  </div>
                </div>
              ))}
              {analytics?.topEvents?.length === 0 && (
                <div className="club-admin-empty">No registration data yet.</div>
              )}
            </div>
          </section>

          <section className="club-admin-card">
            <div className="club-admin-section-title">
              <h2>Registration Trends</h2>
              <span className="club-admin-badge">Weekly</span>
            </div>
            <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
              <ResponsiveContainer>
                <LineChart data={analytics?.trends || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(val) => val.split("-").slice(1).join("/")}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#6366f1" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        {/* --- DISTRIBUTION GRID --- */}
        <div className="club-admin-grid">
          <section className="club-admin-card">
            <div className="club-admin-section-title">
              <h2>Club Categories</h2>
              <span className="club-admin-badge">Diversity</span>
            </div>
            <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={analytics?.clubDistribution || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {(analytics?.clubDistribution || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="club-admin-card">
            <div className="club-admin-section-title">
              <h2>Event Types</h2>
              <span className="club-admin-pill">Breakdown</span>
            </div>
            <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={analytics?.eventDistribution || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {(analytics?.eventDistribution || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        {/* --- DETAILED DATA --- */}
        <section className="club-admin-card">
          <div className="club-admin-header-actions" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="club-admin-section-title" style={{ margin: 0 }}>
              <h2>Detailed Analytics</h2>
              <span className="club-admin-pill">By Club</span>
            </div>
            <button onClick={exportToExcel} className="club-admin-button club-admin-button--primary">
              📥 Export to Excel
            </button>
          </div>
          {clubs.length === 0 ? (
            <div className="club-admin-empty">No clubs found.</div>
          ) : (
            <div className="club-admin-members-table-wrapper">
              <table className="club-admin-members-table">
                <thead>
                  <tr>
                    <th>Club</th>
                    <th>Members</th>
                    <th>Events</th>
                    <th>Registrations</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {clubs.map((c) => (
                    <tr key={c.clubId}>
                      <td>{c.clubName}</td>
                      <td>{c.members}</td>
                      <td>{c.events}</td>
                      <td>{c.registrations}</td>
                      <td>
                        <Link to={`/club-admin/clubs/${c.clubId}`} className="club-admin-button club-admin-button--ghost">
                          Open
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* --- RECENT ACTIVITIES (MOVED TO BOTTOM) --- */}
        <section className="club-admin-card">
          <div className="club-admin-section-title">
            <h2>Upcoming Activities</h2>
            <span className="club-admin-badge">Schedule</span>
          </div>
          {dashboard.recentEvents?.length ? (
            <div className="admin-recent-list">
              {dashboard.recentEvents.map((e) => (
                <div className="admin-recent-item" key={e.id}>
                  <div className="recent-item-info">
                    <h3>{e.name}</h3>
                    <p>{e.clubName} • {new Date(e.date).toLocaleDateString()}</p>
                  </div>
                  <Link to={`/club-admin/events/${e.id}`} className="view-link-btn">
                    Manage →
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="club-admin-empty">No upcoming events.</div>
          )}
        </section>
      </div>
    </div>
  );
}

