import React from 'react';
import styles from './aboutUs.module.css';

function MeetOwners() {
  return (
    <div className={styles.meetOwnersWrapper}>
      <h2>The Minds Behind INFRAMANTRA</h2>
      <div className={styles.meetOwnersContentFlex}>
        <div className={styles.meetOwnersContentImgWrapper}>
          {/* className={styles.meetOwnersContentImg" */}
          <div className={styles.meetOwnersContentImg}>
            <img
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/aboutUsPage/shiwangSolo.avif"
              alt="Shiwang Suraj"
            />
            <span></span>
          </div>
        </div>
        <div className={styles.meetOwnersContentDescriptionFlex}>
          <h4 className={styles.meetOwnersContentHeader}>Shiwang Suraj</h4>
          <p className={styles.meetOwnersContentSubHeader}>Founder & Director</p>
          <p className={styles.meetOwnersContentDescription}>
            <span
              style={{ color: '#0B8C27', fontSize: '20px', fontWeight: '800' }}
            >
              Shiwang Suraj
            </span>
            , With a career spanning over 10 years across multiple industries, Shiwang Suraj 
            has contributed to several reputed companies through his constructive approach in 
            sales, operations, and marketing. He began his entrepreneurial journey in 2015 as 
            the Co-founder of Zapplon, with the goal of bringing a new dimension to the transport 
            industry and delivering added value to companies through this initiative. 
            His entrepreneurial spirit shone once again in 2017 when he founded another 
            successful venture, InfraMantra India Pvt. Ltd., specializing in the real estate market.
          </p>
        </div>
      </div>
      <div className={`${styles.meetOwnersContentFlex} ${styles.secondOwnerContent}`}>
        <div className={`${styles.meetOwnersContentDescriptionFlex} ${styles.secondSectionDescriptionFlex}`}>
          <h4 className={styles.meetOwnersContentHeader} style={{ marginLeft: '15%' }}>
            Garvit Tiwari
          </h4>
          <p className={styles.meetOwnersContentSubHeader}>Co-Founder & Director</p>
          <p className={styles.meetOwnersContentDescription}>
            <span
              style={{ color: '#0B8C27', fontSize: '20px', fontWeight: '800' }}
            >
              Garvit Tiwari
            </span>
            , with over 14 years of experience in the banking and finance industries and 
            a Gold Medal in IT, has made significant contributions to several renowned companies 
            through his expertise in finance, marketing, and information technology. He has worked 
            with major banks, including HDFC Bank, IndusInd Bank, Yes Bank, and Kotak Bank,
             strengthening their corporate banking, wealth management, and division management
              functions. In 2017, Garvit embarked on his entrepreneurial journey by co-founding 
              InfraMantra India Pvt. Ltd., a successful company specializing in the real estate market.
          </p>
        </div>
        <div className={styles.meetOwnersContentImgWrapper}>
          <div className={`${styles.meetOwnersContentImg} ${styles.secondSectionImg}`}>
            <img
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/aboutUsPage/garvitSolo.avif"
              alt="Garvit Tiwari"
            />
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MeetOwners;
