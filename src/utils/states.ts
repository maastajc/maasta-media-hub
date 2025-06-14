
/**
 * List of states/provinces for each country.
 * Expand as needed; structure matches the country name (not code).
 */
const STATES = {
  India: [
    "Delhi", "Maharashtra", "Karnataka", "Tamil Nadu", "West Bengal",
    "Uttar Pradesh", "Bihar", "Gujarat", "Rajasthan", "Punjab", "Kerala",
    "Madhya Pradesh", "Telangana", "Andhra Pradesh", "Odisha", "Assam"
    // ...add all Indian states
  ],
  "United States": [
    "California", "Texas", "Florida", "New York", "Illinois",
    "Pennsylvania", "Ohio", "Georgia", "North Carolina", "Michigan",
    // ...all 50 US states
  ],
  "United Kingdom": [
    "England", "Scotland", "Wales", "Northern Ireland"
  ],
  Canada: [
    "Ontario", "Quebec", "British Columbia", "Alberta", "Manitoba",
    "Saskatchewan", "Nova Scotia", "New Brunswick", "Newfoundland and Labrador"
    // ...add all Canadian provinces/territories
  ],
  Australia: [
    "New South Wales", "Victoria", "Queensland", "Western Australia", "South Australia",
    "Tasmania", "Australian Capital Territory", "Northern Territory"
  ],
  // ...add other countries and their subdivisions
};

export default STATES;
