import React from "react";
// import './testimonialsCard.css'
import styles from "./testimonialsCard.module.css"; // CSS Module import
const testimonialCardStyles = {
  paper: {
    height: "274px",
    width: "85%",
    borderRadius: "20px",
    background: "rgba(237, 192, 107, 0.26)",
    marginBottom: "5%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    padding: "20px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    "@media (max-width:768px)": {
      width: "74%",
      height: "auto",
      margin: "10px auto",
      boxShadow: "0px 1.411px 3.175px 0px rgba(0, 0, 0, 0.25)",
    },
  },
  rating: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#E4A951",
    fontFamily: "Lexend Deca",
    "@media (max-width:768px)": {
      fontSize: "150%",
    },
  },
  quoteIcon: {
    color: "#E4A951",
    fontSize: "2rem",
    marginBottom: "10px",
  },
  text: {
    marginTop: "10px",
    // textAlign: "center",
  },
  name: {
    textAlign: "left",
    // fontWeight: "bold",
  },
}


function TestimonialCard({ data }) {
  const rating = "5";

  return (
    <div className={styles.testimonialsContainerCard}>
      <div className={styles.testimonialCardNameContainer}>
        <h6 className={`${styles.testimonialCardName} ${styles.testimonialCardNameContainerh6}`} style={testimonialCardStyles.name}>{data.name}</h6>
      </div>
      <div className={styles.testimonialCardRatingContainer}>
        <div className={styles.testimonialsCardRatingSpan}>
          {"★".repeat(rating)}
          {"☆".repeat(5 - rating)}
        </div>
      </div>
      <div className={styles.testimonialCardTextContainer}>
        <span className={styles.testimonialCardQuoteIcon}>“</span>
        <p style={testimonialCardStyles.text}>{data.description}</p>
      </div>
    </div>
  );
}

export default TestimonialCard;
