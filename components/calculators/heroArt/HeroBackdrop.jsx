import React from "react";
import styles from "../Calculators.module.css";

/* Backdrop layer: gradient base, dotted texture, gold glow, framing arcs and
   the bottom accent line. Pure CSS — the motifs sit independently on top. */
function HeroBackdrop() {
  return (
    <div className={styles.heroArt} aria-hidden="true">
      <div className={styles.heroDots} />
      <div className={`${styles.heroGlow} ${styles.artGlow}`} />
      <div className={`${styles.heroArc} ${styles.artArcSlow}`} />
      <div className={`${styles.heroArc} ${styles.heroArcSm} ${styles.artArcSlowRev}`} />
      <span className={styles.heroWordmark}>INFRAMANTRA</span>
      <div className={styles.heroAccent} />
    </div>
  );
}

export default HeroBackdrop;
