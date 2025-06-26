import React, { useEffect, useRef, useState } from 'react';
import styles from './banner.module.css'; // Assuming you have a CSS module for styles

const BannerVideo = () => {
  const desktopVideo = 'https://inframantra.blr1.cdn.digitaloceanspaces.com/bannerVideo/webbanner3.png';
  const placeholderImageUrl = 'https://inframantra.blr1.cdn.digitaloceanspaces.com/bannerVideo/mobile%20bannerimagev3.png';


  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isDesktop, setIsDesktop] = useState(null); 
  const [videoSrc, setVideoSrc] = useState(true);

  const checkScreenWidth = () => {
    const newIsDesktop = window.innerWidth >= 768;
    setIsDesktop(newIsDesktop);
     setVideoSrc(newIsDesktop ? desktopVideo : placeholderImageUrl);
  };

  useEffect(() => {
    checkScreenWidth(); // Only runs on the client
    window.addEventListener('resize', checkScreenWidth);

    return () => {
      window.removeEventListener('resize', checkScreenWidth);
    };
  }, []);


 

  return (
    <div
      className={styles.demoBanner}
      
    >
      <div className={styles.slideshow}>
        <div className={`${styles.slideImage} ${styles.slideImage1}`}></div>
        <div className={`${styles.slideImage} ${styles.slideImage2}`}></div>
        <div className={`${styles.slideImage} ${styles.slideImage3}`}></div>
      </div>
    </div>
  );
};

export default BannerVideo;