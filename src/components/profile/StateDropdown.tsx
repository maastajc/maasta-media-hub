
import React from "react";
import STATES from "@/utils/states";

interface StateDropdownProps {
  value: string;
  country: string;
  onChange: (value: string) => void;
}

/**
 * Select dropdown for all states in selected country (no manual typing).
 */
const StateDropdown: React.FC<StateDropdownProps> = ({ value, country, onChange }) => {
  const states = STATES[country] || [];
  return (
    <select
      className="w-full border rounded p-2"
      value={value}
      onChange={e => onChange(e.target.value)}
      required
      disabled={!country}
      autoComplete="off"
    >
      <option value="">Select state</option>
      {states.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
};

export default StateDropdown;
export { STATES as STATE_OPTIONS };
