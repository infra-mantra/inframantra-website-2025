import React, { useState } from "react";
import styles from "./Faq.module.css";

function FaqSection({ faq }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqData = faq || [];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className={styles.faqSection}>
      {faqData.length > 0 && <h2 className={styles.faqHeading}>FREQUENTLY ASKED QUESTIONS</h2>}

      <div className={styles.faqContainer}>
        {faqData.map((item, index) => (
          <div
            key={index}
            className={`${styles.faqItem} ${activeIndex === index ? styles.active : ""}`}
            onClick={() => toggleFAQ(index)}
          >
            <div className={styles.faqQuestion}>
              <span className={styles.faqNumber}>
                {index + 1 < 10 ? `0${index + 1}` : index + 1}
              </span>
              <span className={styles.faqText}>{item.question}</span>
              <span className={styles.icon}>{activeIndex === index ? "-" : "+"}</span>
            </div>

            {activeIndex === index && <div className={styles.faqAnswer}>{item.answer}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}

export default FaqSection;
