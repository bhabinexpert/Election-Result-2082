// ----- useElectionData Hook -----
// Custom hook that manages all election data fetching and filter state

import { useState, useEffect, useCallback } from "react";
import {
  getOverviewStats,
  getStatsByParty,
  getStatsByProvince,
  getStatsByDistrict,
  getStatsByGender,
  getTopCandidates,
  getElectionResults,
  getFilterOptions,
} from "../services/api";

const useElectionData = () => {
  // ----- Filter State -----
  const [filters, setFilters] = useState({
    province_id: "",
    district_id: "",
    constituency: "",
    party: "",
    gender: "",
  });

  // ----- Data State -----
  const [overview, setOverview] = useState(null);
  const [partyStats, setPartyStats] = useState([]);
  const [provinceStats, setProvinceStats] = useState([]);
  const [districtStats, setDistrictStats] = useState([]);
  const [genderStats, setGenderStats] = useState([]);
  const [topCandidates, setTopCandidates] = useState([]);
  const [tableData, setTableData] = useState({ data: [], pagination: {} });
  const [filterOptions, setFilterOptions] = useState({
    provinces: [],
    districts: [],
    constituencies: [],
    parties: [],
  });

  // ----- Loading & Error State -----
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ----- Table pagination state -----
  const [tablePage, setTablePage] = useState(1);
  const [tableSearch, setTableSearch] = useState("");
  const [tableSortBy, setTableSortBy] = useState("votes");
  const [tableSortOrder, setTableSortOrder] = useState("desc");

  // Fetch filter options once on mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const res = await getFilterOptions();
        setFilterOptions(res.data.data);
      } catch (err) {
        console.error("Error fetching filter options:", err);
      }
    };
    fetchFilterOptions();
  }, []);

  // Fetch all dashboard data whenever filters change
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        overviewRes,
        partyRes,
        provinceRes,
        districtRes,
        genderRes,
        topRes,
      ] = await Promise.all([
        getOverviewStats(filters),
        getStatsByParty(filters),
        getStatsByProvince(filters),
        getStatsByDistrict({ ...filters, limit: 20 }),
        getStatsByGender(filters),
        getTopCandidates({ ...filters, limit: 10 }),
      ]);

      setOverview(overviewRes.data.data);
      setPartyStats(partyRes.data.data);
      setProvinceStats(provinceRes.data.data);
      setDistrictStats(districtRes.data.data);
      setGenderStats(genderRes.data.data);
      setTopCandidates(topRes.data.data);
    } catch (err) {
      setError(err.message || "Failed to fetch data");
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Fetch table data whenever filters, page, search, or sort changes
  const fetchTableData = useCallback(async () => {
    try {
      const res = await getElectionResults({
        ...filters,
        page: tablePage,
        limit: 15,
        search: tableSearch,
        sortBy: tableSortBy,
        order: tableSortOrder,
      });
      setTableData({
        data: res.data.data,
        pagination: res.data.pagination,
      });
    } catch (err) {
      console.error("Table fetch error:", err);
    }
  }, [filters, tablePage, tableSearch, tableSortBy, tableSortOrder]);

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData]);

  // Update a single filter value and reset page
  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setTablePage(1);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      province_id: "",
      district_id: "",
      constituency: "",
      party: "",
      gender: "",
    });
    setTablePage(1);
    setTableSearch("");
  };

  return {
    filters,
    updateFilter,
    resetFilters,
    overview,
    partyStats,
    provinceStats,
    districtStats,
    genderStats,
    topCandidates,
    tableData,
    tablePage,
    setTablePage,
    tableSearch,
    setTableSearch,
    tableSortBy,
    setTableSortBy,
    tableSortOrder,
    setTableSortOrder,
    filterOptions,
    loading,
    error,
  };
};

export default useElectionData;
