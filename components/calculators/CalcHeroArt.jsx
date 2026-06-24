import React from "react";
import styles from "./calculators.module.css";
import HeroBackdrop from "./heroArt/HeroBackdrop";
import HeroHouse from "./heroArt/HeroHouse";
import HeroCalculator from "./heroArt/HeroCalculator";
import HeroDonut from "./heroArt/HeroDonut";
import HeroBars from "./heroArt/HeroBars";
import HeroCoins from "./heroArt/HeroCoins";
import HeroOverlay from "./heroArt/HeroOverlay";

/* Animated hero banner. The single SVG canvas holds the shared gradient/pattern
   defs; each motif is its own component (backdrop, house, calculator, donut,
   bars, coins, overlay) with its own animation. */
function CalcHeroArt() {
  return (
    <svg
      className={styles.heroSvg}
      viewBox="0 0 1920 640"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      role="img"
      aria-label="Inframantra property and home loan calculators banner"
    >
      <defs>
        <linearGradient id="ha-bg" x1="0" y1="0" x2="1920" y2="640" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#120e08" />
          <stop offset="0.5" stopColor="#191309" />
          <stop offset="1" stopColor="#241a0e" />
        </linearGradient>
        <linearGradient id="ha-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f0c977" />
          <stop offset="1" stopColor="#d9a23c" />
        </linearGradient>
        <radialGradient id="ha-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#e7b554" stopOpacity="0.22" />
          <stop offset="1" stopColor="#e7b554" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ha-leftfade" x1="0" y1="0" x2="1920" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#0f0b06" stopOpacity="0.92" />
          <stop offset="0.42" stopColor="#0f0b06" stopOpacity="0.55" />
          <stop offset="0.7" stopColor="#0f0b06" stopOpacity="0" />
        </linearGradient>
        <pattern id="ha-dots" width="28" height="28" patternUnits="userSpaceOnUse">
          <circle cx="14" cy="14" r="1.1" fill="#e7b554" fillOpacity="0.12" />
        </pattern>
        <linearGradient id="ha-bar" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#d9a23c" />
          <stop offset="1" stopColor="#f0c977" />
        </linearGradient>
      </defs>

      <HeroBackdrop />
      <HeroHouse />
      <HeroCalculator />
      <HeroDonut />
      <HeroBars />
      <HeroCoins />
      <HeroOverlay />
    </svg>
  );
}

export default CalcHeroArt;
