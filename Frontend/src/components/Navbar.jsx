// ----- Navbar Component -----
// Navigation bar with Nepal flag, links to Dashboard and Candidates

import { NavLink } from "react-router-dom";
import NepalFlag from "./NepalFlag";
import { useAppSettings } from "../context/useAppSettings";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi";

const Navbar = () => {
  const { language, setLanguage, theme, setTheme, t } = useAppSettings();

  const linkClass = ({ isActive }) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "bg-white/20 text-white dark:bg-slate-700/60"
        : "text-blue-200 hover:text-white hover:bg-white/10 dark:text-slate-200"
    }`;

  return (
    <nav className="bg-linear-to-r from-[#1B2A4A]/95 via-[#162240]/95 to-[#0F1A33]/95 text-white shadow-lg sticky top-0 z-50 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="bg-white/10 p-1.5 rounded-lg group-hover:bg-white/20 transition-colors">
              <NepalFlag size={28} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                {t.app.title}
              </h1>
              <p className="text-xs text-blue-300 -mt-0.5">
                {t.app.subtitle}
              </p>
            </div>
          </NavLink>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <NavLink to="/" end className={linkClass}>
              {t.nav.dashboard}
            </NavLink>
            <NavLink to="/candidates" className={linkClass}>
              {t.nav.candidates}
            </NavLink>
            <NavLink to="/parties" className={linkClass}>
              {t.nav.parties}
            </NavLink>
            <NavLink to="/constituencies" className={linkClass}>
              {t.nav.constituencies}
            </NavLink>
            <button
              onClick={() => setLanguage(language === "en" ? "ne" : "en")}
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white/10 hover:bg-white/20 transition-all hover:-translate-y-0.5"
              type="button"
            >
              {language === "en" ? "ने" : "EN"}
            </button>
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all hover:-translate-y-0.5"
              type="button"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <HiOutlineMoon /> : <HiOutlineSun />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
