import React from "react";
import styles from "../calculators.module.css";

const KEYS = [
  { x: 24, y: 102 }, { x: 96, y: 102 }, { x: 168, y: 102 },
  { x: 24, y: 152 }, { x: 96, y: 152 }, { x: 168, y: 152 },
  { x: 24, y: 202 }, { x: 96, y: 202 }, { x: 168, y: 202 },
];
const KEY_DELAYS = [0, 0.9, 1.8, 2.4, 0.45, 3.0, 1.35, 3.6, 2.1];

/* Independent calculator motif — keys press one by one, the screen line
   draws while climbing, and the "=" key pulses. */
function HeroCalculator() {
  return (
    <div className={`${styles.motif} ${styles.mCalc}`} aria-hidden="true">
      <svg viewBox="0 0 232 300" fill="none">
        <defs>
          <linearGradient id="mcalc-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f0c977" />
            <stop offset="1" stopColor="#d9a23c" />
          </linearGradient>
        </defs>

        <rect x="3" y="3" width="226" height="294" rx="24" fill="#e7b554" fillOpacity="0.04" stroke="#e7b554" strokeOpacity="0.55" strokeWidth="3" />
        <rect x="24" y="24" width="184" height="58" rx="10" fill="#e7b554" fillOpacity="0.06" stroke="#e7b554" strokeOpacity="0.45" strokeWidth="2.5" />
        <polyline
          className={styles.artLine}
          points="36,68 64,50 92,60 124,40 156,52 196,42"
          fill="none" stroke="#f0c977" strokeOpacity="0.9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
        />

        {KEYS.map((k, i) => (
          <rect
            key={i}
            className={styles.artKey}
            x={k.x} y={k.y} width="52" height="38" rx="8"
            fill="#e7b554" fillOpacity="0"
            stroke="#e7b554" strokeOpacity="0.4" strokeWidth="2.5"
            style={{ animationDelay: `${KEY_DELAYS[i]}s` }}
          />
        ))}
        <rect x="24" y="250" width="124" height="38" rx="8" fill="#e7b554" fillOpacity="0" stroke="#e7b554" strokeOpacity="0.4" strokeWidth="2.5" />
        <rect className={styles.artEquals} x="168" y="250" width="52" height="38" rx="8" fill="url(#mcalc-gold)" fillOpacity="0.85" />
      </svg>
    </div>
  );
}

export default HeroCalculator;
