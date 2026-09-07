import React from "react";
import ServicesCard from "./ServicesCard.jsx";
import serviceCardDataSection from "./serviceSectionData.js";
import { useRouter } from "next/router.js";
import styles from "./Service.module.css";

function ServicesSection() {
  const router = useRouter();

  return (
    <div className={styles.servicesSectionWrapper}>
      <div className={styles.servicesSectionHeader}>
        <h3 className={styles.servicesSectionTitle}>
          Your Home, <span>Our Hustle</span>
        </h3>
        <p>We simplify your property journey with expert support at every step.</p>
      </div>
      <div className={styles.servicesSectionCardWrapperFirst}>
        {serviceCardDataSection.map((service, index) => (
          <ServicesCard
            key={service.title}
            title={service.title}
            Icon={service.icon}
            description={service.description}
            alt={service.alt}
            id={service.title.replace(/\s+/g, "-")}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

export default ServicesSection;
