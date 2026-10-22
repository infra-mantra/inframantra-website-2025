import { useEffect, useState } from "react";

/*
  How many properties match one filter option, for the search bar's dropdowns
  and the filter tabs ("Villa 12").

  Source: GET {apiUrl1}/search?q=<city>&limit=1&fields=card&<filter>
  The same endpoint and filter names the listing page uses (property-listing
  [name].js buildSearchQuery); we only read `total`. One small request per
  option, made the first time a dropdown/tab row is opened, cached per city.
  A failed request gives `null`: the count is then simply not shown.
*/
const cache = new Map(); // "gurgaon|status=New Launch" -> Promise<number|null>

// filter -> query params, same spelling as the listing page
export const countParams = {
  unit: (v) => ({ unitType: v }),
  bhk: (v) => ({ configuration: v }),
  status: (v) => ({ status: v }),
  // budget option: min / max in crores
  budget: (b) => ({
    ...(b.min ? { minPrice: Math.round(b.min * 1e7) } : {}),
    ...(b.max ? { maxPrice: Math.round(b.max * 1e7) } : {}),
  }),
};

export function loadCount(city, params) {
  const q = new URLSearchParams({ q: city?.slug || "property-in-india", limit: 1, fields: "card" });
  Object.entries(params).forEach(([k, v]) => q.set(k, v));
  const key = q.toString();
  if (!cache.has(key)) {
    const request = fetch(`${process.env.apiUrl1}/search?${key}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => (typeof d?.total === "number" ? d.total : null))
      .catch(() => null);
    cache.set(key, request);
  }
  return cache.get(key);
}

/*
  Counts for a list of options: `items` = [{ id, params, city? }] (an item's own
  `city` overrides the shared one, e.g. one total per city).
  Returns { [id]: number | null } (missing = still loading). Only loads while
  `enabled` is true, so nothing is fetched until the user opens the menu.
*/
export function useCounts(city, items, enabled = true) {
  const [counts, setCounts] = useState({});
  const key = `${city?.slug}|${items.map((i) => `${i.city?.slug || ""}${i.id}`).join(",")}`;
  useEffect(() => {
    if (!enabled) return undefined;
    let alive = true;
    setCounts({});
    items.forEach(({ id, params, city: own }) =>
      loadCount(own || city, params).then((n) => alive && setCounts((c) => ({ ...c, [id]: n })))
    );
    return () => {
      alive = false;
    };
    // `key` covers city + items
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled]);
  return counts;
}
