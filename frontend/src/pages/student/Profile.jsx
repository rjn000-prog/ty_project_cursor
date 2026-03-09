import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [form, setForm] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/api/student/profile", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setProfile(res.data))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, []);

  const handleEditClick = () => {
    setForm({
      name: profile.name || "",
      mobile: profile.mobile || "",
      address: profile.address || "",
      year: profile.year || "",
      dob: profile.dob ? profile.dob.slice(0, 10) : ""
    });
    setSaveError("");
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setSaveError("");
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    setSaveError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        "http://localhost:5000/api/student/profile",
        {
          name: form.name,
          mobile: form.mobile,
          address: form.address,
          year: Number(form.year),
          dob: form.dob
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(res.data);
      setEditing(false);
    } catch (err) {
      setSaveError(
        err.response?.data?.message || "Failed to save changes. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-loading">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-loading">Failed to load profile</div>
        </div>
      </div>
    );
  }

  const initials = (profile.name || "U").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="profile-page">
      <div className="profile-container">
        <nav className="profile-nav">
          <Link to="/clubs">Clubs</Link>
          <span>/</span>
          <Link to="/events">Events</Link>
          <span>/</span>
          <Link to="/my-events">My Events</Link>
          <span>/</span>
          <span>Profile</span>
        </nav>

        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">{initials}</div>
            <h1 className="profile-name">{profile.name}</h1>
            <p className="profile-email">{profile.email}</p>
          </div>

          <div className="profile-body">
            <div className="profile-section-header">
              <h2 className="profile-section-title">Personal Information</h2>
              {!editing && (
                <button className="profile-edit-btn" onClick={handleEditClick}>
                  Edit Profile
                </button>
              )}
            </div>

            {editing ? (
              <form className="profile-edit-form" onSubmit={handleSave}>
                <div className="profile-grid">
                  <div className="profile-field">
                    <label className="profile-field-label" htmlFor="name">Name</label>
                    <input
                      id="name"
                      name="name"
                      className="profile-field-input"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="profile-field">
                    <label className="profile-field-label" htmlFor="mobile">Mobile</label>
                    <input
                      id="mobile"
                      name="mobile"
                      className="profile-field-input"
                      value={form.mobile}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="profile-field">
                    <label className="profile-field-label" htmlFor="year">Year</label>
                    <input
                      id="year"
                      name="year"
                      type="number"
                      min="1"
                      max="5"
                      className="profile-field-input"
                      value={form.year}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="profile-field">
                    <label className="profile-field-label" htmlFor="dob">Date of Birth</label>
                    <input
                      id="dob"
                      name="dob"
                      type="date"
                      className="profile-field-input"
                      value={form.dob}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="profile-field" style={{ gridColumn: "1 / -1" }}>
                    <label className="profile-field-label" htmlFor="address">Address</label>
                    <textarea
                      id="address"
                      name="address"
                      className="profile-field-input profile-field-textarea"
                      value={form.address}
                      onChange={handleChange}
                      rows={3}
                      required
                    />
                  </div>
                  {profile.department && (
                    <div className="profile-field">
                      <div className="profile-field-label">Department</div>
                      <div className="profile-field-value">
                        {profile.department.name || profile.department}
                      </div>
                    </div>
                  )}
                  <div className="profile-field">
                    <div className="profile-field-label">Roll No</div>
                    <div className="profile-field-value">{profile.rollNo}</div>
                  </div>
                </div>
                {saveError && <p className="profile-save-error">{saveError}</p>}
                <div className="profile-form-actions">
                  <button type="submit" className="profile-save-btn" disabled={saving}>
                    {saving ? "Saving…" : "Save Changes"}
                  </button>
                  <button type="button" className="profile-cancel-btn" onClick={handleCancel} disabled={saving}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-grid">
                <div className="profile-field">
                  <div className="profile-field-label">Roll No</div>
                  <div className="profile-field-value">{profile.rollNo}</div>
                </div>
                <div className="profile-field">
                  <div className="profile-field-label">Mobile</div>
                  <div className="profile-field-value">{profile.mobile}</div>
                </div>
                <div className="profile-field">
                  <div className="profile-field-label">Year</div>
                  <div className="profile-field-value">{profile.year}</div>
                </div>
                <div className="profile-field">
                  <div className="profile-field-label">Date of Birth</div>
                  <div className="profile-field-value">
                    {new Date(profile.dob).toLocaleDateString("en-US")}
                  </div>
                </div>
                <div className="profile-field" style={{ gridColumn: "1 / -1" }}>
                  <div className="profile-field-label">Address</div>
                  <div className="profile-field-value">{profile.address}</div>
                </div>
                {profile.department && (
                  <div className="profile-field">
                    <div className="profile-field-label">Department</div>
                    <div className="profile-field-value">
                      {profile.department.name || profile.department}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
