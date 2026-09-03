import React from "react";
import styles from "../Calculators.module.css";

/* Independent rupee coin — bobs up and down. */
function HeroMoney() {
  return (
    <div className={`${styles.motif} ${styles.mMoney}`} aria-hidden="true">
      <svg viewBox="0 0 88 88" fill="none">
        <circle
          cx="44"
          cy="44"
          r="42"
          fill="#e7b554"
          fillOpacity="0.05"
          stroke="#e7b554"
          strokeOpacity="0.5"
          strokeWidth="3"
        />
        <text
          x="44"
          y="60"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
          fontSize="46"
          fontWeight="700"
          fill="#f0c977"
          fillOpacity="0.9"
        >
          &#8377;
        </text>
      </svg>
    </div>
  );
}

export default HeroMoney;
