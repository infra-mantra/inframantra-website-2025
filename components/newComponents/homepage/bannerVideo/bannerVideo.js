
import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player/youtube';
import styles from './banner.module.css';

const BannerVideo = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // 👇 Change videos here
  const mobileVideo = 'https://www.youtube.com/shorts/PWqb2xN_a8g';
  const desktopVideo = 'https://www.youtube.com/watch?v=X76cmns2pjc';

  const videoUrl = isMobile ? mobileVideo : desktopVideo;

  return (
    <div className={styles.demoBanner}>
      <div className={styles.slideshow}>
        <ReactPlayer
          url={videoUrl}
          playing
          loop
          controls={false}
          width="100%"
          height="100%"
          playsinline
          className={styles.bannerVideo}
          config={{
            youtube: {
              playerVars: {
                autoplay: 1,
                controls: 0,
                modestbranding: 1,
                rel: 0,
                iv_load_policy: 3,
                disablekb: 1,
                fs: 0,
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default BannerVideo;
