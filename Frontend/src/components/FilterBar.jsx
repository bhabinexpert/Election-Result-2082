// ----- FilterBar Component -----
// Dropdown filters for province, district, constituency, party, and gender

import { useAppSettings } from "../context/useAppSettings";

const FilterBar = ({ filters, filterOptions, updateFilter, resetFilters }) => {
  const { t } = useAppSettings();
  // Get districts filtered by selected province
  const filteredDistricts = filters.province_id
    ? filterOptions.districts.filter(
        (d) => d.province_id === Number(filters.province_id)
      )
    : filterOptions.districts;

  // Get constituencies filtered by selected district
  const filteredConstituencies = filters.district_id
    ? filterOptions.constituencies.filter((c) => {
        const district = filterOptions.districts.find(
          (d) => d.district_id === Number(filters.district_id)
        );
        return district ? c.includes(district.district_name.split(" ")[0]) : true;
      })
    : filterOptions.constituencies;

  // Check if any filter is active
  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-4 mb-6 card-3d">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-200 uppercase tracking-wider">
          {t.common.filterResults}
        </h3>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors cursor-pointer"
          >
            {t.common.clearAll}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Province Filter */}
        <select
          value={filters.province_id}
          onChange={(e) => {
            updateFilter("province_id", e.target.value);
            // Reset dependent filters
            updateFilter("district_id", "");
            updateFilter("constituency", "");
          }}
          className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A] focus:border-transparent transition-all"
        >
          <option value="">{t.common.allProvinces}</option>
          {filterOptions.provinces.map((p) => (
            <option key={p.province_id} value={p.province_id}>
              {p.province_name}
            </option>
          ))}
        </select>

        {/* District Filter */}
        <select
          value={filters.district_id}
          onChange={(e) => {
            updateFilter("district_id", e.target.value);
            updateFilter("constituency", "");
          }}
          className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A] focus:border-transparent transition-all"
        >
          <option value="">{t.common.allDistricts}</option>
          {filteredDistricts.map((d) => (
            <option key={d.district_id} value={d.district_id}>
              {d.district_name}
            </option>
          ))}
        </select>

        {/* Constituency Filter */}
        <select
          value={filters.constituency}
          onChange={(e) => updateFilter("constituency", e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A] focus:border-transparent transition-all"
        >
          <option value="">{t.common.allConstituencies}</option>
          {filteredConstituencies.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Party Filter */}
        <select
          value={filters.party}
          onChange={(e) => updateFilter("party", e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A] focus:border-transparent transition-all"
        >
          <option value="">{t.common.allParties}</option>
          {filterOptions.parties.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        {/* Gender Filter */}
        <select
          value={filters.gender}
          onChange={(e) => updateFilter("gender", e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A] focus:border-transparent transition-all"
        >
          <option value="">{t.common.allGenders}</option>
          <option value="male">{t.common.male}</option>
          <option value="female">{t.common.female}</option>
          <option value="other">{t.common.other}</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
