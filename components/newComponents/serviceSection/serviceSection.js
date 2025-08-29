import React from 'react';
import ServicesCard from './servicesCard/servicesCard.js';
import serviceCardDataSection from './serviceSectionData';
import { useRouter } from 'next/router.js';
import styles from './service.module.css';

function ServicesSection() {
  const router = useRouter();

  return (
    
    <div className={styles.servicesSectionWrapper}>
        <div className={styles.servicesSectionHeader}>
        <h3
          className={styles.servicesSectionTitle}
          
        >
        Your Home, Our Hustle
        </h3>
        <p>We simplify your property journey with expert support at every step.</p>
       
      </div>
      <div className={styles.servicesSectionCardWrapperFirst}>
        {serviceCardDataSection.map((service, index) => (
          <ServicesCard
            title={service.title}
            Icon={service.icon}
            description={service.description}
            alt={service.alt}
            id={service.title.replace(/\s+/g, '-')}
            index={index}
          />
        ))}
      </div>
     
    
    </div>
  );
}

export default ServicesSection;
