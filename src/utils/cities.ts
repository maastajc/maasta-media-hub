/**
 * List of cities mapped by COUNTRY -> STATE.
 * Only partial data below for brevity; expand as needed for your app.
 */
const CITIES = {
  India: {
    Delhi: ["New Delhi", "Dwarka", "Noida", "Gurgaon"],
    Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik"],
    Karnataka: ["Bangalore", "Mysore", "Mangalore"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
    "West Bengal": ["Kolkata", "Darjeeling"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi"],
    // ...other states and their cities
  },
  "United States": {
    California: ["Los Angeles", "San Francisco", "San Diego", "Sacramento"],
    Texas: ["Houston", "Dallas", "Austin", "San Antonio"],
    Florida: ["Miami", "Orlando", "Tampa"],
    New York: ["New York City", "Buffalo", "Rochester", "Albany"],
    // ...all 50 states and major cities
  },
  Canada: {
    Ontario: ["Toronto", "Ottawa", "Mississauga", "Hamilton"],
    Quebec: ["Montreal", "Quebec City"],
    Alberta: ["Calgary", "Edmonton"],
    "British Columbia": ["Vancouver", "Victoria"],
    // ...other provinces and their cities
  },
  Australia: {
    "New South Wales": ["Sydney", "Newcastle"],
    Victoria: ["Melbourne", "Geelong"],
    Queensland: ["Brisbane", "Gold Coast"],
    // ...other states/cities
  },
  "United Kingdom": {
    England: ["London", "Manchester", "Birmingham", "Liverpool"],
    Scotland: ["Edinburgh", "Glasgow"],
    Wales: ["Cardiff", "Swansea"],
    "Northern Ireland": ["Belfast", "Derry"],
  },
  // ...more countries as needed
};

export default CITIES;
