'use client';

import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper';
import { fetchCityProperties } from '../utils/propertyApi';
import { cityEventManager } from '../utils/cityEventManager';
import PropertyCard from '../shared/PropertyCard';
import styles from './LocalityPropertiesSection.module.css';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function LocalityPropertiesSection({data,loading,selectedCity}) {

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
{data.map((locality, index) => {

  return (
 locality.properties .length> 0  && (
      <div key={locality.name} className={styles.localitySection}>
        {/* Locality Title */}
        <h3 className={styles.localityTitle}>
          Property in {locality?.locality.name}
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
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              320: { slidesPerView: 1.2, spaceBetween: 16 },
              480: { slidesPerView: 1.5, spaceBetween: 16 },
              768: { slidesPerView: 2.5, spaceBetween: 20 },
              1024: { slidesPerView: Math.min(3, locality.properties.length), spaceBetween: 24 },
              1200: { slidesPerView: Math.min(3, locality.properties.length), spaceBetween: 24 },
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
          />
          <button
            className={`locality-next-${index} ${styles.localityNavButton} ${styles.localityNavButtonNext}`}
          />
        </div>
      </div>
    )
  );
})}


        {/* View More Localities Button */}
        <div className={styles.localityViewMoreContainer}>
          <button className={styles.localityViewMoreButton}>
            View more Localities
          </button>
        </div>
      </div>
    </div>
  );
}
