import { useEffect, useState } from "react";
import { getStudentDashboard } from "../../services/studentService";
import "../dashboard/StudentDashboard.css";

export default function StudentTeams() {
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
          <div className="dashboard-loader">Loading teams...</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="student-dashboard">
        <div className="student-dashboard-container">
          <div className="dashboard-loader">Failed to load teams</div>
        </div>
      </div>
    );
  }

  const teams = data.teams || [];

  return (
    <div className="student-dashboard">
      <div className="student-dashboard-container">
        <div className="dashboard-hero">
          <h1>My Teams</h1>
          <p className="dashboard-hero-subtitle">
            View details of the sports teams you are part of.
          </p>
        </div>

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
    </div>
  );
}

