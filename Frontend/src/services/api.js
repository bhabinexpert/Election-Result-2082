// ----- API Service -----
// Centralized API calls to the backend using Axios
// Set VITE_API_URL in .env to configure the backend URL

import axios from "axios";

// Backend API base URL from environment variable
let API_URL = import.meta.env.VITE_API_URL || "https://election-result-2082.onrender.com";

// Remove trailing slash if present
if (API_URL.endsWith("/")) {
  API_URL = API_URL.slice(0, -1);
}

// Remove /api/elections if present to avoid duplication
if (API_URL.endsWith("/api/elections")) {
  API_URL = API_URL.replace("/api/elections", "");
}

const API = axios.create({
  baseURL: `${API_URL}/api/elections`,
});

/**
 * Builds query string from filter object, excluding empty values
 */
const buildParams = (filters = {}) => {
  const params = {};
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      params[key] = value;
    }
  });
  return params;
};

// ----- API Functions -----

/** Fetch paginated election results with filters */
export const getElectionResults = (filters = {}) =>
  API.get("/", { params: buildParams(filters) });

/** Fetch overview statistics (total votes, candidates, etc.) */
export const getOverviewStats = (filters = {}) =>
  API.get("/stats/overview", { params: buildParams(filters) });

/** Fetch vote stats grouped by party */
export const getStatsByParty = (filters = {}) =>
  API.get("/stats/by-party", { params: buildParams(filters) });

/** Fetch vote stats grouped by province */
export const getStatsByProvince = (filters = {}) =>
  API.get("/stats/by-province", { params: buildParams(filters) });

/** Fetch vote stats grouped by district */
export const getStatsByDistrict = (filters = {}) =>
  API.get("/stats/by-district", { params: buildParams(filters) });

/** Fetch vote stats grouped by gender */
export const getStatsByGender = (filters = {}) =>
  API.get("/stats/by-gender", { params: buildParams(filters) });

/** Fetch vote stats grouped by constituency */
export const getStatsByConstituency = (filters = {}) =>
  API.get("/stats/by-constituency", { params: buildParams(filters) });

/** Fetch top candidates by votes */
export const getTopCandidates = (filters = {}) =>
  API.get("/stats/top-candidates", { params: buildParams(filters) });

/** Fetch a single candidate by ID (with constituency peers) */
export const getCandidateById = (id) => API.get(`/${id}`);

/** Fetch all filter options for dropdowns */
export const getFilterOptions = () => API.get("/filters");

export default API;
