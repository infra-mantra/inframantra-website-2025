import React, { useEffect, useRef, useState } from "react";
import styles from "./imageGallerySection.module.css";

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

const ImageGallerySection = () => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  // Gentle auto-play so the gallery is alive on load and on touch devices.
  useEffect(() => {
    if (paused) return undefined;
    const id = setInterval(
      () => setActive((a) => (a + 1) % itemData.length),
      AUTOPLAY_MS
    );
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
    <section
      ref={ref}
      className={`${styles.gallery} ${inView ? styles.in : ""}`}
    >
      <span className={styles.glowA} aria-hidden="true" />
      <span className={styles.glowB} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            Moments &amp; Milestones
          </span>
          <h2 className={styles.title}>
            Frames of <span>Excellence</span>
          </h2>
          <p className={styles.subtitle}>
            Where vision meets reality — the moments, milestones and people
            behind every home we deliver.
          </p>
        </div>

        <div
          className={`${styles.accordion} ${paused ? styles.paused : ""}`}
          onMouseLeave={() => setPaused(false)}
        >
          {itemData.map((it, i) => (
            <figure
              key={i}
              className={`${styles.panel} ${i === active ? styles.active : ""}`}
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
                className={styles.panelBg}
              />
              <img
                src={it.img}
                alt={it.caption}
                loading="lazy"
                className={styles.panelImg}
              />
              <span className={styles.scrim} aria-hidden="true" />
              <span className={styles.shine} aria-hidden="true" />
              <span className={styles.ring} aria-hidden="true" />

              <span className={styles.vLabel} aria-hidden="true">
                <span>{it.caption}</span>
              </span>

              <figcaption className={styles.label}>
                <span className={styles.index}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={styles.labelText}>{it.caption}</span>
              </figcaption>

              {i === active && (
                <span key={active} className={styles.progress} aria-hidden="true" />
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImageGallerySection;
