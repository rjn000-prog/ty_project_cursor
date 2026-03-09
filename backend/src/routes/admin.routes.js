import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import { createClubAdmin, createSportsAdmin } from "../controllers/clubAdmin.controller.js";
import {
  listClubsWithAdmins,
  createClubWithAdmin,
  updateClubAsAdmin,
  deleteClubAsAdmin,
} from "../controllers/adminClub.controller.js";
import {
  listEventsForAdmin,
  updateEventAsAdmin,
  deleteEventAsAdmin,
} from "../controllers/adminEvent.controller.js";

const router = express.Router();

// All admin routes below require super_admin
router.use(authMiddleware, roleMiddleware(["super_admin"]));

// SUPER ADMIN: create club admins
router.post("/club-admins", createClubAdmin);

// SUPER ADMIN: create sports admins
router.post("/sports-admins", createSportsAdmin);

// SUPER ADMIN: clubs CRUD
router.get("/clubs", listClubsWithAdmins);
router.post("/clubs", createClubWithAdmin);
router.put("/clubs/:id", updateClubAsAdmin);
router.delete("/clubs/:id", deleteClubAsAdmin);

// SUPER ADMIN: events CRUD
router.get("/events", listEventsForAdmin);
router.put("/events/:id", updateEventAsAdmin);
router.delete("/events/:id", deleteEventAsAdmin);

export default router;

