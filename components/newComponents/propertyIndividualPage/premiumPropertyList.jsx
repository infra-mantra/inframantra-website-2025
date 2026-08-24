import React, { useEffect, useState } from 'react';
import axios from 'axios';

import PremiumPicksSection from '../premiumPicks/PropertyCard';
import { PremiumCardsSkeleton } from '../homepage/HomeSkeletons';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function PremiumProperty({ city  }) {
  const [premiumProperties, setPremiumProperties] = useState([]);
  const [loading, setLoading] = useState(true); // true while similar properties fetch

  useEffect(() => {
    let alive = true;
    const fetchCityData = async () => {
      try {
        const response = await axios.get(
          `${process.env.apiUrl1}/property/premium/${city}`
        );
        if (alive) setPremiumProperties(response?.data?.data || []);
      } catch (err) {
        console.error('Error fetching premium properties:', err);
      } finally {
        if (alive) setLoading(false);
      }
    };

    setLoading(true);
    fetchCityData();
    return () => {
      alive = false;
    };
  }, [city]);

  // While loading → show a skeleton (keep the heading so the section reads the same).
  if (loading) {
    return (
      <div className="slider-wrapper-similar">
        <div className="slide-wrapper" style={{ padding: '20px', paddingBottom: '0px' }}>
          <h2 className="Header">Similar Properties</h2>
          <PremiumCardsSkeleton />
        </div>
      </div>
    );
  }

  // Loaded but nothing to show → render nothing.
  if (!premiumProperties.length) return null;

  return (
    <div className="slider-wrapper-similar">
      <div className="slide-wrapper" style={{ padding: '20px', paddingBottom: '0px' }}>
        <h2 className="Header">Similar Properties</h2>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{ clickable: true }}
          navigation
          breakpoints={{
            320: { slidesPerView: 1.2, spaceBetween: 16 },
            480: { slidesPerView: 1.6, spaceBetween: 16 },
            768: { slidesPerView: 2.5, spaceBetween: 20 },
            1024: {
              slidesPerView: Math.min(4, premiumProperties.length),
              spaceBetween: 24,
            },
          }}
          loop={premiumProperties.length > 4}
          grabCursor
        >
          {premiumProperties.map((property) => (
            <SwiperSlide key={property._id}>
              <PremiumPicksSection property={property} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default PremiumProperty;
