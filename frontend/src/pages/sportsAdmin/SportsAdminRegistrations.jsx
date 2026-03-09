import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  listSports,
  listSportsRegistrations,
  updateSportsRegistrationStatus,
} from "../../services/sportsAdminService";
import "../dashboard/ClubAdminDashboard.css";

export default function SportsAdminRegistrations() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sports, setSports] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [sportFilter, setSportFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const load = async (filters = {}) => {
    setLoading(true);
    try {
      const [s, regs] = await Promise.all([
        sports.length ? Promise.resolve(sports) : listSports(),
        listSportsRegistrations(filters),
      ]);
      if (!sports.length) setSports(Array.isArray(s) ? s : []);
      setRegistrations(Array.isArray(regs) ? regs : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const filters = {};
    if (sportFilter) filters.sportId = Number(sportFilter);
    if (statusFilter) filters.status = statusFilter;
    load(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sportFilter, statusFilter]);

  const handleUpdateStatus = async (id, status) => {
    setSaving(true);
    try {
      await updateSportsRegistrationStatus(id, status);
      const filters = {};
      if (sportFilter) filters.sportId = Number(sportFilter);
      if (statusFilter) filters.status = statusFilter;
      await load(filters);
    } finally {
      setSaving(false);
    }
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="club-admin-dashboard">

      <div className="club-admin-dashboard-container">
        <header className="club-admin-header">
          <div className="club-admin-header-title">
            <h1>Candidate Registrations</h1>
            <p>Review and authorize student participations in athletic programs</p>
          </div>
          <div className="club-admin-header-actions" style={{ gap: '1rem' }}>
            <div className="header-stat-pill">
              <span className="pill-label">Discipline</span>
              <select
                value={sportFilter}
                onChange={(e) => setSportFilter(e.target.value)}
                className="club-admin-form select"
                style={{ padding: '0.4rem 2rem 0.4rem 1rem', fontSize: '0.85rem', width: '160px', background: 'rgba(255,255,255,0.05)' }}
              >
                <option value="">All Sports</option>
                {sports.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="header-stat-pill">
              <span className="pill-label">Status</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="club-admin-form select"
                style={{ padding: '0.4rem 2rem 0.4rem 1rem', fontSize: '0.85rem', width: '140px', background: 'rgba(255,255,255,0.05)' }}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending Review</option>
                <option value="approved">Authorized</option>
                <option value="rejected">Declined</option>
              </select>
            </div>
          </div>
        </header>

        <section className="club-admin-card">
          <div className="club-admin-section-title">
            <h2>Registration Ledger</h2>
            <span className="club-admin-pill">{registrations.length} Applications</span>
          </div>
          {loading ? (
            <div className="admin-loader-mini">Synchronizing candidate database...</div>
          ) : registrations.length === 0 ? (
            <div className="club-admin-empty">No registration records found for these criteria.</div>
          ) : (
            <div className="club-admin-members-table-wrapper">
              <table className="club-admin-members-table">
                <thead>
                  <tr>
                    <th>Student Identity</th>
                    <th>Sports Discipline</th>
                    <th>Roll Number</th>
                    <th>Academic Year</th>
                    <th style={{ textAlign: 'center' }}>Status</th>
                    <th style={{ textAlign: 'right' }}>Authorization</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: '#fff' }}>{r.student.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Application ID: SPR-{r.id.toString().padStart(4, '0')}</div>
                      </td>
                      <td>
                        <span className="club-admin-pill" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--clr-accent)' }}>
                          {r.sportName}
                        </span>
                      </td>
                      <td style={{ fontFamily: 'monospace', letterSpacing: '1px' }}>{r.student.rollNo}</td>
                      <td>Year {r.student.year}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span
                          className={`club-admin-pill ${r.status === "approved"
                            ? "sentiment-positive"
                            : r.status === "rejected"
                              ? "sentiment-negative"
                              : "sentiment-neutral"
                            }`}
                          style={{ minWidth: '90px', textAlign: 'center' }}
                        >
                          {r.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="admin-actions-mini" style={{ justifyContent: 'flex-end', gap: '8px' }}>
                          <button
                            type="button"
                            className="action-btn-approve"
                            title="Approve Candidate"
                            disabled={saving || r.status === 'approved'}
                            onClick={() => handleUpdateStatus(r.id, "approved")}
                            style={{ opacity: r.status === 'approved' ? 0.3 : 1 }}
                          >
                            ✓
                          </button>
                          <button
                            type="button"
                            className="action-btn-reject"
                            title="Reject Candidate"
                            disabled={saving || r.status === 'rejected'}
                            onClick={() => handleUpdateStatus(r.id, "rejected")}
                            style={{ opacity: r.status === 'rejected' ? 0.3 : 1 }}
                          >
                            ✕
                          </button>
                        </div>
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

