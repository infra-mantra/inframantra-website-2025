import React from 'react';
import styles from './about.module.css';
import RegistrationForm from '../events/RegistrationForm';

function AboutSection() {
  return (
    <section id="about" className={styles.aboutSection}>
      <div className={`${styles.container} ${styles.aboutContent}`}>

        {/* LEFT */}
        <div className={styles.aboutLeft}>
          <div className={styles.displayMobile}>
          <RegistrationForm name="USA EXPO" />
            </div>
          <div className={styles.sectionHead}>
         
            <div>
              <span>Trusted by Investors</span>
            </div>
            <h2>About Gurgaon </h2>
          </div>

          <div className={styles.aboutDetails}>
            <p>
             One of India’s leading corporate and real estate destinations, Gurgaon is home to numerous Fortune 500 companies offering a dynamic ecosystem driven by global business activity. The city features world-class infrastructure, premium residential communities, and modern urban planning. 
            </p>

            <p>
              With strong rental demand and consistent appreciation, Gurgaon presents a highly attractive opportunity for investors and home-buyers.
            </p>

          
          </div>
        </div>

        {/* RIGHT */}
        <div className={styles.aboutRight}>
          <div className={styles.aboutItem}>
            <img src="./nripage/icon-1.svg" alt="Icon" />
            {/* <h3>Over 76,000</h3> */}
            <p>Corporate Hub </p>
          </div>

          <div className={styles.aboutItem}>
             <img src="./nripage/icon-3.svg" alt="Icon" />
            
            {/* <h3>More than 43,500</h3> */}
            <p>High ROI Potential</p>
          </div>

          <div className={styles.aboutItem}>
           <img src="./nripage/icon-2.svg" alt="Icon" />
            {/* <h3>36+ Markets</h3> */}
            <p>World-Class Infrastructure
</p>
          </div>

          <div className={styles.aboutItem}>
            <img src="./nripage/icon-4.svg" alt="Icon" />
            {/* <h3>62 New Projects</h3>     */}
            <p>Strategic Connectivity
</p>
          </div>
        </div>


      </div>
    </section>
  );
}

export default AboutSection;