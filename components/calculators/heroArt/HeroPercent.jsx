import React from "react";
import styles from "../calculators.module.css";

/* Independent percent badge — bobs up and down on its own offset. */
function HeroPercent() {
  return (
    <div className={`${styles.motif} ${styles.mPercent}`} aria-hidden="true">
      <svg viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="30" fill="#e7b554" fillOpacity="0.05" stroke="#e7b554" strokeOpacity="0.45" strokeWidth="2.5" />
        <text x="32" y="43" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="30" fontWeight="700" fill="#f0c977" fillOpacity="0.85">%</text>
      </svg>
    </div>
  );
}

export default HeroPercent;
