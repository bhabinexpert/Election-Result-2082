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
          await trackPageView({ path, visitorId });
        }
        const statsResponse = await getPageViewStats({ path, visitorId });
        const stats = statsResponse.data?.data;
        setViewStats({
          uniqueVisitors: stats?.uniqueVisitors || 0,
        });
        setViewsStatus("ready");
      } catch (error) {
        console.error("Failed to load view analytics", error);
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
        <footer className="text-center py-6 border-t border-gray-200 dark:border-slate-800 mt-8">
          <p className="text-sm text-gray-400 dark:text-slate-400">{t.app.footer}</p>
          <div className="max-w-7xl mx-auto mt-3 px-4 sm:px-6 lg:px-8 flex justify-end">
            <div className="rounded-xl border border-gray-200/90 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-4 py-2 text-xs sm:text-sm text-gray-700 dark:text-slate-200 shadow-sm">
              Visitor Count: {formatNumber(viewStats.uniqueVisitors)}
              {viewsStatus === "loading" && <span className="ml-2 opacity-70">(loading...)</span>}
              {viewsStatus === "error" && <span className="ml-2 text-amber-600 dark:text-amber-400">(offline)</span>}
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
