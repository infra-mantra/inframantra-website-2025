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
 console.log("pppppp",data)
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
           Discover Properties in Other Cities
          </p>
        </div>


<div className={styles.localityCarouselContainer}>
  <Swiper
    modules={[Navigation, Pagination, Autoplay]}
    spaceBetween={20}
    navigation={{
      nextEl: `.locality-next`,
      prevEl: `.locality-prev`,
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
      1024: { slidesPerView: Math.min(3, data.length), spaceBetween: 24 },
      1200: { slidesPerView: Math.min(3, data.length), spaceBetween: 24 },
    }}
    loop={data.length > 3}
    grabCursor={true}
  >
    {data.map((property) => (
      <SwiperSlide key={property._id}>
        <PropertyCard property={property} location={true} />
      </SwiperSlide>
    ))}
  </Swiper>

  <button className={`locality-prev ${styles.localityNavButton} ${styles.localityNavButtonPrev}`} />
  <button className={`locality-next ${styles.localityNavButton} ${styles.localityNavButtonNext}`} />
</div>

        {/* View More Localities Button */}
   
      </div>
    </div>
  );
}
