'use client';

import React from 'react';
import styles from './banner.module.css';

const BannerVideo = () => {
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
      desktop: 'https://inframantra.blr1.cdn.digitaloceanspaces.com/bannerVideo/banner-enhance-img/whiteland-b.webp',
      mobile: 'https://inframantra.blr1.cdn.digitaloceanspaces.com/bannerVideo/banner-enhance-img/WESTIN-mobile.webp',
      alt: 'Westin',
    },
    {
      desktop: 'https://inframantra.blr1.cdn.digitaloceanspaces.com/bannerVideo/banner-enhance-img/monsella-b.webp',
      mobile: 'https://inframantra.blr1.cdn.digitaloceanspaces.com/bannerVideo/banner-enhance-img/monsella-mobile.webp',
      alt: 'Tulip Monsella',
    },
    {
      desktop: 'https://inframantra.blr1.cdn.digitaloceanspaces.com/bannerVideo/banner-enhance-img/melrose-b.webp',
      mobile: 'https://inframantra.blr1.cdn.digitaloceanspaces.com/bannerVideo/banner-enhance-img/melrose-mobile.webp',
      alt: 'Tulip Melrose',
    },
    {
      desktop: 'https://inframantra.blr1.cdn.digitaloceanspaces.com/bannerVideo/banner-enhance-img/crimson-b.webp',
      mobile: 'https://inframantra.blr1.cdn.digitaloceanspaces.com/bannerVideo/banner-enhance-img/crimson-mobile.webp',
      alt: 'BPTP 66',
    },
    {
      desktop: 'https://inframantra.blr1.cdn.digitaloceanspaces.com/bannerVideo/banner-enhance-img/godrej-samaris-desktop.webp',
      mobile: 'https://inframantra.blr1.cdn.digitaloceanspaces.com/bannerVideo/banner-enhance-img/godrej-samaris-mobile.webp',
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
              Decorative; the rotating slides below carry the alt text + clicks. */}
          <picture aria-hidden="true">
            <source media="(max-width: 768px)" srcSet={images[0].mobile} />
            <img
              src={images[0].desktop}
              alt=""
              className={styles.slideBase}
              draggable="false"
              loading="eager"
              fetchpriority="high"
            />
          </picture>
          {images.map((img, index) => (
            <picture key={index}>
              <source media="(max-width: 768px)" srcSet={img.mobile} />
              <img
                src={img.desktop}
                alt={img.alt}
                className={`${styles.slideImage} ${slides[index].className}`}
                draggable="false"
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchpriority={index === 0 ? 'high' : 'low'}
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