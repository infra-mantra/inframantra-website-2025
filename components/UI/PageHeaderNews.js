import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Section from './Section';
import Share from '../../pages/share';
import PropertyContact from '../newComponents/propertyData/propertyHeader/propertyHeaderContact';
import styles from './pageHeader.module.css';


const formatDate = (dateString) => {
  const [day, month, year] = dateString.split('/');
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  return `${monthNames[parseInt(month, 10) - 1]} ${day} ${year}`;
};

const PageHeader = ({ data }) => {
  const { image, title, date, detailContent } = data;
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const updateIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    updateIsDesktop();

    window.addEventListener('resize', updateIsDesktop);

    return () => {
      window.removeEventListener('resize', updateIsDesktop);
    };
  }, []);

  return (
    <Section classes="" id="" pageWidth="fluid">
      <div className={styles.blogBannerContent}>
        {isDesktop ? (
          // Desktop Layout
          <div style={{ display: 'flex', gap: '67px', marginLeft: '2rem' }}>
            <div>
            <picture className={styles.blogHeaderImageContainerNews}>
              <img
                src={image}
                alt="Banner"
                width={800}
                height={450}
                style={{
                  objectFit: 'cover',
                  width: '100%',
                  height: 'auto',
                }}
                  className={styles.blogHeaderImageNews}

                priority
              />
              </picture>
              <p
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {title}
              </p>
            </div>
            <div style={{width:'100%'}}>
              <PropertyContact name="display" />
            </div>
          </div>
        ) : (
          // Mobile Layout
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              marginLeft: '1rem',
              marginRight: '1rem',
            }}
            className={styles.responsiveBannerContainerNews}
          >
            <div>
              <Image
                src={image}
                alt="Banner"
                width={800}
                height={450}
                style={{
                  objectFit: 'cover',
                  width: '100%',
                  height: 'auto',
                }}
                priority
              />
              <p
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                }}
              >
                {title}
              </p>
            </div>
          </div>
        )}

        <div className={styles.pageWidth}>
          <p className={styles.date}>{formatDate(date)}</p>
          <h1>{title}</h1>
          <div className={styles.blogDivider}></div>
          <Share className={styles.shareSection} content={detailContent} />
        </div>
      </div>
    </Section>
  );
};

export default PageHeader;
