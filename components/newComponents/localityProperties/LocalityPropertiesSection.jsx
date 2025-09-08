'use client';

import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper';
import PropertyCard from '../shared/PropertyCard';
import styles from './LocalityPropertiesSection.module.css';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function LocalityPropertiesSection({ data, loading, selectedCity }) {
  const [visibleLocalities, setVisibleLocalities] = useState(2); // Show 2 localities initially

  // Reset visible localities when city changes
  useEffect(() => {
    setVisibleLocalities(2);
  }, [selectedCity]);

  if (loading) {
    return (
      <div className={styles.localityContainer}>
        <div className={styles.localityContentWrapper}>
          <div className={styles.localityLoadingContainer}>
            <div className={styles.localityLoadingSpinner}></div>
            <p className={styles.localityLoadingText}>Loading {selectedCity} localities...</p>
          </div>
        </div>
      </div>
    );
  }

  // Filter out localities with no properties
  const localitiesWithProperties = data.filter(
    (locality) => locality.properties && locality.properties.length > 0
  );

  // Only show the first N localities based on visibleLocalities state
  const displayedLocalities = localitiesWithProperties.slice(0, visibleLocalities);

  // Check if there are more localities to show
  const hasMoreLocalities = visibleLocalities < localitiesWithProperties.length;

  const handleViewMore = () => {
    setVisibleLocalities((prev) => prev + 2); // Show 2 more localities each time
  };

  const handleViewLess = () => {
    setVisibleLocalities(2); // Reset to initial 2 localities
  };

  return (
    <div className={styles.localityContainer}>
      <div className={styles.localityContentWrapper}>
        {/* Section Header */}
        <div className={styles.localitySectionHeader}>
          <h2 className={styles.localityMainTitle}>
            Discover Your Dream Home
          </h2>
          <p className={styles.localitySubtitle}>
            Explore premium homes across top localities in {selectedCity}
          </p>
        </div>

        {/* Display Localities */}
        {displayedLocalities.map((locality, index) => (
          <div key={locality.name || locality._id || index} className={styles.localitySection}>
            {/* Locality Title */}
            <h3 className={styles.localityTitle}>
              Properties in {locality?.locality?.name || 'Unknown Area'}
            </h3>

            {/* Properties Swiper for this locality */}
            <div className={styles.localityCarouselContainer}>
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={20}
                navigation={{
                  nextEl: `.locality-next-${index}`,
                  prevEl: `.locality-prev-${index}`,
                }}
                breakpoints={{
                  320: { slidesPerView: 1.2, spaceBetween: 16 },
                  480: { slidesPerView: 1.5, spaceBetween: 16 },
                  768: { slidesPerView: 2.5, spaceBetween: 20 },
                  1024: {
                    slidesPerView: Math.min(3, locality.properties.length),
                    spaceBetween: 24,
                  },
                  1400: {
                    slidesPerView: Math.min(4, locality.properties.length),
                    spaceBetween: 28,
                  },
                }}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                loop={locality.properties.length > 3}
                grabCursor={true}
              >
                {locality.properties.map((property) => (
                  <SwiperSlide key={property._id}>
                    <PropertyCard property={property} />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Navigation Arrows */}
              <button
                className={`locality-prev-${index} ${styles.localityNavButton} ${styles.localityNavButtonPrev}`}
                aria-label="Previous properties"
              ></button>
              <button
                className={`locality-next-${index} ${styles.localityNavButton} ${styles.localityNavButtonNext}`}
                aria-label="Next properties"
              ></button>
            </div>
          </div>
        ))}

        {/* View More/Less Localities Button */}
        {localitiesWithProperties.length > 2 && (
          <div className={styles.localityViewMoreContainer}>
            {hasMoreLocalities ? (
              <button
                className={styles.localityViewMoreButton}
                onClick={handleViewMore}
              >
                View more Localities
              </button>
            ) : (
              <button
                className={styles.localityViewMoreButton}
                onClick={handleViewLess}
              >
                Show Less
              </button>
            )}
          </div>
        )}

        {/* No localities message */}
        {localitiesWithProperties.length === 0 && (
          <div className={styles.localityEmptyState}>
            <p>No properties available in {selectedCity} at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
