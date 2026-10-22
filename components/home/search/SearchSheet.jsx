import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/router";
import CustomizedHook, { resolveSearch } from "../../shared/search/SearchAutocomplete.jsx";
import {
  CITIES,
  EMPTY_FILTERS,
  POPULAR_SEARCHES,
  countFilters,
} from "../../shared/search/searchFilterConfig.js";
import { addRecentSearch } from "../../shared/search/recentSearches.js";
import { Caret, FIELDS, pickedText } from "./FilterDropdowns.jsx";
import FilterPopover from "./FilterPopover.jsx";
import styles from "./SearchSheet.module.css";

/*
  Phone / tablet search: a full-screen sheet opened from the compact bar.
  Top to bottom: city chips, search box, filter chips (scroll sideways), the open
  filter's options, recent / popular / live suggestions, and "Show properties".
  Loaded lazily by SearchOptions on the first tap. Portalled to <body> because the
  hero's search wrapper uses a transform (position:fixed would stick to it).
*/
const SearchSheet = ({ filters, onChange, onClose }) => {
  const router = useRouter();
  const typedRef = useRef(""); // the search box text, for "Show properties"
  const [openField, setOpenField] = useState(null); // filter whose options are showing

  // Lock the page behind the sheet; Escape closes it.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const showProperties = async () => {
    const { href, label } = await resolveSearch(typedRef.current, filters);
    addRecentSearch(label, href);
    router.push(href);
  };

  const field = FIELDS.find((f) => f.key === openField);
  const active = countFilters({ ...filters, city: null });

  // Filter chips row (sits between the search box and the suggestions).
  const chipRow = (
    <>
      <div className={styles.chipRow} role="toolbar" aria-label="Filters">
        {FIELDS.map((f) => {
          const picked = pickedText(f, filters);
          const open = openField === f.key;
          return (
            <button
              key={f.key}
              type="button"
              aria-expanded={open}
              className={`${styles.chip} ${picked ? styles.chipOn : ""} ${open ? styles.chipOpen : ""}`}
              onClick={() => setOpenField(open ? null : f.key)}
            >
              <span className={styles.chipText}>{picked || f.label}</span>
              <Caret />
            </button>
          );
        })}
        {active > 0 && (
          <button
            type="button"
            className={styles.resetChip}
            onClick={() => onChange({ ...EMPTY_FILTERS, city: filters.city })}
          >
            Reset
          </button>
        )}
      </div>
      {field && (
        // key: a fresh draft each time a different filter is opened
        <FilterPopover
          key={field.key}
          field={field}
          filters={filters}
          onChange={onChange}
          onClose={() => setOpenField(null)}
          inSheet
        />
      )}
    </>
  );

  return createPortal(
    <div className={styles.sheet} role="dialog" aria-modal="true" aria-label="Search">
      <header className={styles.head}>
        <button type="button" className={styles.back} aria-label="Close search" onClick={onClose}>
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
        <span className={styles.title}>Search properties</span>
      </header>

      <div className={styles.body}>
        <div className={styles.cityRow} role="radiogroup" aria-label="City">
          {CITIES.map((c) => {
            const on = filters.city?.slug === c.slug;
            return (
              <button
                key={c.slug}
                type="button"
                role="radio"
                aria-checked={on}
                className={`${styles.city} ${on ? styles.cityOn : ""}`}
                onClick={() => onChange({ ...filters, city: c })}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        <CustomizedHook
          onSearch={() => {}}
          filters={filters}
          quickSearches={POPULAR_SEARCHES}
          onInputChange={(v) => (typedRef.current = v)}
          toolbar={chipRow}
          inline
          autoFocus
          showButton={false}
        />
      </div>

      <footer className={styles.foot}>
        <button type="button" className={styles.show} onClick={showProperties}>
          Show properties
        </button>
      </footer>
    </div>,
    document.body
  );
};

export default SearchSheet;
