// ----- Navbar Component -----
// Navigation bar with Nepal flag, links to Dashboard and Candidates

import { NavLink } from "react-router-dom";
import NepalFlag from "./NepalFlag";

const Navbar = () => {
  const linkClass = ({ isActive }) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "bg-white/20 text-white"
        : "text-blue-200 hover:text-white hover:bg-white/10"
    }`;

  return (
    <nav className="bg-linear-to-r from-[#1B2A4A] via-[#162240] to-[#0F1A33] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="bg-white/10 p-1.5 rounded-lg group-hover:bg-white/20 transition-colors">
              <NepalFlag size={28} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                Nepal Election 2082
              </h1>
              <p className="text-xs text-blue-300 -mt-0.5">
                House of Representatives
              </p>
            </div>
          </NavLink>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <NavLink to="/" end className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/candidates" className={linkClass}>
              Candidates
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
