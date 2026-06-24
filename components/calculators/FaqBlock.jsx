import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import styles from "./calculators.module.css";

/* Animated FAQ accordion. Answers stay in the DOM (collapsed via max-height)
   so the text remains crawlable and stays in sync with the FAQPage JSON-LD
   passed to <Wrapper faq={...}>. First item is open by default. */
function FaqBlock({ faqs, heading = "Frequently Asked Questions" }) {
  const [openIndex, setOpenIndex] = useState(0);

  if (!faqs || faqs.length === 0) return null;

  const toggle = (i) => setOpenIndex((cur) => (cur === i ? -1 : i));

  return (
    <section className={styles.faqSection}>
      <h2 className={styles.faqHeading}>{heading}</h2>
      {faqs.map((f, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            className={`${styles.faqItem} ${isOpen ? styles.faqOpen : ""}`}
            key={i}
          >
            <button
              type="button"
              className={styles.faqQ}
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
            >
              <span>{f.question}</span>
              <FiChevronDown className={styles.faqChevron} />
            </button>
            <div className={styles.faqAnswerWrap} aria-hidden={!isOpen}>
              <p className={styles.faqA}>{f.answer}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
}

export default FaqBlock;
