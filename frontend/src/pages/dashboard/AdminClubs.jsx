import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllClubsForAdmin, updateClubForAdmin, deleteClubForAdmin } from "../../services/adminService";
import "./AdminDashboard.css";

export default function AdminClubs() {
    const navigate = useNavigate();
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingClub, setEditingClub] = useState(null);

    useEffect(() => {
        loadClubs();
    }, []);

    const loadClubs = async () => {
        try {
            setLoading(true);
            const data = await getAllClubsForAdmin();
            setClubs(data);
        } catch (err) {
            console.error("Failed to load clubs", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this club? All associated events and data will be lost.")) return;
        try {
            await deleteClubForAdmin(id);
            loadClubs();
        } catch (err) {
            alert("Failed to delete club");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateClubForAdmin(editingClub.id, editingClub);
            setEditingClub(null);
            loadClubs();
        } catch (err) {
            alert("Failed to update club");
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    if (loading) return <div className="admin-loader">Loading Clubs...</div>;

    return (
        <div className="admin-dashboard">

            <div className="admin-dashboard-container">
                <header className="admin-header">
                    <h1>Club Management</h1>
                    <p>Edit or remove existing clubs</p>
                </header>

                <section className="admin-section">
                    <div className="admin-members-table-wrapper" style={{ background: "var(--clr-surface)", borderRadius: "16px", padding: "20px", border: "1px solid var(--clr-border)" }}>
                        <table className="club-admin-members-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Location</th>
                                    <th>Admin</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clubs.map(club => (
                                    <tr key={club.id}>
                                        <td>{club.name}</td>
                                        <td>{club.type}</td>
                                        <td>{club.location}</td>
                                        <td>{club.admin?.email || "No Admin"}</td>
                                        <td>
                                            <div style={{ display: "flex", gap: "10px" }}>
                                                <button
                                                    onClick={() => setEditingClub(club)}
                                                    className="action-btn-approve"
                                                    style={{ background: "#3b82f6" }}
                                                >Edit</button>
                                                <button
                                                    onClick={() => handleDelete(club.id)}
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

            {editingClub && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <div className="admin-modal-header">
                            <h3>Edit Club</h3>
                            <button onClick={() => setEditingClub(null)}>✕</button>
                        </div>
                        <div className="admin-modal-body">
                            <form onSubmit={handleUpdate} className="admin-modern-form">
                                <div className="form-group">
                                    <label>Club Name</label>
                                    <input
                                        value={editingClub.name}
                                        onChange={(e) => setEditingClub({ ...editingClub, name: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Type</label>
                                    <input
                                        value={editingClub.type}
                                        onChange={(e) => setEditingClub({ ...editingClub, type: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Location</label>
                                    <input
                                        value={editingClub.location}
                                        onChange={(e) => setEditingClub({ ...editingClub, location: e.target.value })}
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
