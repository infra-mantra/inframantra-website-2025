import React, { useState } from 'react';
import styles from './faqSection.module.css';

const faqData = [
  {
    id: 1,
    question: 'Tu brand ki planning kaise karwe hai?',
    answer:
      'Arre bhai, hum agency mein milke tere brand ke liye strategy banate hain. Marketing aur design ke saare kaam hum handle karte hain.',
  },
  {
    id: 2,
    question: 'Tu marketing mein kime madad kare hai?',
    answer:
      'Haan bhai, hum marketing ke har pehlu mein madad karte hain, jaise social media, ads aur content creation.',
  },
  {
    id: 3,
    question: 'Design aur creative ka kaam kime hota hai?',
    answer:
      'Design ka kaam hum creatively karte hain, taaki tera brand alag dikhe aur customers ko attract kare.',
  },
  {
    id: 4,
    question: 'Brand strategy ka fayda ke hai?',
    answer:
      'Strategy se brand strong banta hai, aur customers ko tere products aur services samajh aate hain easily.',
  },
];

function FaqSection() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className={styles.faqSection}>
      <h2 className={styles.faqHeading}>FREQUENTLY ASKED QUESTIONS</h2>

      <div className={styles.faqContainer}>
        {faqData.map((item, index) => (
          <div
            key={item.id}
            className={`${styles.faqItem} ${
              activeIndex === index ? styles.active : ''
            }`}
            onClick={() => toggleFAQ(index)}
          >
            <div className={styles.faqQuestion}>
              <span className={styles.faqNumber}>
                {item.id < 10 ? `0${item.id}` : item.id}
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
    </section>
  );
}

export default FaqSection;
