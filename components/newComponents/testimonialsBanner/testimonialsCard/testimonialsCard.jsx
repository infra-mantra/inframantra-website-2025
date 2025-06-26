import React from "react";
import styles from "./testimonialsCard.module.css"; // CSS Module import

function TestimonialCard({ data }) {
  const rating = "5";

  return (
    <div className={styles.testimonialsContainerCard}>
      <div className={styles.testimonialCardNameContainer}>
        <h6 className="testimonialCardName">{data.name}</h6>
      </div>
      <div className={styles.testimonialCardRatingContainer}>
        <div className="testimonialsCardRatingSpan">
          {"★".repeat(rating)}
          {"☆".repeat(5 - rating)}
        </div>
      </div>
      <div className={styles.testimonialCardTextContainer}>
        <span className={styles.testimonialCardQuoteIcon}>“</span>
        <p>{data.description}</p>
      </div>
    </div>
  );
}

export default TestimonialCard;
