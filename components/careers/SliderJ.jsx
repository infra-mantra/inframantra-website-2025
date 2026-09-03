import React, { useState } from "react";
import styles from "./LearningDevelopment.module.css";

const LearningDevelopment = () => {
  const awardImages = [
    {
      src: "https://inframantra.blr1.cdn.digitaloceanspaces.com/aboutus-page-awards/a1.jpg",
      title: "Project Trainings",
    },
    {
      src: "https://inframantra.blr1.cdn.digitaloceanspaces.com/aboutus-page-awards/a2.jpg",
      title: "Workshops",
    },
    {
      src: "https://inframantra.blr1.cdn.digitaloceanspaces.com/aboutus-page-awards/a3.jpg",
      title: "Learning Sessions",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? awardImages.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === awardImages.length - 1 ? 0 : prev + 1));
  };

  const nextIndex = currentIndex === awardImages.length - 1 ? 0 : currentIndex + 1;

  return (
    <div className={styles.container}>
      {/* Title */}
      <h2 className={styles.title}>LEARNING & DEVELOPMENT</h2>

      {/* Slider Area */}
      <div className={styles.sliderWrapper}>
        {/* Background Card */}
        <div className={`${styles.card} ${styles.backCard}`}>
          <img src={awardImages[nextIndex].src} alt="next" className={styles.image} />
        </div>

        {/* Main Card */}
        <div className={`${styles.card} ${styles.mainCard}`}>
          <img src={awardImages[currentIndex].src} alt="current" className={styles.image} />
        </div>
      </div>

      {/* Bottom Section */}
      <div className={styles.bottomNav}>
        <button className={styles.arrow} onClick={prevSlide}>
          &#10094;
        </button>

        <p className={styles.subtitle}>{awardImages[currentIndex].title}</p>

        <button className={styles.arrow} onClick={nextSlide}>
          &#10095;
        </button>
      </div>
    </div>
  );
};

export default LearningDevelopment;
