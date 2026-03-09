import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./AdminNavbar.css";

const AdminNavbar = ({ role }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="admin-nav">
            <div className="admin-nav-container">
                <Link to="/" className="admin-nav-logo">PCCAS <span>ADMIN</span></Link>

                <div className="admin-nav-links">
                    {role === "super_admin" && (
                        <>
                            <Link to="/admin" className={isActive("/admin") ? "active" : ""}>Dashboard</Link>
                            <Link to="/admin/clubs" className={isActive("/admin/clubs") ? "active" : ""}>Clubs</Link>
                            <Link to="/admin/events" className={isActive("/admin/events") ? "active" : ""}>Events</Link>
                        </>
                    )}

                    {(role === "super_admin" || role === "sports_admin") && (
                        <div className="nav-dropdown">
                            <Link to="/sports-admin" className={location.pathname.startsWith("/sports-admin") ? "active" : ""}>
                                Sports Management ▾
                            </Link>
                            <div className="nav-dropdown-content">
                                <Link to="/sports-admin/sports">Sports List</Link>
                                <Link to="/sports-admin/teams">Teams</Link>
                                <Link to="/sports-admin/tournaments">Tournaments</Link>
                                <Link to="/sports-admin/matches">Matches</Link>
                                <Link to="/sports-admin/registrations">Registrations</Link>
                                <Link to="/sports-admin/news">News</Link>
                                <Link to="/sports-admin/gallery">Gallery</Link>
                            </div>
                        </div>
                    )}

                    <Link to="/clubs">Public Portal</Link>
                    <button onClick={handleLogout} className="admin-nav-logout">Logout</button>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;
