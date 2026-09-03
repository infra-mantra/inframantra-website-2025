"use client";

import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow, Navigation } from "swiper";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

import styles from "./CoreValues.module.css";

/* Small line icons (one per value). They use stroke="currentColor", so the
   badge around them controls the colour — no image files, nothing to load. */
const IconHeart = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1 7.8 7.8 7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
  </svg>
);
const IconShield = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2 4 5v6c0 5 3.4 8.6 8 10 4.6-1.4 8-5 8-10V5l-8-3z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
const IconPeople = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconProcess = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12a9 9 0 1 1-3-6.7" />
    <path d="M21 4v4h-4" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const CoreValues = () => {
  const values = [
    {
      icon: <IconHeart />,
      title: "Client Centric",
      text: "Clients come first. We prioritise their needs, ensuring personalised real estate experiences that exceed expectations, making their dreams a reality.",
    },
    {
      icon: <IconShield />,
      title: "Integrity, Simplicity & Transparency",
      text: "At INFRAMANTRA, we value honesty, simplicity & transparency. We build trust by being truthful, simplify real estate and ensure clear communication with no hidden costs.",
    },
    {
      icon: <IconPeople />,
      title: "Respect for People",
      text: "We treat everyone with dignity. We listen to our clients, value their opinions and prioritise their needs, fostering trust and lasting relationships.",
    },
    {
      icon: <IconProcess />,
      title: "Process Oriented",
      text: "Our method ensures each step is smooth and clear, building trust and delivering excellence throughout the process.",
    },
  ];

  const [isMobile, setIsMobile] = useState(false);
  const [inView, setInView] = useState(false);
  const [loading, setLoading] = useState(true); // show skeleton cards briefly on load

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Hide the skeleton once the section is ready (short, just enough to be seen).
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  // Reveal the section (heading + cards fade/slide up) once it scrolls into view.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // One card — reused by both the desktop grid and the mobile slider.
  const renderCard = (item, index) => {
    // Alternate gold / white cards. `gold` = filled gold, `light` = white.
    const cardStyle = index % 2 === 0 ? styles.gold : styles.light;
    return (
      <div key={index} className={`${styles.cardCoreValue} ${cardStyle}`}>
        <span className={styles.iconBadge}>{item.icon}</span>
        <h3 className={styles.cardTitle}>{item.title}</h3>
        <p className={styles.cardText}>{item.text}</p>
      </div>
    );
  };

  return (
    <section ref={sectionRef} className={`${styles.coreSection} ${inView ? styles.inView : ""}`}>
      <h2 className={styles.heading}>Core Values</h2>
      <div className={styles.coreValuesContaier}>
        {loading ? (
          // Skeleton: four placeholder cards that match the real layout.
          <div className={styles.skelGrid} aria-hidden="true">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={styles.skelCard}>
                <span className={styles.skelBadge} />
                <span className={styles.skelLine} style={{ width: "60%", height: 16 }} />
                <span className={styles.skelLine} style={{ width: "100%" }} />
                <span className={styles.skelLine} style={{ width: "95%" }} />
                <span className={styles.skelLine} style={{ width: "88%" }} />
                <span className={styles.skelLine} style={{ width: "70%" }} />
              </div>
            ))}
          </div>
        ) : isMobile ? (
          // Mobile: cards don't all fit, so use a slider with arrow buttons.
          <>
            <Swiper
              modules={[Autoplay, Navigation, EffectCoverflow]}
              spaceBetween={20}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              grabCursor
              slidesPerView={1.2}
              effect="coverflow"
              coverflowEffect={{
                rotate: 30,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: false,
              }}
              navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
              onBeforeInit={(swiper) => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }}
            >
              {values.map((item, index) => (
                <SwiperSlide key={index}>{renderCard(item, index)}</SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation Buttons (mobile only) */}
            <div className={styles.navButtons}>
              <button ref={prevRef} className={styles.prevBtn} aria-label="Previous">
                &#10094;
              </button>
              <button ref={nextRef} className={styles.nextBtn} aria-label="Next">
                &#10095;
              </button>
            </div>
          </>
        ) : (
          // Desktop: all cards fit, so show them as a static grid — no slider.
          <div className={styles.cardsGrid}>
            {values.map((item, index) => renderCard(item, index))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CoreValues;
