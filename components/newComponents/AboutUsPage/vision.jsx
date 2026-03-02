"use client";

import React from "react";
import styles from "./vision.module.css";

const AboutVisionSection = () => {
  return (
    <section className={styles.aboutVisionWrapper}>
      <div className={styles.aboutVisionContainer}>
        
        <h2 className={styles.aboutVisionHeading}>Our Vision</h2>

        <div className={styles.aboutVisionContent}>
          
          {/* LEFT ICON */}
          <div className={styles.aboutVisionIconBox}>
            <img
              src="/aboutUs/visionPng.png"
              alt="vision icon"
              className={styles.aboutVisionIcon}
            />
          </div>

          {/* RIGHT TEXT */}
          <div className={styles.aboutVisionText}>
         To be the most preferred partner for all real estate stakeholders through transparency, simplicity, and choice.


          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutVisionSection;