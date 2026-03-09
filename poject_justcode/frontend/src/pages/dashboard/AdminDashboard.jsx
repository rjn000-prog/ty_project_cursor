import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleAddClub = () => {
    navigate("/admin/clubs/add"); // ✅ MATCHES ROUTE
  };

  return (
    <div className="admin-dashboard">
      {/* HEADER */}
      <header className="admin-header">
        <div>
          <h1>Admin Dashboard 🛠️</h1>
          <p>Sports Sphere Management Panel</p>
        </div>
        <button className="admin-logout" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* STATS */}
      <section className="admin-stats">
        <div className="admin-card">
          <h3>📅 Total Events</h3>
          <p>12</p>
        </div>
        <div className="admin-card">
          <h3>⏳ Pending Registrations</h3>
          <p>38</p>
        </div>
        <div className="admin-card">
          <h3>🏫 Active Clubs</h3>
          <p>9</p>
        </div>
        <div className="admin-card">
          <h3>🏆 Matches Scheduled</h3>
          <p>6</p>
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="admin-actions">
        <h2>Quick Actions</h2>
        <div className="action-grid">
          <button onClick={handleAddClub}>Add New Club</button>
          <button>Approve Registrations</button>
          <button>Upload Match Results</button>
          <button>Post Announcement</button>
        </div>
      </section>

      {/* ACTIVITY */}
      <section className="admin-activity">
        <h2>Recent Activity</h2>
        <ul>
          <li>✔ Cricket Tournament created</li>
          <li>✔ 5 registrations approved</li>
          <li>✔ Football match result uploaded</li>
          <li>✔ Announcement posted</li>
        </ul>
      </section>
    </div>
  );
}
