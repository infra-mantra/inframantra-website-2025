import { useEffect, useRef, useState } from "react";
import {
  BUDGET_OPTIONS,
  BUDGET_STEPS,
  CITIES,
  EMPTY_FILTERS,
  buildListingUrl,
  formatCr,
  makeBudget,
} from "../../shared/search/searchFilterConfig.js";
import { countParams, useCounts } from "../../shared/search/filterCounts.js";
import styles from "./FilterDropdowns.module.css";

/*
  The options of one search-bar dropdown (loaded lazily by FilterDropdowns).

  City: pick one, applied straight away.
  Property type / BHK / Status: tick several, then Apply.
  Budget: a preset, or a Min / Max pair, then Apply.

  `inSheet` → drawn inside the phone search sheet (full width, no floating box,
  no outside-click handling — the sheet owns that).
*/
// "12" after an option: a shimmer while loading, nothing if the count failed
export const Count = ({ n }) => {
  if (n === null) return null;
  if (n === undefined) return <span className={styles.countLoading} aria-hidden="true" />;
  return <span className={styles.count}>{n}</span>;
};

// small diagonal "go" arrow (also used by FilterTabs.jsx)
export const GoArrow = () => (
  <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
    <path
      d="M4.5 11.5l7-7M6 4.5h5.5V10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// The arrow next to an option: straight to the listing with ONLY that option
// (and the city). No arrow when the option has no properties.
const GoTo = ({ filters, set, label, n }) => {
  if (n === 0) return null;
  const city = filters.city?.label;
  const where = city ? ` in ${city}` : "";
  const count = typeof n === "number" ? ` (${n})` : "";
  return (
    <a
      className={styles.optGo}
      href={buildListingUrl({ ...EMPTY_FILTERS, city: filters.city, ...set })}
      aria-label={`See ${label}${where}${count}`}
    >
      <GoArrow />
    </a>
  );
};

const toggleIn = (list, v) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

const FilterPopover = ({ field, filters, onChange, onClose, anchorRef, alignRight, inSheet }) => {
  const boxRef = useRef(null);
  const isCity = field === "city";
  const key = isCity ? "city" : field.key;

  // Changes are kept here until Apply (city applies on tap).
  const [draft, setDraft] = useState(filters[key]);
  const [min, setMin] = useState(filters.budget?.min || "");
  const [max, setMax] = useState(filters.budget?.max || "");

  // Escape or a click outside closes (the trigger button toggles itself).
  useEffect(() => {
    boxRef.current?.querySelector("button, select")?.focus({ preventScroll: true });
    if (inSheet) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose();
    const onDown = (e) => {
      if (boxRef.current?.contains(e.target) || anchorRef?.current?.contains(e.target)) return;
      onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
    // Set up once per open popover.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const apply = (value) => {
    onChange({ ...filters, [key]: value });
    onClose();
  };
  const clear = () => {
    setDraft(Array.isArray(draft) ? [] : null);
    setMin("");
    setMax("");
  };
  // A preset keeps its own short label ("₹1 – 2 Cr"); any other pair gets one built.
  const budgetValue = () =>
    BUDGET_OPTIONS.find((b) => b.min === (min || null) && b.max === (max || null)) ||
    makeBudget(Number(min) || null, Number(max) || null);

  // how many properties each option has in the chosen city (not for City)
  const countItems = isCity
    ? []
    : key === "budget"
      ? BUDGET_OPTIONS.map((b) => ({ id: b.label, params: countParams.budget(b) }))
      : field.options.map((o) => ({ id: o.value, params: countParams[key](o.value) }));
  const counts = useCounts(filters.city, countItems, !isCity);

  const boxClass = inSheet ? styles.sheetBox : `${styles.pop} ${alignRight ? styles.right : ""}`;
  const title = isCity ? "Select city" : field.label;

  // ---- City: a simple list, picked on tap ----
  if (isCity) {
    return (
      <div ref={boxRef} className={boxClass} role="dialog" aria-label={title}>
        <p className={styles.popTitle}>{title}</p>
        <div className={styles.options} role="radiogroup" aria-label="City">
          {CITIES.map((c) => (
            <button
              key={c.slug}
              type="button"
              role="radio"
              aria-checked={draft?.slug === c.slug}
              className={`${styles.opt} ${draft?.slug === c.slug ? styles.optOn : ""}`}
              onClick={() => apply(c)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={boxRef} className={boxClass} role="dialog" aria-label={title}>
      {!inSheet && <p className={styles.popTitle}>{title}</p>}

      {key === "budget" ? (
        <>
          <div className={styles.options}>
            {BUDGET_OPTIONS.map((b) => {
              const on = (min || null) === b.min && (max || null) === b.max;
              return (
                <span key={b.label} className={styles.optRow}>
                  <button
                    type="button"
                    aria-pressed={on}
                    className={`${styles.opt} ${on ? styles.optOn : ""}`}
                    disabled={counts[b.label] === 0 && !on}
                    onClick={() => {
                      setMin(on ? "" : b.min || "");
                      setMax(on ? "" : b.max || "");
                    }}
                  >
                    {b.label}
                    <Count n={counts[b.label]} />
                  </button>
                  <GoTo filters={filters} set={{ budget: b }} label={b.label} n={counts[b.label]} />
                </span>
              );
            })}
          </div>
          <div className={styles.minMax}>
            <label className={styles.selectWrap}>
              <span>Min</span>
              <select value={min} onChange={(e) => setMin(Number(e.target.value) || "")}>
                <option value="">No min</option>
                {BUDGET_STEPS.filter((s) => !max || s < max).map((s) => (
                  <option key={s} value={s}>
                    {formatCr(s)}
                  </option>
                ))}
              </select>
            </label>
            <span className={styles.dash} aria-hidden="true">
              –
            </span>
            <label className={styles.selectWrap}>
              <span>Max</span>
              <select value={max} onChange={(e) => setMax(Number(e.target.value) || "")}>
                <option value="">No max</option>
                {BUDGET_STEPS.filter((s) => !min || s > min).map((s) => (
                  <option key={s} value={s}>
                    {formatCr(s)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </>
      ) : (
        <div className={styles.options}>
          {field.options.map((o) => {
            const on = draft.includes(o.value);
            return (
              <span key={o.value} className={styles.optRow}>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={on}
                  className={`${styles.opt} ${on ? styles.optOn : ""}`}
                  disabled={counts[o.value] === 0 && !on}
                  onClick={() => setDraft(toggleIn(draft, o.value))}
                >
                  {on && <span aria-hidden="true">✓ </span>}
                  {o.label}
                  <Count n={counts[o.value]} />
                </button>
                <GoTo
                  filters={filters}
                  set={{ [key]: [o.value] }}
                  label={o.label}
                  n={counts[o.value]}
                />
              </span>
            );
          })}
        </div>
      )}

      <div className={styles.popFoot}>
        <button type="button" className={styles.clear} onClick={clear}>
          Clear
        </button>
        <button
          type="button"
          className={styles.apply}
          onClick={() => apply(key === "budget" ? budgetValue() : draft)}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default FilterPopover;
