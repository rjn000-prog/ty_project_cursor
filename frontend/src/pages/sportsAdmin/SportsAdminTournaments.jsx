import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  listSports,
  listTournaments,
  createTournament,
  updateTournament,
  deleteTournament,
} from "../../services/sportsAdminService";
import "../dashboard/ClubAdminDashboard.css";

export default function SportsAdminTournaments() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sports, setSports] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [sportFilter, setSportFilter] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    sportId: "",
    name: "",
    level: "",
    startDate: "",
    endDate: "",
  });

  const load = (sportId) => {
    setLoading(true);
    Promise.all([
      sports.length ? Promise.resolve(sports) : listSports(),
      listTournaments(sportId ? { sportId } : {}),
    ])
      .then(([s, t]) => {
        if (!sports.length) setSports(Array.isArray(s) ? s : []);
        setTournaments(Array.isArray(t) ? t : []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load(sportFilter ? Number(sportFilter) : undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sportFilter]);

  const startEdit = (t) => {
    setEditingId(t.id);
    setForm({
      sportId: t.sportId,
      name: t.name,
      level: t.level,
      startDate: t.startDate.slice(0, 10),
      endDate: t.endDate.slice(0, 10),
    });
  };

  const clearForm = () => {
    setEditingId(null);
    setForm({
      sportId: "",
      name: "",
      level: "",
      startDate: "",
      endDate: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.sportId ||
      !form.name ||
      !form.level ||
      !form.startDate ||
      !form.endDate
    )
      return;
    setSaving(true);
    try {
      if (editingId) {
        await updateTournament(editingId, {
          name: form.name,
          level: form.level,
          startDate: form.startDate,
          endDate: form.endDate,
        });
      } else {
        await createTournament({
          sportId: Number(form.sportId),
          name: form.name,
          level: form.level,
          startDate: form.startDate,
          endDate: form.endDate,
        });
      }
      clearForm();
      load(sportFilter ? Number(sportFilter) : undefined);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Delete this tournament? This will also delete its matches."
      )
    )
      return;
    try {
      await deleteTournament(id);
      load(sportFilter ? Number(sportFilter) : undefined);
    } catch {
      // ignore
    }
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="club-admin-dashboard">

      <div className="club-admin-dashboard-container">
        <header className="club-admin-header">
          <div className="club-admin-header-title">
            <h1>Championships & Tournaments</h1>
            <p>Define competitive tiers and scheduling for sports events</p>
          </div>
          <div className="club-admin-header-actions">
            <div className="header-stat-pill">
              <span className="pill-label">Active Discipline</span>
              <select
                value={sportFilter}
                onChange={(e) => setSportFilter(e.target.value)}
                className="club-admin-form select"
                style={{ padding: '0.4rem 2rem 0.4rem 1rem', fontSize: '0.85rem', width: '200px', background: 'rgba(255,255,255,0.05)' }}
              >
                <option value="">All Sports</option>
                {sports.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </header>

        <section className="club-admin-card">
          <div className="club-admin-section-title">
            <h2>{editingId ? "Refine Tournament Details" : "New Tournament Calibration"}</h2>
            <span className="club-admin-pill">Event Setup</span>
          </div>
          <form className="club-admin-form" onSubmit={handleSubmit}>
            <div className="club-admin-form-group">
              <label>Target Discipline</label>
              <select
                value={form.sportId}
                onChange={(e) =>
                  setForm((p) => ({ ...p, sportId: e.target.value }))
                }
                required
                disabled={!!editingId}
              >
                <option value="">Select a sport...</option>
                {sports.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="club-admin-form-group">
              <label>Official Tournament Name</label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="e.g. Annual Inter-Dept Cup"
                required
              />
            </div>
            <div className="club-admin-form-group">
              <label>Competitive Tier</label>
              <select
                value={form.level}
                onChange={(e) =>
                  setForm((p) => ({ ...p, level: e.target.value }))
                }
                required
              >
                <option value="">Select level...</option>
                <option value="Inter-department">Inter-departmental</option>
                <option value="Inter-college">Inter-collier</option>
                <option value="University">University Level</option>
              </select>
            </div>
            <div className="club-admin-form-group">
              <label>Commencement Date</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm((p) => ({ ...p, startDate: e.target.value }))
                }
                required
              />
            </div>
            <div className="club-admin-form-group">
              <label>Conclusion Date</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) =>
                  setForm((p) => ({ ...p, endDate: e.target.value }))
                }
                required
              />
            </div>
            <div
              className="club-admin-actions"
              style={{ gridColumn: "1 / -1", borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}
            >
              <button
                type="submit"
                className="club-admin-button club-admin-button--primary"
                disabled={saving}
              >
                {saving
                  ? "Processing..."
                  : editingId
                    ? "Update Tournament"
                    : "Launch Tournament"}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="club-admin-button club-admin-button--ghost"
                  onClick={clearForm}
                  disabled={saving}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="club-admin-card">
          <div className="club-admin-section-title">
            <h2>Active Championships</h2>
            <span className="club-admin-pill">{tournaments.length} Loaded</span>
          </div>
          {loading ? (
            <div className="admin-loader-mini">Synchronizing tournament ledger...</div>
          ) : tournaments.length === 0 ? (
            <div className="club-admin-empty">No tournaments scheduled in this discipline.</div>
          ) : (
            <div className="club-admin-members-table-wrapper">
              <table className="club-admin-members-table">
                <thead>
                  <tr>
                    <th>Tournament</th>
                    <th>Discipline</th>
                    <th>Tier</th>
                    <th>Timeline</th>
                    <th style={{ textAlign: 'center' }}>Bracket</th>
                    <th style={{ textAlign: 'right' }}>Management</th>
                  </tr>
                </thead>
                <tbody>
                  {tournaments.map((t) => (
                    <tr key={t.id}>
                      <td style={{ fontWeight: 700, color: '#fff' }}>{t.name}</td>
                      <td>
                        <span className="club-admin-pill" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--clr-accent)' }}>
                          {t.sportName}
                        </span>
                      </td>
                      <td>{t.level}</td>
                      <td style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                        {new Date(t.startDate).toLocaleDateString("en-US", { month: 'short', day: 'numeric' })} - {new Date(t.endDate).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className="club-admin-pill" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#4ade80', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                          {t.matchesCount} Matches
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="admin-actions-mini" style={{ justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            className="action-btn-approve"
                            title="Edit Tournament"
                            onClick={() => startEdit(t)}
                          >
                            ✎
                          </button>
                          <button
                            type="button"
                            className="action-btn-reject"
                            title="Delete Tournament"
                            onClick={() => handleDelete(t.id)}
                          >
                            🗑
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

