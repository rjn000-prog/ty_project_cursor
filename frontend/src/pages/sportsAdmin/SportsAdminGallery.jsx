import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../dashboard/ClubAdminDashboard.css";

const API = "http://localhost:5000/api/sports-admin/gallery";

export default function SportsAdminGallery() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: "",
    caption: "",
    imageUrl: "",
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
      visible: item.visible,
    });
  };

  const clearForm = () => {
    setEditing(null);
    setForm({
      title: "",
      caption: "",
      imageUrl: "",
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
          visible: form.visible,
        }),
      });
      clearForm();
      fetchItems();
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
            <h1>Sports Gallery</h1>
            <p>Curate images for sports highlights and events</p>
          </div>
        </header>

        <div className="club-admin-grid">
          <section className="club-admin-card">
            <div className="club-admin-section-title">
              <h2>{editing ? "Refine image" : "Upload image"}</h2>
              <span className="club-admin-pill">{editing ? "Edit mode" : "New entry"}</span>
            </div>

            <form className="club-admin-form" onSubmit={handleSubmit}>
              <div className="club-admin-form-group">
                <label>Image title</label>
                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, title: e.target.value }))
                  }
                  placeholder="Enter a descriptive title"
                  required
                />
              </div>
              <div className="club-admin-form-group">
                <label>Direct image URL</label>
                <input
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, imageUrl: e.target.value }))
                  }
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>
              <div
                className="club-admin-form-group"
                style={{ gridColumn: "1 / -1" }}
              >
                <label>Context / Caption</label>
                <textarea
                  value={form.caption}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, caption: e.target.value }))
                  }
                  placeholder="Add a short description for the gallery..."
                  rows={3}
                />
              </div>
              <div className="club-admin-form-group">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px' }}>
                  <input
                    id="visible-check"
                    type="checkbox"
                    checked={form.visible}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, visible: e.target.checked }))
                    }
                  />
                  <label htmlFor="visible-check" style={{ marginBottom: 0, cursor: 'pointer' }}>Visible in public portal</label>
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
                  {saving ? "Saving..." : editing ? "Update Image" : "Publish to Gallery"}
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
              <h2>Gallery preview</h2>
              <span className="club-admin-pill">{items.length} Images</span>
            </div>
            {loading ? (
              <div className="club-admin-empty">Shuttering up the gallery...</div>
            ) : items.length === 0 ? (
              <div className="club-admin-empty">No memories captured yet.</div>
            ) : (
              <div className="gallery-grid">
                {items.slice(0, 12).map((g) => (
                  <div
                    key={g.id}
                    className="gallery-card"
                    title="Click to edit"
                    onClick={() => startEdit(g)}
                  >
                    <img src={g.imageUrl} alt={g.title} />
                    {!g.visible && <div className="hidden-overlay">Hidden</div>}
                  </div>
                ))}
              </div>
            )}
            <p className="club-admin-small-text">
              ✨ Pro-tip: Click any image above to quickly edit its details.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

