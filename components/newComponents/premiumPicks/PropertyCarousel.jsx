import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper';
import PropertyCard from './PropertyCard';
import styles from './premiumPicks.module.css';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function PropertyCarousel({ properties, loading, selectedCity }) {
  // Loading state
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading properties...</p>
      </div>
    );
  }

  // No properties state
  if (!properties?.length) {
    return (
      <div className={styles.noProperties}>
        <p>No properties found in {selectedCity}</p>
      </div>
    );
  }

  return (
    <div className={styles.carouselContainer}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        navigation={{
          nextEl: `.${styles.swiperButtonNext}`,
          prevEl: `.${styles.swiperButtonPrev}`,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
          el: `.${styles.swiperPagination}`,
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        breakpoints={{
          // Mobile: 1.5 slides
          320: {
            slidesPerView: 1.5,
            spaceBetween: 16,
            centeredSlides: false,
          },
          480: {
            slidesPerView: 1.8,
            spaceBetween: 16,
            centeredSlides: false,
          },
          // Tablet: 2.5 slides
          768: {
            slidesPerView: 2.5,
            spaceBetween: 20,
            centeredSlides: false,
          },
          // Desktop: 4 slides
          1024: {
            slidesPerView: 3,
            spaceBetween: 24,
            centeredSlides: false,
          },
          1200: {
            slidesPerView: 4,
            spaceBetween: 24,
            centeredSlides: false,
          },
        }}
        loop={properties.length > 4}
        grabCursor={true}
        className={styles.propertySwiper}
      >
        {properties.map((property) => (
          <SwiperSlide key={property._id}>
            <PropertyCard property={property} />
          </SwiperSlide>
        ))}

        {/* Custom Navigation Buttons */}
        <div className={styles.swiperButtonPrev}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              d="M15 18L9 12L15 6" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className={styles.swiperButtonNext}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              d="M9 18L15 12L9 6" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
        
        {/* Custom Pagination */}
        <div className={styles.swiperPagination}></div>
      </Swiper>
    </div>
  );
}
