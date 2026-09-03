import React from "react";
import styles from "../Calculators.module.css";

/* Independent house motif — gently floats; the roof draws in and the door
   light blinks. */
function HeroHouse() {
  return (
    <div className={`${styles.motif} ${styles.mHouse}`} aria-hidden="true">
      <svg viewBox="0 0 150 150" fill="none">
        <path
          className={styles.artHouseRoof}
          d="M18 80 L75 26 L132 80"
          stroke="#e7b554"
          strokeOpacity="0.55"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M30 72 L30 138 L120 138 L120 72"
          stroke="#e7b554"
          strokeOpacity="0.55"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          className={styles.artHouseDoor}
          x="58"
          y="98"
          width="34"
          height="40"
          rx="3"
          stroke="#e7b554"
          strokeOpacity="0.55"
          strokeWidth="3.5"
        />
      </svg>
    </div>
  );
}

export default HeroHouse;
