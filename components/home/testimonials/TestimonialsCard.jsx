import React, { useState } from "react";
import styles from "./TestimonialsCard.module.css";

const MAX_CHARS = 220; // longer quotes get a "Read more" button

// "Amit Verma" -> "AV"
const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

function TestimonialCard({ data }) {
  const [expanded, setExpanded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const text = (data.description || "").trim();
  const isLong = text.length > MAX_CHARS;
  const showImage = data.image && !imageFailed;

  return (
    <article className={styles.card}>
      <span className={styles.quoteMark} aria-hidden="true">
        &ldquo;
      </span>

      <p className={`${styles.text} ${isLong && !expanded ? styles.clamped : ""}`}>{text}</p>

      {isLong && (
        <button
          type="button"
          className={styles.readMore}
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}

      <footer className={styles.author}>
        {showImage ? (
          <img
            className={styles.avatar}
            src={data.image}
            alt={data.name}
            width="48"
            height="48"
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span className={styles.avatar} aria-hidden="true">
            {getInitials(data.name)}
          </span>
        )}
        <h3 className={styles.name}>{data.name}</h3>
      </footer>
    </article>
  );
}

export default TestimonialCard;
