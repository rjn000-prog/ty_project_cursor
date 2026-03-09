import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../dashboard/ClubAdminDashboard.css";

const API = "http://localhost:5000/api/club-admin/gallery";

export default function ClubAdminGallery() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: "",
    caption: "",
    imageUrl: "",
    clubId: "",
    visible: true,
  });

  const fetchItems = () => {
    setLoading(true);
    fetch(API, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((r) => r.json())
      .then((d) => setItems(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const startEdit = (item) => {
    setEditing(item.id);
    setForm({
      title: item.title || "",
      caption: item.caption || "",
      imageUrl: item.imageUrl || "",
      clubId: item.clubId || "",
      visible: item.visible,
    });
  };

  const clearForm = () => {
    setEditing(null);
    setForm({
      title: "",
      caption: "",
      imageUrl: "",
      clubId: "",
      visible: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.imageUrl) return;

    setSaving(true);
    try {
      const method = editing ? "PUT" : "POST";
      const url = editing ? `${API}/${editing}` : API;
      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: form.title,
          caption: form.caption,
          imageUrl: form.imageUrl,
          clubId: form.clubId || undefined,
          visible: form.visible,
        }),
      });
      clearForm();
      fetchItems();
    } finally {
      setSaving(false);
    }
  };

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
            <h1>Gallery</h1>
            <p>Curate images shown in the homepage gallery</p>
          </div>
        </header>

        <div className="club-admin-grid">
          <section className="club-admin-card">
            <div className="club-admin-section-title">
              <h2>{editing ? "Edit image" : "Add image"}</h2>
              <span className="club-admin-badge">Homepage gallery</span>
            </div>

            <form className="admin-modern-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    value={form.title}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, title: e.target.value }))
                    }
                    placeholder="e.g. Volleyball Finals"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Club (Optional)</label>
                  <input
                    value={form.clubId}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, clubId: e.target.value }))
                    }
                    placeholder="Club ID"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, imageUrl: e.target.value }))
                  }
                  placeholder="https://..."
                  required
                />
              </div>

              <div className="form-group">
                <label>Caption</label>
                <textarea
                  value={form.caption}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, caption: e.target.value }))
                  }
                  placeholder="Describe the moment..."
                  rows={2}
                />
              </div>

              <div className="checkbox-row">
                <label className="admin-checkbox-label">
                  <input
                    type="checkbox"
                    checked={form.visible}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, visible: e.target.checked }))
                    }
                  />
                  <span>Visible in Gallery</span>
                </label>
              </div>

              <div className="admin-form-actions">
                <button
                  type="submit"
                  className="club-admin-button club-admin-button--primary"
                  disabled={saving}
                >
                  {saving ? "Working..." : editing ? "Save Changes" : "Add to Gallery"}
                </button>
                {editing && (
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
              <h2>Media Preview</h2>
              <span className="club-admin-pill">{items.length}</span>
            </div>
            {loading ? (
              <div className="admin-loader-mini">Curating media...</div>
            ) : items.length === 0 ? (
              <div className="club-admin-empty">Your gallery is empty.</div>
            ) : (
              <div className="admin-gallery-preview">
                {items.slice(0, 12).map((g) => (
                  <div
                    key={g.id}
                    className={`gallery-preview-item ${!g.visible ? 'hidden-item' : ''}`}
                    onClick={() => startEdit(g)}
                  >
                    <img src={g.imageUrl} alt={g.title} />
                    {!g.visible && <div className="hidden-overlay">Hidden</div>}
                  </div>
                ))}
              </div>
            )}
            <p className="club-admin-small-text">
              Click an image to edit. Only visible images appear on the homepage.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

