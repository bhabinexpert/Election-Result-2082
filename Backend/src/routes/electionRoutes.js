// ----- Election Routes -----
// Defines all API endpoints for election data

import { Router } from "express";
import {
  getElectionResults,
  getOverviewStats,
  getStatsByParty,
  getStatsByProvince,
  getStatsByDistrict,
  getStatsByGender,
  getTopCandidates,
  getFilterOptions,
  getStatsByConstituency,
  getCandidateById,
} from "../controllers/electionController.js";

const router = Router();

// Filter options for dropdown menus
router.get("/filters", getFilterOptions);

// Statistics endpoints
router.get("/stats/overview", getOverviewStats);
router.get("/stats/by-party", getStatsByParty);
router.get("/stats/by-province", getStatsByProvince);
router.get("/stats/by-district", getStatsByDistrict);
router.get("/stats/by-gender", getStatsByGender);
router.get("/stats/by-constituency", getStatsByConstituency);
router.get("/stats/top-candidates", getTopCandidates);

// Single candidate by ID
router.get("/:id", getCandidateById);

// Main election results with filtering and pagination
router.get("/", getElectionResults);

export default router;
