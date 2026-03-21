import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAppSettings } from "../context/useAppSettings";
import { formatNumber } from "../utils/formatters";
import { getStatsByParty } from "../services/api";
import { getPartyLogo } from "../utils/partyLogo";

const Parties = () => {
  const [partyStats, setPartyStats] = useState([]);
  const [partyLogos, setPartyLogos] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useAppSettings();
  const fallbackPartyError = t.common.failedFetchPartyStats;

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getStatsByParty({ limit: 25 });
        setPartyStats(res.data.data || []);
      } catch (err) {
        setError(err.message || fallbackPartyError);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [fallbackPartyError]);

  useEffect(() => {
    const loadLogos = async () => {
      const subset = partyStats.slice(0, 20);
      const entries = await Promise.all(
        subset.map(async (party) => [party.party, await getPartyLogo(party.party, 120)])
      );
      setPartyLogos(Object.fromEntries(entries));
    };
    if (partyStats.length) loadLogos();
  }, [partyStats]);

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl p-6 max-w-md text-center">
          <p className="text-red-600 dark:text-red-400 font-semibold text-lg mb-2">{t.common.connectionError}</p>
          <p className="text-red-400 dark:text-red-300 text-xs mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">{t.parties.title}</h2>
        <p className="text-sm text-gray-500 dark:text-slate-300 mt-1">{t.parties.subtitle}</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-5 card-3d">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-100 mb-4">
              {t.parties.leaderboard}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {partyStats.slice(0, 10).map((party, idx) => (
                <Link
                  key={party.party}
                  to={`/parties/${encodeURIComponent(party.party)}`}
                  className="rounded-xl border px-4 py-3 bg-gray-50/70 dark:bg-slate-800/50 hover:border-cyan-500/40 transition-all text-left border-gray-100 dark:border-slate-800 block"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={partyLogos[party.party]}
                      alt={party.party}
                      className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-slate-700 bg-white"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-slate-100">
                        #{idx + 1} {party.party}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">
                        {t.common.candidates}: {party.candidateCount}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-800 dark:text-slate-100">
                      {formatNumber(party.totalVotes)}
                    </p>
                    <p className="text-[11px] text-cyan-600 dark:text-cyan-300 mt-1">
                      {t.parties.openDetails}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default Parties;

