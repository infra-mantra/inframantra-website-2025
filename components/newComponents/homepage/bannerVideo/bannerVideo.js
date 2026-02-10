import React, { useState, useEffect } from 'react';
import styles from './banner.module.css';

const BannerVideo = () => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // set initial width on client
    setWidth(window.innerWidth);

    function handleWindowSizeChange() {
      setWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 768;

  // Desktop images
  const desktopImages = [
    {
      src: 'https://inframantra.blr1.cdn.digitaloceanspaces.com/bannerVideo/revampHomePage/satya-banner-web.webp',
      alt: 'Satya Levante',
      className: styles.slideImage1,
    },
    {
      src: 'https://inframantra.blr1.cdn.digitaloceanspaces.com/bannerVideo/revampHomePage/tulip%20monsella.jpg',
      alt: 'Tulip Monsella',
      className: styles.slideImage2,
    },
    {
      src: 'https://inframantra.blr1.cdn.digitaloceanspaces.com/bannerVideo/revampHomePage/vatika%20seven%20elements.jpg',
      alt: 'Vatika Seven Elements',
      className: styles.slideImage3,
    },
  ];

  // Mobile images
  const mobileImages = [
    {
      src: 'https://inframantra.blr1.cdn.digitaloceanspaces.com/bannerVideo/revampHomePage/mobile-banner.webp',
      alt: 'Satya Levante Mobile',
      className: styles.slideImage1,
    },
    {
      src: 'https://inframantra.blr1.cdn.digitaloceanspaces.com/bannerVideo/mobilebanner/monsella.jpg',
      alt: 'Tulip Monsella Mobile',
      className: styles.slideImage2,
    },
    {
      src: 'https://inframantra.blr1.cdn.digitaloceanspaces.com/bannerVideo/mobilebanner/seven%20elements.jpg',
      alt: 'Vatika Seven Elements Mobile',
      className: styles.slideImage3,
    },
  ];

  const imagesToRender = isMobile ? mobileImages : desktopImages;

  return (
    <div className={styles.demoBanner}>
      <div className={styles.slideshow}>
        {imagesToRender.map((img, index) => (
          <img
            key={index}
            src={img.src}
            alt={img.alt}
            className={`${styles.slideImage} ${img.className}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerVideo;
