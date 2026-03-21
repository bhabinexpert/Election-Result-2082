// ----- App Root Component -----
// Sets up React Router with multi-page navigation

import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Candidates from "./pages/Candidates";
import CandidateProfile from "./pages/CandidateProfile";
import Parties from "./pages/Parties";
import Constituencies from "./pages/Constituencies";
import PartyDetail from "./pages/PartyDetail";
import ConstituencyDetail from "./pages/ConstituencyDetail";
import { useAppSettings } from "./context/useAppSettings";
import { getPageViewStats, trackPageView } from "./services/api";
import { getOrCreateVisitorId } from "./utils/visitor";
import { formatNumber } from "./utils/formatters";

const AppContent = () => {
  const { t } = useAppSettings();
  const location = useLocation();
  const [viewStats, setViewStats] = useState({ uniqueVisitors: 0 });
  const [viewsStatus, setViewsStatus] = useState("loading");
  const trackedRef = useRef(new Set());

  useEffect(() => {
    const path = location.pathname || "/";
    const visitorId = getOrCreateVisitorId();
    const key = `${path}:${visitorId}`;

    const sendAnalytics = async () => {
      setViewsStatus("loading");
      try {
        if (!trackedRef.current.has(key)) {
          trackedRef.current.add(key);
          const trackRes = await trackPageView({ path, visitorId });
          console.log("Tracked page view:", trackRes.data);
        }
        const statsResponse = await getPageViewStats({ path, visitorId });
        console.log("Analytics stats:", statsResponse.data);
        const stats = statsResponse?.data?.data || {};
        const uniqueCount = parseInt(stats.uniqueVisitors, 10) || 0;
        setViewStats({
          uniqueVisitors: uniqueCount,
        });
        setViewsStatus("ready");
      } catch (error) {
        console.error("Failed to load view analytics", error.response?.data || error.message);
        setViewsStatus("error");
      }
    };

    sendAnalytics();
  }, [location.pathname]);

  return (
    <div className="app-shell min-h-screen bg-gray-50 dark:bg-slate-950">
      <Navbar />
      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/parties" element={<Parties />} />
          <Route path="/parties/:partyName" element={<PartyDetail />} />
          <Route path="/constituencies" element={<Constituencies />} />
          <Route path="/constituencies/:constituencyName" element={<ConstituencyDetail />} />
          <Route path="/candidates/:id" element={<CandidateProfile />} />
        </Routes>
        <footer className="text-center py-4 sm:py-6 border-t border-gray-200 dark:border-slate-800 mt-6 sm:mt-8">
          <p className="text-xs sm:text-sm text-gray-400 dark:text-slate-400">{t.app.footer}</p>
          <div className="max-w-7xl mx-auto mt-2 sm:mt-3 px-3 sm:px-4 md:px-6 lg:px-8 flex flex-col sm:flex-row justify-center sm:justify-end gap-2 sm:gap-0">
            <div className="rounded-lg sm:rounded-xl border border-gray-200/90 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 dark:text-slate-200 shadow-sm">
              Visitor Count: {formatNumber(viewStats.uniqueVisitors)}
              {viewsStatus === "loading" && <span className="ml-1 sm:ml-2 opacity-70 inline">(loading...)</span>}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
