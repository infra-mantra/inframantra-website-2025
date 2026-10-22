import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./PropertyMediaGallery.module.css";
import { VIDEO_LABELS, getEmbedUrl, getVideoThumbnail } from "./videoMedia.js";

/*
  Horizontal row of video cards (YouTube videos, Shorts, Instagram Reels).
  Each card is a "facade": a thumbnail + play button. The real iframe is only
  created when that card is clicked, so the page loads no YouTube/Instagram
  script up front. `videos` comes from getPropertyVideos() in videoMedia.js.
*/

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
      <path d="M8 5v14l11-7z" fill="currentColor" />
    </svg>
  );
}

function ArrowIcon({ direction }) {
  const d = direction === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6";
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function VideoCard({ video, index, projectName }) {
  const [playing, setPlaying] = useState(false);
  const thumbnail = getVideoThumbnail(video);
  const label = VIDEO_LABELS[video.type];
  const isVertical = video.aspect === "9:16";
  const title = `${projectName || "Property"} ${label.toLowerCase()} ${index + 1}`;

  return (
    <li
      className={`${styles["pm-card"]} ${isVertical ? styles["pm-vertical"] : styles["pm-landscape"]}`}
    >
      {playing ? (
        <iframe
          className={styles["pm-frame"]}
          src={getEmbedUrl(video)}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          className={styles["pm-facade"]}
          onClick={() => setPlaying(true)}
          aria-label={`Play ${title}`}
        >
          {thumbnail ? (
            <img src={thumbnail} alt="" width={480} height={360} loading="lazy" decoding="async" />
          ) : (
            // Instagram has no public thumbnail URL, so show a branded tile.
            <span className={styles["pm-insta-tile"]} aria-hidden="true" />
          )}
          <span className={styles["pm-shade"]} aria-hidden="true" />
          <span className={styles["pm-badge"]}>{label}</span>
          <span className={styles["pm-play"]} aria-hidden="true">
            <PlayIcon />
          </span>
        </button>
      )}
    </li>
  );
}

function PropertyMediaGallery({ videos = [], projectName }) {
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  // Enable/disable the arrows based on where the row is scrolled to.
  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, [updateArrows, videos.length]);

  const scrollByPage = (direction) => {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: "smooth" });
  };

  if (!videos.length) return null;
  const showArrows = canPrev || canNext;

  return (
    <div className={styles["pm-root"]}>
      <div className={styles["pm-head"]}>
        <div>
          <p className={styles["pm-eyebrow"]}>Videos &amp; Reels</p>
          <h2 className={`Header ${styles["pm-title"]}`}>Watch {projectName || "the project"}</h2>
        </div>
        {showArrows && (
          <div className={styles["pm-arrows"]}>
            <button
              type="button"
              className={styles["pm-arrow"]}
              onClick={() => scrollByPage(-1)}
              disabled={!canPrev}
              aria-label="Previous videos"
            >
              <ArrowIcon direction="left" />
            </button>
            <button
              type="button"
              className={styles["pm-arrow"]}
              onClick={() => scrollByPage(1)}
              disabled={!canNext}
              aria-label="Next videos"
            >
              <ArrowIcon direction="right" />
            </button>
          </div>
        )}
      </div>

      <ul className={styles["pm-track"]} ref={trackRef} onScroll={updateArrows}>
        {videos.map((video, i) => (
          <VideoCard
            key={`${video.type}-${video.id}`}
            video={video}
            index={i}
            projectName={projectName}
          />
        ))}
      </ul>
    </div>
  );
}

export default PropertyMediaGallery;
