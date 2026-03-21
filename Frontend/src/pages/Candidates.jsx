// ----- Candidates Page -----
// Grid of candidate cards with large photos, search, filters, and pagination.
// Photos are fetched from Wikipedia with fallback to avatar placeholders.

import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getElectionResults, getFilterOptions } from "../services/api";
import { formatNumber } from "../utils/formatters";
import { getAvatarUrl } from "../utils/colors";
import { getCachedWikipediaImage } from "../utils/wikipedia";
import { HiSearch, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { useAppSettings } from "../context/useAppSettings";

// ----- Candidate Card Component -----

const CandidateCard = ({ candidate, t }) => {
  const [photoUrl, setPhotoUrl] = useState(null);
  const c = candidate;

  // Fetch Wikipedia image on mount
  useEffect(() => {
    const fetchPhoto = async () => {
      const url = await getCachedWikipediaImage(c.candidate_name, 300);
      setPhotoUrl(url);
    };
    fetchPhoto();
  }, [c.candidate_name]);

  return (
    <Link
      to={`/candidates/${c._id}`}
      className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden hover:shadow-lg hover:border-[#1B2A4A]/20 transition-all group card-3d"
    >
      {/* Large Photo Section */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-900 overflow-hidden">
        <img
          src={photoUrl || getAvatarUrl(c.candidate_name, 300)}
          alt={c.candidate_name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = getAvatarUrl(c.candidate_name, 300);
          }}
        />
        {/* Vote Badge */}
        <div className="absolute bottom-3 right-3 bg-[#DC143C] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
          {formatNumber(c.votes)} {t.common.votes}
        </div>
        {/* Gender Badge */}
        <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-full capitalize text-gray-700 dark:text-slate-200">
          {c.gender}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        {/* Name & Party */}
        <h3 className="font-bold text-gray-900 dark:text-slate-100 text-lg truncate group-hover:text-[#1B2A4A] transition-colors">
          {c.candidate_name}
        </h3>
        <p className="text-sm text-[#1B2A4A] dark:text-cyan-300 font-medium truncate mt-0.5">
          {c.party}
        </p>

        {/* Location Info */}
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-800 space-y-1.5 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 dark:text-slate-400">{t.common.constituency}</span>
            <span className="text-gray-700 dark:text-slate-200 font-medium text-right truncate ml-2 max-w-[55%]">
              {c.constituency}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 dark:text-slate-400">{t.common.district}</span>
            <span className="text-gray-700 dark:text-slate-200 font-medium">{c.district_name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 dark:text-slate-400">{t.common.age}</span>
            <span className="text-gray-700 dark:text-slate-200 font-medium">{c.age} {t.common.years}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

// ----- Main Candidates Page -----

const Candidates = () => {
  const { t } = useAppSettings();
  // ----- State -----
  const [candidates, setCandidates] = useState([]);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [party, setParty] = useState("");
  const [gender, setGender] = useState("");
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);

  // ----- Fetch party list for filter dropdown -----
  useEffect(() => {
    getFilterOptions()
      .then((res) => setParties(res.data.data.parties))
      .catch(() => {});
  }, []);

  // ----- Fetch candidates when filters change -----
  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getElectionResults({
        search,
        page,
        limit: 12,
        sortBy: "votes",
        order: "desc",
        party,
        gender,
      });
      setCandidates(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error("Error fetching candidates:", err);
    } finally {
      setLoading(false);
    }
  }, [search, page, party, gender]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  // ----- Handlers -----
  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  // ----- Render -----
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">{t.candidatesPage.title}</h2>
        <p className="text-sm text-gray-500 dark:text-slate-300 mt-1">
          {t.candidatesPage.subtitlePrefix} {formatNumber(pagination.total || 0)} {t.candidatesPage.subtitleSuffix}
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-4 mb-6 card-3d">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={t.candidatesPage.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A] focus:border-transparent transition-all"
            />
          </div>

          {/* Party Filter */}
          <select
            value={party}
            onChange={(e) => {
              setParty(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2.5 text-sm border border-gray-200 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A] focus:border-transparent cursor-pointer"
          >
            <option value="">{t.common.allParties}</option>
            {parties.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          {/* Gender Filter */}
          <select
            value={gender}
            onChange={(e) => {
              setGender(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2.5 text-sm border border-gray-200 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A] focus:border-transparent cursor-pointer"
          >
            <option value="">{t.common.allGenders}</option>
            <option value="male">{t.common.male}</option>
            <option value="female">{t.common.female}</option>
            <option value="other">{t.common.other}</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#1B2A4A] rounded-full animate-spin" />
        </div>
      ) : candidates.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16 text-gray-400 dark:text-slate-400">
          {t.candidatesPage.noCandidates}
        </div>
      ) : (
        <>
          {/* Candidate Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
              {candidates.map((c) => (
                <CandidateCard key={c._id} candidate={c} t={t} />
              ))}
            </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer text-sm font-medium text-gray-700 dark:text-slate-200"
              >
                <HiChevronLeft />
                 {t.common.prev}
              </button>
              <span className="text-sm text-gray-600 dark:text-slate-300 font-medium">
                {t.common.page} {pagination.page} {t.common.of} {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                disabled={page >= pagination.totalPages}
                className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer text-sm font-medium text-gray-700 dark:text-slate-200"
              >
                {t.common.next}
                <HiChevronRight />
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default Candidates;
