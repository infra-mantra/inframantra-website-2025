import React, { useState } from "react";
import styles from "./MapFacade.module.css";

/*
  Office map that shows instantly.
  A live Google Maps embed downloads ~1 MB of Google's code every visit (it can't
  be cached by us), so we first show a saved picture of the same map
  (/public/maps/inframantra-office.*, ~40 KB) and load the real map only when
  the visitor clicks it.

  To refresh the picture after the office moves: re-capture the embed below and
  save it over the two files in /public/maps/.
*/
export const OFFICE_MAP_EMBED =
  "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14032.085916196966!2d77.0413113!3d28.4487689!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d193e2433c0cf%3A0xef40ba926f65e0ec!2sINFRAMANTRA!5e0!3m2!1sen!2sin!4v1731478063313!5m2!1sen!2sin";

export default function MapFacade({ width = 560, height = 300, className = "" }) {
  const [live, setLive] = useState(false);

  return (
    <div className={`${styles.mfMap} ${className}`} style={{ aspectRatio: `${width} / ${height}` }}>
      {live ? (
        <iframe
          title="Inframantra office location"
          src={OFFICE_MAP_EMBED}
          width={width}
          height={height}
          className={styles.mfFrame}
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <button
          type="button"
          className={styles.mfPreview}
          onClick={() => setLive(true)}
          aria-label="Load interactive map of the Inframantra office"
        >
          <picture>
            <source srcSet="/maps/inframantra-office.avif" type="image/avif" />
            <img
              src="/maps/inframantra-office.webp"
              alt="Map: Inframantra office, 95 Institutional Area, Sector 32, Gurugram"
              width={width}
              height={height}
              loading="lazy"
              decoding="async"
            />
          </picture>
          <span className={styles.mfHint}>Tap to explore the map</span>
        </button>
      )}
    </div>
  );
}
