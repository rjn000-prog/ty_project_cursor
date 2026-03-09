import express from "express";
import { listPublicNews, getNewsBySlug } from "../controllers/news.controller.js";

const router = express.Router();

router.get("/", listPublicNews);
router.get("/:slug", getNewsBySlug);

export default router;

