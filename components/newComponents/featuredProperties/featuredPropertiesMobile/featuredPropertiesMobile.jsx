import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
// import './featuredPropertiesMobile.css';
import { MdSquareFoot } from "react-icons/md";
import { IoIosHome } from "react-icons/io";
import { IoLocationSharp } from "react-icons/io5";
import { MdOutlineCurrencyRupee, MdKeyboardArrowRight } from "react-icons/md";
import styles from './featuredPropertiesMobile.module.css'; // Assuming you have a CSS module for stylesx


const featuredPropertiesMobileStyles = {
  paper: {
    // height: '50%',
    width: '80%',
    borderRadius: '10px',
    background: '#FFF',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: 'rgba(0, 0, 0, 0.2) 0px 7px 8px -4px, rgba(0, 0, 0, 0.14) 0px 12px 17px 2px, rgba(0, 0, 0, 0.12) 0px 5px 22px 4px'
  },
  icon: {
    color: '#DCAA4C',
    fontSize: '1rem',
    marginRight: '8px',
    width: '1em',
    height: '1em',
  },
  arrowIcon: {
    color: '#E7B554',
    position: 'absolute',
    left: '93%',
    bottom: '25%',
    transform: 'translateY(-50%)',
    width: '20px',
    height: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: '50%',
    cursor: 'pointer',
  },
  crossIcon: {
    color: '#fff',
    position: 'absolute',
    left: '5%',
    bottom: '77%',
    width: '50px',
    height: '50px',
    cursor: 'pointer',
    
  },
};
 const arrowButton = {
    position: 'absolute',
    color: 'rgb(231, 181, 84)',
    width: '40px',
    right: '1%',
    top: '53.5%',
    height: '40px',
    zIndex: 100,
    cursor: 'pointer',
  };

function FeaturedPropertiesMobile({ property }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  return (
    <div className={`${styles.featuredPropertiesMobileCard} ${isFlipped ? 'flipped' : ''}`}>
      <div className={styles.featuredPropertiesMobileCardInner}>
        <div className={`cardSide cardFront`}>
          <CardFrontComponent property={property} handleFlip={handleFlip} />
        </div>
        <div className={`cardSide cardBack`}>
          <CardBackComponent property={property} handleFlip={handleFlip} />
        </div>
      </div>
    </div>
  );
}

export default FeaturedPropertiesMobile;

const CardFrontComponent = ({ property, handleFlip }) => {
  const router = useRouter();

  const handleArrowClick = (event) => {
    event.stopPropagation();
    handleFlip();
  };

  const handlePaperClick = (slug) => {
    router.push(`/property/${slug}`);
  };

  return (
    <div
      style={featuredPropertiesMobileStyles.paper}
      onClick={() => handlePaperClick(property.slug)}
    >
      <div className={styles.featuredPropertiesMobileImageContainer}>
        <img
          className={styles.featuredPropertiesMobileImage}
          src={property.images[0].url}
          alt="featured"
        />
        <div
          className={arrowButton}
          style={featuredPropertiesMobileStyles.arrowIcon}
          onClick={handleArrowClick}
        >
          <MdKeyboardArrowRight />
        </div>
      </div>
      <div className={styles.featuredPropertiesMobileContent}>
        <div className={styles.featuredPropertiesMobileContentFirstSection}>
          <div className={styles.featuredPropertiesMobileContentFirstSectionContent}>
            <span style={featuredPropertiesMobileStyles.icon}><MdOutlineCurrencyRupee/></span>
            <p>
              {
                property.numericInsights.find(
                  (insight) => insight.title === 'Starting Price'
                ).value
              }
            </p>
          </div>
          <div className={styles.featuredPropertiesMobileContentFirstSectionContent}>
            <span style={featuredPropertiesMobileStyles.icon}><IoLocationSharp /></span>
            <p>{property.location}</p>
          </div>
        </div>
        <div className={styles.featuredPropertiesMobileContentSecondSection}>
          <p>{property.title}</p>
        </div>
        <div className={styles.featuredPropertiesMobileContentThirdSection}>
          <hr />
          <div className={styles.featuredPropertiesMobileContentThirdSectionContentFlex}>
            <div className={styles.featuredPropertiesMobileContentThirdSectionContent}>
              <span style={featuredPropertiesMobileStyles.icon}><MdSquareFoot/></span>
              <p>
                {
                  property.numericInsights.find(
                    (insight) => insight.title === 'Sq feet'
                  ).value
                }
              </p>
            </div>
            <div className={styles.vl}>|</div>
            <div className={styles.featuredPropertiesMobileContentThirdSectionContent}>
              <span style={featuredPropertiesMobileStyles.icon}><IoIosHome/></span>
              <p>
                {
                  property.numericInsights.find(
                    (insight) => insight.title === 'Configurations'
                  ).value
                }
              </p>
            </div>
          </div>
          <hr />
        </div>
      </div>
    </div>
  );
};

const CardBackComponent = ({ property, handleFlip }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const carouselTrackRef = useRef(null);
  const autoplayIntervalRef = useRef(null);

  const handleDotClick = (index) => {
    setCurrentImageIndex(index);
  };

  useEffect(() => {
    const track = carouselTrackRef.current;
    if (track) {
      track.style.transform = `translateX(-${currentImageIndex * track.offsetWidth
        }px)`;
    }
  }, [currentImageIndex]);

  useEffect(() => {
    const autoplay = () => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % property.images.slice(0, 3).length
      );
    };

    autoplayIntervalRef.current = setInterval(autoplay, 2000);

    return () => clearInterval(autoplayIntervalRef.current);
  }, [property.images]);

  return (
    <div style={featuredPropertiesMobileStyles.paper}>
      <div className={styles.featuredPropertiesMobileImageContainerBack}>
        <div className={styles.carouselFeatured}>
          <div className={styles.carouseltrack} ref={carouselTrackRef}>
            {property.images.slice(0, 3).map((img, index) => (
              <img
                key={index}
                className={styles.carouselslide}
                src={img.url}
                alt={`Featured Property ${index + 1}`}
              />
            ))}
          </div>
          <div className={styles.carouselnav}>
            {property.images.slice(0, 3).map((_, index) => (
              <button
                key={index}
                className={`${styles.carouselnavdot} ${index === currentImageIndex ? 'active' : ''
                  }`}
                onClick={() => handleDotClick(index)}
              ></button>
            ))}
          </div>
        </div>
      </div>
      <div
        style={featuredPropertiesMobileStyles.crossIcon}
        onClick={handleFlip}
      >
        ✖
      </div>
    </div>
  );
};
