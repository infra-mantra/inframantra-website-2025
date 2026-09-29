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
      {/* Next 12: <Link> passes href to a single <a> child, which carries the styling */}
      <Link href="/property/whiteland-the-westin-residences-sector-103-gurugram" passHref>
        <a
          className={styles.adLink}
          aria-label="Featured project: Whiteland The Westin Residences — explore project"
        >
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

          <span className={styles.adTag} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="12" height="12">
              <path
                d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 20.9l1.6-7L2 9.2l7.1-.6z"
                fill="currentColor"
              />
            </svg>
            Featured Project
          </span>

          <span className={styles.adCta} aria-hidden="true">
            Explore Project
            <svg viewBox="0 0 24 24" width="15" height="15">
              <path
                d="M5 12h14M13 6l6 6-6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </a>
      </Link>
    </div>
  );
}

export default AdsBanner;
