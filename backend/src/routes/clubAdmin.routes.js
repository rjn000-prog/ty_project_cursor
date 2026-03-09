import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import { updateEvent } from "../controllers/event.controller.js";
import {
  getGlobalClubAdminDashboard,
  listAllClubsForAdmin,
  getClubForGlobalAdmin,
  createClubAsGlobalAdmin,
  updateClubAsGlobalAdmin,
  deleteClubAsGlobalAdmin,
  getClubMembersByClubId,
  removeClubMemberById,
  setClubJoinFormSchema,
  listAllEventsForAdmin,
  getEventForGlobalAdmin,
  createEventAsGlobalAdmin,
  deleteEventAsGlobalAdmin,
  setEventRegistrationFormSchema,
  getEventRegistrationsForAdmin,
  updateEventRegistrationStatus,
  getEventFeedbackForAdmin,
  getClubAdminAnalytics,
  issueCertificatesForEvent,
  generateRegistrationTicket,
  verifyAttendanceByQR,
  broadcastToEventParticipants,
} from "../controllers/clubAdminGlobal.controller.js";
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

// All routes below require an authenticated club_admin or super_admin
router.use(authMiddleware, roleMiddleware(["club_admin", "super_admin"]));

router.get("/dashboard", getGlobalClubAdminDashboard);

// Clubs management
router.get("/clubs", listAllClubsForAdmin);
router.post("/clubs", createClubAsGlobalAdmin);
router.get("/clubs/:id", getClubForGlobalAdmin);
router.put("/clubs/:id", updateClubAsGlobalAdmin);
router.delete("/clubs/:id", deleteClubAsGlobalAdmin);
router.get("/clubs/:id/members", getClubMembersByClubId);
router.delete("/clubs/:clubId/members/:memberId", removeClubMemberById);
router.put("/clubs/:id/join-form-schema", setClubJoinFormSchema);

// Events management
router.get("/events", listAllEventsForAdmin);
router.post("/events", createEventAsGlobalAdmin);
router.get("/events/:id", getEventForGlobalAdmin);
router.put("/events/:id", updateEvent);
router.delete("/events/:id", deleteEventAsGlobalAdmin);
router.get("/events/:id/registrations", getEventRegistrationsForAdmin);
router.put("/registrations/:id/update-status", updateEventRegistrationStatus);
router.get("/events/:id/feedback", getEventFeedbackForAdmin);
router.put("/events/:id/registration-form-schema", setEventRegistrationFormSchema);
router.post("/events/:id/issue-certificates", issueCertificatesForEvent);
router.get("/registrations/:id/ticket", generateRegistrationTicket);
router.post("/attendance/verify", verifyAttendanceByQR);
router.post("/events/:id/broadcast", broadcastToEventParticipants);

// Analytics
router.get("/analytics", getClubAdminAnalytics);

// News management
router.get("/news", listAdminNews);
router.post("/news", createAdminNews);
router.put("/news/:id", updateAdminNews);
router.delete("/news/:id", deleteAdminNews);

// Gallery management
router.get("/gallery", listAdminGallery);
router.post("/gallery", createAdminGalleryItem);
router.put("/gallery/:id", updateAdminGalleryItem);
router.delete("/gallery/:id", deleteAdminGalleryItem);

export default router;

