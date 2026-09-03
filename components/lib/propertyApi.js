const API_BASE_URL = "https://apitest.inframantra.com/api/v1/property/citywise/";

export async function fetchCityProperties(city) {
  try {
    // Direct mapping to avoid import issues (removed Delhi and Bangalore)
    const apiCityMap = {
      Gurgaon: "Gurgaon",
      Pune: "Pune",
      Jaipur: "Jaipur",
      Noida: "Noida",
    };

    const apiCityName = apiCityMap[city] || city;

    // console.log(`Fetching properties for: ${city} -> API: ${apiCityName}`);

    const response = await fetch(`${API_BASE_URL}${encodeURIComponent(apiCityName)}`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error("API returned unsuccessful response");
    }

    // Combine mainCity properties with locality properties
    let allProperties = [];

    // Add main city properties
    if (data.mainCity?.properties?.length > 0) {
      allProperties = [...data.mainCity.properties];
    }

    // Add locality properties (like for Pune)
    if (data.localities?.length > 0) {
      data.localities.forEach((locality) => {
        if (locality.properties?.length > 0) {
          allProperties = [...allProperties, ...locality.properties];
        }
      });
    }

    // console.log(`Found ${allProperties.length} total properties for ${city}`);

    return {
      ...data,
      allProperties, // Combined properties for easy access
    };
  } catch (error) {
    console.error(`Failed to fetch properties for ${city}:`, error);
    throw error;
  }
}
