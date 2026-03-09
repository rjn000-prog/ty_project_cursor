import { useEffect, useState } from "react";
import { getStudentDashboard } from "../../services/studentService";
import "../dashboard/StudentDashboard.css";

export default function StudentTournaments() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getStudentDashboard()
      .then((res) => setData(res))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="student-dashboard">
        <div className="student-dashboard-container">
          <div className="dashboard-loader">Loading tournaments...</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="student-dashboard">
        <div className="student-dashboard-container">
          <div className="dashboard-loader">Failed to load tournaments</div>
        </div>
      </div>
    );
  }

  const tournaments = data.tournaments || [];
  const matches = data.matches || [];

  return (
    <div className="student-dashboard">
      <div className="student-dashboard-container">
        <div className="dashboard-hero">
          <h1>Tournaments & Matches</h1>
          <p className="dashboard-hero-subtitle">
            See upcoming tournaments, levels, schedules and results.
          </p>
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
          <h2>Match Schedule & Results</h2>
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
      </div>
    </div>
  );
}

