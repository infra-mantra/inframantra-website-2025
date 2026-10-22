"use client";

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper";
import { fetchCityProperties } from "../../lib/propertyApi.js";
import { cityEventManager } from "../../lib/cityEventManager.js";
import PropertyCard from "../../shared/PropertyCard.jsx";
import styles from "./LocalityPropertiesSection.module.css";
import { LocalityCardsSkeleton } from "../HomeSkeletons.jsx";
import { useAutoplayWhenVisible } from "../../shared/useAutoplayWhenVisible";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function LocalityPropertiesSection({ data, loading, selectedCity }) {
  const onSwiper = useAutoplayWhenVisible();
  // Skeleton cards (not a spinner) while the city data loads.
  if (loading) return <LocalityCardsSkeleton />;

  return (
    <div className={`${styles.localityContainer} home-alt-bg`}>
      <div className={styles.localityContentWrapper}>
        {/* Section header: same pattern as the other home sections */}
        <div className={styles.localitySectionHeader} data-reveal>
          <h2 className={styles.localityMainTitle}>
            Discover Properties in <span>Other Cities</span>
          </h2>
          {selectedCity && (
            <p className={styles.localitySubtitle}>Premium homes beyond {selectedCity}</p>
          )}
        </div>

        <div className={styles.localityCarouselContainer}>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            onSwiper={onSwiper}
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
