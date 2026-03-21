import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { getStatsByConstituency } from "../services/api";
import { useAppSettings } from "../context/useAppSettings";
import { formatNumber } from "../utils/formatters";

const Constituencies = () => {
  const { t } = useAppSettings();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("totalVotes");
  const [sortOrder, setSortOrder] = useState("desc");

  const fallbackConstituencyError = t.common.failedFetchConstituencyStats;

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await getStatsByConstituency({ limit: 1000 });
        setData(res.data.data || []);
      } catch (err) {
        setError(err.message || fallbackConstituencyError);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [fallbackConstituencyError]);

  const filteredAndSorted = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = query
      ? data.filter((row) =>
          String(row.constituency || "").toLowerCase().includes(query)
        )
      : data;

    const sorted = [...filtered].sort((a, b) => {
      const aValue = a?.[sortBy] ?? 0;
      const bValue = b?.[sortBy] ?? 0;

      if (sortBy === "constituency") {
        return sortOrder === "asc"
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      }

      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });

    return sorted;
  }, [data, search, sortBy, sortOrder]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">{t.constituencies.title}</h2>
        <p className="text-sm text-gray-500 dark:text-slate-300 mt-1">{t.constituencies.subtitle}</p>
      </div>

      {error ? (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl p-6 max-w-md text-center">
          <p className="text-red-600 dark:text-red-400 font-semibold text-lg mb-2">{t.common.connectionError}</p>
          <p className="text-red-400 dark:text-red-300 text-xs mt-2">{error}</p>
        </div>
      ) : loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-5 card-3d">
            <div className="mb-4 flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-100">
                {t.constituencies.leaderboard}
              </h3>
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t.constituencies.searchPlaceholder}
                  className="px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm text-gray-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
                <select
                  value={`${sortBy}:${sortOrder}`}
                  onChange={(e) => {
                    const [nextSortBy, nextSortOrder] = e.target.value.split(":");
                    setSortBy(nextSortBy);
                    setSortOrder(nextSortOrder);
                  }}
                  className="px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm text-gray-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="totalVotes:desc">{t.constituencies.sortVotesDesc}</option>
                  <option value="totalVotes:asc">{t.constituencies.sortVotesAsc}</option>
                  <option value="candidateCount:desc">{t.constituencies.sortCandidatesDesc}</option>
                  <option value="candidateCount:asc">{t.constituencies.sortCandidatesAsc}</option>
                  <option value="constituency:asc">{t.constituencies.sortNameAsc}</option>
                  <option value="constituency:desc">{t.constituencies.sortNameDesc}</option>
                </select>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-300 mb-4">
              {t.constituencies.showingCount} {filteredAndSorted.length}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredAndSorted.map((row, idx) => {
                const isCandidateSort = sortBy === "candidateCount";
                const primaryLabel = isCandidateSort ? t.common.candidates : t.common.votes;
                const primaryValue = isCandidateSort ? row.candidateCount : row.totalVotes;
                const secondaryLabel = isCandidateSort ? t.common.votes : t.common.candidates;
                const secondaryValue = isCandidateSort ? row.totalVotes : row.candidateCount;

                return (
                <Link
                  key={row.constituency}
                  to={`/constituencies/${encodeURIComponent(row.constituency)}`}
                  className="flex items-center justify-between rounded-xl border px-4 py-3 bg-gray-50/70 dark:bg-slate-800/50 text-left border-gray-100 dark:border-slate-800"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-slate-100">
                      #{idx + 1} {row.constituency}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      {secondaryLabel}: {formatNumber(secondaryValue)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-800 dark:text-slate-100">
                      {primaryLabel}: {formatNumber(primaryValue)}
                    </p>
                    <p className="text-[11px] text-cyan-600 dark:text-cyan-300 mt-1">
                      {t.constituencies.openDetails}
                    </p>
                  </div>
                </Link>
                );
              })}
            </div>
            {!filteredAndSorted.length && (
              <p className="text-sm text-gray-500 dark:text-slate-300 mt-4">
                {t.common.noData}
              </p>
            )}
          </div>
        </>
      )}
    </main>
  );
};

export default Constituencies;

