import { Router } from "express";
import { getPageViewStats, trackPageView } from "../controllers/analyticsController.js";

const router = Router();

router.post("/views", trackPageView);
router.get("/views", getPageViewStats);

export default router;
