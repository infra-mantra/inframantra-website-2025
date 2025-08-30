'use client';

import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper';
import { cityEventManager } from '../utils/cityEventManager';
import PropertyCard from '../shared/PropertyCard';
import styles from '../premiumPicks/PremiumPicksSection.module.css';
// ^ Reuse the PremiumPicksSection.module.css you supplied

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Pass "otherCityProperties" as a prop (from API)
export default function OtherCityPropertiesSection({ otherCityProperties = [], initialCity = 'Gurgaon' }) {
  const [selectedCity, setSelectedCity] = useState(initialCity);

  // Listen for city changes
  useEffect(() => {
    const unsubscribe = cityEventManager.onCityChange((e) => {
      setSelectedCity(e.detail.city);
    });
    return () => unsubscribe();
  }, []);

  // Filter out properties of the selected city
  const filteredProperties = otherCityProperties.filter(
    (property) => property.city?.name && property.city.name !== selectedCity
  );

  if (!filteredProperties.length) return null;

  return (
    <div className={styles.premiumPicksContainer}>
      <div className={styles.premiumContentWrapper}>
        {/* Header */}
        <div className={styles.premiumSectionHeader}>
          <h1 className={styles.premiumMainTitle}>Explore Properties in Other Cities</h1>
          <p className={styles.premiumSubtitle}>
            Find premium offerings in cities other than {selectedCity}.
          </p>
        </div>
        {/* Carousel */}
        <div className={styles.premiumCarouselContainer}>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              320: { slidesPerView: 1.5, spaceBetween: 16 },
              480: { slidesPerView: 1.8, spaceBetween: 16 },
              768: { slidesPerView: 2.5, spaceBetween: 20 },
              1024: { slidesPerView: Math.min(4, filteredProperties.length), spaceBetween: 24 },
              1200: { slidesPerView: Math.min(4, filteredProperties.length), spaceBetween: 24 },
            }}
            loop={filteredProperties.length > 4}
            grabCursor={true}
          >
            {filteredProperties.map((property) => (
              <SwiperSlide key={property._id}>
                <PropertyCard property={property} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
