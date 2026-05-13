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
      link: 'https://inframantra.com/property/bptp-downtown-66-sector-66-gurgaon',
      className: styles.slideImage4,
    },
    {
      link: 'https://inframantra.com/property/vatika-seven-elements-sector-89a-gurgaon',
      className: styles.slideImage5,
    },
  ];

  const images = [
    {
      desktop: 'https://inframantra.blr1.cdn.digitaloceanspaces.com/bannerVideo/banner-enhance-img/WESTIN%20final%20d%20L.webp',
      mobile: 'https://inframantra.blr1.cdn.digitaloceanspaces.com/bannerVideo/banner-enhance-img/WESTIN%20final%20m%20L.webp',
      alt: 'Westin',
    },
    {
      desktop: 'https://inframantra.blr1.cdn.digitaloceanspaces.com/bannerVideo/banner-enhance-img/tulip%20monsella%20final%20d%20L.webp',
      mobile: 'https://inframantra.blr1.cdn.digitaloceanspaces.com/bannerVideo/banner-enhance-img/monsela%20final.webp',
      alt: 'Tulip Monsella',
    },
    {
      desktop: 'https://inframantra.blr1.cdn.digitaloceanspaces.com/bannerVideo/banner-enhance-img/tulip%20melrose%20final%20L.webp',
      mobile: 'https://inframantra.blr1.cdn.digitaloceanspaces.com/bannerVideo/banner-enhance-img/melrose%20mobile%20final%20L.webp',
      alt: 'Tulip Melrose',
    },
    {
      desktop: 'https://inframantra.blr1.cdn.digitaloceanspaces.com/bannerVideo/banner-enhance-img/bptp%2066%20final%20d%20L.webp',
      mobile: 'https://inframantra.blr1.cdn.digitaloceanspaces.com/bannerVideo/banner-enhance-img/bptp%20mobile%20final%20LL.png',
      alt: 'BPTP 66',
    },
    {
      desktop: 'https://inframantra.blr1.cdn.digitaloceanspaces.com/bannerVideo/banner-enhance-img/vatika%20d%20final%20L.webp',
      mobile: 'https://inframantra.blr1.cdn.digitaloceanspaces.com/bannerVideo/banner-enhance-img/seven%20elements%20final%20mobile%20L.webp',
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
          {images.map((img, index) => (
            <picture key={index}>
              <source media="(max-width: 768px)" srcSet={img.mobile} />
              <img
                src={img.desktop}
                alt={img.alt}
                className={`${styles.slideImage} ${slides[index].className}`}
                draggable="false"
                loading="lazy"
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