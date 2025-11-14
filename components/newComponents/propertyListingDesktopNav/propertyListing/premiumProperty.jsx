import React from 'react'
import PropertyCard from '../../premiumPicks/PropertyCard'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay , Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function premiumProperty({premiumProperties}) {
    
    
  return (
    <>    {premiumProperties.length > 0 && (
            <div >
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={20}
                autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                breakpoints={{
                  320: { slidesPerView: 1.5, spaceBetween: 16 },
                  480: { slidesPerView: 1.8, spaceBetween: 16 },
                  768: { slidesPerView: 2.5, spaceBetween: 20 },
                  1024: { slidesPerView: Math.min(4, premiumProperties.length), spaceBetween: 24 },
                  1200: { slidesPerView: Math.min(4, premiumProperties.length), spaceBetween: 24 },
                }}
                loop={premiumProperties.length > 4}
                grabCursor={true}
              >
                {premiumProperties.map((property) => (
                  <SwiperSlide key={property._id}>
                    <PropertyCard property={property} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}

          </>

          
  )
}

export default premiumProperty