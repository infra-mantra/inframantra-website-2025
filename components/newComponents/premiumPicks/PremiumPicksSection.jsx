'use client';

import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper';
import PropertyCard from '../shared/PropertyCard';
import CitySelector from './CitySelector';
import styles from './premiumPicksSection.module.css';
import { useRouter } from 'next/router';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function PremiumPicksSection({ 
  data, 
  loading, 
  onUpdate, 
  selectedCity, 
  detectedCity, 
  locationStatus 
}) {
  // Use selectedCity from props, no local state needed
  const [localSelectedCity, setLocalSelectedCity] = useState(selectedCity);
   const router = useRouter();
  // Update local state when prop changes
  useEffect(() => {
    setLocalSelectedCity(selectedCity);
  }, [selectedCity]);

  const handleCityChange = (city) => {
    console.log(`🎯 Manual city selection: ${localSelectedCity} → ${city}`);
    setLocalSelectedCity(city);
    onUpdate(city); // This updates parent state
  };

 const handleViewMore = () => {
 
  router.push(`/property-listing/city/${selectedCity}`);
};

  if (loading) {
    return (
      <div className={styles.premiumLoadingContainer}>
        <div className={styles.premiumLoadingSpinner}></div>
        <p className={styles.premiumLoadingText}>Loading {localSelectedCity} properties...</p>
      </div>
    );
  }

  return (
    <div className={styles.premiumPicksContainer} suppressHydrationWarning={true}>
      <div className={styles.premiumContentWrapper}>
        {/* Section Header */}
        <div className={styles.premiumSectionHeader}>
          <h1 className={styles.premiumMainTitle}>Premium Picks</h1>
          <p className={styles.premiumSubtitle}>
            Explore the finest homes across premium locations.
          </p>
        </div>

        {/* Location Detection Status */}
        {locationStatus === 'detecting' && (
          <div className={`${styles.premiumLocationStatus} ${styles.premiumLocationDetecting}`}>
            <span className={styles.premiumLocationIcon}>🌍</span>
            <span className={styles.premiumLocationDetectingText}>
              Detecting your location...
            </span>
          </div>
        )}

        {locationStatus === 'found' && detectedCity && (
          <div className={`${styles.premiumLocationStatus} ${styles.premiumLocationFound}`}>
            <span className={styles.premiumLocationIcon}>📍</span>
            <span className={styles.premiumLocationFoundText}>
              {detectedCity === localSelectedCity 
                ? `Showing properties near you (${detectedCity})`
                : `We detected you're in ${detectedCity}`
              }
            </span>
          </div>
        )}

        {/* City Selector */}
        <div className={styles.premiumCitySelectorContainer}>
          <CitySelector
            selectedCity={localSelectedCity}
            onCityChange={handleCityChange}
          />
        </div>

        {/* Property Carousel */}
        {data && data.length > 0 && (
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
                320: {
                  slidesPerView: 1.5,
                  spaceBetween: 16,
                },
                480: {
                  slidesPerView: 1.8,
                  spaceBetween: 16,
                },
                768: {
                  slidesPerView: 2.5,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: Math.min(4, data.length),
                  spaceBetween: 24,
                },
                1200: {
                  slidesPerView: Math.min(4, data.length),
                  spaceBetween: 24,
                },
              }}
              loop={data.length > 4}
              grabCursor={true}
            >
              {data.map((property) => (
                <SwiperSlide key={property._id}>
                  <PropertyCard property={property} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      
                  <div className={styles.localityViewMoreContainer}>    
                      <button
                        className={styles.localityViewMoreButton}
                        onClick={handleViewMore}
                      >
                        View  all
                      </button>
                  </div>
                
      </div>
    </div>
  );
}
