import React, { useState, useRef, useEffect } from 'react';
import { AiOutlineHeart } from 'react-icons/ai';
// import '../propertyPage.css';

const featuredPropertiesMobileStyles = {
  paper: {
    height: '56%',
    width: '100%',
    background: '#FFF',
    position: 'relative',
  },
  crossIcon: {
    color: '#fff',
    position: 'absolute',
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    top: '10px',
    right: '10px',
  },
};

function PropertyMobileHeaderImg({ imageGallery = [] ,name}) {
  console.log('imageGallery', name);
  return <CardBackComponent imageGallery={imageGallery} name={name} />;
}

export default PropertyMobileHeaderImg;

const CardBackComponent = ({ imageGallery = [], name }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const carouselTrackRef = useRef(null);
  const autoplayIntervalRef = useRef(null);

  useEffect(() => {
    const track = carouselTrackRef.current;
    if (track) {
      track.style.transform = `translateX(-${
        currentImageIndex * track.offsetWidth
      }px)`;
    }
  }, [currentImageIndex]);

  useEffect(() => {
    const autoplay = () => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % imageGallery.slice(0, 5).length
      );
    };
    

    autoplayIntervalRef.current = setInterval(autoplay, 2000);

    return () => clearInterval(autoplayIntervalRef.current);
  }, [imageGallery]);
  return (
    <div style={featuredPropertiesMobileStyles.paper}>
      <div className="propertiesPageMobileCrousel">
        <div className="carouselFeaturedPropertyPage">
          <div className="carousel-track" ref={carouselTrackRef}>
            {imageGallery.slice(0, 5).map((img, index) => (
              <img
                key={index}
                className="carousel-slidePropertyPage"
                src={img.url}
                alt={name+' property image'}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="propertyPageMobileWishlistWrapper">
        <AiOutlineHeart style={featuredPropertiesMobileStyles.crossIcon} />
      </div>
    </div>
  );
};
