import { BrowserRouter, Routes, Route } from "react-router-dom";

/* Public pages */
import Home from "./pages/public/Home";
import Login from "./pages/auth/Login";
import Unauthorized from "./pages/Unauthorized";

/* Public components */
import Events from "./components/Events";
import Clubs from "./components/Clubs";

/* Dashboards */
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";

/* Admin auth pages */
import AdminLogin from "./admin/AdminLogin";

/* Route protection */
import RoleProtectedRoute from "./components/RoleProtectedRoute";

import AddClub from "./admin/ClubAdmin";
import ClubAdmin from "./admin/ClubAdmin";


import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ---------------- PUBLIC ---------------- */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/events" element={<Events />} />
        <Route path="/clubs" element={<Clubs />} />

        {/* ---------------- STUDENT ---------------- */}
        <Route
          path="/dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </RoleProtectedRoute>
          }
        />

        {/* ---------------- ADMIN AUTH ---------------- */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ---------------- ADMIN DASHBOARD ---------------- */}
        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}

          
        />
          
                  {/** AFTER CLCIKING ADD CLUBS IN ADMIN DASHBOARD
                   * 
                   */}
                  <Route path="/admin/clubs/add" element={<ClubAdmin />} />
                  <Route path="/student/dashboard" element={<StudentDashboard />} />
                  

      </Routes>
    </BrowserRouter>
  );
}

export default App;
