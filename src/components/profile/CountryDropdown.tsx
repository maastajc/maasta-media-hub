
import React from "react";
import COUNTRIES from "@/utils/countries";

interface CountryDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Select dropdown for all countries (no manual typing allowed).
 */
const CountryDropdown: React.FC<CountryDropdownProps> = ({ value, onChange }) => {
  return (
    <select
      className="w-full border rounded p-2"
      value={value}
      onChange={e => onChange(e.target.value)}
      required
      autoComplete="off"
    >
      <option value="">Select country</option>
      {COUNTRIES.map((c) => (
        <option key={c.code} value={c.name}>{c.name}</option>
      ))}
    </select>
  );
};

export default CountryDropdown;
export { COUNTRIES as COUNTRY_OPTIONS };
