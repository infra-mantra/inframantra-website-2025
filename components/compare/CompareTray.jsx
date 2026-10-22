import React, { useState } from "react";
import { useRouter } from "next/router";
import { useCompareList, removeFromCompare, clearCompare, MAX_COMPARE } from "./compareStore.js";
import styles from "./CompareTray.module.css";

/*
  Fixed bottom bar listing the properties picked for comparison.
  Loaded with next/dynamic from _app.js only once something is in the list,
  so visitors who never compare never download it.
*/
export default function CompareTray() {
  const list = useCompareList();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false); // phones: fold down to one line

  if (!list.length) return null;

  const canCompare = list.length >= 2;
  const emptySlots = Math.max(0, MAX_COMPARE - list.length);
  const goCompare = () => {
    if (!canCompare) return;
    router.push(`/compare?p=${list.map((p) => encodeURIComponent(p.slug)).join(",")}`);
  };

  return (
    <aside
      className={`${styles.cmptr_tray} ${collapsed ? styles.cmptr_collapsed : ""}`}
      aria-label="Properties selected for comparison"
    >
      <div className={styles.cmptr_inner}>
        <button
          type="button"
          className={styles.cmptr_head}
          onClick={() => setCollapsed((c) => !c)}
          aria-expanded={!collapsed}
        >
          <span className={styles.cmptr_title}>
            Compare <span className={styles.cmptr_count}>{list.length}</span>
            <span className={styles.cmptr_of}>/ {MAX_COMPARE}</span>
          </span>
          <svg
            className={styles.cmptr_chev}
            viewBox="0 0 24 24"
            width="16"
            height="16"
            aria-hidden="true"
          >
            <path
              d="M6 15l6-6 6 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <ul className={styles.cmptr_slots}>
          {list.map((p) => (
            <li key={p.slug} className={styles.cmptr_item}>
              {p.image ? (
                <img
                  src={p.image}
                  alt=""
                  className={styles.cmptr_thumb}
                  width="56"
                  height="42"
                  loading="lazy"
                />
              ) : (
                <span className={styles.cmptr_thumb} aria-hidden="true" />
              )}
              <span className={styles.cmptr_meta}>
                <span className={styles.cmptr_name}>{p.name}</span>
                <span className={styles.cmptr_sub}>
                  {p.price ? `₹ ${p.price}` : p.location || "—"}
                </span>
              </span>
              <button
                type="button"
                className={styles.cmptr_remove}
                onClick={() => removeFromCompare(p.slug)}
                aria-label={`Remove ${p.name} from compare`}
              >
                ×
              </button>
            </li>
          ))}
          {Array.from({ length: emptySlots }).map((_, i) => (
            <li
              key={`empty-${i}`}
              className={`${styles.cmptr_item} ${styles.cmptr_empty}`}
              aria-hidden="true"
            >
              <span className={styles.cmptr_plus}>+</span>
              <span className={styles.cmptr_sub}>Add a property</span>
            </li>
          ))}
        </ul>

        <div className={styles.cmptr_actions}>
          <button type="button" className={styles.cmptr_clear} onClick={clearCompare}>
            Clear
          </button>
          <button
            type="button"
            className={styles.cmptr_go}
            onClick={goCompare}
            disabled={!canCompare}
            title={canCompare ? undefined : "Add at least 2 properties to compare"}
          >
            Compare ({list.length})
          </button>
        </div>
      </div>
    </aside>
  );
}
