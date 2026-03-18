// ----- Election Controller -----
// Handles all election data API logic
// Uses a shared buildFilter() helper to avoid repeating filter logic

import ElectionResult from "../models/ElectionResult.js";

// ----- Shared Helper -----
// Builds a MongoDB filter object from query params.
// Numeric fields are converted to Number, gender is lowercased.
// Only non-empty params are included, so empty strings are ignored.
const buildFilter = (query) => {
  const filter = {};
  const { province_id, district_id, constituency, party, gender } = query;

  if (province_id) filter.province_id = Number(province_id);
  if (district_id) filter.district_id = Number(district_id);
  if (constituency) filter.constituency = constituency;
  if (party) filter.party = party;
  if (gender) filter.gender = gender.toLowerCase();

  return filter;
};

// ----- GET /api/elections -----
// Returns paginated election results with optional filters and search
export const getElectionResults = async (req, res) => {
  try {
    const { search, page = 1, limit = 20, sortBy = "votes", order = "desc" } = req.query;
    const filter = buildFilter(req.query);

    // Add text search on candidate name if provided
    if (search) {
      filter.candidate_name = { $regex: search, $options: "i" };
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;
    const sortOrder = order === "asc" ? 1 : -1;

    // Run query and count in parallel for speed
    const [results, total] = await Promise.all([
      ElectionResult.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limitNum)
        .select("-__v -createdAt -updatedAt")
        .lean(),
      ElectionResult.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: results,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----- GET /api/elections/stats/overview -----
// Returns key dashboard metrics (totals, counts, top candidate)
export const getOverviewStats = async (req, res) => {
  try {
    const match = buildFilter(req.query);

    // Run aggregation and top candidate query in parallel
    const [stats, topCandidate] = await Promise.all([
      ElectionResult.aggregate([
        { $match: match },
        {
          $group: {
            _id: null,
            totalVotes: { $sum: "$votes" },
            totalCandidates: { $sum: 1 },
            uniqueParties: { $addToSet: "$party" },
            uniqueConstituencies: { $addToSet: "$constituency" },
            uniqueDistricts: { $addToSet: "$district_id" },
            uniqueProvinces: { $addToSet: "$province_id" },
            highestVotes: { $max: "$votes" },
            averageAge: { $avg: "$age" },
            maleCount: { $sum: { $cond: [{ $eq: ["$gender", "male"] }, 1, 0] } },
            femaleCount: { $sum: { $cond: [{ $eq: ["$gender", "female"] }, 1, 0] } },
            otherCount: { $sum: { $cond: [{ $eq: ["$gender", "other"] }, 1, 0] } },
          },
        },
      ]),
      ElectionResult.findOne(match)
        .sort({ votes: -1 })
        .select("candidate_name party votes constituency district_name province_name")
        .lean(),
    ]);

    const d = stats[0] || {};
    res.json({
      success: true,
      data: {
        totalVotes: d.totalVotes || 0,
        totalCandidates: d.totalCandidates || 0,
        totalParties: d.uniqueParties?.length || 0,
        totalConstituencies: d.uniqueConstituencies?.length || 0,
        totalDistricts: d.uniqueDistricts?.length || 0,
        totalProvinces: d.uniqueProvinces?.length || 0,
        highestVotes: d.highestVotes || 0,
        averageAge: Math.round(d.averageAge || 0),
        genderBreakdown: {
          male: d.maleCount || 0,
          female: d.femaleCount || 0,
          other: d.otherCount || 0,
        },
        topCandidate: topCandidate || null,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----- GET /api/elections/stats/by-party -----
// Returns vote totals and candidate counts grouped by party
export const getStatsByParty = async (req, res) => {
  try {
    const match = buildFilter(req.query);
    const limit = Number(req.query.limit) || 15;

    const stats = await ElectionResult.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$party",
          totalVotes: { $sum: "$votes" },
          candidateCount: { $sum: 1 },
          highestVote: { $max: "$votes" },
          avgVotes: { $avg: "$votes" },
        },
      },
      { $sort: { totalVotes: -1 } },
      { $limit: limit },
      {
        $project: {
          party: "$_id",
          totalVotes: 1,
          candidateCount: 1,
          highestVote: 1,
          avgVotes: { $round: ["$avgVotes", 0] },
          _id: 0,
        },
      },
    ]);

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----- GET /api/elections/stats/by-province -----
// Returns vote totals grouped by province
export const getStatsByProvince = async (req, res) => {
  try {
    const match = buildFilter(req.query);

    const stats = await ElectionResult.aggregate([
      { $match: match },
      {
        $group: {
          _id: { province_id: "$province_id", province_name: "$province_name" },
          totalVotes: { $sum: "$votes" },
          candidateCount: { $sum: 1 },
          constituencies: { $addToSet: "$constituency" },
        },
      },
      { $sort: { "_id.province_id": 1 } },
      {
        $project: {
          province_id: "$_id.province_id",
          province_name: "$_id.province_name",
          totalVotes: 1,
          candidateCount: 1,
          totalConstituencies: { $size: "$constituencies" },
          _id: 0,
        },
      },
    ]);

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----- GET /api/elections/stats/by-district -----
// Returns vote totals grouped by district
export const getStatsByDistrict = async (req, res) => {
  try {
    const match = buildFilter(req.query);

    const stats = await ElectionResult.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            district_id: "$district_id",
            district_name: "$district_name",
            province_name: "$province_name",
          },
          totalVotes: { $sum: "$votes" },
          candidateCount: { $sum: 1 },
        },
      },
      { $sort: { totalVotes: -1 } },
      {
        $project: {
          district_id: "$_id.district_id",
          district_name: "$_id.district_name",
          province_name: "$_id.province_name",
          totalVotes: 1,
          candidateCount: 1,
          _id: 0,
        },
      },
    ]);

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----- GET /api/elections/stats/by-gender -----
// Returns vote and candidate stats grouped by gender
export const getStatsByGender = async (req, res) => {
  try {
    const match = buildFilter(req.query);

    const stats = await ElectionResult.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$gender",
          totalVotes: { $sum: "$votes" },
          candidateCount: { $sum: 1 },
          avgVotes: { $avg: "$votes" },
        },
      },
      {
        $project: {
          gender: "$_id",
          totalVotes: 1,
          candidateCount: 1,
          avgVotes: { $round: ["$avgVotes", 0] },
          _id: 0,
        },
      },
    ]);

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----- GET /api/elections/stats/top-candidates -----
// Returns top N candidates by votes
export const getTopCandidates = async (req, res) => {
  try {
    const match = buildFilter(req.query);
    const limit = Number(req.query.limit) || 10;

    // .lean() returns plain JS objects — faster than Mongoose documents
    const candidates = await ElectionResult.find(match)
      .sort({ votes: -1 })
      .limit(limit)
      .select("candidate_name party votes constituency district_name province_name gender age")
      .lean();

    res.json({ success: true, data: candidates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----- GET /api/elections/filters -----
// Returns unique values for all filter dropdowns
export const getFilterOptions = async (req, res) => {
  try {
    // Run all four queries in parallel
    const [provinces, districts, constituencies, parties] = await Promise.all([
      ElectionResult.aggregate([
        { $group: { _id: { province_id: "$province_id", province_name: "$province_name" } } },
        { $sort: { "_id.province_id": 1 } },
        { $project: { province_id: "$_id.province_id", province_name: "$_id.province_name", _id: 0 } },
      ]),
      ElectionResult.aggregate([
        { $group: { _id: { district_id: "$district_id", district_name: "$district_name", province_id: "$province_id" } } },
        { $sort: { "_id.district_name": 1 } },
        { $project: { district_id: "$_id.district_id", district_name: "$_id.district_name", province_id: "$_id.province_id", _id: 0 } },
      ]),
      ElectionResult.distinct("constituency"),
      ElectionResult.distinct("party"),
    ]);

    res.json({
      success: true,
      data: {
        provinces,
        districts,
        constituencies: constituencies.sort(),
        parties: parties.sort(),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----- GET /api/elections/:id -----
// Returns a single candidate by MongoDB _id
export const getCandidateById = async (req, res) => {
  try {
    const candidate = await ElectionResult.findById(req.params.id)
      .select("-__v -createdAt -updatedAt")
      .lean();

    if (!candidate) {
      return res.status(404).json({ success: false, message: "Candidate not found" });
    }

    // Find other candidates in the same constituency for context
    const constituencyPeers = await ElectionResult.find({
      constituency: candidate.constituency,
    })
      .sort({ votes: -1 })
      .select("candidate_name party votes")
      .lean();

    // Find candidate's rank in their constituency
    const rank = constituencyPeers.findIndex(
      (c) => c._id.toString() === candidate._id.toString()
    ) + 1;

    res.json({
      success: true,
      data: {
        ...candidate,
        constituencyRank: rank,
        constituencyTotal: constituencyPeers.length,
        constituencyPeers,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----- GET /api/elections/stats/by-constituency -----
// Returns vote totals grouped by constituency
export const getStatsByConstituency = async (req, res) => {
  try {
    const match = buildFilter(req.query);

    const stats = await ElectionResult.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$constituency",
          totalVotes: { $sum: "$votes" },
          candidateCount: { $sum: 1 },
        },
      },
      { $sort: { totalVotes: -1 } },
      {
        $project: {
          constituency: "$_id",
          totalVotes: 1,
          candidateCount: 1,
          _id: 0,
        },
      },
    ]);

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
