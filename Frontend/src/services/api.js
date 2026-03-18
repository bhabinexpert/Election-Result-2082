// ----- API Service -----
// Centralized API calls to the backend using Axios
// Set VITE_API_URL in .env to configure the backend URL

import axios from "axios";

// Backend API base URL from environment variable
const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/elections`,
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

/** Fetch top candidates by votes */
export const getTopCandidates = (filters = {}) =>
  API.get("/stats/top-candidates", { params: buildParams(filters) });

/** Fetch a single candidate by ID (with constituency peers) */
export const getCandidateById = (id) => API.get(`/${id}`);

/** Fetch all filter options for dropdowns */
export const getFilterOptions = () => API.get("/filters");

export default API;
