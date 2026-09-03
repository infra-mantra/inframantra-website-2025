import React from "react";
import styles from "./Calculators.module.css";

/* Simple numbered "how it works" strip — adds scannable, keyword-rich
   content to each calculator page (good for SEO and user trust). */
function HowItWorks({ heading = "How it works", steps = [] }) {
  if (!steps.length) return null;
  return (
    <section className={styles.howSection}>
      <h2 className={styles.howHeading}>{heading}</h2>
      <div className={styles.howGrid}>
        {steps.map((s, i) => (
          <div className={styles.howStep} key={i}>
            <span className={styles.howNum}>{i + 1}</span>
            <h3 className={styles.howStepTitle}>{s.title}</h3>
            <p className={styles.howStepText}>{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;
