import React, { useEffect, useState, useRef } from 'react';
import styles from './banner.module.css';

const BannerVideo = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // video starts muted
  const videoRef = useRef(null);

  // Detect mobile
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth <= 768);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const mobileVideo =
    'https://inframantra.blr1.cdn.digitaloceanspaces.com/bannerVideo/Dining_Clean_small_size_mobile.mp4';
  const desktopVideo =
    'https://inframantra.blr1.cdn.digitaloceanspaces.com/bannerVideo/Dining_Clean_Website_video_Desktop.mp4';

  const videoUrl = isMobile ? mobileVideo : desktopVideo;

 

  return (
    <div className={styles.demoBanner}>
      <div className={styles.slideshow}>
        <div className={styles.demoBannerWrapper}>
          <video
            ref={videoRef}
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            webkit-playsinline="true"
            x5-playsinline="true"
            className={styles.bannerVideo}
          />
     
        </div>
      </div>
    </div>
  );
};

export default BannerVideo;
