export const CITY_MAP = {
  'gurgaon': 'Gurgaon',
  'gurugram': 'Gurgaon',
  'pune': 'Pune',
  'jaipur': 'Jaipur',
  'delhi': 'Delhi',
  'new delhi': 'Delhi',
  'noida': 'Noida',
  'bengaluru': 'Bangalore',
  'bangalore': 'Bangalore'
};

// Removed Delhi and Bangalore
export const AVAILABLE_CITIES = ['Gurgaon', 'Pune', 'Jaipur', 'Noida'];

export function normalizeCity(inputCity) {
  if (!inputCity) return null;
  
  const normalized = CITY_MAP[inputCity.toLowerCase().trim()];
  return AVAILABLE_CITIES.includes(normalized) ? normalized : null;
}

// Function to get the correct API city name (case-sensitive)
export function getApiCityName(city) {
  // Map internal city names to API endpoint names (removed Delhi and Bangalore)
  const apiCityMap = {
    'Gurgaon': 'Gurgaon',
    'Pune': 'Pune',
    'Jaipur': 'Jaipur',
    'Noida': 'Noida'
  };
  
  return apiCityMap[city] || city;
}
