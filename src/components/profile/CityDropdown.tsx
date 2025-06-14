
import React from "react";
import CITIES from "@/utils/cities";

interface CityDropdownProps {
  value: string;
  country: string;
  state: string;
  onChange: (value: string) => void;
}

/**
 * Select dropdown for all cities in selected state (no manual typing).
 */
const CityDropdown: React.FC<CityDropdownProps> = ({ value, country, state, onChange }) => {
  const cities = (CITIES as any)[country]?.[state] || [];
  return (
    <select
      className="w-full border rounded p-2"
      value={value}
      onChange={e => onChange(e.target.value)}
      required
      disabled={!country || !state}
      autoComplete="off"
    >
      <option value="">Select city</option>
      {cities.map((c: string) => (
        <option key={c} value={c}>{c}</option>
      ))}
    </select>
  );
};

export default CityDropdown;
export { CITIES as CITY_OPTIONS };
