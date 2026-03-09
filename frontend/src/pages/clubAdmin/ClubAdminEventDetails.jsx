import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getEventByIdForAdmin,
  updateEventForAdmin,
  getEventRegistrationsForAdmin,
  getEventFeedbackForAdmin,
  setEventRegistrationFormSchema,
  issueCertificatesForEvent,
  verifyAttendanceByQR,
  getRegistrationTicket,
  broadcastToEventParticipants,
  updateEventRegistrationStatus,
} from "../../services/clubAdminService";
import { SchemaBuilder } from "../../components/forms/DynamicSchemaForm";
import "../dashboard/ClubAdminDashboard.css";

export default function ClubAdminEventDetails() {
  const { id } = useParams();
  const eventId = Number(id);
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [regs, setRegs] = useState([]);
  const [feedbackData, setFeedbackData] = useState({ feedback: [], insights: null });
  const [saving, setSaving] = useState(false);
  const [schema, setSchema] = useState([]);
  const [savingSchema, setSavingSchema] = useState(false);

  const [form, setForm] = useState({});
  const [issuingCert, setIssuingCert] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [qrToken, setQRToken] = useState("");
  const [verifyingQR, setVerifyingQR] = useState(false);
  const [qrStatus, setQRStatus] = useState(null);

  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({ subject: "", message: "" });
  const [broadcasting, setBroadcasting] = useState(false);

  const canLoad = useMemo(() => Number.isFinite(eventId) && eventId > 0, [eventId]);

  useEffect(() => {
    if (!canLoad) return;
    setLoading(true);
    Promise.all([
      getEventByIdForAdmin(eventId),
      getEventRegistrationsForAdmin(eventId),
      getEventFeedbackForAdmin(eventId),
    ])
      .then(([e, r, f]) => {
        setEvent(e);
        setRegs(Array.isArray(r) ? r : []);
        setFeedbackData(f || { feedback: [], insights: null });
        setSchema(Array.isArray(e?.registrationFormSchema) ? e.registrationFormSchema : []);
        setForm({
          name: e?.name || "",
          type: e?.type || "",
          description: e?.description || "",
          date: e?.date ? String(e.date).slice(0, 10) : "",
          startTime: e?.startTime || "",
          endTime: e?.endTime || "",
          maxParticipants: e?.maxParticipants || "",
        });
      })
      .catch((err) => {
        console.error("Load error:", err);
        setEvent(null);
        setRegs([]);
      })
      .finally(() => setLoading(false));
  }, [canLoad, eventId]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await updateEventForAdmin(eventId, {
        ...form,
        maxParticipants: Number(form.maxParticipants),
      });
      setEvent(res.event);
      alert("Event updated successfully!");
    } catch (err) {
      alert("Failed to update event.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSchema = async () => {
    try {
      setSavingSchema(true);
      const res = await setEventRegistrationFormSchema(eventId, schema);
      setSchema(res.registrationFormSchema || []);
      alert("Registration form schema updated!");
    } catch (err) {
      alert("Failed to update schema.");
    } finally {
      setSavingSchema(false);
    }
  };

  const handleUpdateStatus = async (regId, status) => {
    try {
      await updateEventRegistrationStatus(regId, status);
      const updatedRegs = await getEventRegistrationsForAdmin(eventId);
      setRegs(updatedRegs);
    } catch (error) {
      console.error("Status update error:", error);
      alert(`Failed to update status: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleIssueCertificates = async () => {
    if (!window.confirm("Are you sure you want to issue certificates to all approved participants? This will send emails with PDF attachments.")) return;
    try {
      setIssuingCert(true);
      const res = await issueCertificatesForEvent(eventId);
      alert(res.message);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to issue certificates");
    } finally {
      setIssuingCert(false);
    }
  };

  const handleVerifyQR = async () => {
    try {
      setVerifyingQR(true);
      setQRStatus(null);
      const res = await verifyAttendanceByQR(qrToken);
      setQRStatus({ type: 'success', message: `${res.message}: ${res.student}` });
      setQRToken("");
      const updatedRegs = await getEventRegistrationsForAdmin(eventId);
      setRegs(updatedRegs);
    } catch (error) {
      setQRStatus({ type: 'error', message: error.response?.data?.message || "Verification failed" });
    } finally {
      setVerifyingQR(false);
    }
  };

  const handleSendBroadcast = async () => {
    if (!broadcastForm.subject || !broadcastForm.message) {
      alert("Please fill in both subject and message.");
      return;
    }
    try {
      setBroadcasting(true);
      const res = await broadcastToEventParticipants(eventId, broadcastForm);
      alert(res.message);
      setShowBroadcastModal(false);
      setBroadcastForm({ subject: "", message: "" });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send broadcast");
    } finally {
      setBroadcasting(false);
    }
  };

  if (loading) {
    return (
      <div className="club-admin-dashboard">
        <div className="club-admin-dashboard-container">
          <div className="admin-loader">Loading event...</div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="club-admin-dashboard">
        <div className="club-admin-dashboard-container">
          <div className="admin-loader">Event not found</div>
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
            <h1>{event.name}</h1>
            <p>
              {event.clubName} •{" "}
              {new Date(event.date).toLocaleDateString("en-US")} •{" "}
              {regs.length || 0} registrations
            </p>
          </div>
          <div className="club-admin-header-actions" style={{ display: 'flex', gap: '10px' }}>
            <button
              className="club-admin-button club-admin-button--primary"
              onClick={() => setShowQRScanner(true)}
            >
              📲 Attendance Tool
            </button>
            <button
              className="club-admin-button club-admin-button--secondary"
              onClick={handleIssueCertificates}
              disabled={issuingCert}
            >
              🎓 {issuingCert ? "Issuing..." : "Issue Certificates"}
            </button>
            <button
              className="club-admin-button club-admin-button--accent"
              onClick={() => setShowBroadcastModal(true)}
              style={{ background: 'var(--clr-accent)', color: 'white' }}
            >
              📣 Broadcast
            </button>
          </div>
        </header>

        <div className="club-admin-grid">
          <section className="club-admin-card">
            <div className="club-admin-section-title">
              <h2>Edit event</h2>
              <span className="club-admin-badge">{event.type}</span>
            </div>

            <div className="club-admin-form admin-modern-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Event Name</label>
                  <input
                    value={form.name || ""}
                    onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <input
                    value={form.type || ""}
                    onChange={(e) => setForm(p => ({ ...p, type: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={form.date || ""}
                    onChange={(e) => setForm(p => ({ ...p, date: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>Start time</label>
                  <input
                    type="time"
                    value={form.startTime || ""}
                    onChange={(e) => setForm(p => ({ ...p, startTime: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>End time</label>
                  <input
                    type="time"
                    value={form.endTime || ""}
                    onChange={(e) => setForm(p => ({ ...p, endTime: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Max participants</label>
                  <input
                    type="number"
                    value={form.maxParticipants || ""}
                    onChange={(e) => setForm(p => ({ ...p, maxParticipants: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={form.description || ""}
                  onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
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
              <Link to={`/events/${event.id}`} className="club-admin-button club-admin-button--ghost">
                View public page
              </Link>
            </div>
          </section>

          <section className="club-admin-card">
            <div className="club-admin-section-title">
              <h2>Registrations</h2>
              <span className="club-admin-pill">{regs.length}</span>
            </div>

            {regs.length === 0 ? (
              <div className="club-admin-empty">No registrations yet.</div>
            ) : (
              <div className="club-admin-members-table-wrapper">
                <table className="club-admin-members-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Roll</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regs.map((r) => (
                      <tr key={r.id}>
                        <td>{r.student?.name}</td>
                        <td>{r.student?.rollNo}</td>
                        <td>{r.student?.email}</td>
                        <td>
                          <span className={`status-badge status-${r.status.toLowerCase()}`}>
                            {r.status}
                          </span>
                        </td>
                        <td>{new Date(r.regDate).toLocaleDateString()}</td>
                        <td>
                          <div className="admin-actions-mini">
                            {(r.status.toUpperCase() === "PENDING" || r.status.toUpperCase() === "REGISTERED") && (
                              <>
                                <button
                                  onClick={() => handleUpdateStatus(r.id, "APPROVED")}
                                  className="action-btn-approve"
                                  title="Approve"
                                >✓</button>
                                <button
                                  onClick={() => handleUpdateStatus(r.id, "REJECTED")}
                                  className="action-btn-reject"
                                  title="Reject"
                                >✕</button>
                              </>
                            )}
                            {r.status.toUpperCase() === "APPROVED" && (
                              <span className={r.attended ? "attended-pill" : "not-attended-pill"}>
                                {r.attended ? "✓ Attended" : "○ Not Present"}
                              </span>
                            )}
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

        <section className="club-admin-card">
          <div className="club-admin-section-title">
            <h2>Registration form (students)</h2>
            <span className="club-admin-badge">Dynamic</span>
          </div>
          <SchemaBuilder schema={schema} setSchema={setSchema} disabled={savingSchema} />
          <div className="club-admin-actions">
            <button
              className="club-admin-button club-admin-button--primary"
              onClick={handleSaveSchema}
              disabled={savingSchema}
            >
              {savingSchema ? "Saving..." : "Save form"}
            </button>
          </div>
        </section>

        <section className="club-admin-card">
          <div className="club-admin-section-title">
            <h2>AI Insight Dashboard 🤖</h2>
            {feedbackData.insights && (
              <span className={`sentiment-badge sentiment-${feedbackData.insights.sentiment.label.toLowerCase().replace(' ', '-')}`}>
                {feedbackData.insights.sentiment.label} ({feedbackData.insights.sentiment.score})
              </span>
            )}
          </div>

          {!feedbackData.insights ? (
            <div className="club-admin-empty">Need more feedback for AI analysis.</div>
          ) : (
            <div className="ai-insights-container">
              <div className="ai-insight-block">
                <h4 className="insight-heading pro">✅ Top Pros</h4>
                <ul className="insight-list">
                  {feedbackData.insights.summary.pros.map(p => <li key={p}>{p}</li>)}
                  {feedbackData.insights.summary.pros.length === 0 && <li>Analyzing...</li>}
                </ul>
              </div>
              <div className="ai-insight-block">
                <h4 className="insight-heading con">❌ Areas for Improvement</h4>
                <ul className="insight-list">
                  {feedbackData.insights.summary.cons.map(c => <li key={c}>{c}</li>)}
                  {feedbackData.insights.summary.cons.length === 0 && <li>Analyzing...</li>}
                </ul>
              </div>
            </div>
          )}
        </section>

        <section className="club-admin-card">
          <div className="club-admin-section-title">
            <h2>Detailed Feedback</h2>
            <span className="club-admin-pill">{feedbackData.feedback.length}</span>
          </div>
          {feedbackData.feedback.length === 0 ? (
            <div className="club-admin-empty">No feedback yet.</div>
          ) : (
            <table className="club-admin-members-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Roll</th>
                  <th>Rating</th>
                  <th>Comments</th>
                </tr>
              </thead>
              <tbody>
                {feedbackData.feedback.map((f, idx) => (
                  <tr key={idx}>
                    <td>{f.student?.name}</td>
                    <td>{f.student?.rollNo}</td>
                    <td>{f.rating}</td>
                    <td>{f.comments}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>

      {showQRScanner && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>Attendance Verification</h3>
              <button onClick={() => { setShowQRScanner(false); setQRStatus(null); }}>✕</button>
            </div>
            <div className="admin-modal-body">
              <p>Enter Ticket Token or Scan QR Code (Simulated)</p>
              <div className="qr-input-group">
                <input
                  type="text"
                  placeholder="Paste Ticket Token..."
                  value={qrToken}
                  onChange={(e) => setQRToken(e.target.value)}
                  className="modern-input"
                />
                <button
                  className="club-admin-button club-admin-button--primary"
                  onClick={handleVerifyQR}
                  disabled={verifyingQR || !qrToken}
                >
                  {verifyingQR ? "Verifying..." : "Verify Attendance"}
                </button>
              </div>
              {qrStatus && (
                <div className={`qr-status-msg status-${qrStatus.type}`}>
                  {qrStatus.message}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showBroadcastModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>Broadcast Message 📣</h3>
              <button onClick={() => setShowBroadcastModal(false)}>✕</button>
            </div>
            <div className="admin-modal-body">
              <p>Send a priority update email to all <b>approved</b> participants.</p>
              <div className="admin-modern-form">
                <div className="form-group">
                  <label>Subject Line</label>
                  <input
                    value={broadcastForm.subject}
                    onChange={(e) => setBroadcastForm(p => ({ ...p, subject: e.target.value }))}
                    className="modern-input"
                  />
                </div>
                <div className="form-group">
                  <label>Message Content</label>
                  <textarea
                    value={broadcastForm.message}
                    onChange={(e) => setBroadcastForm(p => ({ ...p, message: e.target.value }))}
                    rows={5}
                    className="modern-input"
                  />
                </div>
                <button
                  className="club-admin-button club-admin-button--primary"
                  onClick={handleSendBroadcast}
                  disabled={broadcasting}
                  style={{ width: '100%', marginTop: '1rem' }}
                >
                  {broadcasting ? "Sending..." : "Send Priority Email"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
