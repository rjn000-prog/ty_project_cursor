import express from "express";
import { getMapEvents } from "./map.controller.js";
import authMiddleware from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/events", authMiddleware, getMapEvents);

export default router;
