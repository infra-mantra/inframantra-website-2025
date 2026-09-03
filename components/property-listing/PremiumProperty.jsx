import React from "react";
import PropertyCard from "../home/premium-picks/PropertyCard.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function premiumProperty({ premiumProperties }) {
  return (
    <>
      {" "}
      {premiumProperties.length > 0 && (
        <div>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            breakpoints={{
              320: {
                slidesPerView: 1.25,
                spaceBetween: 14,
                slidesOffsetBefore: 14,
                slidesOffsetAfter: 14,
              },
              480: {
                slidesPerView: 1.8,
                spaceBetween: 16,
                slidesOffsetBefore: 14,
                slidesOffsetAfter: 14,
              },
              768: { slidesPerView: 2.5, spaceBetween: 20 },
              1024: { slidesPerView: 4, spaceBetween: 22 },
              1200: { slidesPerView: 4, spaceBetween: 22 },
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
  );
}

export default premiumProperty;
