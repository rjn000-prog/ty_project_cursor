import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import "./sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path) => location.pathname.startsWith(path);

  const role = localStorage.getItem("role");
  const dashboardPath =
    role === "club_admin"
      ? "/club-admin"
      : role === "sports_admin"
        ? "/sports-admin"
        : role === "super_admin"
          ? "/admin"
          : "/dashboard";

  const isAdmin = ["super_admin", "sports_admin", "club_admin"].includes(role);

  const navItems = [
    { path: dashboardPath, label: "Dashboard", icon: "◫" },
    { path: "/clubs", label: "Clubs", icon: "🏟️" },
    { path: "/events", label: "Events", icon: "📅" },
    { path: "/my-events", label: "My Events", icon: "✓" },
    { path: "/sports", label: "Sports", icon: "🏅" },
    { path: "/my-teams", label: "My Teams", icon: "👥" },
    { path: "/tournaments", label: "Tournaments", icon: "🏆" },
    { path: "/directory", label: "Directory", icon: "📖" },
    { path: "/map", label: "Campus Map", icon: "🗺️" },
    { path: "/profile", label: "Profile", icon: "👤" },
  ];

  return (
    <aside className={`sidebar ${collapsed ? "sidebar--collapsed" : ""}`}>
      <div className="sidebar-header">
        <Link to="/clubs" className="sidebar-logo">
          <img src="/logo.svg" alt="PCCAS" className="sidebar-logo-img" />
        </Link>
        <button
          className="sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-link ${isActive(item.path) ? "sidebar-link--active" : ""}`}
          >
            <span className="sidebar-link-icon">{item.icon}</span>
            {!collapsed && <span className="sidebar-link-label">{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        {isAdmin && (
          <Link
            to={dashboardPath}
            className="sidebar-link sidebar-link--admin"
          >
            <span className="sidebar-link-icon">⚙️</span>
            {!collapsed && <span className="sidebar-link-label">Admin Dashboard</span>}
          </Link>
        )}
        <Link
          to="/"
          className={`sidebar-link sidebar-link--home ${location.pathname === "/" ? "sidebar-link--active" : ""}`}
        >
          <span className="sidebar-link-icon">🏠</span>
          {!collapsed && <span className="sidebar-link-label">Return to Portal</span>}
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
