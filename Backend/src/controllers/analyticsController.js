import PageView from "../models/PageView.js";

const isValidPath = (path) => typeof path === "string" && path.startsWith("/") && path.length <= 200;

const isValidVisitorId = (visitorId) =>
  typeof visitorId === "string" && visitorId.trim().length >= 8 && visitorId.trim().length <= 100;

export const trackPageView = async (req, res) => {
  try {
    const { path, visitorId } = req.body;
    console.log(`[ANALYTICS] Track: path=${path}, visitorId=${visitorId.substring(0, 8)}...`);

    if (!isValidPath(path) || !isValidVisitorId(visitorId)) {
      console.warn(`[ANALYTICS] Invalid: path valid=${isValidPath(path)}, id valid=${isValidVisitorId(visitorId)}`);
      return res.status(400).json({ success: false, message: "Invalid path or visitorId" });
    }

    const doc = await PageView.create({
      path,
      visitorId: visitorId.trim(),
      userAgent: req.headers["user-agent"] || "",
    });
    console.log(`[ANALYTICS] Saved: _id=${doc._id}, path=${path}`);

    res.status(201).json({
      success: true,
      data: { id: doc._id, path: doc.path, visitorId: doc.visitorId, createdAt: doc.createdAt },
    });
  } catch (error) {
    console.error(`[ANALYTICS] Track error:`, error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPageViewStats = async (req, res) => {
  try {
    const { path, visitorId } = req.query;
    console.log(`[ANALYTICS] GetStats: path=${path}, visitorId=${visitorId ? visitorId.substring(0, 8) + "..." : "none"}`);

    if (!isValidPath(path)) {
      console.warn(`[ANALYTICS] Invalid path: "${path}"`);
      return res.status(400).json({ success: false, message: "Invalid path" });
    }

    const [totalViews, uniqueVisitors, myViews] = await Promise.all([
      PageView.countDocuments({ path }),
      PageView.distinct("visitorId", { path }).then((ids) => ids.length),
      isValidVisitorId(visitorId) ? PageView.countDocuments({ path, visitorId: visitorId.trim() }) : 0,
    ]);
    console.log(`[ANALYTICS] Stats: path=${path}, total=${totalViews}, unique=${uniqueVisitors}, mine=${myViews}`);

    res.json({
      success: true,
      data: {
        path,
        totalViews,
        uniqueVisitors,
        myViews,
      },
    });
  } catch (error) {
    console.error(`[ANALYTICS] GetStats error:`, error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getGlobalStats = async (req, res) => {
  try {
    const { visitorId } = req.query;
    console.log(`[ANALYTICS] GetGlobalStats: visitorId=${visitorId ? visitorId.substring(0, 8) + "..." : "none"}`);

    const [totalViews, totalUniqueVisitors, visitorViews] = await Promise.all([
      PageView.countDocuments({}),
      PageView.distinct("visitorId", {}).then((ids) => ids.length),
      isValidVisitorId(visitorId) ? PageView.countDocuments({ visitorId: visitorId.trim() }) : 0,
    ]);
    console.log(`[ANALYTICS] GlobalStats: total=${totalViews}, unique=${totalUniqueVisitors}, visitorViews=${visitorViews}`);

    res.json({
      success: true,
      data: {
        totalViews,
        uniqueVisitors: totalUniqueVisitors,
        visitorViews,
      },
    });
  } catch (error) {
    console.error(`[ANALYTICS] GetGlobalStats error:`, error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
