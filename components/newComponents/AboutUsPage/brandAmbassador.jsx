import React from 'react';
import styles from './brandAmbassador.module.css';
function BrandAmbassador() {
  return (
    <div className={styles.brandAmbassadorWrapper}>
      <h4>OUR BRAND AMBASSADOR</h4>
     
      <div className={styles.brandAmbassadorContentWrapper}>
        <div className={styles.brandAmbassadorImageWrapper}>
          <img
            src="https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/guruContactPage.png"
            alt=""
          />
          <p className={styles.brandAmbassadorName}>Guru Randhawa</p>
          <p className={styles.brandAmbassadorSubHeader}>Musical Superstar</p>
        </div>
        <div className={styles.brandAmbassadorDescriptionWrapper}>
          <p>
            Inframantra is honoured to have global music icon Guru Randhawa as our Brand Ambassador, 
            strengthening our brand’s presence and credibility.


          </p>
        </div>
      </div>
    </div>
  );
}

export default BrandAmbassador;



