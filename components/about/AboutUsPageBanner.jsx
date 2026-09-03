"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./AboutUs.module.css";
import RightSlideModal from "../property-detail/Modal.jsx";

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

  const BannerImage =
    "https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/about%20us%20banner%20final.avif";

  const MobileBannerImage =
    "https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/About%20us%20banner%20Phone.avif";

  // Full text content to show inside modal
  const fullText = (
    <>
      <span className={styles.highlightName}>Shiwang Suraj</span> and{" "}
      <span className={styles.highlightName}>Garvit Tiwari</span> bring together a powerful blend of
      entrepreneurial vision and financial expertise as the driving forces behind InfraMantra India
      Pvt. Ltd.
      <br />
      <br />
      With over a decade of cross-industry experience, Shiwang began his entrepreneurial journey in
      2015 as Co-founder of Zapplon, transforming corporate transport solutions with innovation and
      operational excellence. His strengths in sales, marketing, and operations laid the foundation
      for building scalable, value-driven ventures.
      <br />
      <br />
      Complementing this vision, Garvit brings more than 14 years of experience in banking and
      finance, having worked with leading institutions such as HDFC Bank, IndusInd Bank, Yes Bank,
      and Kotak Bank. A Gold Medalist in IT, he has driven growth across corporate banking and
      wealth management verticals.
      <br />
      <br />
      Together, their combined expertise in strategy, finance, and market development positions
      InfraMantra as a dynamic and trusted name in the real estate industry.
    </>
  );

  return (
    <>
      <div className={styles.aboutUsPageWrapper}>
        {/* Banner */}
        <div className={styles.aboutUsPageHeaderImgContainer}>
          <img
            src={isDesktop ? BannerImage : MobileBannerImage}
            alt="about banner"
            className={styles.aboutUsPageHeaderImg}
          />
        </div>

        <div className={styles.aboutUsContainer}>
          <div>
            <h2 className={styles.headingTitleAbout}>About us</h2>
          </div>
          <div className={styles.storyText_about}>
            Inframantra is one of India’s leading proptech advisory firms, dedicated to guiding
            clients seamlessly through the process of searching, discovering, purchasing, and
            managing properties from top real estate developers, while also helping build a
            rewarding investment portfolio. <br />
            <br />
            Anchored in a process-driven approach, we ensure every home-buying experience is deeply
            customer-centric, and transparent. Experience a new benchmark in property advisory with
            Inframantra-where expertise meets excellence, and your aspirations find their perfect
            home.
          </div>
        </div>

        {/* STORY SECTION */}
        <div className={styles.storyContainer}>
          <h2 className={styles.headingTitlemobile}>Our Story</h2>

          <div className={styles.storyImage}>
            <img src="/aboutUs/ourStory.jpeg" alt="Our Story" />
          </div>

          <div className={styles.storyContent}>
            <h2 className={styles.headingTitleStory}>Our Story</h2>

            <div className={styles.storyText} style={{ maxHeight: "300px", overflow: "hidden" }}>
              {/* Linked to their profile pages. Both /team/* pages exist and are
                  served from the CMS, but nothing on the site linked to them and
                  they were in no sitemap — an orphan page with no inbound links
                  is what search engines quietly drop. */}
              <Link href="/team/shiwang-suraj">
                <a className={styles.highlightName}>Shiwang Suraj</a>
              </Link>{" "}
              and{" "}
              <Link href="/team/garvit-tiwari">
                <a className={styles.highlightName}>Garvit Tiwari</a>
              </Link>{" "}
              bring together a powerful
              blend of entrepreneurial vision and financial expertise as the driving forces behind
              InfraMantra India Pvt. Ltd.
              <br />
              <br />
              With over a decade of cross-industry experience, Shiwang began his entrepreneurial
              journey in 2015 as Co-founder of Zapplon, transforming corporate transport solutions
              with innovation and operational excellence. His strengths in sales, marketing, and
              operations laid the foundation for building scalable, value-driven ventures.
              <br />
              <br />
              Complementing this vision, Garvit brings more than 14 years of experience in banking
              and finance, having worked with leading institutions such as HDFC Bank, IndusInd Bank,
              Yes Bank, and Kotak Bank. A Gold Medalist in IT, he has driven growth across corporate
              banking and wealth management verticals.
              <br />
              <br />
              Together, their combined expertise in strategy, finance, and market development
              positions InfraMantra as a dynamic and trusted name in the real estate industry.
            </div>

            <span onClick={() => setIsModalOpen(true)} className={styles.inlineReadMore}>
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
