import { useMemo, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getElectionResults } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import DataTable from "../components/DataTable";
import { formatNumber } from "../utils/formatters";
import { getPartyLogo } from "../utils/partyLogo";
import { useAppSettings } from "../context/useAppSettings";

const PartyDetail = () => {
  const { partyName } = useParams();
  const decodedParty = decodeURIComponent(partyName || "");
  const { t } = useAppSettings();

  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logo, setLogo] = useState("");

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("votes");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    const loadLogo = async () => {
      const url = await getPartyLogo(decodedParty, 220);
      setLogo(url);
    };
    loadLogo();
  }, [decodedParty]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getElectionResults({
          party: decodedParty,
          page,
          limit: 20,
          search,
          sortBy,
          order: sortOrder,
        });
        setRows(res.data.data || []);
        setPagination(res.data.pagination || {});
      } catch (err) {
        setError(err.message || t.common.failedFetchPartyDetails);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [decodedParty, page, search, sortBy, sortOrder, t.common.failedFetchPartyDetails]);

  const details = useMemo(() => {
    const totalVotes = rows.reduce((sum, r) => sum + (r.votes || 0), 0);
    const districts = new Set(rows.map((r) => r.district_name).filter(Boolean)).size;
    const provinces = new Set(rows.map((r) => r.province_name).filter(Boolean)).size;
    const topCandidate = rows[0] || null;
    return {
      totalVotes,
      districts,
      provinces,
      topCandidate,
      candidateCount: pagination.total || rows.length,
    };
  }, [rows, pagination.total]);

  if (loading && rows.length === 0) return <LoadingSpinner />;

  if (error) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p className="text-red-500 dark:text-red-300">{error}</p>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Link to="/parties" className="inline-flex text-sm text-[#1B2A4A] dark:text-cyan-300 hover:underline mb-4">
        &larr; {t.parties.title}
      </Link>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5 mb-6 card-3d">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={logo}
            alt={decodedParty}
            className="w-16 h-16 rounded-xl object-cover bg-white border border-gray-200 dark:border-slate-700"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">{decodedParty}</h2>
            <p className="text-sm text-gray-500 dark:text-slate-300">
              {formatNumber(details.candidateCount)} {t.common.candidates}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40">
            <p className="text-xs text-red-600 dark:text-red-300">{t.common.votes}</p>
            <p className="text-xl font-bold text-red-700 dark:text-red-200">{formatNumber(details.totalVotes)}</p>
          </div>
          <div className="rounded-xl p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40">
            <p className="text-xs text-blue-700 dark:text-blue-300">{t.common.candidates}</p>
            <p className="text-xl font-bold text-blue-800 dark:text-blue-200">{formatNumber(details.candidateCount)}</p>
          </div>
          <div className="rounded-xl p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
            <p className="text-xs text-slate-600 dark:text-slate-300">{t.common.district}</p>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{details.districts}</p>
          </div>
          <div className="rounded-xl p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
            <p className="text-xs text-emerald-600 dark:text-emerald-300">{t.common.province}</p>
            <p className="text-xl font-bold text-emerald-700 dark:text-emerald-200">{details.provinces}</p>
          </div>
        </div>

        {details.topCandidate && (
          <div className="mt-4 p-4 rounded-xl border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50">
            <p className="text-xs text-gray-500 dark:text-slate-400">{t.charts.leadingCandidate}</p>
            <p className="font-semibold text-gray-800 dark:text-slate-100">{details.topCandidate.candidate_name}</p>
            <p className="text-sm text-gray-500 dark:text-slate-300">
              {details.topCandidate.constituency} • {details.topCandidate.district_name}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 mb-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 p-5 card-3d">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-100 mb-3">{t.charts.top10Candidates}</h3>
          <div className="space-y-3">
            {rows.slice(0, 10).map((c, i) => (
              <div key={c._id || `${c.candidate_name}-${i}`} className="rounded-lg border border-gray-100 dark:border-slate-800 p-3 bg-gray-50 dark:bg-slate-800/50">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-slate-100">#{i + 1} {c.candidate_name}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-300">{c.constituency} • {c.district_name} • {c.province_name}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-300">{t.common.party}: {c.party}</p>
                  </div>
                  <p className="text-sm font-bold text-[#1B2A4A] dark:text-cyan-300">{formatNumber(c.votes)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DataTable
        data={rows}
        pagination={pagination}
        page={page}
        setPage={setPage}
        search={search}
        setSearch={setSearch}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
    </main>
  );
};

export default PartyDetail;

