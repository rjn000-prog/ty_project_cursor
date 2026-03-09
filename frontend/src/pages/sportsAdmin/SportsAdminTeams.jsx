import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  listSports,
  listTeams,
  createTeam,
  updateTeam,
  deleteTeam,
  addPlayerToTeam,
  removePlayerFromTeam,
} from "../../services/sportsAdminService";
import "../dashboard/ClubAdminDashboard.css";

export default function SportsAdminTeams() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sports, setSports] = useState([]);
  const [teams, setTeams] = useState([]);
  const [sportFilter, setSportFilter] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    coachName: "",
    departmentId: "",
    sportId: "",
  });
  const [playerForm, setPlayerForm] = useState({
    teamId: "",
    studentId: "",
    position: "",
  });

  const load = (sportId) => {
    setLoading(true);
    Promise.all([
      sports.length ? Promise.resolve(sports) : listSports(),
      listTeams(sportId ? { sportId } : {}),
    ])
      .then(([s, t]) => {
        if (!sports.length) setSports(Array.isArray(s) ? s : []);
        setTeams(Array.isArray(t) ? t : []);
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

  const sportOptions = useMemo(() => sports, [sports]);

  const startEdit = (team) => {
    setEditingId(team.id);
    setForm({
      name: team.name,
      coachName: team.coachName,
      departmentId: team.departmentId || "",
      sportId: team.sportId || "",
    });
  };

  const clearForm = () => {
    setEditingId(null);
    setForm({
      name: "",
      coachName: "",
      departmentId: "",
      sportId: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.coachName || !form.departmentId || !form.sportId)
      return;
    setSaving(true);
    try {
      if (editingId) {
        await updateTeam(editingId, {
          name: form.name,
          coachName: form.coachName,
          departmentId: Number(form.departmentId),
        });
      } else {
        await createTeam({
          name: form.name,
          coachName: form.coachName,
          departmentId: Number(form.departmentId),
          sportId: Number(form.sportId),
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
        "Delete this team? This will also remove its players and matches."
      )
    )
      return;
    try {
      await deleteTeam(id);
      load(sportFilter ? Number(sportFilter) : undefined);
    } catch {
      // ignore
    }
  };

  const handleAddPlayer = async (e) => {
    e.preventDefault();
    if (!playerForm.teamId || !playerForm.studentId) return;
    setSaving(true);
    try {
      await addPlayerToTeam(playerForm.teamId, {
        studentId: Number(playerForm.studentId),
        position: playerForm.position || "player",
      });
      setPlayerForm({ teamId: "", studentId: "", position: "" });
      load(sportFilter ? Number(sportFilter) : undefined);
    } finally {
      setSaving(false);
    }
  };

  const handleRemovePlayer = async (teamId, studentId) => {
    if (!window.confirm("Remove this player from the team?")) return;
    try {
      await removePlayerFromTeam(teamId, studentId);
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
            <h1>Teams & Roster</h1>
            <p>Assemble your squads and manage player assignments</p>
          </div>
          <div className="club-admin-header-actions">
            <div className="header-stat-pill">
              <span className="pill-label">Filter by Sport</span>
              <select
                value={sportFilter}
                onChange={(e) => setSportFilter(e.target.value)}
                className="club-admin-form select"
                style={{ padding: '0.4rem 2rem 0.4rem 1rem', fontSize: '0.85rem', width: '200px', background: 'rgba(255,255,255,0.05)' }}
              >
                <option value="">All Disciplines</option>
                {sportOptions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </header>

        <div className="club-admin-grid">
          <section className="club-admin-card">
            <div className="club-admin-section-title">
              <h2>{editingId ? "Refine Squad" : "New Team Initialization"}</h2>
              <span className="club-admin-pill">Squad Setup</span>
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
                  {sportOptions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="club-admin-form-group">
                <label>Official Team Name</label>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="e.g. PCCAS Warriors"
                  required
                />
              </div>
              <div className="club-admin-form-group">
                <label>Head Coach</label>
                <input
                  value={form.coachName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, coachName: e.target.value }))
                  }
                  placeholder="Enter coach's full name"
                  required
                />
              </div>
              <div className="club-admin-form-group">
                <label>Department Identification</label>
                <input
                  type="number"
                  value={form.departmentId}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, departmentId: e.target.value }))
                  }
                  placeholder="ID Number"
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
                    ? "Saving..."
                    : editingId
                      ? "Update Squad"
                      : "Initialize Team"}
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
              <h2>Roster Recruitment</h2>
              <span className="club-admin-pill">Add Players</span>
            </div>
            <form className="club-admin-form" onSubmit={handleAddPlayer}>
              <div className="club-admin-form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Select Destination Squad</label>
                <select
                  value={playerForm.teamId}
                  onChange={(e) =>
                    setPlayerForm((p) => ({ ...p, teamId: e.target.value }))
                  }
                  required
                >
                  <option value="">Select target team...</option>
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.sportName})
                    </option>
                  ))}
                </select>
              </div>
              <div className="club-admin-form-group">
                <label>Student ID Reference</label>
                <input
                  type="number"
                  value={playerForm.studentId}
                  onChange={(e) =>
                    setPlayerForm((p) => ({
                      ...p,
                      studentId: e.target.value,
                    }))
                  }
                  placeholder="Student ID"
                  required
                />
              </div>
              <div className="club-admin-form-group">
                <label>Tactical Position</label>
                <input
                  value={playerForm.position}
                  onChange={(e) =>
                    setPlayerForm((p) => ({
                      ...p,
                      position: e.target.value,
                    }))
                  }
                  placeholder="e.g. Forward, Captain"
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
                  {saving ? "Inducting..." : "Assign to Roster"}
                </button>
              </div>
            </form>
          </section>
        </div>

        <section className="club-admin-card">
          <div className="club-admin-section-title">
            <h2>Active Squads & Assignments</h2>
            <span className="club-admin-pill">{teams.length} Teams Loaded</span>
          </div>
          {loading ? (
            <div className="admin-loader-mini">Aggregating roster data...</div>
          ) : teams.length === 0 ? (
            <div className="club-admin-empty">No squads identified in this discipline.</div>
          ) : (
            <div className="club-admin-teams-list">
              {teams.map((t) => (
                <div key={t.id} className="club-admin-card" style={{ marginBottom: '2rem', background: 'rgba(255,255,255,0.02)' }}>
                  <div className="club-admin-section-title">
                    <h3>
                      <span style={{ color: 'var(--clr-accent)' }}>{t.name}</span> <span style={{ opacity: 0.5 }}>/</span> {t.sportName}
                    </h3>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span className="club-admin-pill">
                        {t.members.length} Athletes
                      </span>
                      <div className="admin-actions-mini">
                        <button
                          type="button"
                          className="action-btn-approve"
                          title="Edit Squad"
                          onClick={() => startEdit(t)}
                        >
                          ✎
                        </button>
                        <button
                          type="button"
                          className="action-btn-reject"
                          title="Dissolve Team"
                          onClick={() => handleDelete(t.id)}
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  </div>
                  <p style={{ marginBottom: '1.5rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                    Staff: <strong style={{ color: '#fff' }}>Coach {t.coachName}</strong> • {t.departmentName} Dept.
                  </p>

                  <div className="club-admin-members-table-wrapper">
                    <table className="club-admin-members-table">
                      <thead>
                        <tr>
                          <th>Athlete</th>
                          <th>Roll No.</th>
                          <th>Academic Year</th>
                          <th>Position</th>
                          <th style={{ textAlign: 'right' }}>Management</th>
                        </tr>
                      </thead>
                      <tbody>
                        {t.members.map((m) => (
                          <tr key={m.studentId}>
                            <td style={{ fontWeight: 700, color: '#fff' }}>{m.student.name}</td>
                            <td><code style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>{m.student.rollNo}</code></td>
                            <td>{m.student.year} Year</td>
                            <td>
                              <span className="club-admin-pill" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                                {m.position || 'General'}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <button
                                type="button"
                                className="club-admin-button club-admin-button--danger"
                                style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                                onClick={() =>
                                  handleRemovePlayer(t.id, m.studentId)
                                }
                              >
                                Evict
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {t.members.length === 0 && (
                    <div className="admin-loader-mini" style={{ padding: '1rem', background: 'rgba(0,0,0,0.1)', borderRadius: '12px' }}>
                      Roster is currently empty. Use the form above to add athletes.
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

