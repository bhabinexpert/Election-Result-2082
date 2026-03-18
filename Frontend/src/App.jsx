// ----- App Root Component -----
// Sets up React Router with multi-page navigation

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Candidates from "./pages/Candidates";
import CandidateProfile from "./pages/CandidateProfile";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/candidates/:id" element={<CandidateProfile />} />
        </Routes>
        <footer className="text-center py-6 border-t border-gray-200 mt-8">
          <p className="text-sm text-gray-400">
            Nepal Election 2082 Results Dashboard &mdash; Built with MERN Stack
          </p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
