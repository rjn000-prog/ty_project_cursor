import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStudentDashboard, registerForSport } from "../../services/studentService";
import Sidebar from "../../components/layout/Sidebar";
import "../../components/layout/layout.css";
import "./StudentDashboard.css";

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = () => {
    setLoading(true);
    getStudentDashboard()
      .then((res) => setData(res))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="app-with-sidebar">
        <Sidebar />
        <main className="main-content">
          <div className="student-dashboard">
            <div className="student-dashboard-container">
              <div className="dashboard-loader">Loading your dashboard...</div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="app-with-sidebar">
        <Sidebar />
        <main className="main-content">
          <div className="student-dashboard">
            <div className="student-dashboard-container">
              <div className="dashboard-loader">Failed to load dashboard</div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const registrations = data.registrations || [];
  const sportsRegistrations = data.sportsRegistrations || [];
  const sportsOverview = data.sportsOverview || [];
  const teams = data.teams || [];
  const tournaments = data.tournaments || [];
  const matches = data.matches || [];
  const performance = data.performance || {
    totalMatches: 0,
    wins: 0,
    losses: 0,
    sportsParticipationCount: 0,
    eventsAttended: 0,
    certificatesEarned: 0,
  };

  const total = registrations.length;
  const upcoming = registrations.filter(
    (r) => new Date(r.eventDate) >= new Date()
  ).length;
  const past = total - upcoming;

  const isRegistered = (s) =>
    ["registered", "approved", "Registered", "Approved"].includes(
      String(s || "").toLowerCase()
    );

  return (
    <div className="app-with-sidebar">
      <Sidebar />
      <main className="main-content">
        <div className="student-dashboard">
          <div className="student-dashboard-container">
            <div className="dashboard-hero animate-fade-up">
              <p className="dashboard-hero-subtitle">
                {data.student?.department} • Year {data.student?.year}
              </p>
              <h1>Welcome, {data.student?.name || "Student"}</h1>
            </div>

            <div className="dashboard-stats animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <div className="dashboard-stat-card dashboard-stat-card--premium hover-lift">
                <div className="dashboard-stat-icon">🎓</div>
                <div className="dashboard-stat-info">
                  <h3>Events Attended</h3>
                  <div className="dashboard-stat-value">{performance.eventsAttended || 0}</div>
                </div>
              </div>
              <div className="dashboard-stat-card dashboard-stat-card--premium hover-lift">
                <div className="dashboard-stat-icon">🏆</div>
                <div className="dashboard-stat-info">
                  <h3>Certificates Won</h3>
                  <div className="dashboard-stat-value">{performance.certificatesEarned || 0}</div>
                </div>
              </div>
              <div className="dashboard-stat-card dashboard-stat-card--premium hover-lift">
                <div className="dashboard-stat-icon">⚽</div>
                <div className="dashboard-stat-info">
                  <h3>Total Sports</h3>
                  <div className="dashboard-stat-value">{performance.sportsParticipationCount || 0}</div>
                </div>
              </div>
            </div>

            <div className="dashboard-stats-grid animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <div className="dashboard-stat-small hover-lift">
                <h3>Registered Events</h3>
                <div className="dashboard-stat-small-value">{total}</div>
              </div>
              <div className="dashboard-stat-small hover-lift">
                <h3>Upcoming</h3>
                <div className="dashboard-stat-small-value">{upcoming}</div>
              </div>
              <div className="dashboard-stat-small hover-lift">
                <h3>Matches Played</h3>
                <div className="dashboard-stat-small-value">{performance.totalMatches || 0}</div>
              </div>
            </div>

            <div className="dashboard-section animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <h2>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                My Registered Events
              </h2>

              {total === 0 ? (
                <div className="dashboard-empty">
                  <p>You haven't registered for any events yet.</p>
                  <Link to="/events" className="dashboard-hero-btn dashboard-hero-btn--primary">
                    Browse Events
                  </Link>
                </div>
              ) : (
                <table className="events-table">
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((r, i) => (
                      <tr key={i}>
                        <td>{r.eventName}</td>
                        <td>{new Date(r.eventDate).toLocaleDateString("en-US")}</td>
                        <td>
                          <span
                            className={`status-badge ${isRegistered(r.status) ? "registered" : "pending"
                              }`}
                          >
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="dashboard-section">
              <h2>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19V6l12-3v13"
                  />
                </svg>
                Sports Overview
              </h2>

              {sportsOverview.length === 0 ? (
                <div className="dashboard-empty">
                  <p>No sports configured yet.</p>
                </div>
              ) : (
                <table className="events-table">
                  <thead>
                    <tr>
                      <th>Sport</th>
                      <th>Teams</th>
                      <th>Registered</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {sportsOverview.map((s) => {
                      const reg = sportsRegistrations.find(
                        (r) => r.sportId === s.id
                      );
                      const status = reg?.status || "Not registered";

                      const handleRegisterClick = async () => {
                        if (reg) return;
                        try {
                          await registerForSport(s.id);
                          const refreshed = await getStudentDashboard();
                          setData(refreshed);
                        } catch (e) {
                          // eslint-disable-next-line no-alert
                          alert(
                            e.response?.data?.message ||
                            "Failed to register for sport."
                          );
                        }
                      };

                      return (
                        <tr key={s.id}>
                          <td>{s.name}</td>
                          <td>{s.teamsCount}</td>
                          <td>
                            <span className="status-badge">
                              {status}
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="dashboard-hero-btn dashboard-hero-btn--primary"
                              disabled={!!reg}
                              onClick={handleRegisterClick}
                            >
                              {reg ? "Registered" : "Register"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            <div className="dashboard-section">
              <h2>My Teams</h2>
              {teams.length === 0 ? (
                <div className="dashboard-empty">
                  <p>You are not part of any team yet.</p>
                </div>
              ) : (
                <table className="events-table">
                  <thead>
                    <tr>
                      <th>Team</th>
                      <th>Sport</th>
                      <th>Coach</th>
                      <th>Department</th>
                      <th>Members</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.map((t) => (
                      <tr key={t.id}>
                        <td>{t.name}</td>
                        <td>{t.sportName}</td>
                        <td>{t.coachName}</td>
                        <td>{t.departmentName}</td>
                        <td>{t.members.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="dashboard-section">
              <h2>Upcoming Tournaments</h2>
              {tournaments.length === 0 ? (
                <div className="dashboard-empty">
                  <p>No tournaments assigned to your sports yet.</p>
                </div>
              ) : (
                <table className="events-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Sport</th>
                      <th>Level</th>
                      <th>Start</th>
                      <th>End</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tournaments.map((t) => (
                      <tr key={t.id}>
                        <td>{t.name}</td>
                        <td>{t.sportName}</td>
                        <td>{t.level}</td>
                        <td>
                          {new Date(t.startDate).toLocaleDateString("en-US")}
                        </td>
                        <td>
                          {new Date(t.endDate).toLocaleDateString("en-US")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="dashboard-section">
              <h2>Matches</h2>
              {matches.length === 0 ? (
                <div className="dashboard-empty">
                  <p>No matches found for your teams yet.</p>
                </div>
              ) : (
                <table className="events-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Sport</th>
                      <th>Tournament</th>
                      <th>Teams</th>
                      <th>Venue</th>
                      <th>Status</th>
                      <th>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matches.map((m) => (
                      <tr key={m.id}>
                        <td>
                          {new Date(m.date).toLocaleDateString("en-US")}
                        </td>
                        <td>{m.sportName}</td>
                        <td>{m.tournamentName}</td>
                        <td>
                          {m.teamAName} vs {m.teamBName}
                        </td>
                        <td>{m.venue}</td>
                        <td>
                          <span className="status-badge">
                            {m.isUpcoming ? "Upcoming" : "Completed"}
                          </span>
                        </td>
                        <td>
                          {m.scoreA} - {m.scoreB}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="dashboard-section">
              <h2>Sports Performance</h2>
              <div className="dashboard-stats">
                <div className="dashboard-stat-card dashboard-stat-card--events">
                  <h3>Total Matches</h3>
                  <div className="dashboard-stat-value">
                    {performance.totalMatches || 0}
                  </div>
                </div>
                <div className="dashboard-stat-card dashboard-stat-card--clubs">
                  <h3>Wins</h3>
                  <div className="dashboard-stat-value">
                    {performance.wins || 0}
                  </div>
                </div>
                <div className="dashboard-stat-card dashboard-stat-card--registered">
                  <h3>Losses</h3>
                  <div className="dashboard-stat-value">
                    {performance.losses || 0}
                  </div>
                </div>
                <div className="dashboard-stat-card dashboard-stat-card--events">
                  <h3>Sports Participating</h3>
                  <div className="dashboard-stat-value">
                    {performance.sportsParticipationCount || 0}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
