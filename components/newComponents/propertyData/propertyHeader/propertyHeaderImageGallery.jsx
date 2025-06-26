import React, { useState, useCallback } from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';

function PropertyHeaderImageGallery({ imageGallery = [],name }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSlideChange = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  return (
    <div className="propertyPageHeaderImgSection">
      <div className="carouselContainer">
        <Carousel
          showArrows={false}
          showStatus={false}
          showIndicators={false}
          infiniteLoop={true}
          autoPlay={true}
          autoFocus={false}
          width="100%"
          selectedItem={currentIndex}
          onChange={handleSlideChange}
          showThumbs={false}
          interval={7000}
          alt={name}
        >
          {imageGallery.slice(0, 5).map((image) => (
            <div key={image.key}>
              <img src={image.url} alt={name} className="carouselImage" />
            </div>
          ))}
        </Carousel>
      </div>
      <div className="thumbnailWrapper">
        {imageGallery
          .slice(0, 5)
          .map(
            (image, index) =>
              index !== currentIndex && (
                <img
                  key={image.key}
                  src={image.url}
                  alt={name}
                  className="thumbnail"
                  onClick={() => setCurrentIndex(index)}
                />
              )
          )}
      </div>
    </div>
  );
}

export default React.memo(PropertyHeaderImageGallery);
