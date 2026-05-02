import React from "react";
import styles from "./NRIHomeFest.module.css";

const NRIHomeFest = () => {
  return (
    <section className={styles.section1}>

      {/* Heading */}
      <div className={styles.headingWrapper}>
        <h2 className={styles.heading}>
          Our Story
        </h2>
      </div>

      {/* Main Layout */}
      <div className={styles.storyContent}>

        {/* Video 1 */}
        <div className={`${styles.videoBox} ${styles.videoBox2}`}>
          <iframe
            src="https://www.youtube.com/embed/AArzfBwCHEM"
            title="InfraMantra Video 1"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>

        {/* Video 2 */}
        <div className={`${styles.videoBox} ${styles.videoBox1}`}>
          <iframe
            src="https://www.youtube.com/embed/PjaY-8rnoNM"
            title="InfraMantra Video 2"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>

        <div className={styles.storyText}>

          <span className={styles.highlightName}>
            Shiwang Suraj
          </span>{" "}
          and{" "}
          <span className={styles.highlightName}>
            Garvit Tiwari
          </span>{" "}
          bring together a powerful blend of entrepreneurial vision and
          financial expertise as the driving forces behind InfraMantra India Pvt. Ltd.

          <br /><br />

          With over a decade of cross-industry experience, Shiwang began his
          entrepreneurial journey in 2015 as Co-founder of Zapplon,
          transforming corporate transport solutions with innovation and
          operational excellence. His strengths in sales, marketing, and
          operations laid the foundation for building scalable, value-driven
          ventures.

          <br /><br />

          Complementing this vision, Garvit brings more than 14 years of
          experience in banking and finance, having worked with leading
          institutions such as HDFC Bank, IndusInd Bank, Yes Bank, and Kotak
          Bank. A Gold Medalist in IT, he has driven growth across corporate
          banking and wealth management verticals.

          <br /><br />

          Together, their combined expertise in strategy, finance, and market
          development positions InfraMantra as a dynamic and trusted name in
          the real estate industry.

        </div>

      </div>

    </section>
  );
};

export default NRIHomeFest;