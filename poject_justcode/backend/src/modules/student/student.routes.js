import express from "express";
import { getStudentDashboard } from "./student.controller.js";
import authMiddleware from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/dashboard", authMiddleware, getStudentDashboard);

export default router;
