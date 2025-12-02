import React from 'react';
// import './aboutUsPage.css';
import styles  from './aboutUs.module.css'
function CoreValues() {
  return (
    <div className={styles.coreValuesWrapper}>
      <h2>Core Values</h2>
      <div className={styles.coreValuesContentGrid}>
        <div className={styles.coreValuesContentGridItem}>
          <h2>01</h2>
          <h4>Client Centric</h4>
          <p>
           Clients come first. We prioritise their needs, ensuring personalised real 
           estate experiences that exceed expectations, making their dreams a reality. 
          </p>
        </div>
        <div className={styles.coreValuesContentGridItem}>
          <h2 style={{ color: 'black' }}>02</h2>
          <h4>Integrity, Simplicity and Transparency</h4>
          <p>
          At INFRAMANTRA, we value honesty, simplicity & transparency. We build trust by being truthful, 
          simplify real estate and ensure clear communication with no hidden costs.
          </p>
        </div>
        <div class={styles.coreValuesContentGridItem}>
          <h2 style={{ color: 'black' }}>03</h2>
          <h4>Respect for People</h4>
          <p>
       We treat everyone with dignity. We listen to our clients, value their opinions 
       and prioritise their needs, fostering trust and lasting relationships. 
          </p>
        </div>
        <div class={styles.coreValuesContentGridItem}>
          <h2>04</h2>
          <h4>Process Oriented</h4>
          <p>
    Our method ensures each step is smooth and clear, building trust and delivering 
    excellence throughout the process.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CoreValues;
