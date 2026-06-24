import React from "react";
import styles from "./calculators.module.css";

/* Two-segment donut (pure CSS conic-gradient). `primary`/`secondary` are the
   two amounts; the centre shows a label + the headline value. */
function SplitDonut({ primary = 0, secondary = 0, centerLabel, centerValue, legend = [] }) {
  const total = primary + secondary || 1;
  const primaryPct = (primary / total) * 100;

  const donutStyle = {
    background: `conic-gradient(var(--c-accent) 0% ${primaryPct}%, var(--c-interest) ${primaryPct}% 100%)`,
  };

  return (
    <div className={styles.donutBlock}>
      <div className={styles.donut} style={donutStyle}>
        <div className={styles.donutHole}>
          {centerLabel && <span className={styles.donutLabel}>{centerLabel}</span>}
          <strong className={styles.donutValue}>{centerValue}</strong>
        </div>
      </div>
      {legend.length > 0 && (
        <ul className={styles.donutLegend}>
          {legend.map((l, i) => (
            <li key={i}>
              <span
                className={styles.dot}
                style={{ background: l.color }}
              />
              {l.label}
              {l.value != null && <span className={styles.legendVal}>{l.value}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SplitDonut;
