import React, { useEffect, useRef } from "react";
import styles from "./NRIHomeFest.module.css";

// Defaults = the YouTube films used on /usa-nri-event.
// Pass `videos` to swap them per page (e.g. Instagram reels for an event).
const DEFAULT_VIDEOS = [
  {
    src: "https://www.youtube.com/embed/AArzfBwCHEM",
    title: "InfraMantra Video 1",
  },
  {
    src: "https://www.youtube.com/embed/PjaY-8rnoNM",
    title: "InfraMantra Video 2",
  },
];

const NRIHomeFest = ({ compact = false, videos = DEFAULT_VIDEOS, portrait = false }) => {
  // videoBox2 renders first (order:-2), videoBox1 second (order:-1)
  const boxOrder = [styles.videoBox2, styles.videoBox1];

  const frameRefs = useRef([]);

  /* ------------------------------------------------------------------
     Instagram's /embed page posts its rendered height to the parent
     (this is what their embed.js listens for). Using it means the box
     is sized to the real content instead of a CSS estimate, so nothing
     can be trimmed at any width. The CSS ratio-box stays as the
     fallback for the moment before this message arrives.
     ------------------------------------------------------------------ */
  useEffect(() => {
    if (!portrait) return;

    const onMessage = (event) => {
      if (typeof event.origin !== "string") return;
      if (!/(^|\.)instagram\.com$/.test(event.origin.replace(/^https?:\/\//, ""))) {
        return;
      }

      let payload = event.data;
      if (typeof payload === "string") {
        try {
          payload = JSON.parse(payload);
        } catch (e) {
          return;
        }
      }

      const height = payload && payload.details && payload.details.height;
      if (!height) return;

      frameRefs.current.forEach((frame) => {
        if (frame && frame.contentWindow === event.source) {
          frame.style.height = `${Math.ceil(height)}px`;
        }
      });
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [portrait]);

  return (
    <section className={styles.section1}>

      {/* Heading */}
      <div className={styles.headingWrapper}>
        <h2
          className={`${styles.nriStoryHeading} ${
            compact ? styles.nriStoryHeadingCompact : ""
          }`}
        >
          Our Story
        </h2>
      </div>

      {/* Main Layout */}
      <div className={`${styles.storyContent} ${portrait ? styles.storyContentPortrait : ""}`}>

        {videos.slice(0, 2).map((video, i) => (
          <div
            key={video.src}
            className={`${styles.videoBox} ${boxOrder[i] || ""} ${
              portrait ? styles.videoBoxPortrait : ""
            }`}
          >
            <iframe
              ref={(el) => {
                frameRefs.current[i] = el;
              }}
              src={video.src}
              title={video.title}
              frameBorder="0"
              scrolling="no"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        ))}

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