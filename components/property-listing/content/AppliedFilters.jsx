import React from "react";
import af from "./AppliedFilters.module.css";

/*
  "Applied filters" strip above the results: one removable chip per active
  filter (cities, unit type, configuration, status, price) and "Clear all".
  A configuration page's own layout (e.g. 3 BHK on /configuration/3-bhk) is the
  page's scope, not a removable filter, so it gets no chip.
*/

const configLabel = (v) => (/^\d+(\.\d+)?$/.test(v) ? `${v} BHK` : v);
const priceLabel = ([min, max]) => {
  if (min && max) return `₹${min} Cr – ₹${max} Cr`;
  if (min) return `From ₹${min} Cr`;
  if (max) return `Up to ₹${max} Cr`;
  return "";
};

export default function AppliedFilters({ filters, pageConfiguration, onRemove, onClearAll }) {
  const chips = [];
  (filters.city || []).forEach((v) => chips.push({ key: "city", value: v, label: v, kind: "City" }));
  (filters.unitType || []).forEach((v) => chips.push({ key: "unitType", value: v, label: v, kind: "Type" }));
  (filters.configuration || [])
    .filter((v) => !(pageConfiguration && v === pageConfiguration && filters.configuration.length === 1))
    .forEach((v) => chips.push({ key: "configuration", value: v, label: configLabel(v), kind: "Size" }));
  (filters.status || []).forEach((v) => chips.push({ key: "status", value: v, label: v, kind: "Status" }));
  const price = priceLabel(filters.priceRange || []);
  if (price) chips.push({ key: "priceRange", value: null, label: price, kind: "Price" });

  if (!chips.length) return null;

  return (
    <div className={af["af-bar"]} aria-label="Applied filters">
      <span className={af["af-title"]}>
        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
          <path d="M3 5h18l-7 8v5l-4 2v-7L3 5z" fill="currentColor" />
        </svg>
        Applied filters
      </span>
      <div className={af["af-chips"]}>
        {chips.map((c) => (
          <span key={`${c.key}-${c.label}`} className={af["af-chip"]}>
            <span className={af["af-kind"]}>{c.kind}</span>
            {c.label}
            <button
              type="button"
              className={af["af-remove"]}
              onClick={() => onRemove(c.key, c.value)}
              aria-label={`Remove ${c.label}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      {chips.length > 1 && (
        <button type="button" className={af["af-clear"]} onClick={onClearAll}>
          Clear all
        </button>
      )}
    </div>
  );
}
