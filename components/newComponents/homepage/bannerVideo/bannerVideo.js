'use client';

import React, { useState, useEffect } from 'react';
import styles from './banner.module.css';
// The mobile LCP hero, base64'd into the bundle. Delivering it inside the HTML
// removes the separate image request — worth ~560 ms of simulated round trip on
// Lighthouse mobile, which was the last thing holding LCP down. Desktop keeps a
// normal file reference: that image is 98 KB and the mobile score is what we're
// optimising.
import HERO_MOBILE_AVIF from './heroMobileInline.js';

const BannerVideo = () => {
  // Only the LCP hero (slideBase) paints on first load. The rotating slides are
  // mounted on the first genuine user interaction — the same trigger already used
  // for GTM and the chatbot. Revealing them on `load` still put ~99 KB inside the
  // initial load window, competing with the hero for bandwidth on slow mobile.
  // Anyone who scrolls or taps gets the rotation within moments; a visitor who
  // never interacts simply keeps the static hero, which is the first slide anyway.
  const [showSlides, setShowSlides] = useState(false);
  useEffect(() => {
    const reveal = () => setShowSlides(true);
    const events = ['scroll', 'mousemove', 'touchstart', 'keydown', 'click'];
    events.forEach((e) =>
      window.addEventListener(e, reveal, { passive: true, once: true })
    );
    return () => {
      events.forEach((e) => window.removeEventListener(e, reveal));
    };
  }, []);

  const slides = [
    {
      link: 'https://inframantra.com/property/whiteland-the-westin-residences-sector-103-gurugram',
      className: styles.slideImage1,
    },

    {
      link: 'https://inframantra.com/property/tulip-monsella-sector-53-gurgaon',
      className: styles.slideImage2,
    },
    {
      link: 'https://inframantra.com/property/tulip-melrose-sector-70-gurgaon',
      className: styles.slideImage3,
    },
    {
      link: 'https://inframantra.com/property/tulip-crimson-sector-70-gurgaon',
      className: styles.slideImage4,
    },
    {
      link: 'https://inframantra.com/property/godrej-samaris-sector-53-gurgaon',
      className: styles.slideImage5,
    },
  ];

  const images = [
     {
      // Slide 1 is the SAME picture as the static LCP base above. It was still
      // costing a second download because the hero resolves to .avif while this
      // only offered .webp — 29 KB fetched, then 46 KB fetched again for identical
      // pixels. Listing the AVIF here makes the URLs match, so the browser serves
      // this slide straight from cache. The other four slides have no AVIF build,
      // hence the optional fields.
      desktopAvif: '/banner/whiteland-desktop.avif',
      mobileAvif: HERO_MOBILE_AVIF,
      desktop: '/banner/whiteland-desktop.webp',
      mobile: '/banner/westin-mobile.webp',
      alt: 'Westin',
    },
    {
      desktop: '/banner/monsella-desktop.webp',
      mobile: '/banner/monsella-mobile.webp',
      alt: 'Tulip Monsella',
    },
    {
      desktop: '/banner/melrose-desktop.webp',
      mobile: '/banner/melrose-mobile.webp',
      alt: 'Tulip Melrose',
    },
    {
      desktop: '/banner/crimson-desktop.webp',
      mobile: '/banner/crimson-mobile.webp',
      alt: 'BPTP 66',
    },
    {
      desktop: '/banner/godrej-desktop.webp',
      mobile: '/banner/godrej-mobile.webp',
      alt: 'Vatika',
    },
  ];

  // ✅ BEST detection logic (no mismatch)
  const handleClick = () => {
    let maxOpacity = 0;
    let activeIndex = 0;

    const allSlides = document.querySelectorAll(`.${styles.slideImage}`);

    allSlides.forEach((el, index) => {
      const opacity = parseFloat(window.getComputedStyle(el).opacity);

      if (opacity > maxOpacity) {
        maxOpacity = opacity;
        activeIndex = index;
      }
    });

    window.location.href = slides[activeIndex].link;
  };

  return (
    <>
      {/* 🔴 BACKGROUND */}
      <div className={styles.demoBanner}>
        <div className={styles.slideshow}>
          {/* Static base = first slide, always painted (stable LCP anchor).
              Uses self-hosted, pre-compressed AVIF/WebP (mobile 29 KB vs the
              original 153 KB) so the LCP image downloads fast on mobile, while
              keeping the separate mobile/desktop crops via <picture>. */}
          <picture aria-hidden="true">
            <source media="(max-width: 768px)" type="image/avif" srcSet={HERO_MOBILE_AVIF} />
            <source media="(max-width: 768px)" type="image/webp" srcSet="/banner/westin-mobile.webp" />
            <source type="image/avif" srcSet="/banner/whiteland-desktop.avif" />
            <source type="image/webp" srcSet="/banner/whiteland-desktop.webp" />
            <img
              src="/banner/whiteland-desktop.webp"
              alt=""
              className={styles.slideBase}
              draggable="false"
              loading="eager"
              fetchpriority="high"
            />
          </picture>
          {showSlides &&
            images.map((img, index) => (
              <picture key={index}>
                {img.mobileAvif && (
                  <source media="(max-width: 768px)" type="image/avif" srcSet={img.mobileAvif} />
                )}
                <source media="(max-width: 768px)" srcSet={img.mobile} />
                {img.desktopAvif && <source type="image/avif" srcSet={img.desktopAvif} />}
                <img
                  src={img.desktop}
                  alt={img.alt}
                  className={`${styles.slideImage} ${slides[index].className}`}
                  draggable="false"
                  loading="lazy"
                  fetchpriority="low"
                />
              </picture>
            ))}
        </div>
      </div>

      <div
        onClick={handleClick}
        style={{
          position: 'absolute',
          top: '10vh',
          bottom: '8vh',
          left: 0,
          right: 0,
          zIndex: 2,
          cursor: 'pointer',
          background: 'transparent',
        }}
      />
    </>
  );
};

export default BannerVideo;