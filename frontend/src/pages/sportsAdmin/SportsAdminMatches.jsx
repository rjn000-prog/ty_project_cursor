import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  listSports,
  listTournaments,
  listTeams,
  listMatches,
  createMatch,
  updateMatch,
  deleteMatch,
} from "../../services/sportsAdminService";
import "../dashboard/ClubAdminDashboard.css";

export default function SportsAdminMatches() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sports, setSports] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [tournamentFilter, setTournamentFilter] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    tournamentId: "",
    teamAId: "",
    teamBId: "",
    date: "",
    venue: "",
    scoreA: "",
    scoreB: "",
  });

  const loadBase = async () => {
    const [s, t, teamsData] = await Promise.all([
      listSports(),
      listTournaments(),
      listTeams(),
    ]);
    setSports(Array.isArray(s) ? s : []);
    setTournaments(Array.isArray(t) ? t : []);
    setTeams(Array.isArray(teamsData) ? teamsData : []);
  };

  const loadMatches = async (tournamentId) => {
    const data = await listMatches(
      tournamentId ? { tournamentId } : undefined
    );
    setMatches(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        await loadBase();
        await loadMatches();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    loadMatches(tournamentFilter ? Number(tournamentFilter) : undefined);
  }, [tournamentFilter]);

  const tournamentsBySport = tournaments;

  const startEdit = (m) => {
    setEditingId(m.id);
    setForm({
      tournamentId: m.tournamentId,
      teamAId: m.teamAId,
      teamBId: m.teamBId,
      date: m.date.slice(0, 10),
      venue: m.venue,
      scoreA: m.scoreA,
      scoreB: m.scoreB,
    });
  };

  const clearForm = () => {
    setEditingId(null);
    setForm({
      tournamentId: "",
      teamAId: "",
      teamBId: "",
      date: "",
      venue: "",
      scoreA: "",
      scoreB: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.tournamentId ||
      !form.teamAId ||
      !form.teamBId ||
      !form.date ||
      !form.venue
    )
      return;
    setSaving(true);
    try {
      if (editingId) {
        await updateMatch(editingId, {
          date: form.date,
          venue: form.venue,
          scoreA: form.scoreA === "" ? undefined : Number(form.scoreA),
          scoreB: form.scoreB === "" ? undefined : Number(form.scoreB),
        });
      } else {
        await createMatch({
          tournamentId: Number(form.tournamentId),
          teamAId: Number(form.teamAId),
          teamBId: Number(form.teamBId),
          date: form.date,
          venue: form.venue,
          scoreA: form.scoreA === "" ? undefined : Number(form.scoreA),
          scoreB: form.scoreB === "" ? undefined : Number(form.scoreB),
        });
      }
      clearForm();
      loadMatches(tournamentFilter ? Number(tournamentFilter) : undefined);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this match?")) return;
    try {
      await deleteMatch(id);
      loadMatches(tournamentFilter ? Number(tournamentFilter) : undefined);
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
            <h1>Match Scheduling & Scoring</h1>
            <p>Coordinate fixtures and maintain real-time scoreboards</p>
          </div>
          <div className="club-admin-header-actions">
            <div className="header-stat-pill">
              <span className="pill-label">Filter Tournament</span>
              <select
                value={tournamentFilter}
                onChange={(e) => setTournamentFilter(e.target.value)}
                className="club-admin-form select"
                style={{ padding: '0.4rem 2rem 0.4rem 1rem', fontSize: '0.85rem', width: '220px', background: 'rgba(255,255,255,0.05)' }}
              >
                <option value="">All Championships</option>
                {tournamentsBySport.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.sportName})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </header>

        <section className="club-admin-card">
          <div className="club-admin-section-title">
            <h2>{editingId ? "Update Fixture & Score" : "New Match Configuration"}</h2>
            <span className="club-admin-pill">Fixture Setup</span>
          </div>
          <form className="club-admin-form" onSubmit={handleSubmit}>
            <div className="club-admin-form-group">
              <label>Parent Tournament</label>
              <select
                value={form.tournamentId}
                onChange={(e) =>
                  setForm((p) => ({ ...p, tournamentId: e.target.value }))
                }
                required
                disabled={!!editingId}
              >
                <option value="">Select tournament...</option>
                {tournamentsBySport.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.sportName})
                  </option>
                ))}
              </select>
            </div>
            <div className="club-admin-form-group">
              <label>Home Team (A)</label>
              <select
                value={form.teamAId}
                onChange={(e) =>
                  setForm((p) => ({ ...p, teamAId: e.target.value }))
                }
                required
                disabled={!!editingId}
              >
                <option value="">Select team...</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.sportName})
                  </option>
                ))}
              </select>
            </div>
            <div className="club-admin-form-group">
              <label>Away Team (B)</label>
              <select
                value={form.teamBId}
                onChange={(e) =>
                  setForm((p) => ({ ...p, teamBId: e.target.value }))
                }
                required
                disabled={!!editingId}
              >
                <option value="">Select team...</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.sportName})
                  </option>
                ))}
              </select>
            </div>
            <div className="club-admin-form-group">
              <label>Scheduled Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((p) => ({ ...p, date: e.target.value }))
                }
                required
              />
            </div>
            <div className="club-admin-form-group">
              <label>Arena / Venue</label>
              <input
                value={form.venue}
                onChange={(e) =>
                  setForm((p) => ({ ...p, venue: e.target.value }))
                }
                placeholder="e.g. Main Stadium, Court 1"
                required
              />
            </div>
            <div className="club-admin-form-group">
              <label>Current Score (Team A)</label>
              <input
                type="number"
                value={form.scoreA}
                onChange={(e) =>
                  setForm((p) => ({ ...p, scoreA: e.target.value }))
                }
                placeholder="0"
              />
            </div>
            <div className="club-admin-form-group">
              <label>Current Score (Team B)</label>
              <input
                type="number"
                value={form.scoreB}
                onChange={(e) =>
                  setForm((p) => ({ ...p, scoreB: e.target.value }))
                }
                placeholder="0"
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
                    ? "Update Fixture"
                    : "Confirm Schedule"}
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
            <h2>Fixture Ledger</h2>
            <span className="club-admin-pill">{matches.length} Scheduled</span>
          </div>
          {loading ? (
            <div className="admin-loader-mini">Synchronizing match data...</div>
          ) : matches.length === 0 ? (
            <div className="club-admin-empty">No fixtures registered.</div>
          ) : (
            <div className="club-admin-members-table-wrapper">
              <table className="club-admin-members-table">
                <thead>
                  <tr>
                    <th>Timeline</th>
                    <th>Fixture Detail</th>
                    <th>Arena</th>
                    <th style={{ textAlign: 'center' }}>Live Score</th>
                    <th style={{ textAlign: 'right' }}>Management</th>
                  </tr>
                </thead>
                <tbody>
                  {matches.map((m) => (
                    <tr key={m.id}>
                      <td style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                        {new Date(m.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <strong style={{ color: '#fff' }}>{m.teamAName} vs {m.teamBName}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--clr-accent)' }}>{m.tournamentName} • {m.sportName}</span>
                        </div>
                      </td>
                      <td>{m.venue}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span className="club-admin-pill" style={{ background: 'rgba(255, 107, 0, 0.1)', color: 'var(--clr-accent)', fontWeight: 800, fontSize: '1.1rem', padding: '4px 12px' }}>
                          {m.scoreA ?? 0} : {m.scoreB ?? 0}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="admin-actions-mini" style={{ justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            className="action-btn-approve"
                            title="Edit Match"
                            onClick={() => startEdit(m)}
                          >
                            ✎
                          </button>
                          <button
                            type="button"
                            className="action-btn-reject"
                            title="Cancel Match"
                            onClick={() => handleDelete(m.id)}
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

