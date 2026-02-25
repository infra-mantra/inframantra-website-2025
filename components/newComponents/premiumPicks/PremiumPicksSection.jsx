'use client';

import React from 'react';
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
  data = [],
  loading,
  onUpdate,
  selectedCity,
  detectedCity,
  locationStatus,
}) {
  const router = useRouter();

  const handleCityChange = (city) => {
    console.log('Selected City:', city); // ✅ Will now log on mobile
    onUpdate(city);
  };

  const handleViewMore = () => {
    router.push(`/property-listing/city/${selectedCity}`);
  };

  if (loading) {
    return (
      <div className={styles.premiumLoadingContainer}>
        <div className={styles.premiumLoadingSpinner}></div>
        <p className={styles.premiumLoadingText}>
          Loading {selectedCity} properties...
        </p>
      </div>
    );
  }

  return (
    <div className={styles.premiumPicksContainer}>
      <div className={styles.premiumContentWrapper}>
        {/* Header */}
        <div className={styles.premiumSectionHeader}>
          <h1 className={styles.premiumMainTitle}>Premium Picks</h1>
          <p className={styles.premiumSubtitle}>
            Explore the finest homes across premium locations.
          </p>
        </div>

        {/* Location Status */}
        {locationStatus === 'detecting' && (
          <div className={styles.premiumLocationStatus}>
            🌍 Detecting your location...
          </div>
        )}

        {locationStatus === 'found' && detectedCity && (
          <div className={styles.premiumLocationStatus}>
            📍{' '}
            {detectedCity === selectedCity
              ? `Showing properties near you (${detectedCity})`
              : `We detected you're in ${detectedCity}`}
          </div>
        )}

        {/* City Selector */}
        <div className={styles.premiumCitySelectorContainer}>
          <CitySelector
            selectedCity={selectedCity}
            onCityChange={handleCityChange}
          />
        </div>

        {/* Swiper Carousel */}
        {data.length > 0 && (
          <div className={styles.premiumCarouselContainer}>
            <Swiper
              key={selectedCity} // ✅ Forces re-render when city changes
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={20}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              touchStartPreventDefault={false} // ✅ Fix mobile touch issues
              breakpoints={{
                320: { slidesPerView: 1.5, spaceBetween: 16 },
                480: { slidesPerView: 1.8, spaceBetween: 16 },
                768: { slidesPerView: 2.5, spaceBetween: 20 },
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
              grabCursor
            >
              {data.map((property) => (
                <SwiperSlide key={property._id}>
                  <PropertyCard property={property} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {/* View All Button */}
        <div className={styles.localityViewMoreContainer}>
          <button
            className={styles.localityViewMoreButton}
            onClick={handleViewMore}
          >
            View All
          </button>
        </div>
      </div>
    </div>
  );
}