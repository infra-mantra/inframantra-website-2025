import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { slugify } from "../../../utils/slugify.js";
import lf from "./LocationFilter.module.css";

/*
  Location section of the listing filters.

  - A search box over every state, city, locality and sub-locality that has
    properties (from GET /location-tree, built from the search index itself).
  - Cities list with property counts; the arrow expands a city into its
    localities (the tree stops there — sub-localities are reachable from search).
  - The place the page is showing is highlighted and auto-expanded. Clicking it
    again does nothing destructive (it used to un-tick the city).
  - Moving to another place keeps the filters already applied (unit type,
    configuration, status, price, sort) by carrying them in the query string.
  - Configuration pages (/configuration/3-bhk) keep their old behaviour for
    cities: a city narrows the page (onRefineCity) instead of navigating away.
*/

// Fallback when the tree endpoint is unavailable: the cities the filter always had.
const FALLBACK_CITIES = ["Gurgaon", "Mohali", "Noida", "Pune", "Jaipur"];
// Also the order of the city list. Cities kept out of the list (still reachable
// through the location search box).
const HIDDEN_CITIES = ["ghaziabad"];
const cityRank = (name) => {
  const i = FALLBACK_CITIES.findIndex((c) => c.toLowerCase() === String(name).toLowerCase());
  return i === -1 ? FALLBACK_CITIES.length : i;
};

// Fetched once per page load and shared by the desktop and mobile filters.
let treeCache = null;
let treePromise = null;
const loadTree = () => {
  if (treeCache) return Promise.resolve(treeCache);
  if (!treePromise) {
    treePromise = fetch(`${process.env.apiUrl1}/location-tree`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data) => {
        treeCache = Array.isArray(data?.states) ? data.states : [];
        return treeCache;
      })
      .catch((err) => {
        treePromise = null; // allow a retry on the next mount
        throw err;
      });
  }
  return treePromise;
};

const LOC_PREVIEW = 6; // localities visible before "+N more"

const TYPE_LABEL = {
  state: "State",
  city: "City",
  locality: "Locality",
  subLocality: "Sub-locality",
};

export default function LocationFilter({
  // configuration pages only: city chips narrow the page instead of navigating
  refineCities = [],
  onRefineCity,
  // called after navigating (the mobile drawer closes itself)
  onNavigate,
  // Multi-select: { cities: [slug], localities: [slug] } and its setter. When
  // given, city and locality chips toggle instead of navigating.
  selection,
  onSelectionChange,
  // The tree from getStaticProps, when the page has it. Rendering from it on the
  // server (and the first client render) puts the real chips in the HTML; the
  // loading skeleton was ~140px taller and collapsed after hydration (CLS).
  initialStates = null,
}) {
  const seed = Array.isArray(initialStates) ? initialStates : null;
  // Share with the other filter instance — browser only, so the server process
  // never pins a tree in module state across requests.
  if (typeof window !== "undefined" && !treeCache && seed) treeCache = seed;
  const router = useRouter();
  const { type, name } = router.query;
  const current = { type, slug: String(name || "").toLowerCase() };
  const isConfigurationPage = type === "configuration";

  const [states, setStates] = useState(seed || treeCache);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState("");
  const [openCities, setOpenCities] = useState({});
  const [showAllLocs, setShowAllLocs] = useState({});

  useEffect(() => {
    let alive = true;
    loadTree()
      .then((s) => alive && setStates(s))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, []);

  const cities = useMemo(
    () =>
      (states || [])
        .flatMap((s) => s.cities.map((c) => ({ ...c, state: s.name })))
        .filter((c) => !HIDDEN_CITIES.includes(c.name.toLowerCase()))
        // business order first (FALLBACK_CITIES); any new city follows by size
        .sort((a, b) => {
          const ia = cityRank(a.name),
            ib = cityRank(b.name);
          return ia !== ib ? ia - ib : b.count - a.count;
        }),
    [states]
  );

  // Which city / locality the current page sits in, so they start expanded.
  const currentPath = useMemo(() => {
    for (const c of cities) {
      if (current.type === "city" && slugify(c.name) === current.slug) return { city: c.name };
      for (const l of c.localities) {
        if (current.type === "locality" && slugify(l.name) === current.slug)
          return { city: c.name, locality: `${c.name}|${l.name}` };
        for (const s of l.subLocalities) {
          if (current.type === "subLocality" && slugify(s.name) === current.slug)
            return { city: c.name, locality: `${c.name}|${l.name}` };
        }
      }
    }
    return {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cities, current.type, current.slug]);

  useEffect(() => {
    if (currentPath.city) setOpenCities((o) => ({ ...o, [currentPath.city]: true }));
  }, [currentPath.city, currentPath.locality]);

  // Localities shown under the city chips: the city this page sits in, or the
  // one the visitor opened.
  const openName = Object.keys(openCities).find((k) => openCities[k]);
  const localityCity =
    cities.find((c) => c.name === currentPath.city) || cities.find((c) => c.name === openName);

  // ---------- multi-select ----------
  const multiMode = !!onSelectionChange && !isConfigurationPage;
  const selCities = selection?.cities || [];
  const selLocs = selection?.localities || [];
  // "whole" = the city itself is picked; "partial" = some of its localities are
  const cityState = (c) =>
    selCities.includes(slugify(c.name))
      ? "whole"
      : c.localities.some((l) => selLocs.includes(slugify(l.name)))
        ? "partial"
        : "none";
  const pickedCities = multiMode ? cities.filter((c) => cityState(c) !== "none") : [];
  const locGroups = pickedCities.length ? pickedCities : localityCity ? [localityCity] : [];

  const emit = (next) => {
    setQuery("");
    onSelectionChange(next);
  };
  const toggleCityMulti = (c) => {
    const cs = slugify(c.name);
    const own = c.localities.map((l) => slugify(l.name));
    if (cityState(c) !== "none") {
      emit({
        cities: selCities.filter((x) => x !== cs),
        localities: selLocs.filter((x) => !own.includes(x)),
      });
    } else {
      emit({ cities: [...selCities, cs], localities: selLocs });
    }
  };
  const toggleLocMulti = (c, l) => {
    const ls = slugify(l.name);
    if (selLocs.includes(ls)) {
      emit({ cities: selCities, localities: selLocs.filter((x) => x !== ls) });
    } else {
      // picking a locality narrows its city from "whole" to just the picked ones
      emit({
        cities: selCities.filter((x) => x !== slugify(c.name)),
        localities: [...selLocs, ls],
      });
    }
  };
  const onLocalityClick = (c, l) => (multiMode ? toggleLocMulti(c, l) : go("locality", l.name));

  const isCurrent = (t, n) => current.type === t && slugify(n) === current.slug;

  // Carry the applied filters to the new place; page resets to 1.
  const hrefFor = (t, n) => {
    const keep = {};
    for (const k of ["status", "unit", "config", "min", "max", "sort"]) {
      if (router.query[k]) keep[k] = router.query[k];
    }
    // A configuration page's own layout lives in its path; keep it as a filter.
    if (isConfigurationPage && !keep.config && onRefineCity) {
      const own = router.query.name;
      const cfg = {
        "2-bhk": "2",
        "3-bhk": "3",
        "4-bhk": "4",
        "5-bhk": "5",
        penthouse: "Penthouse",
      }[String(own || "").toLowerCase()];
      if (cfg) keep.config = cfg;
    }
    return { pathname: `/property-listing/${t}/${slugify(n)}`, query: keep };
  };

  const go = (t, n) => {
    if (isCurrent(t, n)) return; // already here — nothing to change
    setQuery("");
    router.push(hrefFor(t, n));
    onNavigate?.();
  };

  const onCityClick = (c) => {
    if (multiMode) return toggleCityMulti(c);
    if (isConfigurationPage && onRefineCity) {
      onRefineCity(c.name);
      return;
    }
    // Already on this city: just make sure its localities are showing (the arrow
    // is what collapses them). Never un-selects anything.
    if (isCurrent("city", c.name)) {
      setOpenCities((o) => ({ ...o, [c.name]: true }));
      return;
    }
    go("city", c.name);
  };

  // ---------- search ----------
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2 || !states) return [];
    const out = [];
    const push = (t, n, count, parent) => {
      if (n.toLowerCase().includes(q)) out.push({ t, n, count, parent });
    };
    for (const s of states) {
      if (s.name !== "Other") push("state", s.name, s.count, "");
      for (const c of s.cities) {
        push("city", c.name, c.count, s.name !== "Other" ? s.name : "");
        for (const l of c.localities) {
          push("locality", l.name, l.count, c.name);
          for (const sub of l.subLocalities)
            push("subLocality", sub.name, sub.count, `${l.name}, ${c.name}`);
        }
      }
    }
    // starts-with first, then by size
    return out
      .sort(
        (a, b) =>
          Number(b.n.toLowerCase().startsWith(q)) - Number(a.n.toLowerCase().startsWith(q)) ||
          b.count - a.count
      )
      .slice(0, 8);
  }, [query, states]);

  const loading = !states && !failed;

  return (
    <div className={lf["lf-root"]}>
      {/* Search */}
      <div className={lf["lf-search"]}>
        <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
          <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2.2" />
          <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && results[0]) go(results[0].t, results[0].n);
            if (e.key === "Escape") setQuery("");
          }}
          placeholder="Search state, city, locality…"
          aria-label="Search state, city, locality or sub-locality"
          disabled={failed}
        />
        {query && (
          <button
            type="button"
            className={lf["lf-clear"]}
            onClick={() => setQuery("")}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {query.trim().length >= 2 && (
        <ul className={lf["lf-results"]} role="listbox" aria-label="Matching places">
          {results.length ? (
            results.map((r) => (
              <li key={`${r.t}-${r.n}-${r.parent}`}>
                <button
                  type="button"
                  className={`${lf["lf-result"]} ${isCurrent(r.t, r.n) ? lf["is-current"] : ""}`}
                  onClick={() => go(r.t, r.n)}
                >
                  <span className={lf["lf-result-main"]}>
                    <span className={lf["lf-result-name"]}>{r.n}</span>
                    {r.parent && <span className={lf["lf-result-parent"]}>{r.parent}</span>}
                  </span>
                  <span className={lf["lf-type"]}>{TYPE_LABEL[r.t]}</span>
                  <span className={lf["lf-count"]}>{r.count}</span>
                </button>
              </li>
            ))
          ) : (
            <li className={lf["lf-empty"]}>No matching places</li>
          )}
        </ul>
      )}

      {/* Cities > localities > sub-localities */}
      {loading && (
        <div className={lf["lf-skeleton"]} aria-hidden="true">
          {[70, 55, 62, 48, 58].map((w, i) => (
            <span key={i} style={{ width: `${w}%` }} />
          ))}
        </div>
      )}

      {failed && (
        <div className={lf["lf-fallback"]}>
          {FALLBACK_CITIES.map((c) => (
            <button
              key={c}
              type="button"
              className={`${lf["lf-chip"]} ${
                isCurrent("city", c) || refineCities.includes(c) ? lf["is-current"] : ""
              }`}
              onClick={() => onCityClick({ name: c })}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {!loading && !failed && (
        <>
          {/* Cities: multi-select chips (✓ when picked, whole or in part) */}
          <div className={lf["lf-cities"]} role="group" aria-label="Cities">
            {cities.map((c) => {
              const picked = multiMode
                ? cityState(c) !== "none"
                : isCurrent("city", c.name) || refineCities.includes(c.name);
              const partial = multiMode && cityState(c) === "partial";
              return (
                <button
                  key={c.name}
                  type="button"
                  className={`${lf["lf-chip"]} ${picked && !partial ? lf["is-current"] : ""} ${
                    partial || (!multiMode && currentPath.city === c.name && !picked)
                      ? lf["is-within"]
                      : ""
                  }`}
                  aria-pressed={picked}
                  disabled={!c.count}
                  onClick={() => onCityClick(c)}
                >
                  {picked && (
                    <span className={lf["lf-tick"]} aria-hidden="true">
                      ✓
                    </span>
                  )}
                  {c.name}
                  <span className={lf["lf-count"]}>{c.count}</span>
                </button>
              );
            })}
          </div>

          {/* Localities of every picked city, grouped by city */}
          {locGroups.length > 0 && (
            <div className={lf["lf-locs"]}>
              <span className={lf["lf-locs-label"]}>
                Localities in {locGroups.map((g) => g.name).join(", ")}
              </span>
              {locGroups.map((g) => {
                const all = !!showAllLocs[g.name];
                const list = all ? g.localities : g.localities.slice(0, LOC_PREVIEW);
                return (
                  <div key={g.name} className={lf["lf-locgroup"]}>
                    {locGroups.length > 1 && (
                      <span className={lf["lf-locgroup-name"]}>{g.name}</span>
                    )}
                    <div
                      className={lf["lf-chips"]}
                      role="group"
                      aria-label={`Localities in ${g.name}`}
                    >
                      {list.map((l) => {
                        const on = multiMode
                          ? selLocs.includes(slugify(l.name))
                          : isCurrent("locality", l.name);
                        return (
                          <button
                            key={l.name}
                            type="button"
                            className={`${lf["lf-chip"]} ${lf["lf-chip-sm"]} ${
                              on ? lf["is-current"] : ""
                            }`}
                            aria-pressed={on}
                            disabled={!l.count}
                            onClick={() => onLocalityClick(g, l)}
                          >
                            {on && (
                              <span className={lf["lf-tick"]} aria-hidden="true">
                                ✓
                              </span>
                            )}
                            {l.name}
                            <span className={lf["lf-count"]}>{l.count}</span>
                          </button>
                        );
                      })}
                      {g.localities.length > LOC_PREVIEW && (
                        <button
                          type="button"
                          className={lf["lf-more"]}
                          aria-expanded={all}
                          onClick={() => setShowAllLocs((s) => ({ ...s, [g.name]: !all }))}
                        >
                          {all ? "Show less" : `+${g.localities.length - LOC_PREVIEW} more`}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
