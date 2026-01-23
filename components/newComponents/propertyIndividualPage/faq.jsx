import React, { useState } from 'react';
import styles from './faq.module.css';

function FaqSection({ propertyData }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqData = propertyData.faqs || [];


  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className={styles.faqSection}>
     {faqData.length > 0 &&  <h2 className={styles.faqHeading}>FREQUENTLY ASKED QUESTIONS</h2>}

      <div className={styles.faqContainer}>
        {faqData.map((item, index) => (
          <div
            key={index}
            className={`${styles.faqItem} ${activeIndex === index ? styles.active : ''}`}
            onClick={() => toggleFAQ(index)}
          >
            <div className={styles.faqQuestion}>
              <span className={styles.faqNumber}>
                {index + 1 < 10 ? `0${index + 1}` : index + 1}
              </span>
              <span className={styles.faqText}>{item.question}</span>
              <span className={styles.icon}>
                {activeIndex === index ? '-' : '+'}
              </span>
            </div>

            {activeIndex === index && (
              <div className={styles.faqAnswer}>{item.answer}</div>
            )}
          </div>
        ))}
      </div>

     {faqData.length > 0 &&<div className={styles.faqCta}>
        <div className={styles.faqCtaLeft}>
          <div className={styles.faqCtaIcon}>💬</div>
          <div>
            <h3>Still Have a Question??</h3>
            <p>Our Expert Team is here to help you with your additional question</p>
          </div>
        </div>

        <button className={styles.faqCtaButton}>
          📞 Contact Us
        </button>
      </div> }
    </section>
  );
}

export default FaqSection;
