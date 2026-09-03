"use client";

import React, { useRef } from "react";
import SwiperCore, { Pagination, Autoplay, EffectCoverflow, Lazy } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css/lazy";

import styles from "./AwardsSlider.module.css";

SwiperCore.use([Pagination, Autoplay, EffectCoverflow, Lazy]);

const Award = () => {
  const paginationRef = useRef(null);

  const awardImages = Array.from({ length: 40 }, (_, i) => ({
    src: `https://inframantra.blr1.cdn.digitaloceanspaces.com/career/${i + 1}.webp`,
    title: `Life at Inframantra ${i + 1}`,
  }));

  return (
    <>
      <h2 className={styles.awardHeader}>
        Life at <span className={styles.brand}>INFRAMANTRA</span>
      </h2>

      <div className={styles.awardContainercarrer}>
        <div className={styles.swiperContainer}>
          <Swiper
            modules={[Pagination, Autoplay, EffectCoverflow, Lazy]}
            onBeforeInit={(swiper) => {
              swiper.params.pagination.el = paginationRef.current;
            }}
            pagination={{
              clickable: true,
              el: paginationRef.current,
            }}
            effect="coverflow"
            centeredSlides={true}
            loop={true}
            speed={800}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            lazy={{
              loadPrevNext: true,
              loadOnTransitionStart: true,
            }}
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
                    data-src={item.src}
                    className={`swiper-lazy ${styles.slideImages}`}
                    alt={item.title}
                  />
                  <div className="swiper-lazy-preloader"></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div ref={paginationRef} className={styles.customPagination}></div>
        </div>
      </div>
    </>
  );
};

export default Award;
