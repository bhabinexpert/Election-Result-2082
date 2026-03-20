// ----- Candidate Profile Page -----
// Displays detailed information for a single candidate including:
// - Profile header with photo, name, party, and key stats
// - Election details card
// - Constituency comparison chart
// - Full table of all candidates in the same constituency

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Services & Utils
import { getCandidateById } from "../services/api";
import { formatNumber } from "../utils/formatters";
import { SECONDARY, getAvatarUrl } from "../utils/colors";
import { getCachedWikipediaImage } from "../utils/wikipedia";
import { useAppSettings } from "../context/AppSettingsContext";

// ----- Sub-Components -----

/** Loading spinner shown while fetching candidate data */
const LoadingState = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-14 h-14 border-4 border-gray-200 dark:border-slate-700 border-t-[#1B2A4A] dark:border-t-cyan-400 rounded-full animate-spin" />
  </div>
);

/** Error state with back navigation */
const ErrorState = ({ message, t }) => (
  <main className="max-w-4xl mx-auto px-4 py-12 text-center">
    <p className="text-red-500 text-lg font-semibold mb-4">
      {message || t.profile.candidateNotFound}
    </p>
    <Link to="/candidates" className="text-[#1B2A4A] dark:text-cyan-300 hover:underline text-sm">
      {t.profile.backToCandidates}
    </Link>
  </main>
);

/** Single stat card in the profile header */
const StatBox = ({ value, label, bgColor = "bg-gray-50 dark:bg-slate-800", textColor = "text-gray-800 dark:text-slate-100" }) => (
  <div className={`${bgColor} rounded-xl p-4 text-center`}>
    <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{label}</p>
  </div>
);

/** Election details list */
const DetailsList = ({ items }) => (
  <dl className="space-y-3">
    {items.map(([label, value]) => (
      <div
        key={label}
        className="flex justify-between py-2 border-b border-gray-50 dark:border-slate-800 last:border-0"
      >
        <dt className="text-sm text-gray-500 dark:text-slate-400">{label}</dt>
        <dd className="text-sm font-medium text-gray-800 dark:text-slate-100 capitalize">{value}</dd>
      </div>
    ))}
  </dl>
);

// ----- Main Component -----

const CandidateProfile = () => {
  const { t } = useAppSettings();
  const { id } = useParams();

  // ----- State -----
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  // ----- Data Fetching -----

  // Fetch candidate data when ID changes
  useEffect(() => {
    const fetchCandidate = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getCandidateById(id);
        setCandidate(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || t.profile.failedLoad);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidate();
  }, [id]);

  // Fetch Wikipedia image when candidate data loads (larger size for profile)
  useEffect(() => {
    if (!candidate?.candidate_name) return;

    const fetchImage = async () => {
      const imageUrl = await getCachedWikipediaImage(candidate.candidate_name, 400);
      setProfileImage(imageUrl);
    };
    fetchImage();
  }, [candidate?.candidate_name]);

  // ----- Render States -----

  if (loading) return <LoadingState />;
  if (error || !candidate) return <ErrorState message={error} t={t} />;

  // ----- Derived Data -----

  const c = candidate;
  const isWinner = c.constituencyRank === 1;

  // Prepare data for constituency comparison chart (top 10 peers)
  const peerChartData = (c.constituencyPeers || []).slice(0, 10).map((peer) => ({
    name: peer.candidate_name.length > 15
      ? `${peer.candidate_name.slice(0, 15)}...`
      : peer.candidate_name,
    fullName: peer.candidate_name,
    votes: peer.votes,
    party: peer.party,
    isCurrent: peer._id === c._id,
  }));

  // Election details for the info card
  const electionDetails = [
    [t.common.constituency, c.constituency],
    [t.common.district, c.district_name],
    [t.common.province, c.province_name],
    [t.common.party, c.party],
    [t.common.age, `${c.age} ${t.common.years}`],
    [t.common.gender, c.gender],
    [t.profile.votesReceived, formatNumber(c.votes)],
    [t.profile.constituencyRank, `#${c.constituencyRank} ${t.common.of} ${c.constituencyTotal}`],
  ];

  // ----- Render -----

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Navigation */}
      <Link
        to="/candidates"
        className="inline-flex items-center gap-1 text-sm text-[#1B2A4A] dark:text-cyan-300 hover:underline mb-6"
      >
        &larr; {t.profile.backToCandidates}
      </Link>

      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden mb-6 card-3d">
        {/* Gradient Banner */}
        <div className="h-36 sm:h-44 bg-gradient-to-r from-[#1B2A4A] to-[#DC143C] relative">
          {isWinner && (
              <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                {t.profile.rankBadge}
              </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-6 relative">
          {/* Profile Image - Wikipedia photo or fallback avatar */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <img
              src={profileImage || getAvatarUrl(c.candidate_name, 320)}
              alt={c.candidate_name}
               className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl border-4 border-white dark:border-slate-800 shadow-xl -mt-16 sm:-mt-20 object-cover bg-gray-100 dark:bg-slate-800"
              onError={(e) => {
                e.target.src = getAvatarUrl(c.candidate_name, 320);
              }}
            />

            {/* Name & Party */}
            <div className="flex-1 pb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-slate-100">
                {c.candidate_name}
              </h1>
              <p className="text-[#1B2A4A] dark:text-cyan-300 font-semibold text-lg mt-1">{c.party}</p>
              <p className="text-gray-500 dark:text-slate-300 text-sm mt-1">
                {c.constituency} • {c.district_name}
              </p>
            </div>
          </div>

          {/* Key Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <StatBox
              value={formatNumber(c.votes)}
               label={t.profile.totalVotes}
              bgColor="bg-red-50"
              textColor="text-[#DC143C]"
            />
            <StatBox
              value={`#${c.constituencyRank}`}
               label={`${t.common.of} ${c.constituencyTotal} ${t.common.candidates}`}
              bgColor="bg-slate-50"
              textColor="text-[#1B2A4A]"
            />
            <StatBox value={c.age} label={t.common.age} />
            <StatBox value={c.gender} label={t.common.gender} />
          </div>
        </div>
      </div>

      {/* Details & Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Election Details Card */}
         <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 card-3d">
           <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-100 mb-4">
             {t.profile.electionDetails}
           </h3>
          <DetailsList items={electionDetails} />
        </div>

        {/* Constituency Comparison Chart */}
         <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 card-3d">
           <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-100 mb-4">
             {t.profile.constituencyComparison}
           </h3>
          {peerChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={peerChartData}
                layout="vertical"
                margin={{ top: 0, right: 10, left: 5, bottom: 0 }}
              >
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value, _, props) => [
                     `${formatNumber(value)} ${t.common.votes}`,
                     props.payload.fullName,
                   ]}
                 />
                <Bar dataKey="votes" radius={[0, 4, 4, 0]} maxBarSize={24}>
                  {peerChartData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.isCurrent ? "#DC143C" : SECONDARY}
                      opacity={entry.isCurrent ? 1 : 0.4}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
             <p className="text-gray-400 dark:text-slate-400 text-sm">{t.profile.noComparisonData}</p>
           )}
         </div>
       </div>

      {/* Constituency Peers Table */}
       <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden card-3d">
         <div className="p-5 border-b border-gray-100 dark:border-slate-800">
           <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-100">
             {t.profile.allCandidatesIn} {c.constituency}
           </h3>
         </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
               <tr className="bg-gray-50 dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  #
                </th>
                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-300 uppercase">
                   {t.profile.candidate}
                 </th>
                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-300 uppercase">
                   {t.common.party}
                 </th>
                 <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-slate-300 uppercase">
                   {t.common.votes}
                 </th>
               </tr>
             </thead>
            <tbody className="divide-y divide-gray-50">
              {(c.constituencyPeers || []).map((peer, i) => (
                <tr
                  key={peer._id}
                  className={
                     peer._id === c._id ? "bg-red-50/50 dark:bg-slate-800 font-medium" : "hover:bg-gray-50 dark:hover:bg-slate-800"
                   }
                 >
                   <td className="px-4 py-3 text-gray-400 dark:text-slate-400">{i + 1}</td>
                   <td className="px-4 py-3 text-gray-800 dark:text-slate-100">
                    {peer._id === c._id ? (
                      <span className="font-semibold">{peer.candidate_name}</span>
                    ) : (
                      <Link
                        to={`/candidates/${peer._id}`}
                        className="text-[#1B2A4A] hover:underline"
                      >
                        {peer.candidate_name}
                      </Link>
                    )}
                  </td>
                   <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{peer.party}</td>
                   <td className="px-4 py-3 text-right font-semibold text-gray-800 dark:text-slate-100">
                    {formatNumber(peer.votes)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default CandidateProfile;
