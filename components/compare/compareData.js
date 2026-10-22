import axios from "axios";
import { MAX_COMPARE } from "./compareStore.js";

/*
  Data helpers for the /compare page: fetching, the row definitions and the
  "best value" maths. No JSX here — the page decides how each value looks.
  Anything the API does not send is shown as "—"; nothing is made up.
*/

export const DASH = "—";

// Only the fields the page shows, so the page props stay small.
export const pick = (p) => ({
  slug: p.slug,
  name: p.name || "",
  image: (p.imageGallery || [])[0]?.url || "",
  developer: p.developer?.name || "",
  developerImg: p.developer?.developerImg || "",
  startingPrice: p.startingPrice || "",
  priceInFigure: Number(p.priceInFigure) > 0 ? Number(p.priceInFigure) : null,
  squarePrice: p.squarePrice || "",
  configuration: (p.configuration || "").trim(),
  area: p.area || "",
  status: (p.status || "").trim(),
  possesion: (p.possesion || "").trim(),
  propertyType: p.propertyType || null,
  rera: (p.rera || "").trim(),
  locality: p.locality?.name || "",
  subLocality: p.subLocality?.name || "",
  city: p.city?.name || "",
  coordinates: p.coordinates || null,
  amenities: [...(p.amenities || []), ...(p.exclusiveAmenities || [])]
    .map((a) => (a?.title || "").trim())
    .filter(Boolean)
    .filter((a, i, all) => all.findIndex((x) => x.toLowerCase() === a.toLowerCase()) === i),
  keyHighlights: (p.keyHighlights || []).filter(Boolean),
  // "Project" facts are not in the API today; shown only if it ever sends them
  landArea: p.landArea || p.totalLandArea || "",
  towers: p.towers || p.totalTowers || "",
  units: p.units || p.totalUnits || "",
});

export const fetchProperty = async (slug, base) => {
  try {
    const res = await axios.get(`${base}/property/slug/${encodeURIComponent(slug)}`);
    const data = res?.data?.data;
    return data && data.slug ? pick(data) : null;
  } catch (err) {
    return null; // unknown / removed slug: just leave it out
  }
};

export const parseSlugs = (q) =>
  String(q || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((s, i, all) => all.indexOf(s) === i)
    .slice(0, MAX_COMPARE);

// ---------- formatting ----------

export const clean = (v) => {
  const s = String(v ?? "").trim();
  return s || DASH;
};

export const titleCase = (v) =>
  String(v || "")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

export const sqftNumber = (v) => {
  const n = parseFloat(String(v || "").replace(/[^\d.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
};

export const sqftText = (v) => {
  const s = String(v || "").trim();
  if (!s) return DASH;
  return /sq\.?\s*ft/i.test(s) ? `₹ ${s}` : `₹ ${s} / sq.ft`;
};

const MONTHS = "jan feb mar apr may jun jul aug sep oct nov dec".split(" ");
// " Jan, 2029" -> comparable number; "Ready to move" counts as now (0)
export const possessionValue = (p) => {
  const text = p.possesion.toLowerCase();
  if (/ready/.test(text) || /ready/i.test(p.status)) return 0;
  const year = text.match(/(20\d\d)/);
  if (!year) return null;
  const month = MONTHS.findIndex((m) => text.includes(m));
  return Number(year[1]) * 12 + (month < 0 ? 11 : month);
};

const areaText = (v) => {
  const s = String(v || "").trim();
  if (!s) return DASH;
  return /sq/i.test(s) ? s : `${s} sq.ft`;
};

const propertyTypeText = (t) => {
  const parts = t ? [t.title, ...(t.subType || [])].filter(Boolean) : [];
  return parts.length ? parts.join(" · ") : DASH;
};

export const mapUrl = (p) =>
  p.coordinates?.lat && p.coordinates?.lng
    ? `https://www.google.com/maps/search/?api=1&query=${p.coordinates.lat},${p.coordinates.lng}`
    : "";

// Index(es) of the best number in a row. Nothing when fewer than 2 values exist
// or when every value ties (a tie across all is not a "best").
const bestOf = (values, mode = "min") => {
  const nums = values.filter((v) => v !== null && v !== undefined);
  if (nums.length < 2) return [];
  const target = mode === "min" ? Math.min(...nums) : Math.max(...nums);
  if (nums.every((n) => n === target)) return [];
  return values.map((v, i) => (v === target ? i : -1)).filter((i) => i >= 0);
};

/** Amenity names across all properties (case-insensitive union, A–Z). */
export const amenityUnion = (list) => {
  const all = [];
  list.forEach((p) =>
    p.amenities.forEach((a) => {
      if (!all.some((x) => x.toLowerCase() === a.toLowerCase())) all.push(a);
    })
  );
  return all.sort((a, b) => a.localeCompare(b));
};

export const hasAmenity = (p, name) =>
  p.amenities.some((a) => a.toLowerCase() === name.toLowerCase());

/*
  Rows, grouped. Each row: label, optional tip (info tooltip), value(p) as text
  (used for "differs" and for display unless the page renders it specially),
  and optional best (array of winning column indexes) with a short reason.
*/
export function buildGroups(list) {
  const union = amenityUnion(list);
  const groups = [
    {
      id: "overview",
      title: "Overview",
      rows: [
        {
          id: "price",
          label: "Starting price",
          tip: "Lowest listed price for the smallest unit",
          value: (p) => (p.startingPrice ? `₹ ${p.startingPrice}` : DASH),
          best: bestOf(list.map((p) => p.priceInFigure)),
          reason: "Lowest starting price",
        },
        {
          id: "sqft",
          label: "Price / sq.ft",
          tip: "Average rate per square foot as listed",
          value: (p) => sqftText(p.squarePrice),
          best: bestOf(list.map((p) => sqftNumber(p.squarePrice))),
          reason: "Lowest price / sq.ft",
        },
        { id: "config", label: "Configuration", value: (p) => clean(p.configuration) },
        {
          id: "area",
          label: "Area range",
          tip: "Unit sizes on offer, in sq.ft",
          value: (p) => areaText(p.area),
        },
        { id: "status", label: "Status", value: (p) => (p.status ? titleCase(p.status) : DASH) },
        {
          id: "possession",
          label: "Possession",
          tip: "Expected handover date given by the developer",
          value: (p) => clean(p.possesion),
          best: bestOf(list.map(possessionValue)),
          reason: "Earliest possession",
        },
        { id: "type", label: "Property type", value: (p) => propertyTypeText(p.propertyType) },
        {
          id: "rera",
          label: "RERA no.",
          tip: "State RERA registration number of the project",
          value: (p) => clean(p.rera),
        },
      ],
    },
    {
      id: "location",
      title: "Location",
      rows: [
        { id: "locality", label: "Locality", value: (p) => clean(p.locality) },
        { id: "sector", label: "Sector / area", value: (p) => clean(p.subLocality) },
        { id: "city", label: "City", value: (p) => clean(p.city) },
        { id: "map", label: "Map", value: (p) => (mapUrl(p) ? "map" : DASH), noDiff: true },
      ],
    },
  ];

  const project = [
    { id: "landArea", label: "Land area" },
    { id: "towers", label: "Towers" },
    { id: "units", label: "Units" },
  ].filter((r) => list.some((p) => String(p[r.id] || "").trim()));
  if (project.length) {
    groups.push({
      id: "project",
      title: "Project",
      rows: project.map((r) => ({ ...r, value: (p) => clean(p[r.id]) })),
    });
  }

  if (union.length) {
    groups.push({
      id: "amenities",
      title: "Amenities",
      count: union.length,
      rows: [
        {
          id: "amenityCount",
          label: "Amenities listed",
          tip: "How many of the amenities below each project lists",
          value: (p) => `${p.amenities.length} of ${union.length}`,
          best: bestOf(
            list.map((p) => p.amenities.length),
            "max"
          ),
          reason: "Most amenities",
          kind: "count",
        },
        ...union.map((name) => ({
          id: `a-${name}`,
          label: name,
          value: (p) => (hasAmenity(p, name) ? "yes" : "no"),
          kind: "amenity",
        })),
      ],
    });
  }

  groups.push({
    id: "highlights",
    title: "Highlights",
    rows: [
      {
        id: "highlights",
        label: "Key highlights",
        value: (p) => p.keyHighlights.join("|") || DASH,
        kind: "list",
      },
    ],
  });

  return groups;
}

/** Factual one-liners per property: the categories it leads, plus its status. */
export function summaries(list, groups) {
  const wins = list.map(() => []);
  groups.forEach((g) =>
    g.rows.forEach((r) => (r.best || []).forEach((i) => wins[i].push(r.reason)))
  );
  return list.map((p, i) => {
    const notes = [...wins[i]];
    if (/ready/i.test(p.status)) notes.push("Ready to move");
    return notes;
  });
}
