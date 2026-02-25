"use client";

import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow, Navigation } from "swiper";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

import styles from "./coreValues.module.css";

const CoreValues = () => {
  const values = [
    {
      title: "Client Centric",
      text: "Clients come first. We prioritise their needs, ensuring personalised real estate experiences that exceed expectations, making their dreams a reality.",
    },
    {
      title: "Integrity, Simplicity & Transparency",
      text: "At INFRAMANTRA, we value honesty, simplicity & transparency. We build trust by being truthful, simplify real estate and ensure clear communication with no hidden costs.",
    },
    {
      title: "Respect for People",
      text: "We treat everyone with dignity. We listen to our clients, value their opinions and prioritise their needs, fostering trust and lasting relationships.",
    },
    {
      title: "Process Oriented",
      text: "Our method ensures each step is smooth and clear, building trust and delivering excellence throughout the process.",
    },
  ];

  const [isMobile, setIsMobile] = useState(false);

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className={styles.coreSection}>
      <h2 className={styles.heading}>Core Values</h2>
<div className={styles.coreValuesContaier}>
      

      <Swiper
        modules={[Autoplay, Navigation, ...(isMobile ? [EffectCoverflow] : [])]}
        spaceBetween={20}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        grabCursor
        slidesPerView={isMobile ? 1.2 : 4}
        effect={isMobile ? "coverflow" : "slide"}
        coverflowEffect={
          isMobile
            ? {
                rotate: 30,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: false,
              }
            : undefined
        }
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          // Connect refs to swiper navigation
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        breakpoints={{
          320: {
            slidesPerView: isMobile ? 1.2 : 1,
          },
          480: {
            slidesPerView: isMobile ? 1.2 : 2,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
        }}
      >
        {values.map((item, index) => (
          <SwiperSlide key={index}>
            <div
              className={styles.cardCoreValue}
              style={{
                backgroundColor: index % 2 === 0 ? "#dcaa4c" : "white",
              }}
            >
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardText}>{item.text}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Navigation Buttons */}
      <div className={styles.navButtons}>
        <button ref={prevRef} className={styles.prevBtn}>
          &#10094; {/* Left arrow */}
        </button>
        <button ref={nextRef} className={styles.nextBtn}>
          &#10095; {/* Right arrow */}
        </button>
      </div>
      </div>
    </section>
  );
};

export default CoreValues;