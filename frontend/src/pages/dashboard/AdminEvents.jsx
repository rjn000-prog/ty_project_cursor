import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllEventsForAdmin, updateEventForAdmin, deleteEventForAdmin } from "../../services/adminService";
import "./AdminDashboard.css";

export default function AdminEvents() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingEvent, setEditingEvent] = useState(null);

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            setLoading(true);
            const data = await getAllEventsForAdmin();
            setEvents(data);
        } catch (err) {
            console.error("Failed to load events", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this event? All registrations and feedback will be lost.")) return;
        try {
            await deleteEventForAdmin(id);
            loadEvents();
        } catch (err) {
            alert("Failed to delete event");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateEventForAdmin(editingEvent.id, editingEvent);
            setEditingEvent(null);
            loadEvents();
        } catch (err) {
            alert("Failed to update event");
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    if (loading) return <div className="admin-loader">Loading Events...</div>;

    return (
        <div className="admin-dashboard">

            <div className="admin-dashboard-container">
                <header className="admin-header">
                    <h1>Event Management</h1>
                    <p>Global oversight of all college events</p>
                </header>

                <section className="admin-section">
                    <div className="admin-members-table-wrapper" style={{ background: "var(--clr-surface)", borderRadius: "16px", padding: "20px", border: "1px solid var(--clr-border)" }}>
                        <table className="club-admin-members-table">
                            <thead>
                                <tr>
                                    <th>Event Name</th>
                                    <th>Club</th>
                                    <th>Date</th>
                                    <th>Type</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.map(ev => (
                                    <tr key={ev.id}>
                                        <td>{ev.name}</td>
                                        <td>{ev.club?.name}</td>
                                        <td>{new Date(ev.date).toLocaleDateString()}</td>
                                        <td>{ev.type}</td>
                                        <td>
                                            <div style={{ display: "flex", gap: "10px" }}>
                                                <button
                                                    onClick={() => setEditingEvent({
                                                        ...ev,
                                                        date: ev.date ? String(ev.date).slice(0, 10) : ""
                                                    })}
                                                    className="action-btn-approve"
                                                    style={{ background: "#3b82f6" }}
                                                >Edit</button>
                                                <button
                                                    onClick={() => handleDelete(ev.id)}
                                                    className="action-btn-reject"
                                                >Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            {editingEvent && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <div className="admin-modal-header">
                            <h3>Edit Event</h3>
                            <button onClick={() => setEditingEvent(null)}>✕</button>
                        </div>
                        <div className="admin-modal-body">
                            <form onSubmit={handleUpdate} className="admin-modern-form">
                                <div className="form-group">
                                    <label>Event Name</label>
                                    <input
                                        value={editingEvent.name}
                                        onChange={(e) => setEditingEvent({ ...editingEvent, name: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Type</label>
                                    <input
                                        value={editingEvent.type}
                                        onChange={(e) => setEditingEvent({ ...editingEvent, type: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Date</label>
                                    <input
                                        type="date"
                                        value={editingEvent.date}
                                        onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        value={editingEvent.description}
                                        onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                                        rows={3}
                                    />
                                </div>
                                <button type="submit" className="club-admin-button club-admin-button--primary" style={{ width: "100%", marginTop: "20px" }}>
                                    Save Changes
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
