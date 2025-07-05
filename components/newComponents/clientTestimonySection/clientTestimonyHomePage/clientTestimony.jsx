import React, {useState, useEffect} from 'react';
import styles from './clientTestimony.module.css';

const iconStyle = {
  quoteIcon: {
    transform: 'rotate(180deg)',
    transition: 'transform 0.3s',
    color: '#000',
    marginRight: '10px',
    fontSize: '40px',
  },
  stars: {
    marginTop: '10px',
    color: '#e0a800'
  },
  starsMobile: {
    color: '#ffff',
  },
  quoteIconMobile: {
    transform: 'rotate(180deg)',
    transition: 'transform 0.3s',
    color: '#000',
    fontSize: '30px',
  },
};

function ClientTestimony({ name, testimony, img }) {
  const [isDesktop, setIsDesktop] = useState(true);
  const [isMobile, setIsMobile] = useState(true);

  const checkScreenWidth = () => {
    setIsDesktop(window.innerWidth >= 769);
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    checkScreenWidth();
    window.addEventListener('resize', checkScreenWidth);

    return () => {
      window.removeEventListener('resize', checkScreenWidth);
    };
  }, []);

  const renderStars = () => {
    const starCount = 5;
    return Array.from({ length: starCount }, (_, i) => (
      <span key={i} className={styles.star}>&#9733;</span>
    ));
  };

  return (
    <div className={styles.clientTestimonyCardWrapper}>
      {isDesktop && (
        <>
          <div className={styles.clientTestimonyCardHeader}>
            <p className={styles.clientTestimonyName}>{name}</p>
            <div className={styles.stars} style={iconStyle.stars}>
              {renderStars()}
            </div>
          </div>
          <div className={styles.clientTestimonyCardContainer}>
            <img
              src={img}
              alt="testimonyFace"
              className={styles.clientTestimonyCardFace}
            />
            <div className={styles.clientTestimonyCardTextPseudoFlex}></div>
            <div className={styles.clientTestimonyCardTextFlex}>
              <span className={styles.quoteIcon} style={iconStyle.quoteIcon}>&#8220;</span>
              <p className={styles.clientTestimonyCardText}>{testimony}</p>
            </div>
          </div>
        </>
      )}
      {!isDesktop && (
        <div className={styles.clientTestimonyCardContainer}>
          <img
            src={img}
            alt="testimonyFace"
            className={styles.clientTestimonyCardFace}
          />
          <div className={styles.clientTestimonyCardMobileFlex}>
            <div className={styles.starsMobile} style={iconStyle.starsMobile}>
              {renderStars()}
            </div>
            <p className={styles.clientTestimonyName}>{name}</p>
            <p className={styles.clientTestimonyCardText}>
              <span className={styles.quoteIconMobile} style={iconStyle.quoteIconMobile}>
                &#8220;
              </span>
              {testimony}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientTestimony;
