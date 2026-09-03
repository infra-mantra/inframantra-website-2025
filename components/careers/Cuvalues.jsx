import React, { useState, useEffect } from "react";
import styles from "./CultureValues.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper";
import "swiper/css/pagination";
import "swiper/css";

const values = [
  {
    title: "TRANSPARENCY",
    image: "/career/company-culture-values/transperancy.avif",
  },
  {
    title: "TEAMWORK",
    image: "/career/company-culture-values/team work.avif",
  },
  {
    title: "INTEGRITY",
    image: "/career/company-culture-values/integrity.avif",
  },
  {
    title: "RESPECT",
    image: "/career/company-culture-values/respect.avif",
  },
];

const CultureValues = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreen(); // initial check
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return (
    <section className={styles.section1}>
      <h2 className={styles.title2}>Work Culture & Values</h2>

      {/* ✅ Desktop */}
      {!isMobile && (
        <div className={styles.grid}>
          {values.map((item, index) => (
            <div className={styles.card2} key={index}>
              <img src={item.image} alt={item.title} className={styles.image} />
              <div className={styles.overlay1}>
                <h3>{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      )}

      {isMobile && (
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={10}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 2500 }}
          loop={true}
        >
          {values.map((item, index) => (
            <SwiperSlide key={index}>
              <div className={styles.card2}>
                <img src={item.image} alt={item.title} className={styles.image} />
                <div className={styles.overlay1}>
                  <h3>{item.title}</h3>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
};

export default CultureValues;
