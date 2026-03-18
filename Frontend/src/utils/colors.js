// ----- Nepal-themed Color Palette -----
// Professional palette: dark navy + crimson accents, clean and muted.

export const PRIMARY = "#DC143C";
export const SECONDARY = "#1B2A4A";

// Chart colors — muted professional tones
export const CHART_COLORS = [
  "#1B2A4A", "#DC143C", "#2563EB", "#7C3AED", "#0891B2",
  "#D97706", "#059669", "#BE185D", "#4338CA", "#0D9488",
  "#B45309", "#6D28D9", "#0369A1", "#9F1239", "#047857",
];

// Province colors — 7 distinct muted tones
export const PROVINCE_COLORS = [
  "#1B2A4A", "#DC143C", "#2563EB", "#7C3AED",
  "#0891B2", "#D97706", "#059669",
];

// Gender colors
export const GENDER_COLORS = {
  male: "#1B2A4A",
  female: "#DC143C",
  other: "#D97706",
};

// Stat card Tailwind classes
export const STAT_COLORS = {
  crimson: { gradient: "from-red-700 to-red-800", bg: "bg-red-50", text: "text-red-700" },
  blue:    { gradient: "from-slate-700 to-slate-800", bg: "bg-slate-50", text: "text-slate-700" },
  maroon:  { gradient: "from-rose-700 to-rose-800", bg: "bg-rose-50", text: "text-rose-700" },
  steel:   { gradient: "from-blue-700 to-blue-800", bg: "bg-blue-50", text: "text-blue-700" },
  slate:   { gradient: "from-gray-600 to-gray-700", bg: "bg-gray-100", text: "text-gray-600" },
  ocean:   { gradient: "from-cyan-700 to-cyan-800", bg: "bg-cyan-50", text: "text-cyan-700" },
  rust:    { gradient: "from-amber-700 to-amber-800", bg: "bg-amber-50", text: "text-amber-700" },
  deep:    { gradient: "from-indigo-700 to-indigo-800", bg: "bg-indigo-50", text: "text-indigo-700" },
};

// Avatar URL generator (ui-avatars.com — free, no auth)
export const getAvatarUrl = (name, size = 128) => {
  const encoded = encodeURIComponent(name || "?");
  return `https://ui-avatars.com/api/?name=${encoded}&size=${size}&background=1B2A4A&color=fff&bold=true&format=svg`;
};
