import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getClubByIdForAdmin,
  updateClubByIdForAdmin,
  getClubMembersForAdmin,
  removeClubMemberForAdmin,
  setClubJoinFormSchema,
} from "../../services/clubAdminService";
import { SchemaBuilder } from "../../components/forms/DynamicSchemaForm";
import "../dashboard/ClubAdminDashboard.css";

export default function ClubAdminClubDetails() {
  const { id } = useParams();
  const clubId = Number(id);
  const [loading, setLoading] = useState(true);
  const [club, setClub] = useState(null);
  const [members, setMembers] = useState([]);
  const [saving, setSaving] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [schema, setSchema] = useState([]);
  const [savingSchema, setSavingSchema] = useState(false);

  const form = useMemo(() => {
    if (!club) return null;
    return {
      name: club.name || "",
      type: club.type || "",
      description: club.description || "",
      presidentName: club.presidentName || "",
      contactEmail: club.contactEmail || "",
      capacity: club.capacity || "",
      location: club.location || "",
    };
  }, [club]);

  const [clubForm, setClubForm] = useState({});

  useEffect(() => {
    if (!clubId) return;
    setLoading(true);
    Promise.all([getClubByIdForAdmin(clubId), getClubMembersForAdmin(clubId)])
      .then(([c, m]) => {
        setClub(c);
        setMembers(Array.isArray(m) ? m : []);
        setSchema(Array.isArray(c?.joinFormSchema) ? c.joinFormSchema : []);
        setClubForm({
          name: c?.name || "",
          type: c?.type || "",
          description: c?.description || "",
          presidentName: c?.presidentName || "",
          contactEmail: c?.contactEmail || "",
          capacity: c?.capacity || "",
          location: c?.location || "",
        });
      })
      .catch(() => {
        setClub(null);
        setMembers([]);
        setSchema([]);
      })
      .finally(() => setLoading(false));
  }, [clubId]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await updateClubByIdForAdmin(clubId, clubForm);
      setClub(res.club);
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (memberId) => {
    try {
      setRemovingId(memberId);
      await removeClubMemberForAdmin(clubId, memberId);
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
    } finally {
      setRemovingId(null);
    }
  };

  const handleSaveSchema = async () => {
    try {
      setSavingSchema(true);
      const res = await setClubJoinFormSchema(clubId, schema);
      setSchema(res.joinFormSchema || []);
    } finally {
      setSavingSchema(false);
    }
  };

  if (loading) {
    return (
      <div className="club-admin-dashboard">
        <div className="club-admin-dashboard-container">
          <div className="admin-loader">Loading club...</div>
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="club-admin-dashboard">
        <div className="club-admin-dashboard-container">
          <div className="admin-loader">Club not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="club-admin-dashboard">
      <nav className="dashboard-nav dashboard-nav--admin">
        <Link to="/" className="dashboard-nav-logo">
          PCCAS
        </Link>
        <div className="dashboard-nav-links">
          <Link to="/" className="portal-link">Return to Portal</Link>
          <Link to="/clubs">Public Clubs</Link>
          <Link to="/events">Public Events</Link>
          <Link to="/club-admin">Dashboard</Link>
          <Link to="/club-admin/clubs">Clubs</Link>
          <Link to="/club-admin/events">Events</Link>
          <Link to="/club-admin/news">News</Link>
          <Link to="/club-admin/gallery">Gallery</Link>
        </div>
      </nav>

      <div className="club-admin-dashboard-container">
        <header className="club-admin-header">
          <div className="club-admin-header-title">
            <h1>{club.name}</h1>
            <p>
              {club.type} • {club.location} • {club.membersCount} members
            </p>
          </div>
        </header>

        <div className="club-admin-grid">
          <section className="club-admin-card">
            <div className="club-admin-section-title">
              <h2>Edit club</h2>
              <span className="club-admin-badge">Public details</span>
            </div>

            <div className="club-admin-form admin-modern-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Club Name</label>
                  <input
                    value={clubForm.name || ""}
                    onChange={(e) =>
                      setClubForm((p) => ({ ...p, name: e.target.value }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Type / Category</label>
                  <input
                    value={clubForm.type || ""}
                    onChange={(e) =>
                      setClubForm((p) => ({ ...p, type: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>President Name</label>
                  <input
                    value={clubForm.presidentName || ""}
                    onChange={(e) =>
                      setClubForm((p) => ({ ...p, presidentName: e.target.value }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Contact Email</label>
                  <input
                    value={clubForm.contactEmail || ""}
                    onChange={(e) =>
                      setClubForm((p) => ({ ...p, contactEmail: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Capacity</label>
                  <input
                    type="number"
                    value={clubForm.capacity ?? ""}
                    onChange={(e) =>
                      setClubForm((p) => ({ ...p, capacity: e.target.value }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    value={clubForm.location || ""}
                    onChange={(e) =>
                      setClubForm((p) => ({ ...p, location: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={clubForm.description || ""}
                  onChange={(e) =>
                    setClubForm((p) => ({ ...p, description: e.target.value }))
                  }
                  rows={4}
                />
              </div>
            </div>

            <div className="club-admin-actions">
              <button
                type="button"
                className="club-admin-button club-admin-button--primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <Link
                to={`/clubs/${club.id}`}
                className="club-admin-button club-admin-button--ghost"
              >
                View public page
              </Link>
            </div>
          </section>

          <section className="club-admin-card">
            <div className="club-admin-section-title">
              <h2>Members</h2>
              <span className="club-admin-pill">{members.length}</span>
            </div>
            {members.length === 0 ? (
              <div className="club-admin-empty">No members yet.</div>
            ) : (
              <div className="club-admin-members-table-wrapper">
                <table className="club-admin-members-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Roll</th>
                      <th>Year</th>
                      <th>Email</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((m) => (
                      <tr key={m.id}>
                        <td>{m.student?.name}</td>
                        <td>{m.student?.rollNo}</td>
                        <td>{m.student?.year}</td>
                        <td>{m.student?.email}</td>
                        <td>
                          <button
                            type="button"
                            className="club-admin-button club-admin-button--ghost"
                            onClick={() => handleRemove(m.id)}
                            disabled={removingId === m.id}
                          >
                            {removingId === m.id ? "Removing..." : "Remove"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        <section className="club-admin-card">
          <div className="club-admin-section-title">
            <h2>Join form (students)</h2>
            <span className="club-admin-badge">Dynamic</span>
          </div>

          <SchemaBuilder schema={schema} setSchema={setSchema} disabled={savingSchema} />

          <div className="club-admin-actions">
            <button
              type="button"
              className="club-admin-button club-admin-button--primary"
              onClick={handleSaveSchema}
              disabled={savingSchema}
            >
              {savingSchema ? "Saving..." : "Save form"}
            </button>
          </div>
          <p className="club-admin-small-text">
            Students will see this form when they click “Join Club”.
          </p>
        </section>
      </div>
    </div>
  );
}

