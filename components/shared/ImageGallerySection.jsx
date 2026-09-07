import React, { useEffect, useRef, useState } from "react";
import styles from "./ImageGallerySection.module.css";
import { ShortsRail } from "../home/shorts/ShortsSection.jsx";
import SHORTS from "../home/shorts/shortsData.js";

const CDN = "https://inframantra.blr1.cdn.digitaloceanspaces.com";

const AUTOPLAY_MS = 3600;

/* Real moments at Inframantra, shown as an interactive expanding-panel gallery
   with a scroll-triggered staggered entrance and a story-style progress bar. */
// Self-hosted, pre-compressed WebP (served with immutable cache). The originals
// were huge — brand.jpg alone was 2.7 MB (8192x5464); these are ~15-71 KB each.
const itemData = [
  { img: `/gallery/img2514.webp`, caption: "Celebrating Our Milestones" },
  { img: `/gallery/img5639.webp`, caption: "Times of India Award" },
  { img: `/gallery/a1.webp`, caption: "TOI Channel Partner of the Year" },
  { img: `/gallery/a2.webp`, caption: "Honoured for Performance" },
  { img: `/gallery/a3.webp`, caption: "Recognised as The Champions" },
  { img: `/gallery/brand.webp`, caption: "Celebrating Our Brand Ambassador" },
];

/*
  Award films, as a rail beneath the heading rather than as extra accordion panels.

  Deliberately the Shorts strip's own rail — same 9:16 card, same scroller, same
  play facade as the video section higher up the page, so the two read as one
  treatment. ShortCard also reads the `frame` tag each entry carries, which is
  what stops a Short's 16:9 composite thumbnail being shown whole.

  One of the three is an ordinary landscape upload rather than a Short, so it is
  matted top and bottom inside the vertical card. That is the accepted cost of
  matching the strip above; a 16:9 card would fit it exactly but would then be the
  wrong frame for the other two.

  Read from shortsData.js rather than copied, so adding an entry there under the
  "awards" category appears here with nothing else to change.
*/
const AWARD_VIDEOS = SHORTS.filter((v) => v.category === "awards");

const ImageGallerySection = () => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  // Gentle auto-play so the gallery is alive on load and on touch devices.
  useEffect(() => {
    if (paused) return undefined;
    const id = setInterval(() => setActive((a) => (a + 1) % itemData.length), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused]);

  // Reveal panels with a staggered entrance once the section scrolls into view.
  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setInView(true);
      return undefined;
    }
    const el = ref.current;
    if (!el) return undefined;
    const ob = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          ob.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);

  return (
    <section ref={ref} className={`${styles.igGallery} ${inView ? styles.in : ""}`}>
      <span className={styles.igGlowA} aria-hidden="true" />
      <span className={styles.igGlowB} aria-hidden="true" />

      <div className={styles.igInner}>
        <div className={styles.igHeader}>
          <span className={styles.igEyebrow}>
            <span className={styles.igEyebrowDot} />
            Moments &amp; Milestones
          </span>
          <h2 className={styles.igTitle}>
            Frames of <span>Excellence</span>
          </h2>
          <p className={styles.igSubtitle}>
            Where vision meets reality — the moments, milestones and people behind every home we
            deliver.
          </p>

          <div className={styles.igVideos}>
            <div className={styles.igVideosHead}>
              <h3 className={styles.igVideosTitle}>Awards &amp; Recognition</h3>
              <span className={styles.igVideosCount}>{AWARD_VIDEOS.length} videos</span>
            </div>
            <ShortsRail items={AWARD_VIDEOS} />
          </div>
        </div>

        <div
          className={`${styles.igAccordion} ${paused ? styles.paused : ""}`}
          onMouseLeave={() => setPaused(false)}
        >
          {itemData.map((it, i) => (
            <figure
              key={i}
              className={`${styles.igPanel} ${i === active ? styles.active : ""}`}
              style={{ animationDelay: `${0.12 + i * 0.09}s` }}
              onMouseEnter={() => {
                setActive(i);
                setPaused(true);
              }}
              onClick={() => setActive(i)}
            >
              <img
                src={it.img}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className={styles.igPanelBg}
              />
              <img src={it.img} alt={it.caption} loading="lazy" className={styles.igPanelImg} />
              <span className={styles.igScrim} aria-hidden="true" />
              <span className={styles.igShine} aria-hidden="true" />
              <span className={styles.igRing} aria-hidden="true" />

              <span className={styles.igVLabel} aria-hidden="true">
                <span>{it.caption}</span>
              </span>

              <figcaption className={styles.igLabel}>
                <span className={styles.igIndex}>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.igLabelText}>{it.caption}</span>
              </figcaption>

              {i === active && (
                <span key={active} className={styles.igProgress} aria-hidden="true" />
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImageGallerySection;
