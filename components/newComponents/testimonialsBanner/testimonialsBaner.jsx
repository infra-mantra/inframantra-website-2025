import React from "react";
import styles from "./testimonialsBanner.module.css"; // Import the module

const TestimonialsBanner = () => {
  return (
    <div className={styles.testimonialsContainer}>
      <div className={styles.testimonialsHeader}>
        <div className={styles.quoteIcon}>“</div>
        <div className={styles.testimonialsBannerContainerHeader}>
          <h1>INFRAMANTRA CLIENT STORIES:</h1>
          <h2>REAL EXPERIENCES, REAL RESULTS!</h2>
        </div>
        <p className={styles.testimonialsDescription}>
          Hear from our satisfied clients and discover how we`ve helped them
          achieve their real estate dreams with our exceptional service and
          expertise.
        </p>
      </div>
      <div className={styles.testimonialsImages}>
        <div className={styles.imagePlaceholder}>
          <img
            src={`https://inframantra.blr1.cdn.digitaloceanspaces.com/testimonials/banner/123.jpg`}
            alt="Testimonials 3"
          />
        </div>
        <div className={styles.imageRow}>
          <div className={styles.imagePlaceholder}>
            <img
              src={`https://inframantra.blr1.cdn.digitaloceanspaces.com/testimonials/banner/121.png`}
              alt="Testimonials 1"
            />
          </div>
          <div className={styles.imagePlaceholder}>
            <img
              src={`https://inframantra.blr1.cdn.digitaloceanspaces.com/testimonials/banner/122.jpeg`}
              alt="Testimonials 2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsBanner;
