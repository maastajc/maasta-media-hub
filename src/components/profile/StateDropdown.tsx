
import React from "react";

interface StateDropdownProps {
  value: string;
  country: string;
  onChange: (value: string) => void;
}

const STATE_OPTIONS = {
  India: [ "Delhi", "Maharashtra", "Karnataka", "Tamil Nadu", "West Bengal" ],
  "United States": [ "California", "Texas", "New York", "Florida", "Illinois" ],
  "United Kingdom": [ "England", "Scotland", "Wales", "Northern Ireland" ],
  Canada: [ "Ontario", "Quebec", "Alberta", "British Columbia" ]
};

const StateDropdown: React.FC<StateDropdownProps> = ({ value, country, onChange }) => {
  const states = STATE_OPTIONS[country] || [];
  return (
    <select
      className="w-full border rounded p-2"
      value={value}
      onChange={e => onChange(e.target.value)}
      required
      disabled={!country}
    >
      <option value="">Select state</option>
      {states.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
};

export default StateDropdown;
export { STATE_OPTIONS };
