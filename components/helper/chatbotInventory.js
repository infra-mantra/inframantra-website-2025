import Ajax1 from "./Ajax1";

/**
 * Chatbot inventory helper.
 *
 * Pulls live projects from the same inventory API the website uses
 * ( POST /property/search  with { type:"city", name:"gurgaon" } ),
 * sorts them by their `order` value (ascending, lower = shown first,
 * nulls last) and returns the FULL normalized list so the chatbot can
 * page through it 3 cards at a time.
 */

// 1 Cr = 1,00,00,000 rupees.
const CR = 10000000;

// Buy budget chips — single source of truth shared with the chatbot UI.
// Each chip's label IS its value and IS the BUDGET_RANGE key, so the
// chip the user taps always maps to the right [min, max] sale-price window.
export const BUDGET_OPTIONS = [
  { label: "Under 1 Cr", value: "Under 1 Cr" },
  { label: "1 Cr – 2 Cr", value: "1 Cr – 2 Cr" },
  { label: "2 Cr – 4 Cr", value: "2 Cr – 4 Cr" },
  { label: "4 Cr – 6 Cr", value: "4 Cr – 6 Cr" },
  { label: "6 Cr – 8 Cr", value: "6 Cr – 8 Cr" },
  { label: "8 Cr – 10 Cr", value: "8 Cr – 10 Cr" },
  { label: "Above 10 Cr", value: "Above 10 Cr" },
];

// Map each budget chip to a [min, max] sale-price window (rupees).
const BUDGET_RANGE = {
  "Under 1 Cr": [0, 1 * CR],
  "1 Cr – 2 Cr": [1 * CR, 2 * CR],
  "2 Cr – 4 Cr": [2 * CR, 4 * CR],
  "4 Cr – 6 Cr": [4 * CR, 6 * CR],
  "6 Cr – 8 Cr": [6 * CR, 8 * CR],
  "8 Cr – 10 Cr": [8 * CR, 10 * CR],
  "Above 10 Cr": [10 * CR, 100000 * CR],
};

const normalize = (prop) => {
  if (!prop) return null;
  // imageGallery is an array of {url} on some endpoints, a plain URL string on others.
  const image =
    (Array.isArray(prop.imageGallery)
      ? prop.imageGallery[0]?.url
      : prop.imageGallery) ||
    prop.image ||
    "";
  const locality = prop.subLocality?.name || prop.locality?.name || "";
  const cityName = prop.city?.name || prop.city || "";

  return {
    id: prop._id || prop.id || prop.slug,
    slug: prop.slug,
    name: prop.name,
    image,
    location: [locality, cityName].filter(Boolean).join(", "),
    // Keep the individual place names so we can filter by locality.
    locality: prop.locality?.name || "",
    subLocality: prop.subLocality?.name || "",
    city: cityName,
    price: prop.startingPrice ? `₹ ${prop.startingPrice}` : "Price on request",
    config: prop.configuration || "",
    status: (prop.status || "").trim(),
    order: prop.order,
  };
};

// Ascending by `order`; null / undefined sink to the bottom.
const byOrder = (a, b) => {
  const ao = a.order === null || a.order === undefined ? Infinity : a.order;
  const bo = b.order === null || b.order === undefined ? Infinity : b.order;
  return ao - bo;
};

const dedupe = (cards) => {
  const seen = new Set();
  const out = [];
  for (const card of cards) {
    if (!card || !card.name || seen.has(card.id)) continue;
    seen.add(card.id);
    out.push(card);
  }
  return out;
};

/**
 * @param {Object} filters  { budget, location }
 * @returns {Promise<Array>} full list of normalized cards, ordered by `order`
 */
export async function fetchChatbotProperties(filters = {}) {
  const range = BUDGET_RANGE[filters.budget];
  const city = filters.location;

  let list = [];

  // Search the selected city via /search?q=<city>.
  // IMPORTANT: the older POST /property/search { type:"city", name } endpoint
  // ignores `name` and always returns Gurgaon's inventory — selecting Mohali
  // wrongly showed Gurgaon properties. /search is genuinely city-specific and
  // returns 0 hits for cities with no inventory.
  if (city && !/^other/i.test(city)) {
    try {
      const res = await Ajax1({
        url: "/search",
        method: "GET",
        params: { q: city },
      });
      list = res?.data?.hits || [];
    } catch (error) {
      console.warn("[Chatbot] property search failed:", error);
    }
  }

  // Optional budget filter on sale price (skips unknown/zero prices).
  if (range) {
    list = list.filter((p) => {
      const v = Number(p.priceInFigure) || 0;
      return v === 0 || (v >= range[0] && v <= range[1]);
    });
  }

  return dedupe(list.map(normalize)).sort(byOrder);
}

/**
 * List the localities of a city, e.g. fetchLocalities("Gurgaon").
 * @returns {Promise<Array<{name:string, id:string}>>}
 */
export async function fetchLocalities(city) {
  if (!city) return [];
  try {
    const res = await Ajax1({
      url: `/localities/${encodeURIComponent(city)}?page=1&limit=50`,
    });
    return (res?.data?.data || [])
      .map((x) => ({ name: x.name, id: x._id }))
      .filter((x) => x.name);
  } catch (error) {
    console.warn("[Chatbot] fetchLocalities failed:", error);
    return [];
  }
}

/**
 * Free-text autocomplete (cities / localities / properties), e.g. "golf".
 * @returns {Promise<Array<{title:string, type:string, slug?:string}>>}
 */
export async function fetchSuggestions(query) {
  const q = (query || "").trim();
  if (!q) return [];
  try {
    const res = await Ajax1({ url: "/suggest", method: "GET", params: { q } });
    return res?.data?.suggestions || [];
  } catch (error) {
    console.warn("[Chatbot] fetchSuggestions failed:", error);
    return [];
  }
}

/**
 * Fetch a city's projects (ordered) and optionally narrow them to a locality.
 * Falls back to the full city list if nothing matches the locality.
 * @returns {Promise<Array>} normalized cards ordered by `order`
 */
export async function fetchPropertiesByLocality(city, localityName) {
  const all = await fetchChatbotProperties({ location: city });
  if (!localityName) return all;

  const sel = localityName.toLowerCase().trim();
  const matched = all.filter((c) => {
    const sub = (c.subLocality || "").toLowerCase();
    const loc = (c.locality || "").toLowerCase();
    const full = (c.location || "").toLowerCase();
    return sub === sel || loc === sel || full.includes(sel);
  });

  return matched.length ? matched : all;
}

export default fetchChatbotProperties;
