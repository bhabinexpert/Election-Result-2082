import PageView from "../models/PageView.js";

const isValidPath = (path) => typeof path === "string" && path.startsWith("/") && path.length <= 200;

const isValidVisitorId = (visitorId) =>
  typeof visitorId === "string" && visitorId.trim().length >= 8 && visitorId.trim().length <= 100;

export const trackPageView = async (req, res) => {
  try {
    const { path, visitorId } = req.body;

    if (!isValidPath(path) || !isValidVisitorId(visitorId)) {
      return res.status(400).json({ success: false, message: "Invalid path or visitorId" });
    }

    const doc = await PageView.create({
      path,
      visitorId: visitorId.trim(),
      userAgent: req.headers["user-agent"] || "",
    });

    res.status(201).json({
      success: true,
      data: { id: doc._id, path: doc.path, visitorId: doc.visitorId, createdAt: doc.createdAt },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPageViewStats = async (req, res) => {
  try {
    const { path, visitorId } = req.query;

    if (!isValidPath(path)) {
      return res.status(400).json({ success: false, message: "Invalid path" });
    }

    const [totalViews, uniqueVisitors, myViews] = await Promise.all([
      PageView.countDocuments({ path }),
      PageView.distinct("visitorId", { path }).then((ids) => ids.length),
      isValidVisitorId(visitorId) ? PageView.countDocuments({ path, visitorId: visitorId.trim() }) : 0,
    ]);

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
    res.status(500).json({ success: false, message: error.message });
  }
};
