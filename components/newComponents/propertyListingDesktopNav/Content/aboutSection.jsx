import React, { useState } from 'react';
import styles from './aboutSection.module.css';

function AboutSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <>
      <h2 className={styles.headerAbout}>Properties in Haryana</h2>
      <p className={styles.pageNumberAbout}>Showing 1 - 10 of 30 properties</p>

      <div className={styles.contentWrapper}>
        <p
          className={`${styles.aboutSection} ${
            isExpanded ? styles.expanded : styles.collapsed
          }`}
        >
          Haryana is one of India’s fastest-growing real estate destinations, combining
          excellent connectivity with rapid infrastructure development. From luxury apartments
          and commercial spaces in Gurugram and Faridabad to affordable housing and plots in
          Sonipat, Panipat, and Karnal, the state offers diverse property options. Its proximity
          to Delhi, expanding metro network, and projects like the Delhi–Mumbai Expressway are
          driving demand, making Haryana a prime choice for investors and homebuyers seeking
          growth and long-term value.
        
        </p>
         <button className={styles.readMoreBtn} onClick={toggleReadMore}>
          {isExpanded ? 'Read Less' : 'Read More'}
        </button>

      
      </div>
    </>
  );
}

export default AboutSection;
