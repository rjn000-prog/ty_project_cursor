import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

const AdminLayout = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const role = localStorage.getItem("role") || user.role;
    const token = localStorage.getItem("token");

    if (!token || (role !== "super_admin" && role !== "sports_admin")) {
        return <Navigate to="/unauthorized" replace />;
    }

    return (
        <div className="admin-layout">
            <AdminNavbar role={role} />
            <main className="admin-main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
