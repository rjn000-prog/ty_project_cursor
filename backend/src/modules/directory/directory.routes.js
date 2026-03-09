import express from "express";
import { getDirectory, updatePrivacySettings } from "./directory.controller.js";
import authMiddleware from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getDirectory);
router.put("/privacy", authMiddleware, updatePrivacySettings);

export default router;
