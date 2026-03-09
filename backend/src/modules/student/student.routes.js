import express from "express";
import {
  getStudentDashboard,
  getMyEvents,
  registerForSport,
  getCertificateDownload,
  submitFeedback,
  getMyTicket,
} from "./student.controller.js";
import authMiddleware from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/dashboard", authMiddleware, getStudentDashboard);
router.get("/my-events", authMiddleware, getMyEvents);
router.get("/certificates/:regId/download", authMiddleware, getCertificateDownload);
router.get("/my-ticket/:regId", authMiddleware, getMyTicket);

router.post("/feedback/:eventId", authMiddleware, submitFeedback);
router.post("/sports/:id/register", authMiddleware, registerForSport);

export default router;
