// FeaturedProperties.js
import React, { useState, useEffect } from 'react';
import CustomArrowIcon from '../../arrowIcon/arrowIcon';
import { useRouter } from 'next/router';
import styles from './featuredProperties.module.css';

function FeaturedProperties({
  title,
  location,
  subLocation,
  description,
  price,
  area,
  configurations,
  imageGallery,
  exclusive,
  id,
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useRouter();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageGallery.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [imageGallery.length]);

  const sliceTextByWords = (text, start, end) => {
    let slicedText = text.slice(start, end);
    const lastSpace = slicedText.lastIndexOf(' ');
    if (lastSpace !== -1 && end < text.length) {
      slicedText = slicedText.slice(0, lastSpace);
    }
    return slicedText;
  };

  const firstPart = sliceTextByWords(description, 0, 150);
  const secondPart = sliceTextByWords(description, firstPart.length, 300);

  return (
    <div className={styles.featuredPropertiesWrapper}>
      <div className={styles.featuredPropertiesLeftSection}>
        <div className={styles.featuredPropertiesLeftSectionBgrd}>
          {imageGallery.map((img, index) => (
            <img
              key={index}
              className={`${styles.featuredPropertiesLeftSectionImages} ${index === currentImageIndex ? styles.active : ''}`}
              src={img.url}
              alt={`${title} ${location}`}
              loading="lazy"
            />
          ))}
        </div>
      </div>

      <div className={styles.featuredPropertiesRightSection}>
        <div className={styles.featuredPropertiesRightSectionMarginContainer}>
          <h3 className={styles.featuredPropertiesRightSectionTitle}>{title}</h3>
          <h4 className={styles.featuredPropertiesRightSectionLocation}>{location}, {subLocation}</h4>

          {exclusive && (
            <img
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/INFRAMANTRA-exclusive.png"
              className={styles.exclusiveIcon}
              alt="Inframantra Exclusive Property"
              loading="lazy"
            />
          )}

          <p className={styles.featuredPropertiesRightSectionDescription}>
            {firstPart}{secondPart}...
          </p>

          <div className={styles.featuredPropertiesRightSectionInsightsContainer}>
            <div className={styles.featuredPropertiesRightSectionInsightsFlex}>
              <p className={styles.featuredPropertiesRightSectionInsightsKey}>{price}</p>
              <p className={styles.featuredPropertiesRightSectionInsightsValue}>Starting Price</p>
            </div>
            <div className={styles.featuredPropertiesRightSectionInsightsFlex}>
              <p className={styles.featuredPropertiesRightSectionInsightsKey}>{area.slice(0, 4)}</p>
              <p className={styles.featuredPropertiesRightSectionInsightsValue}>Sq feet</p>
            </div>
            <div className={styles.featuredPropertiesRightSectionInsightsFlex}>
              <p className={styles.featuredPropertiesRightSectionInsightsKey}>{configurations}</p>
              <p className={styles.featuredPropertiesRightSectionInsightsValue}>Configurations</p>
            </div>
          </div>

          <button
            className={styles.featuredPropertiesButton}
            onClick={() => navigate.push(`/property/${id}`)}
          >
            Know More <CustomArrowIcon lineLength={60} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default FeaturedProperties;