"use client";

import React, { useRef } from "react";
import SwiperCore, {
  Navigation,
  Pagination,
  Autoplay,
  EffectCoverflow,
} from "swiper";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

import styles from "./AwardsSlider.module.css";

SwiperCore.use([Navigation, Pagination, Autoplay, EffectCoverflow]);

const Award = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const awardImages = [
    {
      src:
        "https://inframantra.blr1.cdn.digitaloceanspaces.com/aboutus-page-awards/a1.jpg",
    },
    {
      src:
        "https://inframantra.blr1.cdn.digitaloceanspaces.com/aboutus-page-awards/a2.jpg",
    },
    {
      src:
        "https://inframantra.blr1.cdn.digitaloceanspaces.com/aboutus-page-awards/a3.jpg",
    },
  ];

  return (
    <div className={styles.awardContainer}>
      <h2 className={styles.headingTitle}>Awards & Recognitions</h2>

      {/* Custom Navigation Buttons */}
      <div ref={prevRef} className={`${styles.navButton} ${styles.prevButton}`}>
        &#10094;
      </div>
      <div ref={nextRef} className={`${styles.navButton} ${styles.nextButton}`}>
        &#10095;
      </div>

      <div className={styles.swiperContainer}>
        <Swiper
          // Attach navigation refs before init!
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          effect="coverflow"
          centeredSlides={true}
          loop={true}
          speed={800}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          coverflowEffect={{
            rotate: 25,
            stretch: 0,
            depth: 200,
            modifier: 1,
            slideShadows: false,
          }}
          breakpoints={{
            0: { slidesPerView: 1.2, spaceBetween: 10 },
            640: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 30 },
          }}
        >
          {awardImages.map((item, index) => (
            <SwiperSlide key={index}>
              <div className={styles.slideCard}>
                <img
                  src={item.src}
                  alt={`award-${index}`}
                  className={styles.slideImages}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Award;