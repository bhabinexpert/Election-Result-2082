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

// ----- Sub-Components -----

/** Loading spinner shown while fetching candidate data */
const LoadingState = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-14 h-14 border-4 border-gray-200 border-t-[#1B2A4A] rounded-full animate-spin" />
  </div>
);

/** Error state with back navigation */
const ErrorState = ({ message }) => (
  <main className="max-w-4xl mx-auto px-4 py-12 text-center">
    <p className="text-red-500 text-lg font-semibold mb-4">
      {message || "Candidate not found"}
    </p>
    <Link to="/candidates" className="text-[#1B2A4A] hover:underline text-sm">
      Back to Candidates
    </Link>
  </main>
);

/** Single stat card in the profile header */
const StatBox = ({ value, label, bgColor = "bg-gray-50", textColor = "text-gray-800" }) => (
  <div className={`${bgColor} rounded-xl p-4 text-center`}>
    <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
    <p className="text-xs text-gray-500 mt-1">{label}</p>
  </div>
);

/** Election details list */
const DetailsList = ({ items }) => (
  <dl className="space-y-3">
    {items.map(([label, value]) => (
      <div
        key={label}
        className="flex justify-between py-2 border-b border-gray-50 last:border-0"
      >
        <dt className="text-sm text-gray-500">{label}</dt>
        <dd className="text-sm font-medium text-gray-800 capitalize">{value}</dd>
      </div>
    ))}
  </dl>
);

// ----- Main Component -----

const CandidateProfile = () => {
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
        setError(err.response?.data?.message || "Failed to load candidate");
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
  if (error || !candidate) return <ErrorState message={error} />;

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
    ["Constituency", c.constituency],
    ["District", c.district_name],
    ["Province", c.province_name],
    ["Party", c.party],
    ["Age", `${c.age} years`],
    ["Gender", c.gender],
    ["Votes Received", formatNumber(c.votes)],
    ["Constituency Rank", `#${c.constituencyRank} of ${c.constituencyTotal}`],
  ];

  // ----- Render -----

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Navigation */}
      <Link
        to="/candidates"
        className="inline-flex items-center gap-1 text-sm text-[#1B2A4A] hover:underline mb-6"
      >
        &larr; Back to Candidates
      </Link>

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        {/* Gradient Banner */}
        <div className="h-36 sm:h-44 bg-gradient-to-r from-[#1B2A4A] to-[#DC143C] relative">
          {isWinner && (
            <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              #1 in Constituency
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
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl border-4 border-white shadow-xl -mt-16 sm:-mt-20 object-cover bg-gray-100"
              onError={(e) => {
                e.target.src = getAvatarUrl(c.candidate_name, 320);
              }}
            />

            {/* Name & Party */}
            <div className="flex-1 pb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {c.candidate_name}
              </h1>
              <p className="text-[#1B2A4A] font-semibold text-lg mt-1">{c.party}</p>
              <p className="text-gray-500 text-sm mt-1">
                {c.constituency} • {c.district_name}
              </p>
            </div>
          </div>

          {/* Key Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <StatBox
              value={formatNumber(c.votes)}
              label="Total Votes"
              bgColor="bg-red-50"
              textColor="text-[#DC143C]"
            />
            <StatBox
              value={`#${c.constituencyRank}`}
              label={`of ${c.constituencyTotal} candidates`}
              bgColor="bg-slate-50"
              textColor="text-[#1B2A4A]"
            />
            <StatBox value={c.age} label="Age" />
            <StatBox value={c.gender} label="Gender" />
          </div>
        </div>
      </div>

      {/* Details & Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Election Details Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Election Details
          </h3>
          <DetailsList items={electionDetails} />
        </div>

        {/* Constituency Comparison Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Constituency Comparison
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
                    `${formatNumber(value)} votes`,
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
            <p className="text-gray-400 text-sm">No comparison data</p>
          )}
        </div>
      </div>

      {/* Constituency Peers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">
            All Candidates in {c.constituency}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Candidate
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Party
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                  Votes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(c.constituencyPeers || []).map((peer, i) => (
                <tr
                  key={peer._id}
                  className={
                    peer._id === c._id ? "bg-red-50/50 font-medium" : "hover:bg-gray-50"
                  }
                >
                  <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                  <td className="px-4 py-3 text-gray-800">
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
                  <td className="px-4 py-3 text-gray-600">{peer.party}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-800">
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
