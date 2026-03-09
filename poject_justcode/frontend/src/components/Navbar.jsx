import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [admin, setAdmin] = useState(null);
  const [student, setStudent]=useState(null);

  // 🔐 Check admin session on navbar load
  useEffect(() => {
    fetch("http://localhost:5000/admin/check", {
      credentials: "include"
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.admin) {
          setAdmin(data.admin);
        }
      })
      .catch(() => {
        setAdmin(null);
      });
  }, []);

  // 🚪 Logout handler
  const handleLogout = async () => {
    await fetch("http://localhost:5000/admin/logout", {
      method: "POST",
      credentials: "include"
    });

    setAdmin(null);
    window.location.href = "/";
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <div className="navbar-logo">
          <Link to="/">🏆 Sports Sphere</Link>
        </div>

        {/* Menu */}
        <ul className="navbar-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/events">Events</Link></li>
          <li><Link to="/clubs">Clubs</Link></li>

          {/* Admin-only link */}
          {admin && (
            <li><Link to="/admin/dashboard">Admin Panel</Link></li>
          )}
        </ul>

        {/* Auth */}
        <div className="navbar-auth">
          {!admin && (
            <Link to="/admin/login" className="login-btn">
              Admin Login
            </Link>
          )}

          {admin && (
            <>
              <span className="admin-name">
                {admin.name}
              </span>
              <button onClick={handleLogout} className="login-btn">
                Logout
              </button>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}
