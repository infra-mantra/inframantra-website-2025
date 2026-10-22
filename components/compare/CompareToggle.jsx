import React, { useState } from "react";
import { useCompareList, toggleCompare, MAX_COMPARE } from "./compareStore.js";
import styles from "./CompareToggle.module.css";

/*
  "+ Compare" / "✓ Added" pill for a property card or the property page.

  variant="overlay" (default): sits in the bottom-right corner of a card image.
  The parent must be position: relative.
  variant="inline": a normal button, for the property page header.

  Clicks never reach the card underneath (no navigation), and it is a real
  <button> with aria-pressed, so keyboard and screen-reader users get it too.
*/
export default function CompareToggle({ property, variant = "overlay", className = "" }) {
  const list = useCompareList();
  const [full, setFull] = useState(false); // brief "list is full" hint
  const slug = property?.slug;
  if (!slug) return null;

  const added = list.some((p) => p.slug === slug);

  const onClick = (e) => {
    e.preventDefault(); // the card may be inside an <a>
    e.stopPropagation(); // …or have its own onClick
    const result = toggleCompare(property);
    if (result === "full") {
      setFull(true);
      setTimeout(() => setFull(false), 2200);
    }
  };

  const label = full ? `Max ${MAX_COMPARE}` : added ? "Added" : "Compare";

  return (
    <button
      type="button"
      className={`${styles.cmpt_toggle} ${styles["cmpt_" + variant] || ""} ${added ? styles.cmpt_on : ""} ${className}`}
      aria-pressed={added}
      aria-label={
        added
          ? `Remove ${property.name || "property"} from compare`
          : `Add ${property.name || "property"} to compare`
      }
      title={
        full
          ? `You can compare up to ${MAX_COMPARE} properties`
          : added
            ? "Remove from compare"
            : "Add to compare"
      }
      onClick={onClick}
      // stop the card's mousedown/touch handlers (e.g. Swiper drag) from treating this as a card tap
      onMouseDown={(e) => e.stopPropagation()}
    >
      <span className={styles.cmpt_box} aria-hidden="true">
        {added ? (
          <svg viewBox="0 0 16 16" width="10" height="10">
            <path
              d="M3 8.5l3 3 7-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 16 16" width="10" height="10">
            <path
              d="M8 3v10M3 8h10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
        )}
      </span>
      <span>{label}</span>
    </button>
  );
}
