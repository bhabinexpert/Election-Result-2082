import { Router } from "express";
import { getPageViewStats, trackPageView, getGlobalStats } from "../controllers/analyticsController.js";

const router = Router();

router.post("/views", trackPageView);
router.get("/views", getPageViewStats);
router.get("/global-stats", getGlobalStats);

export default router;
