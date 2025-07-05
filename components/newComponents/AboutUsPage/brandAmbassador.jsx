import React from 'react';
import styles from './brandAmbassador.module.css';
function BrandAmbassador() {
  return (
    <div className={styles.brandAmbassadorWrapper}>
      <h4>MEET OUR BRAND AMBASSADOR</h4>
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
            InfraMantra is proud to announce that we have signed the musical
            sensation, Mr. Guru Randhawa as our new face. We welcome Mr.
            Randhawa in the family with trust and loyalty in its core. Guru’s
            excellence and forward thinking aligns with InfraMantra visions and goals, which is to make
            home buying simple and transparent.
          </p>
        </div>
      </div>
    </div>
  );
}

export default BrandAmbassador;
