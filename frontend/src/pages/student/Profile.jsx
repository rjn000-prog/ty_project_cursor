import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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
            <h2 className="profile-section-title">Personal Information</h2>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
