"use client";

import React, { useState, useEffect } from "react";
import styles from "../AboutUsPage/aboutUs.module.css";
import RightSlideModal from "../propertyIndividualPage/modal";

const AboutUsPageHeader = () => {
  const [isDesktop, setIsDesktop] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);
    return () => window.removeEventListener("resize", checkScreenWidth);
  }, []);


  // Full text content to show inside modal
  const fullText = (
    <>

              Inframantra is proud to have global music sensation  <span className={styles.highlightName}>Guru Randhawa</span> as our Brand Ambassador. His dynamic personality and worldwide recognition perfectly align with our vision of innovation, trust, and excellence in the real estate sector.
              <br/><br/>

             As a celebrated artist with millions of fans globally, <span className={styles.highlightName}>Guru Randhawa</span> brings a vibrant energy and credibility to our brand. His association enhances our visibility, connects us with a broader audience, and reinforces our commitment to delivering quality and value in every project.
             <br/><br/>
             By partnering with  <span className={styles.highlightName}>Guru Randhawa</span>, Inframantra not only celebrates creativity and talent but also inspires confidence among customers, stakeholders, and partners, positioning us as a trusted and forward-thinking leader in the real estate industry.

    </>
  );

  return (
    <>
      <div className={styles.aboutUsPageWrapper}>
  

        {/* STORY SECTION */}
        <div className={styles.storyContainer}>
          <h2 className={styles.headingTitlemobile}>Brand Ambassador</h2>

          <div className={styles.storyImage}>
            <img src="/guruCollection/brand.jpg" alt="Our Story" />
          </div>

          <div className={styles.storyContent}>
            <h2 className={styles.headingTitleStory}>Brand Ambassador</h2>

            <div
              className={styles.storyText}
              style={{ maxHeight: "300px", overflow: "hidden" }}
            >

              Inframantra is proud to have global music sensation  <span className={styles.highlightName}>Guru Randhawa</span> as our Brand Ambassador. His dynamic personality and worldwide recognition perfectly align with our vision of innovation, trust, and excellence in the real estate sector.
              <br/><br/>

             As a celebrated artist with millions of fans globally, <span className={styles.highlightName}>Guru Randhawa</span> brings a vibrant energy and credibility to our brand. His association enhances our visibility, connects us with a broader audience, and reinforces our commitment to delivering quality and value in every project.
             <br/><br/>
             By partnering with  <span className={styles.highlightName}>Guru Randhawa</span>, Inframantra not only celebrates creativity and talent but also inspires confidence among customers, stakeholders, and partners, positioning us as a trusted and forward-thinking leader in the real estate industry.

            </div>

            {/* Read More Button */}
            <span
              onClick={() => setIsModalOpen(true)}
              className={styles.inlineReadMore}
            >
              Read More
            </span>
          </div>
        </div>
      </div>

      {/* Modal showing full text */}
      <RightSlideModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Our Story"
        name="about us page"
      >
        <p className={styles.storyText}>{fullText}</p>
      </RightSlideModal>
    </>
  );
};

export default AboutUsPageHeader;