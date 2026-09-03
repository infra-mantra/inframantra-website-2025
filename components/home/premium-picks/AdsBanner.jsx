import React from "react";
import styles from "./AdsBanner.module.css";
import Link from "next/link";

// Desktop banner is 1350x350, mobile 834x625. Using a <picture> element lets the
// browser pick + download ONLY the correct banner at parse time. The old version
// detected width in JS starting from 0 -> it rendered the (tall) mobile banner
// first, then swapped to the (short) desktop banner: a wasted second download and
// a large layout shift. width/height on the <img> reserve space and kill the CLS.
const DESKTOP_BANNER =
  "https://inframantra.blr1.cdn.digitaloceanspaces.com/bannerVideo/revampHomePage/whitelandAdBanner.webp";
const MOBILE_BANNER =
  "https://inframantra.blr1.cdn.digitaloceanspaces.com/bannerVideo/revampHomePage/AdBannermobilewestin.webp";

function AdsBanner() {
  return (
    <div className={styles.imgContainer}>
      <Link href="/property/whiteland-the-westin-residences-sector-103-gurugram">
        <picture>
          <source media="(max-width: 768px)" srcSet={MOBILE_BANNER} width="834" height="625" />
          <img
            className={styles.adBannerStyle}
            src={DESKTOP_BANNER}
            width="1350"
            height="350"
            alt="Whiteland The Westin Residences"
            loading="lazy"
            decoding="async"
          />
        </picture>
      </Link>
    </div>
  );
}

export default AdsBanner;
