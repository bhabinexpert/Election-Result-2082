// ----- App Root Component -----
// Sets up React Router with multi-page navigation

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Candidates from "./pages/Candidates";
import CandidateProfile from "./pages/CandidateProfile";
import Parties from "./pages/Parties";
import Constituencies from "./pages/Constituencies";
import PartyDetail from "./pages/PartyDetail";
import ConstituencyDetail from "./pages/ConstituencyDetail";
import { useAppSettings } from "./context/useAppSettings";

function App() {
  const { t } = useAppSettings();

  return (
    <BrowserRouter>
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
          </footer>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
