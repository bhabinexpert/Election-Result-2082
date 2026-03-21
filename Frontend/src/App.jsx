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
import { getGlobalStats, trackPageView } from "./services/api";
import { getOrCreateVisitorId } from "./utils/visitor";
import { formatNumber } from "./utils/formatters";

const AppContent = () => {
  const { t } = useAppSettings();
  const location = useLocation();
  const [viewStats, setViewStats] = useState({ uniqueVisitors: 0 });
  const [viewsStatus, setViewsStatus] = useState("loading");
  const visitorTrackedRef = useRef(false);

  useEffect(() => {
    const visitorId = getOrCreateVisitorId();

    // Track visitor ONLY ONCE globally (on first page load, not on every route change)
    if (!visitorTrackedRef.current) {
      visitorTrackedRef.current = true;
      trackPageView({ path: "/", visitorId }).catch((error) =>
        console.error("[ANALYTICS] Failed to track visitor:", error.message)
      );
    }

    // Fetch global stats on every page change
    getGlobalStats({ visitorId })
      .then((statsResponse) => {
        console.log("[ANALYTICS] Global stats:", statsResponse.data);
        const stats = statsResponse?.data?.data || {};
        const uniqueCount = parseInt(stats.uniqueVisitors, 10) || 0;
        setViewStats({ uniqueVisitors: uniqueCount });
        setViewsStatus("ready");
      })
      .catch((error) => {
        console.error("[ANALYTICS] Failed to load global stats:", error.response?.data || error.message);
        setViewsStatus("error");
      });
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
            {viewsStatus === "loading" ? (
              <div className="rounded-lg sm:rounded-xl border border-blue-200/90 dark:border-blue-700 bg-blue-50/90 dark:bg-blue-950/90 backdrop-blur-sm px-3 sm:px-4 py-2 text-xs sm:text-sm text-blue-700 dark:text-blue-200 shadow-sm flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-200 dark:border-slate-600 border-t-blue-600 dark:border-t-cyan-400 rounded-full animate-spin"></div>
                <span>...</span>
              </div>
            ) : viewsStatus === "error" ? (
              <div className="rounded-lg sm:rounded-xl border border-red-200/90 dark:border-red-700 bg-red-50/90 dark:bg-red-950/90 backdrop-blur-sm px-3 sm:px-4 py-2 text-xs sm:text-sm text-red-700 dark:text-red-200 shadow-sm">
                Visitor Count: {formatNumber(viewStats.uniqueVisitors)} (Error loading)
              </div>
            ) : (
              <div className="rounded-lg sm:rounded-xl border border-gray-200/90 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 dark:text-slate-200 shadow-sm">
                Visitor Count: {formatNumber(viewStats.uniqueVisitors)}
              </div>
            )}
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
