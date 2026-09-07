import React, { useState } from "react";
import REVIEW_VIDEOS from "./reviewVideosData.js";
import styles from "./ReviewVideos.module.css";

/*
  Testimonial videos, in the reviews section's left info panel.

  Built to match the Shorts rail higher up the page — same scroller, same card
  treatment, same play button. See ReviewVideos.module.css for the one deliberate
  difference (16:9 rather than 9:16) and why.

  Facade, for the same reason as the Shorts rail: a YouTube iframe is roughly
  700 KB - 1 MB of third-party JavaScript each, and six of them on the home page
  would undo the script-evaluation work done on it. Until a card is clicked, each
  item is one optimised thumbnail and a play triangle drawn in CSS.

  Thumbnails go through /_next/image (i.ytimg.com is allowlisted in next.config.js),
  which converts them to AVIF and resizes to the card — a 125 KB source lands around
  6 KB.
*/

/*
  maxresdefault for everything, Shorts included.

  The obvious rule — oardefault for Shorts, maxresdefault for standard uploads —
  is wrong here twice over. Four of these six have no vertical thumbnail at all
  (oardefault returns a 120x90 grey placeholder), and the two that do are the only
  ones a 9:16 frame would suit anyway.

  maxresdefault exists at a true 1280x720 for all six, which is the native aspect
  of these cards, so nothing is cropped.
*/
const thumbFor = ({ id }) => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;

const embedFor = (id) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;

const VideoCard = ({ item, playing, onPlay }) => {
  if (playing) {
    return (
      <div className={styles.rvidCard}>
        <iframe
          className={styles.rvidFrame}
          src={embedFor(item.id)}
          title={item.label}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      className={styles.rvidCard}
      onClick={() => onPlay(item.id)}
      aria-label={`Play ${item.caption}: ${item.label}`}
    >
      {/*
        Plain <img> with an explicit /_next/image URL rather than next/image: this
        sits inside a horizontal scroller where next/image's wrapper divs fight the
        flex sizing, and the src is known at build time.
      */}
      <img
        className={styles.rvidThumb}
        src={`/_next/image?url=${encodeURIComponent(thumbFor(item))}&w=384&q=70`}
        alt=""
        width={240}
        height={135}
        loading="lazy"
        decoding="async"
      />
      <span className={styles.rvidPlay} aria-hidden="true" />
      <span className={styles.rvidLabel}>{item.label}</span>
    </button>
  );
};

/*
  Defaults to the customer testimonials, but takes any list — the Frames of
  Excellence gallery passes its award films in, so both sections carry the same
  rail instead of two different video treatments.
*/
const ReviewVideos = ({ items = REVIEW_VIDEOS, title = "Hear it from them" }) => {
  const [playing, setPlaying] = useState(null);

  return (
    <div className={styles.rvidStrip}>
      <div className={styles.rvidHead}>
        <h3 className={styles.rvidTitle}>{title}</h3>
        <span className={styles.rvidCount}>{items.length} videos</span>
      </div>
      <div className={styles.rvidRow}>
        {items.map((item) => (
          <VideoCard key={item.id} item={item} playing={playing === item.id} onPlay={setPlaying} />
        ))}
      </div>
    </div>
  );
};

export default ReviewVideos;
