import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from "axios";
import { getClubById } from '../../services/clubService';
import DynamicSchemaForm from "../../components/forms/DynamicSchemaForm";
import './club-details.css';

const ClubDetails = () => {
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [joinValues, setJoinValues] = useState({});
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    const loadClub = async () => {
      try {
        const data = await getClubById(id);
        setClub(data);
      } catch (err) {
        setClub(null);
      } finally {
        setLoading(false);
      }
    };
    loadClub();
  }, [id]);

  const submitJoin = async (e) => {
    e?.preventDefault();
    try {
      setJoining(true);
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/clubs/${id}/join`,
        { formData: joinValues },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Joined club successfully");
      setHasJoined(true);
      setShowJoinForm(false);
      setJoinValues({});
    } catch (err) {
      const message = err.response?.data?.message || "Error joining club";
      alert(message);
      if (message.toLowerCase().includes("already joined")) {
        setHasJoined(true);
        setShowJoinForm(false);
      }
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="club-details-page">
        <div className="club-details-container">
          <div className="club-details-loading">Loading club details...</div>
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="club-details-page">
        <div className="club-details-container">
          <div className="club-details-not-found">
            Club not found
            <Link to="/clubs">Back to Clubs</Link>
          </div>
        </div>
      </div>
    );
  }

  const role = localStorage.getItem("role");
  const canJoin = role === "student";

  return (
    <div className="club-details-page">
      <div className="club-details-container">
        <nav className="club-details-nav">
          <Link to="/clubs">← Back to Communities</Link>
          <span>/</span>
          <span>{club.type}</span>
          <span>/</span>
          <span>{club.name}</span>
        </nav>

        <div className="club-details-card">
          <div className="club-details-header">
            <div className="club-details-type">{club.type}</div>
            <h1 className="club-details-title">{club.name}</h1>
          </div>

          <div className="club-details-body">
            <p className="club-details-description">{club.description}</p>

            <div className="club-details-meta">
              <div className="club-details-meta-item">
                <svg className="club-details-meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div>
                  <div className="club-details-meta-label">President</div>
                  <div className="club-details-meta-value">{club.presidentName}</div>
                </div>
              </div>
              <div className="club-details-meta-item">
                <svg className="club-details-meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <div className="club-details-meta-label">Contact</div>
                  <div className="club-details-meta-value">{club.contactEmail}</div>
                </div>
              </div>
              <div className="club-details-meta-item">
                <svg className="club-details-meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <div className="club-details-meta-label">Location</div>
                  <div className="club-details-meta-value">{club.location}</div>
                </div>
              </div>
              <div className="club-details-meta-item">
                <svg className="club-details-meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <div className="club-details-meta-label">Capacity</div>
                  <div className="club-details-meta-value">{club.capacity} members</div>
                </div>
              </div>
            </div>

            <div className="club-details-actions">
              <Link to={`/events`} className="club-details-link">
                View Club Events
              </Link>
              {canJoin && (
                <>
                  {hasJoined ? (
                    <span className="club-details-joined-badge">
                      You are already a member
                    </span>
                  ) : !showJoinForm ? (
                    <button
                      onClick={() => setShowJoinForm(true)}
                      disabled={joining}
                      className="club-details-join-btn"
                    >
                      Join Club
                    </button>
                  ) : (
                    <div style={{ width: "100%" }}>
                      <DynamicSchemaForm
                        schema={club.joinFormSchema || []}
                        values={joinValues}
                        onChange={(k, v) => setJoinValues((p) => ({ ...p, [k]: v }))}
                        disabled={joining}
                        title="Join form"
                        subtitle="Please fill the details to join."
                        submitLabel={joining ? "Joining..." : "Submit & Join"}
                        onSubmit={submitJoin}
                      />
                      <button
                        type="button"
                        className="club-details-link"
                        onClick={() => {
                          setShowJoinForm(false);
                          setJoinValues({});
                        }}
                        style={{ marginTop: 10 }}
                        disabled={joining}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDetails;
