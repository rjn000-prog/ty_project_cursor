import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import {
  getSportsAdminDashboard,
  getSportsAnalytics,
  listSports,
  createSport,
  updateSport,
  deleteSport,
  listTeams,
  createTeam,
  updateTeam,
  deleteTeam,
  addPlayerToTeam,
  removePlayerFromTeam,
  listTournaments,
  createTournament,
  updateTournament,
  deleteTournament,
  listMatches,
  createMatch,
  updateMatch,
  deleteMatch,
  listSportsRegistrations,
  updateSportsRegistrationStatus,
} from "../controllers/sportsAdmin.controller.js";
import {
  listAdminNews,
  createAdminNews,
  updateAdminNews,
  deleteAdminNews,
} from "../controllers/news.controller.js";
import {
  listAdminGallery,
  createAdminGalleryItem,
  updateAdminGalleryItem,
  deleteAdminGalleryItem,
} from "../controllers/gallery.controller.js";

const router = express.Router();

// All routes below require an authenticated sports_admin or super_admin
router.use(authMiddleware, roleMiddleware(["sports_admin", "super_admin"]));

// Sports dashboard & analytics
router.get("/dashboard", getSportsAdminDashboard);
router.get("/analytics", getSportsAnalytics);

// Sports management
router.get("/sports", listSports);
router.post("/sports", createSport);
router.put("/sports/:id", updateSport);
router.delete("/sports/:id", deleteSport);

// Team management
router.get("/teams", listTeams);
router.post("/teams", createTeam);
router.put("/teams/:id", updateTeam);
router.delete("/teams/:id", deleteTeam);
router.post("/teams/:id/players", addPlayerToTeam);
router.delete("/teams/:teamId/players/:studentId", removePlayerFromTeam);

// Tournament management
router.get("/tournaments", listTournaments);
router.post("/tournaments", createTournament);
router.put("/tournaments/:id", updateTournament);
router.delete("/tournaments/:id", deleteTournament);

// Match management
router.get("/matches", listMatches);
router.post("/matches", createMatch);
router.put("/matches/:id", updateMatch);
router.delete("/matches/:id", deleteMatch);

// Sports registrations review
router.get("/registrations", listSportsRegistrations);
router.patch("/registrations/:id", updateSportsRegistrationStatus);

// Sports news management (shares same storage as global news)
router.get("/news", listAdminNews);
router.post("/news", createAdminNews);
router.put("/news/:id", updateAdminNews);
router.delete("/news/:id", deleteAdminNews);

// Sports gallery management (shares same storage as global gallery)
router.get("/gallery", listAdminGallery);
router.post("/gallery", createAdminGalleryItem);
router.put("/gallery/:id", updateAdminGalleryItem);
router.delete("/gallery/:id", deleteAdminGalleryItem);

export default router;

