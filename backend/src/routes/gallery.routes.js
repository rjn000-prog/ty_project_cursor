import express from "express";
import { listPublicGallery } from "../controllers/gallery.controller.js";

const router = express.Router();

router.get("/", listPublicGallery);

export default router;

