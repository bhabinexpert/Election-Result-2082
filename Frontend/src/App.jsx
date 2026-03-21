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
  const [viewStats, setViewStats] = useState(null);
  const trackedRef = useRef(new Set());

  useEffect(() => {
    const path = location.pathname || "/";
    const visitorId = getOrCreateVisitorId();
    const key = `${path}:${visitorId}`;

    const sendAnalytics = async () => {
      try {
        if (!trackedRef.current.has(key)) {
          trackedRef.current.add(key);
          await trackPageView({ path, visitorId });
        }
        const statsResponse = await getPageViewStats({ path, visitorId });
        setViewStats(statsResponse.data?.data || null);
      } catch (error) {
        console.error("Failed to load view analytics", error);
        setViewStats(null);
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
          {viewStats && (
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">
              {t.app.viewsLabel}: {formatNumber(viewStats.totalViews)} | {t.app.uniqueVisitorsLabel}:{" "}
              {formatNumber(viewStats.uniqueVisitors)} | {t.app.yourViewsLabel}: {formatNumber(viewStats.myViews)}
            </p>
          )}
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
