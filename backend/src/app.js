import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authMiddleware from "./middleware/auth.middleware.js";
import roleMiddleware from "./middleware/role.middleware.js";

import authRoutes from "./modules/auth/auth.routes.js";
import studentRoutes from "./modules/student/student.routes.js";
import clubRoutes from "./routes/club.routes.js";
import eventRoutes from "./routes/event.routes.js";
import newsRoutes from "./routes/news.routes.js";
import galleryRoutes from "./routes/gallery.routes.js";
import studentProfileRoutes from "./routes/studentProfileRoutes.js";
import adminRoutes from "./routes/admin.routes.js";
import clubAdminRoutes from "./routes/clubAdmin.routes.js";
import sportsAdminRoutes from "./routes/sportsAdmin.routes.js";
import publicRoutes from "./routes/public.routes.js";
import directoryRoutes from "./modules/directory/directory.routes.js";
import mapRoutes from "./modules/map/map.routes.js";
import { getAdminDashboard } from "./controllers/admin.controller.js";

dotenv.config();

const app = express();

/* -------------------- MIDDLEWARES -------------------- */
app.use(cors());
app.use(express.json());

/* -------------------- ROUTES -------------------- */

// health
app.get("/", (req, res) => {
  res.json({ message: "Sports Sphere Backend running 🚀" });
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/clubs", clubRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/student", studentProfileRoutes); // profile route
app.use("/api/events", eventRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/admin", adminRoutes); // super admin tools (e.g., create club admins)
app.use("/api/club-admin", clubAdminRoutes); // club admin self-service APIs
app.use("/api/sports-admin", sportsAdminRoutes); // sports admin tools
app.use("/api/public", publicRoutes); // public data access
app.use("/api/directory", directoryRoutes); // member directory
app.use("/api/map", mapRoutes); // campus map

// protected example
app.get("/api/profile", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// admin
app.get(
  "/api/admin/dashboard",
  authMiddleware,
  roleMiddleware(["sports_admin", "super_admin"]),
  getAdminDashboard
);

/* -------------------- SERVER -------------------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
