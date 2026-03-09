import { useEffect, useState } from "react";
import { getStudentDashboard, registerForSport } from "../../services/studentService";
import "../dashboard/StudentDashboard.css";

export default function StudentSports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState(null);

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
          <div className="dashboard-loader">Loading sports...</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="student-dashboard">
        <div className="student-dashboard-container">
          <div className="dashboard-loader">Failed to load sports</div>
        </div>
      </div>
    );
  }

  const sportsOverview = data.sportsOverview || [];
  const sportsRegistrations = data.sportsRegistrations || [];

  const getRegistrationForSport = (sportId) =>
    sportsRegistrations.find((r) => r.sportId === sportId);

  const handleRegister = async (sportId) => {
    const existing = getRegistrationForSport(sportId);
    if (existing) return;
    setRegisteringId(sportId);
    try {
      await registerForSport(sportId);
      const refreshed = await getStudentDashboard();
      setData(refreshed);
    } catch (e) {
      // eslint-disable-next-line no-alert
      alert(
        e.response?.data?.message ||
        "Failed to register for this sport. Please try again."
      );
    } finally {
      setRegisteringId(null);
    }
  };

  return (
    <div className="student-dashboard">
      <div className="student-dashboard-container">
        <div className="dashboard-hero">
          <h1>Sports</h1>
          <p className="dashboard-hero-subtitle">
            Browse all available sports and manage your registrations.
          </p>
        </div>

        {sportsOverview.length === 0 ? (
          <div className="dashboard-empty">
            <p>No sports configured yet.</p>
          </div>
        ) : (
          <div className="sports-cards-grid">
            {sportsOverview.map((s) => {
              const reg = getRegistrationForSport(s.id);
              const status =
                reg?.status || (s.isRegistered ? "Registered" : "Not registered");

              return (
                <div className="sport-reg-card" key={s.id}>
                  <div className="sport-reg-header">
                    <h3>{s.name}</h3>
                    <div className={`status-badge status-${status.toLowerCase().replace(' ', '-')}`}>
                      {status}
                    </div>
                  </div>

                  <div className="sport-reg-body">
                    <div className="sport-reg-info">
                      <strong>Teams:</strong> <span>{s.teamsCount}</span>
                    </div>
                  </div>

                  <div className="sport-reg-footer">
                    <button
                      type="button"
                      className="dashboard-hero-btn dashboard-hero-btn--primary"
                      disabled={!!reg || registeringId === s.id}
                      onClick={() => handleRegister(s.id)}
                    >
                      {reg || s.isRegistered
                        ? "Registered"
                        : registeringId === s.id
                          ? "Registering..."
                          : "Register"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

