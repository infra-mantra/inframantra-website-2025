import React from "react";
import styles from "../calculators.module.css";

const BARS = [
  { x: 10, y: 90, h: 50, d: 0 },
  { x: 44, y: 60, h: 80, d: 0.22 },
  { x: 78, y: 30, h: 110, d: 0.44 },
  { x: 112, y: 10, h: 130, d: 0.66 },
];

/* Independent bar-chart motif — bars load in one by one (left to right),
   hold, then reset, like a chart populating. */
function HeroBars() {
  return (
    <div className={`${styles.motif} ${styles.mBars}`} aria-hidden="true">
      <svg viewBox="0 0 140 150" fill="none">
        <defs>
          <linearGradient id="mbar-gold" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#d9a23c" />
            <stop offset="1" stopColor="#f0c977" />
          </linearGradient>
        </defs>
        {BARS.map((b, i) => (
          <rect
            key={i}
            className={styles.artBar}
            x={b.x} y={b.y} width="22" height={b.h} rx="4"
            fill="url(#mbar-gold)" fillOpacity={0.6 + i * 0.13}
            style={{ animationDelay: `${b.d}s` }}
          />
        ))}
        <line x1="4" y1="141" x2="136" y2="141" stroke="#e7b554" strokeOpacity="0.3" strokeWidth="2" />
      </svg>
    </div>
  );
}

export default HeroBars;
