import { BHK_OPTIONS, CITIES, STATUS_OPTIONS } from "./searchFilterConfig.js";

/*
  "Sentence search": turns what people actually type — "3 bhk in gurgaon under 2 cr",
  "ready to move villa noida", "4bhk 5-10 crore" — into the same filters the filter
  panel produces. The search API only matches names, so without this a sentence like
  that returns nothing.

  Returns null when the text has no filter words in it (a plain name search), else
  { filters, text, label }:
    filters — same shape as EMPTY_FILTERS
    text    — words left over that are not filler (e.g. a locality name), or ""
    label   — a human summary for the suggestion row
*/

// Words that carry no meaning once the filters are pulled out.
const FILLER =
  /\b(in|at|near|for|sale|buy|to|the|a|an|and|with|of|flats?|apartments?|homes?|houses?|property|properties|projects?|budget|price|rs\.?|inr)\b/g;

// "2", "2.5", "50" + crore/lakh unit → crores.
const toCr = (n, unit) => (/^l/i.test(unit || "") ? Number(n) / 100 : Number(n));
const AMOUNT = "(\\d+(?:\\.\\d+)?)\\s*(crores?|cr|lakhs?|lacs?|l)?\\b";

const STATUS_WORDS = [
  [/\bready(?:\s*to\s*move(?:\s*in)?)?\b/, "Ready to Move In"],
  [/\bnew\s*launch(?:es)?\b/, "New Launch"],
  [/\bunder\s*construction\b/, "Under Construction"],
  [/\bnear\s*possession\b/, "Near Possession"],
];

export default function parseSearchSentence(raw) {
  let s = ` ${String(raw || "").toLowerCase()} `;
  const filters = { city: null, bhk: [], budget: null, status: [], unit: [] };
  const take = (re, fn) => {
    s = s.replace(re, (...m) => {
      fn(m);
      return " ";
    });
  };

  // BHK: "3 bhk", "3bhk", "3.5 bhk", "penthouse"
  take(/\b(\d)(?:\.5)?\s*bhk\b/g, (m) => {
    if (BHK_OPTIONS.some((o) => o.value === m[1]) && !filters.bhk.includes(m[1])) {
      filters.bhk.push(m[1]);
    }
  });
  take(/\bpenthouses?\b/g, () => filters.bhk.push("Penthouse"));

  // Budget: "between 1 and 2 cr", "1-2 cr", "under 2 cr", "above 5 crore"
  take(new RegExp(`\\b(?:between\\s+)?${AMOUNT}\\s*(?:-|to|and)\\s*${AMOUNT}`, "g"), (m) => {
    const unit = m[4] || m[2];
    if (!unit) return;
    filters.budget = { min: toCr(m[1], m[2] || unit), max: toCr(m[3], unit) };
  });
  take(new RegExp(`\\b(?:under|below|upto|up to|within|less than|max)\\s+${AMOUNT}`, "g"), (m) => {
    filters.budget = { min: filters.budget?.min ?? null, max: toCr(m[1], m[2]) };
  });
  take(new RegExp(`\\b(?:above|over|more than|from|min|starting)\\s+${AMOUNT}`, "g"), (m) => {
    filters.budget = { min: toCr(m[1], m[2]), max: filters.budget?.max ?? null };
  });

  STATUS_WORDS.forEach(([re, value]) =>
    take(new RegExp(re.source, "g"), () => {
      if (!filters.status.includes(value) && STATUS_OPTIONS.includes(value)) {
        filters.status.push(value);
      }
    })
  );

  take(/\bvillas?\b/g, () => filters.unit.push("Villa"));

  CITIES.forEach((c) => {
    const names = [c.label.toLowerCase(), ...c.aliases].join("|");
    take(new RegExp(`\\b(${names})\\b`, "g"), () => (filters.city = c));
  });

  const found =
    filters.city ||
    filters.budget ||
    filters.bhk.length ||
    filters.status.length ||
    filters.unit.length;
  if (!found) return null;

  const text = s.replace(FILLER, " ").replace(/\s+/g, " ").trim();

  // e.g. "3 BHK · Villa · Ready to Move In in Gurgaon · ₹1 – 2 Cr"
  const fmt = (n) => (n < 1 ? `${Math.round(n * 100)} L` : `${n} Cr`);
  const b = filters.budget;
  const budget = !b
    ? ""
    : b.min && b.max
      ? `₹${fmt(b.min)} – ${fmt(b.max)}`
      : b.max
        ? `under ₹${fmt(b.max)}`
        : `above ₹${fmt(b.min)}`;
  const what = [
    ...filters.bhk.map((v) => (v === "Penthouse" ? "Penthouse" : `${v} BHK`)),
    ...filters.unit,
    ...filters.status,
  ].join(", ");
  const where = [text && text.replace(/\b\w/g, (ch) => ch.toUpperCase()), filters.city?.label]
    .filter(Boolean)
    .join(", ");
  const label = [what || "Properties", where && `in ${where}`, budget].filter(Boolean).join(" ");

  return { filters, text, label };
}
