import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  listSports,
  createSport,
  updateSport,
  deleteSport,
} from "../../services/sportsAdminService";
import "../dashboard/ClubAdminDashboard.css";

export default function SportsAdminSports() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sports, setSports] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "" });

  const load = () => {
    setLoading(true);
    listSports()
      .then((data) => setSports(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = (sport) => {
    setEditingId(sport.id);
    setForm({ name: sport.name });
  };

  const clearForm = () => {
    setEditingId(null);
    setForm({ name: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return;
    setSaving(true);
    try {
      if (editingId) {
        await updateSport(editingId, { name: form.name });
      } else {
        await createSport({ name: form.name });
      }
      clearForm();
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Delete this sport? This is only allowed when there are no teams, tournaments, or registrations."
      )
    )
      return;
    try {
      await deleteSport(id);
      load();
    } catch (e) {
      // eslint-disable-next-line no-alert
      alert(
        e.response?.data?.message ||
        "Failed to delete sport. Make sure it has no teams, tournaments, or registrations."
      );
    }
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="club-admin-dashboard">

      <div className="club-admin-dashboard-container">
        <header className="club-admin-header">
          <div className="club-admin-header-title">
            <h1>Sports Master List</h1>
            <p>Define and manage all athletic disciplines on campus</p>
          </div>
          <div className="club-admin-header-actions">
            <button
              className="club-admin-button club-admin-button--primary"
              onClick={() => {
                setEditingId(null);
                setForm({ name: "" });
                setSaving(false);
                document.getElementById('sport-modal').style.display = 'flex';
              }}
            >
              + Add New Discipline
            </button>
          </div>
        </header>

        <section className="club-admin-card">
          <div className="club-admin-section-title">
            <h2>Active Disciplines</h2>
            <span className="club-admin-pill">{sports.length} Total</span>
          </div>
          {loading ? (
            <div className="admin-loader-mini">Synchronizing sports data...</div>
          ) : sports.length === 0 ? (
            <div className="club-admin-empty">No disciplines defined yet.</div>
          ) : (
            <div className="club-admin-members-table-wrapper">
              <table className="club-admin-members-table">
                <thead>
                  <tr>
                    <th>Discipline</th>
                    <th>Teams</th>
                    <th>Tournaments</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sports.map((s) => (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 800, color: "var(--clr-accent)", fontSize: '1.1rem' }}>{s.name}</td>
                      <td>
                        <span className="club-admin-pill" style={{ background: 'rgba(255,255,255,0.05)', color: 'white' }}>
                          {s.teamsCount} Teams
                        </span>
                      </td>
                      <td>
                        <span className="club-admin-pill" style={{ background: 'rgba(255,255,255,0.05)', color: 'white' }}>
                          {s.tournamentsCount} Tourneys
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div className="admin-actions-mini" style={{ justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            className="action-btn-approve"
                            title="Edit Discipline"
                            onClick={() => {
                              startEdit(s);
                              document.getElementById('sport-modal').style.display = 'flex';
                            }}
                          >
                            ✎
                          </button>
                          <button
                            type="button"
                            className="action-btn-reject"
                            title="Delete Discipline"
                            onClick={() => handleDelete(s.id)}
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

      {/* Sport Modal */}
      <div id="sport-modal" className="admin-modal-overlay" style={{ display: "none" }}>
        <div className="admin-modal">
          <div className="admin-modal-header">
            <h3>{editingId ? "Refine Discipline" : "New Athletic Discipline"}</h3>
            <button onClick={() => document.getElementById('sport-modal').style.display = 'none'}>&times;</button>
          </div>
          <div className="admin-modal-body">
            <form className="club-admin-form" style={{ gridTemplateColumns: '1fr' }} onSubmit={async (e) => {
              await handleSubmit(e);
              document.getElementById('sport-modal').style.display = 'none';
            }}>
              <div className="club-admin-form-group">
                <label>Official Sport Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ name: e.target.value })}
                  placeholder="e.g. Football, Basketball, Swimming..."
                  required
                />
              </div>

              <div className="club-admin-actions" style={{ marginTop: '1rem' }}>
                <button
                  type="submit"
                  className="club-admin-button club-admin-button--primary"
                  style={{ flex: 1 }}
                  disabled={saving}
                >
                  {saving ? "Processing..." : editingId ? "Save Changes" : "Create Discipline"}
                </button>
                <button
                  type="button"
                  className="club-admin-button club-admin-button--ghost"
                  style={{ flex: 1 }}
                  onClick={() => document.getElementById('sport-modal').style.display = 'none'}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

