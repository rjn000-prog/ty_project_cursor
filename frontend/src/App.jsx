import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/public/Home";
import Login from "./pages/auth/Login";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import AdminClubs from "./pages/dashboard/AdminClubs";
import AdminEvents from "./pages/dashboard/AdminEvents";
import Unauthorized from "./pages/Unauthorized";
import ClubAdminDashboard from "./pages/clubAdmin/ClubAdminDashboard";
import ClubAdminClubs from "./pages/clubAdmin/ClubAdminClubs";
import ClubAdminClubDetails from "./pages/clubAdmin/ClubAdminClubDetails";
import ClubAdminEvents from "./pages/clubAdmin/ClubAdminEvents";
import ClubAdminEventDetails from "./pages/clubAdmin/ClubAdminEventDetails";
import ClubAdminNews from "./pages/clubAdmin/ClubAdminNews";
import ClubAdminGallery from "./pages/clubAdmin/ClubAdminGallery";
import SportsAdminDashboard from "./pages/sportsAdmin/SportsAdminDashboard";
import SportsAdminNews from "./pages/sportsAdmin/SportsAdminNews";
import SportsAdminGallery from "./pages/sportsAdmin/SportsAdminGallery";
import SportsAdminSports from "./pages/sportsAdmin/SportsAdminSports";
import SportsAdminTeams from "./pages/sportsAdmin/SportsAdminTeams";
import SportsAdminTournaments from "./pages/sportsAdmin/SportsAdminTournaments";
import SportsAdminMatches from "./pages/sportsAdmin/SportsAdminMatches";
import SportsAdminRegistrations from "./pages/sportsAdmin/SportsAdminRegistrations";

import AdminLayout from "./components/layout/AdminLayout";
import ClubsLayout from "./components/layout/ClubsLayout";

import Profile from "./pages/student/Profile";
import StudentSports from "./pages/student/StudentSports";
import StudentTeams from "./pages/student/StudentTeams";
import StudentTournaments from "./pages/student/StudentTournaments";

// Clubs
import ClubsList from "./components/clubs/ClubsList";
import ClubDetails from "./components/clubs/ClubDetails";
import Events from "./components/clubs/Events";
import EventDetails from "./components/clubs/EventDetails";
import MyEvents from "./components/clubs/MyEvents";
import MemberDirectory from "./pages/directory/MemberDirectory";
import CampusMap from "./pages/map/CampusMap";
import Gallery from "./pages/public/Gallery";

import RoleProtectedRoute from "./components/RoleProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC HOME (NO SIDEBAR) */}
        <Route path="/" element={<Home />} />

        {/* PUBLIC AUTH / ERROR (NO LAYOUT) */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* DASHBOARDS (NO NAVBAR) */}
        <Route
          path="/dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </RoleProtectedRoute>
          }
        />

        {/* ADMIN ROUTES (WITH NAVBAR) */}
        <Route element={<AdminLayout />}>
          <Route
            path="/admin"
            element={
              <RoleProtectedRoute allowedRoles={["super_admin"]}>
                <AdminDashboard />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admin/clubs"
            element={
              <RoleProtectedRoute allowedRoles={["super_admin"]}>
                <AdminClubs />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admin/events"
            element={
              <RoleProtectedRoute allowedRoles={["super_admin"]}>
                <AdminEvents />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="/sports-admin"
            element={
              <RoleProtectedRoute allowedRoles={["sports_admin", "super_admin"]}>
                <SportsAdminDashboard />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/sports-admin/sports"
            element={
              <RoleProtectedRoute allowedRoles={["sports_admin", "super_admin"]}>
                <SportsAdminSports />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/sports-admin/teams"
            element={
              <RoleProtectedRoute allowedRoles={["sports_admin", "super_admin"]}>
                <SportsAdminTeams />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/sports-admin/tournaments"
            element={
              <RoleProtectedRoute allowedRoles={["sports_admin", "super_admin"]}>
                <SportsAdminTournaments />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/sports-admin/matches"
            element={
              <RoleProtectedRoute allowedRoles={["sports_admin", "super_admin"]}>
                <SportsAdminMatches />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/sports-admin/registrations"
            element={
              <RoleProtectedRoute allowedRoles={["sports_admin", "super_admin"]}>
                <SportsAdminRegistrations />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/sports-admin/news"
            element={
              <RoleProtectedRoute allowedRoles={["sports_admin", "super_admin"]}>
                <SportsAdminNews />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/sports-admin/gallery"
            element={
              <RoleProtectedRoute allowedRoles={["sports_admin", "super_admin"]}>
                <SportsAdminGallery />
              </RoleProtectedRoute>
            }
          />
        </Route>

        {/* CLUB ADMIN ROUTES */}
        <Route
          path="/club-admin"
          element={
            <RoleProtectedRoute allowedRoles={["club_admin"]}>
              <ClubAdminDashboard />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/club-admin/clubs"
          element={
            <RoleProtectedRoute allowedRoles={["club_admin"]}>
              <ClubAdminClubs />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/club-admin/clubs/:id"
          element={
            <RoleProtectedRoute allowedRoles={["club_admin"]}>
              <ClubAdminClubDetails />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/club-admin/events"
          element={
            <RoleProtectedRoute allowedRoles={["club_admin"]}>
              <ClubAdminEvents />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/club-admin/events/:id"
          element={
            <RoleProtectedRoute allowedRoles={["club_admin"]}>
              <ClubAdminEventDetails />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/club-admin/news"
          element={
            <RoleProtectedRoute allowedRoles={["club_admin"]}>
              <ClubAdminNews />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/club-admin/gallery"
          element={
            <RoleProtectedRoute allowedRoles={["club_admin"]}>
              <ClubAdminGallery />
            </RoleProtectedRoute>
          }
        />

        {/* MAIN APP (SIDEBAR FOR CLUB + STUDENT PAGES) */}
        <Route path="/" element={<ClubsLayout />}>
          <Route path="clubs" element={<ClubsList />} />
          <Route path="clubs/:id" element={<ClubDetails />} />
          <Route path="events" element={<Events />} />
          <Route path="events/:id" element={<EventDetails />} />
          <Route path="my-events" element={<MyEvents />} />
          <Route path="directory" element={<MemberDirectory />} />
          <Route path="map" element={<CampusMap />} />
          <Route
            path="sports"
            element={
              <RoleProtectedRoute allowedRoles={["student", "super_admin", "sports_admin", "club_admin"]}>
                <StudentSports />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="my-teams"
            element={
              <RoleProtectedRoute allowedRoles={["student", "super_admin", "sports_admin", "club_admin"]}>
                <StudentTeams />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="tournaments"
            element={
              <RoleProtectedRoute allowedRoles={["student", "super_admin", "sports_admin", "club_admin"]}>
                <StudentTournaments />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <RoleProtectedRoute allowedRoles={["student", "super_admin", "sports_admin", "club_admin"]}>
                <Profile />
              </RoleProtectedRoute>
            }
          />
        </Route>

        {/* STANDALONE GALLERY PAGE */}
        <Route path="/gallery" element={<Gallery />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;