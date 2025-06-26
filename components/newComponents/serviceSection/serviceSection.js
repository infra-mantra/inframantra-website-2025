import React from 'react';
import ServicesCard from './servicesCard/servicesCard.js';
import {
  serviceCardDataFirstSection,
  serviceCardDataSecondSection,
} from './serviceSectionData';
import { useRouter } from 'next/router.js';
import styles from './service.module.css';

function ServicesSection() {
  const router = useRouter();

  return (
    <div className={styles.servicesSectionWrapper}>
      <div className={styles.servicesSectionCardWrapperFirst}>
        {serviceCardDataFirstSection.map((service, index) => (
          <ServicesCard
            title={service.title}
            Icon={service.icon}
            description={service.description}
            key={index}
            alt={service.alt}
            id={service.title.replace(/\s+/g, '-')}
          />
        ))}
      </div>
      <div className={styles.servicesSectionCardWrapperSecond}>
        {serviceCardDataSecondSection.map((service, index) => (
          <ServicesCard
            title={service.title}
            Icon={service.icon}
            description={service.description}
            key={index}
            alt={service.alt}
            id={service.title.replace(/\s+/g, '-')}
          />
        ))}
      </div>
      <div className={styles.servicesSectionHeader}>
        <h3
          className={styles.servicesSectionTitle}
          onClick={() => router.push('/our-services')}
        >
          Our Services
        </h3>
        <hr className={styles.servicesSectionTitleUnderline} />
      </div>
    </div>
  );
}

export default ServicesSection;
