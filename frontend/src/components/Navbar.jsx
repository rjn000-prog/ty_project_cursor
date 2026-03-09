import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("student");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    setIsAuthenticated(!!token);
    setUserRole(role || "student");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo / Title */}
        <div className="navbar-logo">
          <Link to="/" className="logo-link">
            <img src="/logo.svg" alt="  PCCAS" className="navbar-logo-img" />
          </Link>
        </div>

        {/* Menu - anchor links scroll to sections on home page */}
        <ul className="navbar-links">
          <li><a href="#hero" className="navbar-anchor">Home</a></li>
          <li><a href="#sports" className="navbar-anchor">Sports</a></li>
          <li><a href="#clubs" className="navbar-anchor">Clubs</a></li>
          <li><a href="#events" className="navbar-anchor">Events</a></li>
          <li><a href="#news" className="navbar-anchor">News</a></li>
          <li><a href="#gallery" className="navbar-anchor">Gallery</a></li>
        </ul>

        {/* Auth Section */}
        <div className="navbar-auth">
          {isAuthenticated ? (
            <div className="user-menu">
              {/* My Events link for students */}
              {userRole === "student" && (
                <Link to="/my-events" className="my-events-btn">
                  <span>📅</span>
                  <span>My Events</span>
                </Link>
              )}

              {/* Dashboard link based on role */}
              {(() => {
                let dashboardPath = "/dashboard";
                if (userRole === "club_admin") {
                  dashboardPath = "/club-admin";
                } else if (userRole === "sports_admin") {
                  dashboardPath = "/sports-admin";
                } else if (userRole === "super_admin") {
                  dashboardPath = "/admin";
                }
                return (
                  <Link to={dashboardPath} className="dashboard-btn">
                    <span>👤</span>
                    <span>Dashboard</span>
                  </Link>
                );
              })()}

              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="login-btn">
              <span>🔑</span>
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}