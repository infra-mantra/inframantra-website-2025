import React from "react";
import styles from "./TestimonialsBanner.module.css";

const CDN = "https://inframantra.blr1.cdn.digitaloceanspaces.com/testimonials/banner";

// Page header: title, subtitle, a small count strip and an image collage.
const TestimonialsBanner = ({ count = 0 }) => {
  return (
    <section className={styles.hero}>
      <div className={styles.heroText}>
        <span className={styles.eyebrow}>Client Stories</span>
        <h1 className={styles.heroTitle}>
          Real Experiences, <span className={styles.accent}>Real Results</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Hear from homebuyers who found their dream home with Inframantra, and how our property
          experts guided them at every step.
        </p>
        {/* Only real data here: the number of stories loaded from the API */}
        {count > 0 && (
          <div className={styles.stat}>
            <strong className={styles.statValue}>{count}</strong>
            <span className={styles.statLabel}>homebuyers have shared their story</span>
          </div>
        )}
      </div>

      <div className={styles.collage} aria-hidden="true">
        <img
          className={styles.collageMain}
          src={`${CDN}/123.jpg`}
          alt=""
          width="320"
          height="400"
        />
        <img
          className={styles.collageSmall}
          src={`${CDN}/121.png`}
          alt=""
          width="200"
          height="200"
        />
        <img
          className={styles.collageSmall}
          src={`${CDN}/122.jpeg`}
          alt=""
          width="200"
          height="200"
        />
      </div>
    </section>
  );
};

export default TestimonialsBanner;
