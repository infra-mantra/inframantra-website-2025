import dynamic from "next/dynamic";
import { useRef } from "react";
import {
  BHK_OPTIONS,
  STATUS_OPTIONS,
  UNIT_OPTIONS,
  shortList,
} from "../../shared/search/searchFilterConfig.js";
import styles from "./FilterDropdowns.module.css";

/*
  The dropdown buttons inside the home search bar: City, Property type, BHK, Budget,
  Status. Only the buttons are drawn up front; the popover with the options is its
  own chunk, fetched when someone hovers / focuses / taps a button.
*/
const loadPopover = () => import("./FilterPopover.jsx");
const FilterPopover = dynamic(loadPopover, { ssr: false });
export const warmPopover = () => loadPopover().catch(() => {});

// The four filter dropdowns. `short` is used when the bar is narrow.
export const FIELDS = [
  {
    key: "unit",
    label: "Property type",
    short: "Type",
    options: UNIT_OPTIONS.map((u) => ({ value: u, label: u })),
  },
  { key: "bhk", label: "BHK", short: "BHK", options: BHK_OPTIONS },
  { key: "budget", label: "Budget", short: "Budget", alignRight: true },
  {
    key: "status",
    label: "Status",
    short: "Status",
    alignRight: true,
    options: STATUS_OPTIONS.map((s) => ({ value: s, label: s })),
  },
];

// What a trigger shows once something is picked, e.g. "3 BHK, 4 BHK" (null = nothing).
export const pickedText = (field, filters) => {
  if (field.key === "budget") return filters.budget?.label || null;
  const values = filters[field.key];
  if (!values.length) return null;
  return shortList(values.map((v) => field.options.find((o) => o.value === v)?.label || v));
};

export const Caret = () => (
  <svg className={styles.caret} viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
    <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

export const PinIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
    <path
      d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle cx="12" cy="10" r="2.5" fill="currentColor" />
  </svg>
);

/*
  One dropdown: a button + (when open) its popover underneath.
    field    — "city" or one of FIELDS
    open     — is this one open? (SearchOptions keeps only one open at a time)
    onToggle — open / close this one
    filters / onChange — the whole filter object and its setter
*/
export const FilterDropdown = ({ field, open, onToggle, filters, onChange, className = "" }) => {
  const btnRef = useRef(null);
  const isCity = field === "city";
  const picked = isCity ? filters.city?.label : pickedText(field, filters);
  const label = isCity ? picked || "City" : picked || field.label;

  const close = () => {
    onToggle(false);
    btnRef.current?.focus();
  };

  return (
    <div className={`${styles.dd} ${className}`}>
      <button
        ref={btnRef}
        type="button"
        className={`${isCity ? styles.cityBtn : styles.trigger} ${picked && !isCity ? styles.on : ""}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={isCity ? `City: ${label}` : picked ? `${field.label}: ${picked}` : field.label}
        title={picked || undefined}
        onPointerEnter={warmPopover}
        onFocus={warmPopover}
        onClick={() => onToggle(!open)}
      >
        {isCity && <PinIcon />}
        <span className={styles.triggerText}>
          {isCity || picked ? (
            label
          ) : (
            <>
              <span className={styles.long}>{field.label}</span>
              <span className={styles.short}>{field.short}</span>
            </>
          )}
        </span>
        <Caret />
      </button>
      {open && (
        <FilterPopover
          field={field}
          filters={filters}
          onChange={onChange}
          onClose={close}
          anchorRef={btnRef}
          alignRight={!isCity && field.alignRight}
        />
      )}
    </div>
  );
};
