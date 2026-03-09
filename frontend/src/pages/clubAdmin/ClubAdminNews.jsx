import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../dashboard/ClubAdminDashboard.css";

const API = "http://localhost:5000/api/club-admin/news";

const toSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export default function ClubAdminNews() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    summary: "",
    content: "",
    category: "news",
    visible: true,
  });

  const fetchNews = () => {
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
    fetchNews();
  }, []);

  const startEdit = (item) => {
    setEditing(item.id);
    setForm({
      title: item.title || "",
      slug: item.slug || "",
      summary: item.summary || "",
      content: item.content || "",
      category: item.category || "news",
      visible: item.visible,
    });
  };

  const clearForm = () => {
    setEditing(null);
    setForm({
      title: "",
      slug: "",
      summary: "",
      content: "",
      category: "news",
      visible: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.summary || !form.content) return;

    setSaving(true);
    try {
      const method = editing ? "PUT" : "POST";
      const url = editing ? `${API}/${editing}` : API;
      const payload = {
        ...form,
        slug: form.slug || toSlug(form.title),
      };
      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });
      clearForm();
      fetchNews();
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
            <h1>News</h1>
            <p>Create and manage dynamic news cards</p>
          </div>
        </header>

        <div className="club-admin-grid">
          <section className="club-admin-card">
            <div className="club-admin-section-title">
              <h2>{editing ? "Edit news" : "Create news"}</h2>
              <span className="club-admin-badge">Homepage cards</span>
            </div>

            <form className="admin-modern-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    value={form.title}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        title: e.target.value,
                        slug: toSlug(e.target.value),
                      }))
                    }
                    placeholder="e.g. New Sports Lab Opening"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, category: e.target.value }))
                    }
                    className="admin-select"
                  >
                    <option value="news">General News</option>
                    <option value="sports">Sports</option>
                    <option value="club">Clubs</option>
                    <option value="notice">Notice</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Summary</label>
                <textarea
                  value={form.summary}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, summary: e.target.value }))
                  }
                  placeholder="A short snippet for the card..."
                  rows={2}
                  required
                />
              </div>

              <div className="form-group">
                <label>Content</label>
                <textarea
                  value={form.content}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, content: e.target.value }))
                  }
                  placeholder="Detailed news article content..."
                  rows={6}
                  required
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
                  <span>Show on public homepage</span>
                </label>
              </div>

              <div className="admin-form-actions">
                <button
                  type="submit"
                  className="club-admin-button club-admin-button--primary"
                  disabled={saving}
                >
                  {saving ? "Processing..." : editing ? "Save Changes" : "Publish News"}
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
              <h2>Recent Articles</h2>
              <span className="club-admin-pill">{items.length}</span>
            </div>
            {loading ? (
              <div className="admin-loader-mini">Loading news...</div>
            ) : items.length === 0 ? (
              <div className="club-admin-empty">No news published yet.</div>
            ) : (
              <div className="admin-recent-list">
                {items.map((n) => (
                  <div
                    key={n.id}
                    className={`admin-recent-item clickable ${!n.visible ? 'hidden-item' : ''}`}
                    onClick={() => startEdit(n)}
                  >
                    <div className="recent-item-info">
                      <h3>{n.title}</h3>
                      <p>
                        {n.category.toUpperCase()} • {new Date(n.publishedAt).toLocaleDateString()}
                        {!n.visible && <span className="hidden-tag"> [Hidden]</span>}
                      </p>
                    </div>
                    <span className="edit-hint-btn">Edit →</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

