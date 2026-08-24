import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FaStar,FaStarHalfAlt } from "react-icons/fa";
import styles from "./reviewsWall.module.css";
import { currentReviews } from "./currentReviews";
import { staticGoogleReviews } from "./googleReviews";

/* Highlight figures (numbers, %, ₹, durations, "zero/0 brokerage") so cards
   echo the reference design's emphasised metrics. The whole pattern is one
   capture group, so String.split() keeps the matches at odd indices. */
const HL =
  /((?:\d+(?:\.\d+)?\s?(?:%|x|\+|years?|yrs?|months?|weeks?|days?|lakhs?|crores?|cr|bhk))|₹\s?[\d,]+|zero\b|0\s?brokerage)/gi;

function renderText(text) {
  const parts = String(text || "").split(HL);
  return parts.map((p, i) =>
    i % 2 === 1 ? (
      <span key={i} className={styles.rwHl}>{p}</span>
    ) : (
      <React.Fragment key={i}>{p}</React.Fragment>
    )
  );
}

function Stars({ n = 5 }) {
  return (
    <span className={styles.rwStars} aria-label={`${n} star rating`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <FaStar key={i} className={i < n ? styles.rwStarOn : styles.rwStarOff} />
      ))}
    </span>
  );
}

/* Fractional stars — e.g. 4.8 renders 4 full + ~0.8 of the 5th star. */
function RatingStars({ value = 4.4 }) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
const row = Array.from({ length: 5 }).map((_, i) =>
  i === 4 ? <FaStarHalfAlt key={i} /> : <FaStar key={i} />
); 
  return (
    <span
      className={styles.rwRatingStars}
      role="img"
      aria-label={`${value} out of 5 stars`}
    >
      <span className={styles.rwRatingStarsBase}>{row}</span>
      <span className={styles.rwRatingStarsFill} style={{ width: `${pct}%` }}>
        {row}
      </span>
    </span>
  );
}

function initialsOf(name) {
  return String(name || "IM")
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function ReviewCard({ review }) {
  return (
    <article className={styles.rwCard}>
      <div className={styles.rwCardHead}>
        <span className={styles.rwQuote} aria-hidden="true">&#8220;</span>
        <Stars n={review.rating || 5} />
      </div>
      <p className={styles.rwText}>{renderText(review.text)}</p>
      <div className={styles.rwCardFoot}>
        <span className={styles.rwAvatar}>
          {review.avatar ? (
            <img
              src={review.avatar}
              alt={review.name}
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          ) : (
            initialsOf(review.name)
          )}
        </span>
        <span className={styles.rwWho}>
          <strong>{review.name}</strong>
          <span className={styles.rwRole}>
            {review.role}
            {review.source === "google" && <span className={styles.rwGBadge}>G</span>}
          </span>
        </span>
      </div>
    </article>
  );
}

function ReviewsWall({ current = [] }) {
  const [google, setGoogle] = useState([]);
  const [gMeta, setGMeta] = useState({ rating: null, total: null });

  useEffect(() => {
    let alive = true;
    fetch("/api/google-reviews")
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        setGoogle(Array.isArray(d.reviews) ? d.reviews : []);
        setGMeta({ rating: d.rating, total: d.total });
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  // Use live Google reviews when configured/available; otherwise fall back to
  // the curated real Google reviews.
  const googleData = google.length ? google : staticGoogleReviews;

  // Merge: current (prop, from the home API) + curated current + Google, deduped.
  const all = useMemo(() => {
    const fromProp = (current || [])
      .map((t, i) => ({
        id: t.id || `p-${i}`,
        name: t.name,
        role: t.designation || t.role || "Verified Buyer",
        text: t.description || t.text,
        rating: 5,
        avatar: "",
        source: "inframantra",
      }))
      .filter((r) => r.text);

    const seen = new Set();
    const merged = [];
    [...currentReviews, ...googleData, ...fromProp].forEach((r) => {
      if (!r || !r.text) return;
      // Safety net: the testimonials wall only features strongly-positive
      // reviews (4★+). The honest aggregate rating/count still comes from
      // Google (gMeta) and is shown as-is.
      if ((r.rating ?? 5) < 4) return;
      const k = (r.source + "|" + String(r.name) + "|" + String(r.text).slice(0, 60)).toLowerCase();
      if (seen.has(k)) return;
      seen.add(k);
      merged.push(r);
    });
    return merged;
  }, [current, googleData]);

  // Distribute round-robin into two marquee columns.
  const columns = useMemo(() => {
    const cols = [[], []];
    all.forEach((r, i) => cols[i % 2].push(r));
    return cols;
  }, [all]);

  const ratingValue = gMeta.rating || 4.4;
  const ratingText = ratingValue.toFixed(1);
  const totalText = gMeta.total ? `${gMeta.total}+` : "2,493+";

  return (
    <section className={styles.rwWall}>
      <div className={styles.rwInner}>
        {/* Left info panel */}
        <div className={styles.rwLeft}>
          <span className={styles.rwEyebrow}>Testimonials</span>
          <h2 className={styles.rwHeading}>
            3500+ Homebuyers Rely on <span>Inframantra</span>
          </h2>
          <div className={styles.rwRatingRow}>
            <RatingStars value={ratingValue} />
            <span className={styles.rwRatingText}>
              Rated <strong>{ratingText}</strong> by verified buyers
            </span>
          </div>
          <div className={styles.rwBadges}>
            <span className={styles.rwBadge}>
              <span className={styles.rwGBadge}>G</span> {ratingText} on Google
            </span>
            <span className={styles.rwBadge}>
              {gMeta.total ? `${gMeta.total}+ Google Reviews` : "Verified Google Reviews"}
            </span>
            <span className={styles.rwBadge}>RERA Approved</span>
            <span className={styles.rwBadge}>9+ Years</span>
          </div>
          <Link href="/testimonials">
            <a className={styles.rwCta}>Read all reviews &#8594;</a>
          </Link>
        </div>

        {/* Right animated marquee columns */}
        <div className={styles.rwColumns}>
          {columns.map((col, ci) => (
            <div
              key={ci}
              className={`${styles.rwColumn} ${ci % 2 ? styles.rwColDown : ""}`}
            >
              <div className={styles.rwTrack}>
                {[...col, ...col].map((r, i) => (
                  <ReviewCard key={`${ci}-${i}-${r.id}`} review={r} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ReviewsWall;
