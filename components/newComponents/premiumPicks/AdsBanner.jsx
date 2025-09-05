import React, { useState, useEffect } from 'react';
import styles from './AdsBanner.module.css';
import Link from 'next/link';

function AdsBanner() {
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

  // Desktop & Mobile image URLs
  const desktopBanner =
    'https://inframantra.blr1.cdn.digitaloceanspaces.com/bannerVideo/revampHomePage/banner%202%20sora%20(1).webp';

  const mobileBanner =
    'https://inframantra.blr1.cdn.digitaloceanspaces.com/bannerVideo/mobilebanner/ad%20banner%20sora%20400x200.jpg';

  return (
    <div className={styles.imgContainer}>
      <Link href="/property/godrej-sora-sector-53-gurgaon">
        <img
          className={styles.adBannerStyle}
          src={isMobile ? mobileBanner : desktopBanner}
          alt="Godrej Sora Banner"
        />
      </Link>
    </div>
  );
}

export default AdsBanner;
