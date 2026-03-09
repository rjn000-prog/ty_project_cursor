import { Link, useLocation } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  const location = useLocation();
  const role = typeof window !== "undefined" ? localStorage.getItem("role") : "student";

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="main-navbar">

      <div className="nav-container">

        {/* LOGO */}
        <Link to="/" className="logo">
          PCCAS
        </Link>

        {/* LINKS */}
        <div className="nav-links">
          <Link className={isActive("/") ? "active" : ""} to="/">Home</Link>
          <Link className={isActive("/clubs") ? "active" : ""} to="/clubs">Clubs</Link>
          <Link className={isActive("/events") ? "active" : ""} to="/events">Events</Link>
          <Link className={isActive("/my-events") ? "active" : ""} to="/my-events">My Events</Link>
          <Link className={isActive("/sports") ? "active" : ""} to="/sports">Sports</Link>
          <Link className={isActive("/my-teams") ? "active" : ""} to="/my-teams">Teams</Link>
          <Link className={isActive("/tournaments") ? "active" : ""} to="/tournaments">Tournaments</Link>
          {role === "student" && (
            <Link className={isActive("/dashboard") ? "active" : ""} to="/dashboard">Dashboard</Link>
          )}
          {role === "club_admin" && (
            <Link className={isActive("/club-admin") ? "active" : ""} to="/club-admin">Club Admin</Link>
          )}
          {role === "sports_admin" && (
            <Link className={isActive("/sports-admin") ? "active" : ""} to="/sports-admin">Sports Admin</Link>
          )}
          {role === "super_admin" && (
            <Link className={isActive("/admin") ? "active" : ""} to="/admin">Super Admin</Link>
          )}
        </div>

        {/* PROFILE */}
        <Link to="/profile" className="profile-btn">
          Profile
        </Link>


      </div>

    </nav>
  );
};

export default Navbar;
