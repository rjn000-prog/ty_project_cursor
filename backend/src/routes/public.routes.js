import express from "express";
import { listMatches } from "../controllers/sportsAdmin.controller.js";

const router = express.Router();

// Public Matches
router.get("/matches", listMatches);

export default router;
