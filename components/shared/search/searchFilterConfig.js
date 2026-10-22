/*
  Everything the home-page search filters offer, as plain data. Edit here to add a
  city, change budget bands or reorder popular searches — no component changes needed.

  The `value`s are exactly what the listing page reads from its URL
  (pages/property-listing/[type]/[name].js → parseUrlState):
    ?config=3,4      configuration (BHK number, or "Penthouse")
    ?status=...      project status, comma separated
    ?unit=...        unit type, comma separated
    ?min=1&max=2     budget in crores
*/

// City pages live at /property-listing/city/<slug>.
export const CITIES = [
  { label: "Gurgaon", slug: "gurgaon", aliases: ["gurugram", "ggn"] },
  { label: "Noida", slug: "noida", aliases: [] },
  { label: "Mohali", slug: "mohali", aliases: [] },
  { label: "Pune", slug: "pune", aliases: [] },
  { label: "Jaipur", slug: "jaipur", aliases: [] },
];

// The backend expands "3" to 3 and 3.5 BHK, so one chip covers both.
export const BHK_OPTIONS = [
  { label: "2 BHK", value: "2" },
  { label: "3 BHK", value: "3" },
  { label: "4 BHK", value: "4" },
  { label: "5 BHK", value: "5" },
  { label: "Penthouse", value: "Penthouse" },
];

// min / max in crores; null means "no limit".
export const BUDGET_OPTIONS = [
  { label: "₹1 – 2 Cr", min: 1, max: 2 },
  { label: "₹2 – 5 Cr", min: 2, max: 5 },
  { label: "₹5 – 10 Cr", min: 5, max: 10 },
  { label: "₹10 Cr +", min: 10, max: null },
];

// Same spellings as the listing page's own filter (ListingFilters.jsx).
export const STATUS_OPTIONS = [
  "New Launch",
  "Under Construction",
  "Near Possession",
  "Ready to Move In",
];

export const UNIT_OPTIONS = ["High Rise Apartment", "Low Rise Apartment", "Villa"];

/*
  Shown in the dropdown when the empty search box is focused. Each one is a route
  that already exists, so they work even if the search API is down.
*/
export const POPULAR_SEARCHES = [
  { label: "3 BHK in Gurgaon", href: "/property-listing/city/gurgaon?config=3" },
  { label: "4 BHK in Gurgaon", href: "/property-listing/city/gurgaon?config=4" },
  { label: "Golf Course Road", href: "/property-listing/locality/golf-course-road" },
  { label: "Dwarka Expressway", href: "/property-listing/locality/dwarka-expressway" },
  { label: "Ready to move", href: "/property-listing/city/gurgaon?status=Ready%20to%20Move%20In" },
  { label: "Penthouses", href: "/property-listing/configuration/penthouse" },
];

// The empty selection. `bhk`, `status` and `unit` are arrays (multi-select).
export const EMPTY_FILTERS = { city: null, bhk: [], budget: null, status: [], unit: [] };

// The home search bar starts on this city (most of the inventory is in Gurgaon).
export const DEFAULT_CITY = CITIES[0];

// Steps for the Budget dropdown's Min / Max selects, in crores.
export const BUDGET_STEPS = [0.5, 1, 1.5, 2, 3, 4, 5, 7, 10, 15, 20];

// "₹50 L" / "₹1.5 Cr" for one budget step.
export const formatCr = (cr) => (cr < 1 ? `₹${Math.round(cr * 100)} L` : `₹${cr} Cr`);

// Min / max (crores, null = no limit) → the budget object the URL builder reads.
export const makeBudget = (min, max) => {
  if (!min && !max) return null;
  const label = !min
    ? `Under ${formatCr(max)}`
    : !max
      ? `${formatCr(min)} +`
      : `${formatCr(min)} – ${formatCr(max)}`;
  return { label, min: min || null, max: max || null };
};

// "3 BHK, 4 BHK" for a trigger button; past two picks it becomes "3 BHK +2".
export const shortList = (labels) =>
  labels.length > 2 ? `${labels[0]} +${labels.length - 1}` : labels.join(", ");

// One line describing the filters, used as the label of a "recent search".
export const describeFilters = (f) =>
  [
    f.bhk.map((v) => BHK_OPTIONS.find((b) => b.value === v)?.label || v).join(", "),
    f.unit.join(", "),
    f.budget?.label,
    f.status.join(", "),
    f.city && `in ${f.city.label}`,
  ]
    .filter(Boolean)
    .join(" · ") || "All properties";

export const countFilters = (f) =>
  (f.city ? 1 : 0) + (f.budget ? 1 : 0) + f.bhk.length + f.status.length + f.unit.length;

/*
  Filters (+ optional typed text) → listing URL.
    text typed   → /property-listing/search/<text>
    city picked  → /property-listing/city/<slug>
    neither      → /property-listing/search/property-in-india (all properties)
  The rest rides along as query params, e.g.
    { city: Gurgaon, bhk: ["3"], budget: 1–2 Cr } → /property-listing/city/gurgaon?config=3&min=1&max=2
*/
export const buildListingUrl = (f, text = "") => {
  const q = new URLSearchParams();
  if (f.bhk?.length) q.set("config", f.bhk.join(","));
  if (f.status?.length) q.set("status", f.status.join(","));
  if (f.unit?.length) q.set("unit", f.unit.join(","));
  if (f.budget?.min) q.set("min", f.budget.min);
  if (f.budget?.max) q.set("max", f.budget.max);
  const query = q.toString() ? `?${q}` : "";

  const typed = text.trim();
  const path = typed
    ? `/property-listing/search/${encodeURIComponent(typed)}`
    : f.city
      ? `/property-listing/city/${f.city.slug}`
      : "/property-listing/search/property-in-india";
  return path + query;
};

// Just the query part, for appending to a suggestion's own URL ("" when nothing set).
export const filterQuery = (f) => {
  const url = buildListingUrl({ ...f, city: null });
  const i = url.indexOf("?");
  return i < 0 ? "" : url.slice(i);
};
