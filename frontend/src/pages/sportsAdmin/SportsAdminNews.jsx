import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../dashboard/ClubAdminDashboard.css";

const API = "http://localhost:5000/api/sports-admin/news";

export default function SportsAdminNews() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    summary: "",
    content: "",
    category: "sports",
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
      category: item.category || "sports",
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
      category: "sports",
      visible: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.slug || !form.summary || !form.content) return;

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
        body: JSON.stringify(form),
      });
      clearForm();
      fetchNews();
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
            <h1>Press & Announcements</h1>
            <p>Broadcast the latest sports updates to the student body</p>
          </div>
          <div className="club-admin-header-actions">
            <button
              className="club-admin-button club-admin-button--primary"
              onClick={clearForm}
            >
              + New Announcement
            </button>
          </div>
        </header>

        <div className="club-admin-grid">
          <section className="club-admin-card">
            <div className="club-admin-section-title">
              <h2>{editing ? "Refine Editorial" : "Draft New Update"}</h2>
              <span className="club-admin-pill">{editing ? "Revision Mode" : "New Draft"}</span>
            </div>

            <form className="club-admin-form" onSubmit={handleSubmit}>
              <div className="club-admin-form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Headline Title</label>
                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, title: e.target.value }))
                  }
                  placeholder="Enter a compelling headline"
                  required
                />
              </div>
              <div className="club-admin-form-group">
                <label>URL Slug</label>
                <input
                  value={form.slug}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, slug: e.target.value }))
                  }
                  placeholder="e.g. annual-sports-meet-2024"
                  required
                />
              </div>
              <div className="club-admin-form-group">
                <label>Update Category</label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, category: e.target.value }))
                  }
                >
                  <option value="sports">Athletics / Sports</option>
                  <option value="news">General Bulletin</option>
                  <option value="club">Club Official</option>
                  <option value="notice">Urgent Notice</option>
                </select>
              </div>
              <div
                className="club-admin-form-group"
                style={{ gridColumn: "1 / -1" }}
              >
                <label>Executive Summary</label>
                <textarea
                  value={form.summary}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, summary: e.target.value }))
                  }
                  placeholder="Brief preview text for the card..."
                  rows={2}
                  required
                />
              </div>
              <div
                className="club-admin-form-group"
                style={{ gridColumn: "1 / -1" }}
              >
                <label>Detailed Content</label>
                <textarea
                  value={form.content}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, content: e.target.value }))
                  }
                  placeholder="Write the full story here..."
                  required
                  style={{ minHeight: 200 }}
                />
              </div>
              <div className="club-admin-form-group">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px' }}>
                  <input
                    id="news-visible"
                    type="checkbox"
                    checked={form.visible}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, visible: e.target.checked }))
                    }
                  />
                  <label htmlFor="news-visible" style={{ marginBottom: 0, cursor: 'pointer' }}>Publish to Live Portal</label>
                </div>
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
                  {saving ? "Publishing..." : editing ? "Sync Changes" : "Broadcast Update"}
                </button>
                {editing && (
                  <button
                    type="button"
                    className="club-admin-button club-admin-button--ghost"
                    onClick={clearForm}
                    disabled={saving}
                  >
                    Discard Changes
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="club-admin-card">
            <div className="club-admin-section-title">
              <h2>Broadcast History</h2>
              <span className="club-admin-pill">{items.length} Entries</span>
            </div>
            {loading ? (
              <div className="admin-loader-mini">Retrieving news archives...</div>
            ) : items.length === 0 ? (
              <div className="club-admin-empty">No broadcasts found.</div>
            ) : (
              <div className="admin-activity-list">
                {items.map((n) => (
                  <div
                    key={n.id}
                    className="activity-item"
                    style={{
                      padding: '1rem',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.02)',
                      marginBottom: '0.75rem',
                      cursor: 'pointer',
                      border: '1px solid rgba(255,255,255,0.05)',
                      transition: 'all 0.2s'
                    }}
                    onClick={() => startEdit(n)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <strong style={{ color: '#fff' }}>{n.title}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                        {new Date(n.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span className="club-admin-pill" style={{ fontSize: '0.7rem', padding: '1px 6px', background: 'rgba(255,255,255,0.05)' }}>
                        {n.category}
                      </span>
                      <span className={`club-admin-pill ${n.visible ? 'sentiment-positive' : 'sentiment-negative'}`} style={{ fontSize: '0.7rem', padding: '1px 6px' }}>
                        {n.visible ? "Live" : "Draft"}
                      </span>
                    </div>
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
