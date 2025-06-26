import React, {useEffect, useRef, useState} from 'react';
import PropertyWrapper from './propertyWrapper';
import 'react-image-gallery/styles/css/image-gallery.css';
import ImageGallery from 'react-image-gallery';
import { getNamedMiddlewareRegex } from 'next/dist/shared/lib/router/utils/route-regex';


function PropertyImageGallery({ imageGallery = [], leftSection }) {
  const [isDesktop, setIsDesktop] = useState(true);
  const [isMobile, setIsMobile] = useState(true);
  

  const checkScreenWidth = () => {
    setIsDesktop(window.innerWidth >= 768);
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);

    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);
  const images = imageGallery.map((img, index) => ({
    original: img.url,
    thumbnail: img.thumbnail || img.url, 
    originalAlt: name, 
    thumbnailAlt: name,
  }));

  const handleImageFullScreen = (full) => {
    const gallery = document.querySelector(".image-gallery");
    if (full) {
      gallery.classList.add("fullscreen-modal");
    } else {
      gallery.classList.remove("fullscreen-modal");
    }
  };
  const developerRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.5) {
          leftSection(false);
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
    <PropertyWrapper id="imageGallery" ref={developerRef}>
      <div className="aboutProjectWrapper">
        <h2 className="aboutProjectHeader">Image Gallery</h2>
        
        <div className="propertyGalleryContainer">
        <ImageGallery
          items={images}
          showThumbnails={true}
          thumbnailPosition={isDesktop ? "left" : "bottom"}
          showFullscreenButton={true}
          showPlayButton={false}
          autoPlay={true}
          showBullets={true}
          showNav={false}
          onScreenChange={(full) => handleImageFullScreen(full)}
          additionalClass="custom-gallery"
          originalAlt={true}
       />
        </div>
      </div>
    </PropertyWrapper>
  );
}

export default PropertyImageGallery;
