// ----- DataTable Component -----
// Professional data table with search, sort, pagination, and candidate links

import { Link } from "react-router-dom";
import { formatNumber } from "../utils/formatters";
import { HiChevronLeft, HiChevronRight, HiSearch } from "react-icons/hi";
import { useAppSettings } from "../context/AppSettingsContext";

const DataTable = ({
  data,
  pagination,
  page,
  setPage,
  search,
  setSearch,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}) => {
  const { t } = useAppSettings();
  // Handle sort click on column header
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  // Sort indicator arrow
  const SortArrow = ({ field }) => {
    if (sortBy !== field) return <span className="text-gray-300 ml-1">↕</span>;
    return (
      <span className="text-[#1B2A4A] ml-1">
        {sortOrder === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  // Table columns configuration
  const columns = [
    { key: "candidate_name", label: t.profile.candidate, sortable: true },
    { key: "party", label: t.common.party, sortable: true },
    { key: "constituency", label: t.common.constituency, sortable: true },
    { key: "district_name", label: t.common.district, sortable: true },
    { key: "province_name", label: t.common.province, sortable: true },
    { key: "gender", label: t.common.gender, sortable: true },
    { key: "age", label: t.common.age, sortable: true },
    { key: "votes", label: t.common.votes, sortable: true },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden card-3d">
      {/* Table Header with Search */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-100">
              {t.table.electionResults}
              <span className="text-sm font-normal text-gray-400 dark:text-slate-400 ml-2">
                ({formatNumber(pagination.total || 0)} {t.table.records})
              </span>
            </h3>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.table.searchCandidates}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A] focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-8">
                #
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                    className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-300 uppercase tracking-wider whitespace-nowrap ${
                    col.sortable
                      ? "cursor-pointer hover:text-gray-700 select-none"
                      : ""
                  }`}
                >
                  {col.label}
                  {col.sortable && <SortArrow field={col.key} />}
                </th>
              ))}
            </tr>
          </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
            {data && data.length > 0 ? (
              data.map((row, index) => (
                <tr
                  key={row._id || index}
                    className="hover:bg-red-50/30 dark:hover:bg-slate-800/70 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-400 dark:text-slate-400 text-xs">
                    {(page - 1) * (pagination.limit || 15) + index + 1}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-slate-100">
                    <Link
                      to={`/candidates/${row._id}`}
                      className="text-[#1B2A4A] dark:text-cyan-300 hover:text-[#DC143C] dark:hover:text-cyan-200 hover:underline transition-colors"
                    >
                      {row.candidate_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-slate-800 text-[#1B2A4A] dark:text-cyan-300">
                      {row.party}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">
                    {row.constituency}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">
                    {row.district_name}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">
                    {row.province_name}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300 capitalize">
                    {row.gender}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{row.age}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800 dark:text-slate-100">
                    {formatNumber(row.votes)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-4 py-12 text-center text-gray-400 dark:text-slate-400"
                >
                  {t.table.noResults}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-slate-300">
            {t.common.page} {pagination.page} {t.common.of} {pagination.totalPages}
          </p>
          <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <HiChevronLeft className="text-gray-600 dark:text-slate-300" />
              </button>

            {/* Page number buttons */}
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              let pageNum;
              if (pagination.totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    page === pageNum
                      ? "bg-[#1B2A4A] text-white"
                      : "text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
              disabled={page >= pagination.totalPages}
              className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <HiChevronRight className="text-gray-600 dark:text-slate-300" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
