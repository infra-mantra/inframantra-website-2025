"use client";

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper";
import { fetchCityProperties } from "../../lib/propertyApi.js";
import { cityEventManager } from "../../lib/cityEventManager.js";
import PropertyCard from "../../shared/PropertyCard.jsx";
import styles from "./LocalityPropertiesSection.module.css";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function LocalityPropertiesSection({ data, loading, selectedCity }) {
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
        <h3 className={styles.localityTitle}>Discover Properties in Other Cities</h3>

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
            /* Match Premium Picks / Locality carousels so every card is the same size */
            breakpoints={{
              320: { slidesPerView: 1.5, spaceBetween: 16 },
              480: { slidesPerView: 1.8, spaceBetween: 16 },
              768: { slidesPerView: 2.5, spaceBetween: 20 },
              1024: { slidesPerView: 4, spaceBetween: 24 },
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

          <button
            className={`locality-prev ${styles.localityNavButton} ${styles.localityNavButtonPrev}`}
          />
          <button
            className={`locality-next ${styles.localityNavButton} ${styles.localityNavButtonNext}`}
          />
        </div>

        {/* View More Localities Button */}
      </div>
    </div>
  );
}
