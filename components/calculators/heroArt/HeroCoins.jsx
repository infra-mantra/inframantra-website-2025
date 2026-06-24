import React from "react";
import styles from "../calculators.module.css";

/* Floating currency motifs — the rupee coin and percent badge bob gently
   on opposite offsets. */
function HeroCoins() {
  return (
    <g>
      <g className={styles.artCoin}>
        <circle cx="1180" cy="470" r="48" fill="#e7b554" fillOpacity="0.05" stroke="#e7b554" strokeOpacity="0.5" strokeWidth="2.5" />
        <text x="1180" y="488" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="48" fontWeight="700" fill="#f0c977" fillOpacity="0.85">&#8377;</text>
      </g>
      <g className={styles.artCoin} style={{ animationDelay: "1.2s" }}>
        <circle cx="1560" cy="120" r="36" fill="#e7b554" fillOpacity="0.05" stroke="#e7b554" strokeOpacity="0.45" strokeWidth="2.5" />
        <text x="1560" y="134" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="36" fontWeight="700" fill="#f0c977" fillOpacity="0.8">%</text>
      </g>
    </g>
  );
}

export default HeroCoins;
