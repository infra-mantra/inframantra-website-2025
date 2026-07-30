'use client';

import React, { useState, useEffect } from 'react';
import styles from './banner.module.css';

const BannerVideo = () => {
  // Only the LCP hero (slideBase) paints on first load. The 5 rotating slide
  // images (~350 KB) are mounted after the page's `load` event so they don't
  // steal bandwidth from the hero on slow mobile connections — the single
  // biggest lever on the banner's LCP.
  const [showSlides, setShowSlides] = useState(false);
  useEffect(() => {
    const reveal = () => setShowSlides(true);
    if (document.readyState === 'complete') {
      const t = setTimeout(reveal, 200);
      return () => clearTimeout(t);
    }
    window.addEventListener('load', reveal, { once: true });
    const t = setTimeout(reveal, 3000); // fallback if load is slow
    return () => {
      window.removeEventListener('load', reveal);
      clearTimeout(t);
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
      // Self-hosted, pre-compressed (same as the LCP base) so this first rotating
      // slide reuses the small file instead of re-downloading the 153 KB original.
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
            <source media="(max-width: 768px)" type="image/avif" srcSet="/banner/westin-mobile.avif" />
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
                <source media="(max-width: 768px)" srcSet={img.mobile} />
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