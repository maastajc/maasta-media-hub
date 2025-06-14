
import React from "react";

interface CountryDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const COUNTRY_OPTIONS = [
  { code: "IN", name: "India" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  // Add more countries as needed for your app
];

const CountryDropdown: React.FC<CountryDropdownProps> = ({ value, onChange }) => {
  return (
    <select
      className="w-full border rounded p-2"
      value={value}
      onChange={e => onChange(e.target.value)}
      required
    >
      <option value="">Select country</option>
      {COUNTRY_OPTIONS.map((c) => (
        <option key={c.code} value={c.name}>{c.name}</option>
      ))}
    </select>
  );
};

export default CountryDropdown;
export { COUNTRY_OPTIONS };
