import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getSportsAdminDashboard,
  getSportsAnalytics,
} from "../../services/sportsAdminService";
import "../dashboard/ClubAdminDashboard.css";

export default function SportsAdminDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getSportsAdminDashboard(), getSportsAnalytics()])
      .then(([dash, a]) => {
        setData(dash);
        setAnalytics(a);
      })
      .catch(() => {
        setData(null);
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
          <div className="admin-loader">Loading sports admin dashboard...</div>
        </div>
      </div>
    );
  }

  const stats = data || {
    totalSports: 0,
    totalTeams: 0,
    totalTournaments: 0,
    totalMatches: 0,
    totalSportsRegistrations: 0,
    pendingSportsRegistrations: 0,
    recentTournaments: [],
  };

  const analyticsSports = analytics?.sports || [];

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="club-admin-dashboard">

      <div className="club-admin-dashboard-container">
        <header className="club-admin-header">
          <div className="club-admin-header-title">
            <h1>Command Centre</h1>
            <p>High-level orchestration of sports disciplines and student athletics</p>
          </div>
          <div className="club-admin-header-actions">
            <div className="header-stat-pill">
              <span className="pill-label">Total Disciplines</span>
              <span className="pill-value">{stats.totalSports || 0}</span>
            </div>
            <div className="header-stat-pill">
              <span className="pill-label">Active Teams</span>
              <span className="pill-value">{stats.totalTeams || 0}</span>
            </div>
          </div>
        </header>

        <div className="club-admin-grid">
          <section className="club-admin-card">
            <div className="club-admin-section-title">
              <h2>Athletic Oversight</h2>
              <span className="club-admin-pill">System Pulse</span>
            </div>

            <div className="dashboard-stats-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: '1.25rem',
              margin: '1.5rem 0'
            }}>
              <div className="stat-box" style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Disciplines</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--clr-accent)' }}>{stats.totalSports || 0}</div>
              </div>
              <div className="stat-box" style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Cadre Size</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>{stats.totalTeams || 0}</div>
              </div>
              <div className="stat-box" style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Championships</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>{stats.totalTournaments || 0}</div>
              </div>
              <div className="stat-box" style={{ background: 'rgba(34, 197, 94, 0.05)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(34, 197, 94, 0.1)' }}>
                <div style={{ color: '#4ade80', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Registrations</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>{stats.totalSportsRegistrations || 0}</div>
                <div style={{ fontSize: '0.7rem', color: '#4ade80', marginTop: '4px' }}>{stats.pendingSportsRegistrations || 0} Pending</div>
              </div>
            </div>

            <div
              className="club-admin-actions"
              style={{ justifyContent: "flex-start", gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}
            >
              <Link
                to="/sports-admin/registrations"
                className="club-admin-button club-admin-button--primary"
              >
                Authorize Candidates
              </Link>
              <Link
                to="/sports-admin/matches"
                className="club-admin-button club-admin-button--ghost"
              >
                Sync Scoreboards
              </Link>
            </div>
          </section>

          <section className="club-admin-card">
            <div className="club-admin-section-title">
              <h2>Tournament Timeline</h2>
              <span className="club-admin-pill">Live Calendar</span>
            </div>
            {stats.recentTournaments?.length ? (
              <div className="admin-activity-list">
                {stats.recentTournaments.map((t) => (
                  <div key={t.id} className="activity-item" style={{
                    padding: '1rem',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.02)',
                    marginBottom: '0.75rem',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <strong style={{ color: '#fff' }}>{t.name}</strong>
                      <span className="club-admin-pill" style={{ fontSize: '0.7rem', height: 'fit-content' }}>{t.sportName}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                      Commenced: {new Date(t.startDate).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="club-admin-empty">No active championships scheduled.</div>
            )}
          </section>
        </div>

        <section className="club-admin-card">
          <div className="club-admin-section-title">
            <h2>Performance Intelligence</h2>
            <span className="club-admin-pill">Metric Breakdown</span>
          </div>
          {analyticsSports.length === 0 ? (
            <div className="club-admin-empty">Intelligence modules synchronizing...</div>
          ) : (
            <div className="club-admin-members-table-wrapper">
              <table className="club-admin-members-table">
                <thead>
                  <tr>
                    <th>Discipline</th>
                    <th style={{ textAlign: 'center' }}>Squads</th>
                    <th style={{ textAlign: 'center' }}>Events</th>
                    <th style={{ textAlign: 'center' }}>Fixtures</th>
                    <th style={{ textAlign: 'center' }}>Candidates</th>
                    <th style={{ textAlign: 'right' }}>Management</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsSports.map((s) => (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 700, color: '#fff' }}>{s.name}</td>
                      <td style={{ textAlign: 'center' }}>{s.teams}</td>
                      <td style={{ textAlign: 'center' }}>{s.tournaments}</td>
                      <td style={{ textAlign: 'center' }}>{s.matches}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span className="club-admin-pill" style={{ background: 'rgba(255,255,255,0.05)' }}>{s.registrations}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <Link to={`/sports-admin/teams?sport=${s.id}`} className="club-admin-button--ghost" style={{ fontSize: '0.75rem', textDecoration: 'none', color: 'var(--clr-accent)' }}>
                          View Details →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

