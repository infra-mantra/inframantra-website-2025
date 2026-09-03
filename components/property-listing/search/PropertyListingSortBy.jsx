import React, { useState, useRef, useEffect } from "react";
import styles from "./SearchBar.module.css";

// Custom dropdown (replaces the native <select> so the OPEN menu can be fully styled)
const OPTIONS = [
  { value: "relevance", label: "Recommended" },
  { value: "priceLowHigh", label: "Price: Low to High" },
  { value: "priceHighLow", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
];

const SortDropdown = ({ onSortChange, defaultValue = "relevance" }) => {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const current = OPTIONS.find((o) => o.value === value) || OPTIONS[0];
  // Keep the familiar "SORT BY" label until the user actually picks a sort
  const buttonLabel = value === "relevance" ? "SORT BY" : current.label;

  const select = (opt) => {
    setValue(opt.value);
    setOpen(false);
    onSortChange?.(opt.value);
  };

  return (
    <div className={styles.sortWrap} ref={ref}>
      <button
        type="button"
        className={styles.sortBtn}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={styles.sortBtnLabel}>{buttonLabel}</span>
        <svg
          className={`${styles.sortCaret} ${open ? styles.sortCaretOpen : ""}`}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul className={styles.sortMenu} role="listbox">
          {OPTIONS.map((opt) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              className={`${styles.sortItem} ${opt.value === value ? styles.sortItemActive : ""}`}
              onClick={() => select(opt)}
            >
              <span>{opt.label}</span>
              {opt.value === value && (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SortDropdown;
