import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // Replaces navigate from react-router-dom
import styles from '../service.module.css'; // Assuming you have a CSS module for styles

const serviceCardStyles = {
  paper: {
    height: '45%',
    width: '90%',
    borderRadius: '20px',
    background: '#FFF7E9',
    marginBottom: '10%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    cursor: 'pointer',
    // Note: media queries inside JS objects don’t apply unless you use a CSS-in-JS library
  },
  icon: {
    color: 'white',
    fontSize: '200%',
  },
};

function ServicesCard({ title, Icon, description, key, id, alt }) {
  const router = useRouter();
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkScreenWidth();
    window.addEventListener('resize', checkScreenWidth);

    return () => {
      window.removeEventListener('resize', checkScreenWidth);
    };
  }, []);

  const truncateDescription = (text) => {
    const parts = text.split('.');
    return parts[0] + '.';
  };

  const handleCardClick = () => {
    router.push(`/our-services#${title.replace(/\s+/g, '-')}`);
  };

  return (
    <div
      id={id}
      key={key}
      style={serviceCardStyles.paper}
      className="serviceCard"
      onClick={handleCardClick}
    >
      <div className={styles.serviceCardIconContainer}>
        <div className={styles.serviceCardIconWrapper}>
          <img src={Icon} alt={alt} />
        </div>
      </div>
      <div className={styles.serviceCardTitleContainer}>
        <p className={styles.serviceCardTitle}>{title}</p>
      </div>
      <div className={styles.serviceCardDescriptionContainer}>
        <p className={styles.serviceCardDescription}>
          {isDesktop ? description : truncateDescription(description)}
        </p>
      </div>
    </div>
  );
}

export default ServicesCard;
