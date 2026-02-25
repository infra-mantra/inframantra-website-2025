"use client";

import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectCoverflow } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

import styles from "./AwardsSlider.module.css";

const Award = () => {
  const awardImages = [
    { src: "https://inframantra.blr1.cdn.digitaloceanspaces.com/aboutus-page-awards/a1.jpg", alt: "Award 1" },
    { src: "https://inframantra.blr1.cdn.digitaloceanspaces.com/aboutus-page-awards/a2.jpg", alt: "Award 2" },
    { src: "https://inframantra.blr1.cdn.digitaloceanspaces.com/aboutus-page-awards/a3.jpg", alt: "Award 3" },
  ];

  // Refs for navigation buttons
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  // State to store the actual navigation elements after they mount
  const [navElements, setNavElements] = useState({ prevEl: null, nextEl: null });

  useEffect(() => {
    if (prevRef.current && nextRef.current) {
      setNavElements({ prevEl: prevRef.current, nextEl: nextRef.current });
    }
  }, [prevRef.current, nextRef.current]); // Run after refs are set

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
          modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
          effect="coverflow"
          centeredSlides
          grabCursor
          loop
          speed={800}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          navigation={navElements} // Use the state instead of refs directly
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
                <img src={item.src} alt={item.alt} className={styles.slideImage} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Award;