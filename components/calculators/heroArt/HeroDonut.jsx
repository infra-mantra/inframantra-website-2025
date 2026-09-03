import React from "react";
import styles from "../Calculators.module.css";

/* Independent donut/pie motif — the whole ring spins slowly like a live chart
   (rotation is applied to the .mDonut wrapper in CSS). */
function HeroDonut() {
  return (
    <div className={`${styles.motif} ${styles.mDonut}`} aria-hidden="true">
      <svg viewBox="0 0 120 120" fill="none">
        <defs>
          <linearGradient id="mdonut-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f0c977" />
            <stop offset="1" stopColor="#d9a23c" />
          </linearGradient>
        </defs>
        <circle
          cx="60"
          cy="60"
          r="46"
          fill="none"
          stroke="#e7b554"
          strokeOpacity="0.22"
          strokeWidth="14"
        />
        <circle
          cx="60"
          cy="60"
          r="46"
          fill="none"
          stroke="url(#mdonut-gold)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray="289"
          strokeDashoffset="110"
          transform="rotate(-90 60 60)"
        />
        <circle cx="60" cy="60" r="22" fill="#e7b554" fillOpacity="0.08" />
      </svg>
    </div>
  );
}

export default HeroDonut;
