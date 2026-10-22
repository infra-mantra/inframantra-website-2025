import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { IoSearchSharp } from "react-icons/io5";

import CustomizedHook from "../../shared/search/SearchAutocomplete.jsx";
import { useTypewriterHint } from "../../shared/search/useTypewriterHint";
import { SearchBarSkeleton } from "../HomeSkeletons.jsx";
import {
  DEFAULT_CITY,
  EMPTY_FILTERS,
  POPULAR_SEARCHES,
} from "../../shared/search/searchFilterConfig.js";
import { Caret, FIELDS, FilterDropdown, PinIcon } from "./FilterDropdowns.jsx";
import dd from "./FilterDropdowns.module.css";
import styles from "./SearchOptions.module.css";
import FilterTabs from "./FilterTabs.jsx";

/*
  The home hero search bar (99acres / Square Yards style).

  Desktop (≥1024px), one pill:
    [City ▾] | search box (with suggestions) | Property type ▾ BHK ▾ Budget ▾ Status ▾ | mic | Search
  Phone / tablet: a compact pill [City ▾ | "Search…" | 🔍] that opens a full-screen
  search sheet (SearchSheet.jsx, loaded on first tap).

  Every control writes to one `filters` object; the URL is built from it by
  buildListingUrl() in searchFilterConfig.js.
*/
const loadSheet = () => import("./SearchSheet.jsx");
const SearchSheet = dynamic(loadSheet, { ssr: false });
const warmSheet = () => loadSheet().catch(() => {});

const DESKTOP_QUERY = "(min-width: 1024px)";

const SearchOptions = () => {
  const [filters, setFilters] = useState({ ...EMPTY_FILTERS, city: DEFAULT_CITY });
  const [openMenu, setOpenMenu] = useState(null); // which dropdown is open ("city", "bhk", …)
  const [sheetOpen, setSheetOpen] = useState(false);
  const hint = useTypewriterHint(sheetOpen); // rotating example in the phone bar
  const closeSheet = useCallback(() => setSheetOpen(false), []);

  // When the visitor picks another city, the banner headline shows it
  // (BrandSlide.jsx listens for "inframantra:city"). Only on a real change.
  const lastCity = useRef(filters.city?.label);
  useEffect(() => {
    const label = filters.city?.label;
    if (label === lastCity.current) return;
    lastCity.current = label;
    window.dispatchEvent(new CustomEvent("inframantra:city", { detail: label }));
  }, [filters.city]);

  // Which layout to draw depends on the window width, which does not exist during
  // SSR — so a same-size skeleton covers the first frame instead of a restyle.
  const [isDesktop, setIsDesktop] = useState(true);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const update = () => setIsDesktop(mq.matches);
    update();
    setMounted(true);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (!mounted) return <SearchBarSkeleton />;

  // Opens one dropdown and closes the others.
  const toggle = (name) => (open) => setOpenMenu(open ? name : null);

  if (!isDesktop) {
    return (
      <div className={styles.searchOptionsWrapper}>
        <FilterTabs
          filters={filters}
          onChange={(f) => {
            setFilters(f);
            setSheetOpen(true);
          }}
        />
        <div className={styles.compactBar}>
          <button
            type="button"
            className={dd.cityBtn}
            aria-label={`City: ${filters.city?.label || "All"}. Open search`}
            onPointerDown={warmSheet}
            onClick={() => setSheetOpen(true)}
          >
            <PinIcon />
            <span className={dd.triggerText}>{filters.city?.label || "City"}</span>
            <Caret />
          </button>
          <span className={dd.cityDivider} aria-hidden="true" />
          <button
            type="button"
            className={styles.fakeInput}
            onPointerDown={warmSheet}
            onClick={() => setSheetOpen(true)}
          >
            Search {hint}
          </button>
          <button
            type="button"
            className={styles.searchIconBtn}
            aria-label="Search"
            onPointerDown={warmSheet}
            onClick={() => setSheetOpen(true)}
          >
            <IoSearchSharp size={20} />
          </button>
        </div>
        {sheetOpen && <SearchSheet filters={filters} onChange={setFilters} onClose={closeSheet} />}
      </div>
    );
  }

  const cityPicker = (
    <>
      <FilterDropdown
        field="city"
        open={openMenu === "city"}
        onToggle={toggle("city")}
        filters={filters}
        onChange={setFilters}
      />
      <span className={dd.cityDivider} aria-hidden="true" />
    </>
  );

  const filterDropdowns = (
    <div className={styles.dropdownRow}>
      {FIELDS.map((f) => (
        <FilterDropdown
          key={f.key}
          field={f}
          open={openMenu === f.key}
          onToggle={toggle(f.key)}
          filters={filters}
          onChange={setFilters}
        />
      ))}
    </div>
  );

  return (
    <div className={styles.searchOptionsWrapper}>
      <FilterTabs filters={filters} onChange={setFilters} />
      <div className={styles.searchOptionsFlexContainer}>
        <CustomizedHook
          onSearch={() => setOpenMenu(null)}
          filters={filters}
          before={cityPicker}
          addon={filterDropdowns}
          quickSearches={POPULAR_SEARCHES}
        />
      </div>
    </div>
  );
};

export default SearchOptions;
