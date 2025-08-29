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

export default function LocalityPropertiesSection() {
  const [selectedCity, setSelectedCity] = useState('Gurgaon');
  const [localityData, setLocalityData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log('🏠 LocalityPropertiesSection: Current selectedCity:', selectedCity);

  // Subscribe to city change events
  useEffect(() => {
    console.log('🏠 LocalityPropertiesSection: Setting up event listener');
    
    const unsubscribe = cityEventManager.onCityChange((event) => {
      const newCity = event.detail.city;
      console.log('🏠 LocalityPropertiesSection: Received city change event:', newCity);
      setSelectedCity(newCity);
    });

    // Load initial data
    loadLocalityProperties(selectedCity);

    // Cleanup event listener on unmount
    return () => {
      console.log('🏠 LocalityPropertiesSection: Cleaning up event listener');
      unsubscribe();
    };
  }, []);

  // Load properties when city changes
  useEffect(() => {
    console.log('🏠 LocalityPropertiesSection: City changed to:', selectedCity);
    loadLocalityProperties(selectedCity);
  }, [selectedCity]);

  async function loadLocalityProperties(city) {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🏠 Loading locality properties for: ${city}`);
      
      const data = await fetchCityProperties(city);
      console.log('🏠 Raw API data for', city, ':', data);
      
      // Group properties by locality only
      const groupedProperties = groupPropertiesByLocality(data, city);
      console.log('🏠 Grouped properties by locality for', city, ':', groupedProperties);
      
      setLocalityData(groupedProperties);
      
    } catch (err) {
      console.error('🏠 Error loading locality properties:', err);
      setError(err.message);
      setLocalityData([]);
    } finally {
      setLoading(false);
    }
  }

  function groupPropertiesByLocality(data, city) {
    console.log('🏠 groupPropertiesByLocality called for city:', city);
    const localityGroups = {};

    // Process mainCity properties (for Gurgaon)
    if (data.mainCity?.properties?.length > 0) {
      console.log('🏠 Processing mainCity properties:', data.mainCity.properties.length);
      data.mainCity.properties.forEach(property => {
        const localityName = getLocalityName(property);
        if (localityName) {
          if (!localityGroups[localityName]) {
            localityGroups[localityName] = {
              name: localityName,
              properties: []
            };
          }
          localityGroups[localityName].properties.push(property);
        }
      });
    }

    // Process localities array (for Pune, etc.)
    if (data.localities?.length > 0) {
      console.log('🏠 Processing localities array:', data.localities.length);
      data.localities.forEach(localityObj => {
        if (localityObj.properties?.length > 0) {
          const localityName = localityObj.locality?.name || 'Unknown Area';
          console.log('🏠 Processing locality:', localityName, 'with', localityObj.properties.length, 'properties');
          
          if (!localityGroups[localityName]) {
            localityGroups[localityName] = {
              name: localityName,
              properties: []
            };
          }
          
          // Add all properties from this locality
          localityObj.properties.forEach(property => {
            localityGroups[localityName].properties.push(property);
          });
        }
      });
    }

    // Convert to array and filter out localities with less than 2 properties
    const result = Object.values(localityGroups)
      .filter(locality => locality.properties.length >= 2)
      .sort((a, b) => b.properties.length - a.properties.length); // Sort by property count
    
    console.log('🏠 Final grouped result for', city, ':', result);
    return result;
  }

  function getLocalityName(property) {
    // Get locality name from property object
    const localityName = property.locality?.name;
    
    if (localityName) {
      return localityName;
    }
    
    // Fallback to city if no locality
    return property.city?.name || 'Unknown Area';
  }

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

  if (error || localityData.length === 0) {
    return null; // Don't show anything if no data
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

        {/* Locality Sections */}
        {localityData.map((locality, index) => (
          <div key={locality.name} className={styles.localitySection}>
            {/* Locality Title */}
            <h3 className={styles.localityTitle}>
              Property in {locality.name}
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
                  320: {
                    slidesPerView: 1.2,
                    spaceBetween: 16,
                  },
                  480: {
                    slidesPerView: 1.5,
                    spaceBetween: 16,
                  },
                  768: {
                    slidesPerView: 2.5,
                    spaceBetween: 20,
                  },
                  1024: {
                    slidesPerView: Math.min(3, locality.properties.length),
                    spaceBetween: 24,
                  },
                  1200: {
                    slidesPerView: Math.min(3, locality.properties.length),
                    spaceBetween: 24,
                  },
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
              >
                
              </button>

              <button
                className={`locality-next-${index} ${styles.localityNavButton} ${styles.localityNavButtonNext}`}
              >
            
              </button>
            </div>
          </div>
        ))}

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
