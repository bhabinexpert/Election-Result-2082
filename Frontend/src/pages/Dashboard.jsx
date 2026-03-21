// ----- Dashboard Page -----
// Main page that brings together all components

import useElectionData from "../hooks/useElectionData";
import StatCard from "../components/StatCard";
import FilterBar from "../components/FilterBar";
import PartyBarChart from "../components/PartyBarChart";
import VoteSharePieChart from "../components/VoteSharePieChart";
import ProvinceChart from "../components/ProvinceChart";
import GenderChart from "../components/GenderChart";
import TopCandidatesChart from "../components/TopCandidatesChart";
import DistrictChart from "../components/DistrictChart";
import DataTable from "../components/DataTable";
import LoadingSpinner from "../components/LoadingSpinner";
import { formatNumber } from "../utils/formatters";
import { useAppSettings } from "../context/useAppSettings";
import {
  HiOutlineUsers,
  HiOutlineChartBar,
  HiOutlineOfficeBuilding,
  HiOutlineLocationMarker,
  HiOutlineStar,
  HiOutlineUserGroup,
  HiOutlineGlobe,
  HiOutlineClipboardList,
} from "react-icons/hi";

const Dashboard = () => {
  const { t } = useAppSettings();
  const {
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
  } = useElectionData();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl p-6 max-w-md text-center">
          <p className="text-red-600 font-semibold text-lg mb-2">
            {t.common.connectionError}
          </p>
          <p className="text-red-500 dark:text-red-300 text-sm">
            Unable to connect to the server. Make sure the backend is running
            on port 5000 and MongoDB is connected.
          </p>
          <p className="text-red-400 dark:text-red-300 text-xs mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Page Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">{t.dashboard.title}</h2>
        <p className="text-sm text-gray-500 dark:text-slate-300 mt-1">{t.dashboard.subtitle}</p>
      </div>

      {/* Filters */}
      <FilterBar
        filters={filters}
        filterOptions={filterOptions}
        updateFilter={updateFilter}
        resetFilters={resetFilters}
      />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* ----- Stat Cards ----- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title={t.dashboard.totalVotesCast}
              value={overview?.totalVotes || 0}
              icon={<HiOutlineChartBar />}
              color="crimson"
            />
            <StatCard
              title={t.dashboard.totalCandidates}
              value={overview?.totalCandidates || 0}
              icon={<HiOutlineUsers />}
              color="blue"
            />
            <StatCard
              title={t.dashboard.politicalParties}
              value={overview?.totalParties || 0}
              icon={<HiOutlineOfficeBuilding />}
              color="maroon"
            />
            <StatCard
              title={t.dashboard.constituencies}
              value={overview?.totalConstituencies || 0}
              icon={<HiOutlineLocationMarker />}
              color="steel"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title={t.dashboard.highestVotes}
              value={overview?.highestVotes || 0}
              icon={<HiOutlineStar />}
              color="rust"
              subtitle={overview?.topCandidate?.candidate_name || ""}
            />
            <StatCard
              title={t.dashboard.filteredResults}
              value={tableData?.pagination?.total || 0}
              icon={<HiOutlineUserGroup />}
              color="ocean"
              subtitle={t.dashboard.matchingFilters}
            />
            <StatCard
              title={t.dashboard.provinces}
              value={overview?.totalProvinces || 0}
              icon={<HiOutlineGlobe />}
              color="deep"
            />
            <StatCard
              title={t.dashboard.districts}
              value={overview?.totalDistricts || 0}
              icon={<HiOutlineClipboardList />}
              color="slate"
            />
          </div>

          {/* ----- Top Candidate Highlight ----- */}
          {overview?.topCandidate && (
            <div className="mb-8 bg-linear-to-r from-red-50 via-rose-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border border-red-200 dark:border-slate-700 rounded-xl p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-[#DC143C] uppercase tracking-wider mb-1">
                    {t.dashboard.highestVoteGetter}
                  </p>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-slate-100">
                    {overview.topCandidate.candidate_name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-slate-300">
                    {overview.topCandidate.party} &middot;{" "}
                    {overview.topCandidate.constituency} &middot;{" "}
                    {overview.topCandidate.district_name},{" "}
                    {overview.topCandidate.province_name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-[#DC143C]">
                    {formatNumber(overview.topCandidate.votes)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">{t.dashboard.votesReceived}</p>
                </div>
              </div>
            </div>
          )}

          {/* ----- Charts Row 1: Party Bar + Vote Share Pie ----- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <PartyBarChart data={partyStats} />
            <VoteSharePieChart
              data={partyStats}
              title={t.charts.voteShare}
              valueLabel={t.common.votes}
              nameKey="party"
              othersLabel={t.common.others}
            />
          </div>

          {/* ----- Charts Row 2: Province + Top Candidates ----- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <ProvinceChart data={provinceStats} />
            <TopCandidatesChart data={topCandidates} />
          </div>

          {/* ----- Charts Row 3: Gender + District ----- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <GenderChart data={genderStats} />
            <DistrictChart data={districtStats} />
          </div>

          {/* ----- Data Table ----- */}
          <div className="mb-8">
            <DataTable
              data={tableData.data}
              pagination={tableData.pagination}
              page={tablePage}
              setPage={setTablePage}
              search={tableSearch}
              setSearch={setTableSearch}
              sortBy={tableSortBy}
              setSortBy={setTableSortBy}
              sortOrder={tableSortOrder}
              setSortOrder={setTableSortOrder}
            />
          </div>
        </>
      )}
    </main>
  );
};

export default Dashboard;
