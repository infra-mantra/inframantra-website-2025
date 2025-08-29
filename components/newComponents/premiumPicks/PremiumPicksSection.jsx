'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper';
import { fetchCityProperties } from '../utils/propertyApi';
import { cityEventManager } from '../utils/cityEventManager';
import PropertyCard from '../shared/PropertyCard';
import CitySelector from './CitySelector';
import { useLocationDetection } from './hooks/useLocationDetection';
import styles from './PremiumPicksSection.module.css';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function PremiumPicksSection() {
  const [selectedCity, setSelectedCity] = useState('Gurgaon');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Track if user has manually selected a city
  const hasManuallySelected = useRef(false);
  const hasAutoSelected = useRef(false);

  // Use location detection hook
  const { detectedCity, locationStatus } = useLocationDetection();

  useEffect(() => {
    loadProperties(selectedCity);
  }, [selectedCity]);

  // Auto-select detected city ONLY ONCE and ONLY if user hasn't manually selected
  useEffect(() => {
    if (detectedCity && 
        !hasAutoSelected.current && 
        !hasManuallySelected.current && 
        detectedCity !== selectedCity) {
      
      console.log(`🎯 Auto-selecting detected city: ${detectedCity}`);
      setSelectedCity(detectedCity);
      cityEventManager.emitCityChange(detectedCity);
      hasAutoSelected.current = true;
    }
  }, [detectedCity, selectedCity]);

  async function loadProperties(city) {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🎯 Loading properties for: ${city}`);
      
      const data = await fetchCityProperties(city);
      
      // Get properties from the combined allProperties array
      const cityProperties = data.allProperties || [];
      console.log(`🎯 Loaded ${cityProperties.length} properties for ${city}`);
      
      setProperties(cityProperties);
    } catch (err) {
      console.error('🎯 Error loading properties:', err);
      setError(err.message);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }

  const handleCityChange = (city) => {
    if (city !== selectedCity) {
      console.log(`🎯 Manual city selection: ${selectedCity} → ${city}`);
      hasManuallySelected.current = true;
      setSelectedCity(city);
      
      // Emit the city change event for other components to listen
      cityEventManager.emitCityChange(city);
    }
  };

  if (loading) {
    return (
      <div className={styles.premiumLoadingContainer}>
        <div className={styles.premiumLoadingSpinner}></div>
        <p className={styles.premiumLoadingText}>Loading {selectedCity} properties...</p>
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
        {locationStatus === 'detecting' && !hasManuallySelected.current && (
          <div className={`${styles.premiumLocationStatus} ${styles.premiumLocationDetecting}`}>
            <span className={styles.premiumLocationIcon}>🌍</span>
            <span className={styles.premiumLocationDetectingText}>
              Detecting your location...
            </span>
          </div>
        )}

        {locationStatus === 'found' && detectedCity && !hasManuallySelected.current && (
          <div className={`${styles.premiumLocationStatus} ${styles.premiumLocationFound}`}>
            <span className={styles.premiumLocationIcon}>📍</span>
            <span className={styles.premiumLocationFoundText}>
              {detectedCity === selectedCity 
                ? `Showing properties near you (${detectedCity})`
                : `We detected you're in ${detectedCity}`
              }
            </span>
          </div>
        )}

        {/* City Selector */}
        <div className={styles.premiumCitySelectorContainer}>
          <CitySelector
            selectedCity={selectedCity}
            onCityChange={handleCityChange}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className={styles.premiumErrorContainer}>
            <p className={styles.premiumErrorText}>
              Error loading properties: {error}
            </p>
            <button 
              onClick={() => loadProperties(selectedCity)}
              className={styles.premiumErrorButton}
            >
              Try Again
            </button>
          </div>
        )}

        {/* No Properties Message */}
        {!loading && !error && properties.length === 0 && (
          <div className={styles.premiumNoPropertiesContainer}>
            <p>No properties found in {selectedCity}</p>
          </div>
        )}

        {/* Property Carousel */}
        {!loading && !error && properties.length > 0 && (
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
                  slidesPerView: Math.min(4, properties.length),
                  spaceBetween: 24,
                },
                1200: {
                  slidesPerView: Math.min(4, properties.length),
                  spaceBetween: 24,
                },
              }}
              loop={properties.length > 4}
              grabCursor={true}
            >
              {properties.map((property) => (
                <SwiperSlide key={property._id}>
                  <PropertyCard property={property} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </div>
  );
}
