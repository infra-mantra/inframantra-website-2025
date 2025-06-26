import React, {useEffect, useRef, useState} from 'react';
import PropertyWrapper from './propertyWrapper';
import 'react-image-gallery/styles/css/image-gallery.css';
import ImageGallery from 'react-image-gallery';
// import useMediaQuery from '../../../utils/useMediaQuery';
// import './propertySectionStyles.css';

function PropertyImageGallery({ imageGallery = [] , leftSection, name}) {
    const [isDesktop, setIsDesktop] = useState(true);
    const [isMobile, setIsMobile] = useState(true);
    const checkScreenWidth = () => {
      setIsDesktop(window.innerWidth >= 768); // You can adjust the threshold for desktop here
      setIsMobile(window.innerWidth <=768);
    };
    useEffect(() => {
      checkScreenWidth();
      window.addEventListener('resize', checkScreenWidth);
    
      return () => {
        window.removeEventListener('resize', checkScreenWidth);
      };
    }, []);
    

    const images = imageGallery.map((img, index) => ({
      original: img.url,
      thumbnail: img.thumbnail || img.url, 
      originalAlt: name, 
      thumbnailAlt: name,
    }));

  const handleImageFullScreen = (full) => {
    const galleryContent = document.querySelector('.image-gallery-content');
    if (full) {
      galleryContent.classList.add('fullscreen-gallery-content');
    } else {
      galleryContent.classList.remove('fullscreen-gallery-content');
    }
  };
  const developerRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.5) {
          leftSection(false);
          // console.log('Developer section is within 50% of the viewport');
        }
      },
      {
        root: null,
        threshold: 0.5,
      }
    );

    if (developerRef.current) {
      observer.observe(developerRef.current);
    }

    return () => {
      if (developerRef.current) {
        observer.unobserve(developerRef.current);
      }
    };
  }, [leftSection]);
  return (
    <PropertyWrapper
      id="imageGallery"
      ref={developerRef}
    >
        <div className="aboutProjectWrapper">
          <h2 className="aboutProjectHeader">Image Gallery</h2>
          <div className="propertyGalleryContainer">
            <ImageGallery
              items={images}
              showThumbnails={true}
              thumbnailPosition={isDesktop ? 'left' : 'bottom'}
              showFullscreenButton={true}
              showPlayButton={false}
              autoPlay={true}
              showBullets={true}
              showNav={false}
              onScreenChange={(full) => handleImageFullScreen(full)}
            />
          </div>
        </div>
    </PropertyWrapper>
  );
}

export default PropertyImageGallery;
