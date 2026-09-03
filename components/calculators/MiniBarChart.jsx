import React from "react";
import styles from "./Calculators.module.css";
import { formatShort } from "./calcUtils.js";

/* Lightweight pure-SVG bar chart (no chart library). Pass:
     data: [{ label, value }]
   Renders gold bars with value labels on top and category labels below. */
function MiniBarChart({ data = [], title, footLabel }) {
  if (!data.length) return null;

  const VBW = 640;
  const VBH = 240;
  const PAD_L = 16;
  const PAD_R = 16;
  const PAD_T = 28;
  const PAD_B = 34;
  const plotW = VBW - PAD_L - PAD_R;
  const plotH = VBH - PAD_T - PAD_B;

  const maxVal = data.reduce((m, d) => Math.max(m, d.value), 0) || 1;
  const slot = plotW / data.length;
  const barW = Math.min(64, slot * 0.55);
  const baseY = PAD_T + plotH;

  return (
    <div className={styles.chartCard}>
      {title && <h3 className={styles.chartTitle}>{title}</h3>}
      <svg
        className={styles.chartSvg}
        viewBox={`0 0 ${VBW} ${VBH}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={title || "Bar chart"}
      >
        <line x1={PAD_L} y1={baseY} x2={VBW - PAD_R} y2={baseY} className={styles.axisLine} />
        {data.map((d, i) => {
          const h = (d.value / maxVal) * plotH;
          const x = PAD_L + slot * i + (slot - barW) / 2;
          const y = baseY - h;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={h} rx="4" className={styles.barFill} />
              <text x={x + barW / 2} y={y - 7} className={styles.barValue}>
                {formatShort(d.value)}
              </text>
              <text x={x + barW / 2} y={baseY + 20} className={styles.barLabel}>
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
      {footLabel && <p className={styles.chartFoot}>{footLabel}</p>}
    </div>
  );
}

export default MiniBarChart;
