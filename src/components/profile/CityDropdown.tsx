
import React from "react";

interface CityDropdownProps {
  value: string;
  country: string;
  state: string;
  onChange: (value: string) => void;
}

const CITY_OPTIONS = {
  India: {
    Delhi: ["New Delhi", "Dwarka", "Noida"],
    Maharashtra: ["Mumbai", "Pune", "Nagpur"],
    Karnataka: ["Bangalore", "Mysore"],
    Tamil_Nadu: ["Chennai", "Coimbatore"],
    "West Bengal": ["Kolkata", "Darjeeling"]
  },
  "United States": {
    California: ["Los Angeles", "San Francisco", "San Diego"],
    Texas: ["Houston", "Dallas", "Austin"],
    New_York: ["New York City", "Buffalo"],
    Florida: ["Miami", "Orlando"],
    Illinois: ["Chicago", "Springfield"]
  },
  "United Kingdom": {
    England: ["London", "Manchester"],
    Scotland: ["Edinburgh", "Glasgow"],
    Wales: ["Cardiff", "Swansea"],
    "Northern Ireland": ["Belfast", "Derry"]
  },
  Canada: {
    Ontario: ["Toronto", "Ottawa"],
    Quebec: ["Montreal", "Quebec City"],
    Alberta: ["Calgary", "Edmonton"],
    "British Columbia": ["Vancouver", "Victoria"]
  }
};

const CityDropdown: React.FC<CityDropdownProps> = ({ value, country, state, onChange }) => {
  const cities = (CITY_OPTIONS as any)[country]?.[state] || [];
  return (
    <select
      className="w-full border rounded p-2"
      value={value}
      onChange={e => onChange(e.target.value)}
      required
      disabled={!country || !state}
    >
      <option value="">Select city</option>
      {cities.map((c: string) => (
        <option key={c} value={c}>{c}</option>
      ))}
    </select>
  );
};

export default CityDropdown;
export { CITY_OPTIONS };
