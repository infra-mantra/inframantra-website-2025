import React, { useState } from "react";
import { useShortlist, toggleShortlist, restoreToShortlist } from "./shortlistStore.js";
import { notify } from "./toast.js";
import styles from "./Shortlist.module.css";

/*
  ♥ Save / shortlist toggle for a property card or the property page.

  variant="overlay" (default): round button in the top-right corner of a card
  photo (parent must be position: relative). Pass className to move it.
  variant="inline": a small pill for the property page header.

  Clicks never reach the card underneath (no navigation), and it is a real
  <button> with aria-pressed so keyboard and screen-reader users get it too.
*/
export default function HeartButton({
  property,
  variant = "overlay",
  corner = "right", // overlay only: "right" (top-right) or "left" (top-left)
  className = "",
}) {
  const list = useShortlist();
  const [burst, setBurst] = useState(0); // bumps on each like to replay the animation
  const slug = property?.slug;
  if (!slug) return null;

  const liked = list.some((p) => p.slug === slug);
  const name = property.name || "property";

  const onClick = (e) => {
    e.preventDefault(); // the card may be inside an <a>
    e.stopPropagation(); // …or have its own onClick
    const { liked: nowLiked, item } = toggleShortlist(property);
    if (nowLiked) {
      setBurst((n) => n + 1);
      notify({ message: "Saved to your shortlist", linkText: "View", href: "/shortlist" });
    } else {
      notify({
        message: `Removed ${item.name || "property"}`,
        actionText: "Undo",
        onAction: () => restoreToShortlist(item),
      });
    }
  };

  return (
    <button
      type="button"
      className={`${styles.heart} ${styles["heart_" + variant] || ""} ${
        variant === "overlay" && corner === "left" ? styles.heart_left : ""
      } ${liked ? styles.heartOn : ""} ${className}`}
      aria-pressed={liked}
      aria-label={liked ? `Remove ${name} from shortlist` : `Save ${name}`}
      title={liked ? "Remove from shortlist" : "Save to shortlist"}
      onClick={onClick}
      // stop the card's mousedown/touch handlers (e.g. Swiper drag) treating this as a card tap
      onMouseDown={(e) => e.stopPropagation()}
    >
      <span key={burst} className={`${styles.heartIcon} ${burst && liked ? styles.heartPop : ""}`}>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path
            d="M12 20.6s-7.6-4.6-9.4-9.3C1.4 8 3.4 4.5 6.9 4.5c2 0 3.7 1.1 5.1 3 1.4-1.9 3.1-3 5.1-3 3.5 0 5.5 3.5 4.3 6.8-1.8 4.7-9.4 9.3-9.4 9.3z"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
        {burst > 0 && liked && (
          <span className={styles.burst} aria-hidden="true">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <i key={i} style={{ "--a": `${i * 60}deg` }} />
            ))}
          </span>
        )}
      </span>
      {variant === "inline" && <span>{liked ? "Saved" : "Save"}</span>}
    </button>
  );
}
