import React from "react";
import styles from "./WhyInvest.module.css";

const TaxFreeIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="8.5" />
    <path d="M9 10h3v4" />
    <line x1="9" y1="14" x2="12" y2="14" />
    <line x1="8" y1="17" x2="16" y2="17" />
  </svg>
);

const HighROIIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="3" width="16" height="18" rx="1" />
    <line x1="8" y1="8" x2="16" y2="8" />
    <line x1="8" y1="12" x2="16" y2="12" />
    <line x1="8" y1="16" x2="12" y2="16" />
    <path d="M14 15l2-2 2 2" />
  </svg>
);

const InfrastructureIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="4" />
    <path d="M6 20v-1a6 6 0 0 1 12 0v1" />
    <circle cx="18" cy="8" r="3" />
    <path d="M21 20v-1a5 5 0 0 0-3-4.6" />
  </svg>
);

const cards = [
  {
    icon: <TaxFreeIcon />,
    title: "Expert Guidance",
    description:
      "Receive personalized consultancy and expert insights that help you confidently identify and select the right investment opportunities. ",
  },
  {
    icon: <HighROIIcon />,
    title: "Strong Developer Network ",
    description:
      "Access the best projects with complete transparency and reliable details. Enjoy better deals, timely updates, and smoother communication.",
  },
  {
    icon: <InfrastructureIcon />,
    title: "End-to-End Assistance ",
    description:
      "From virtual site visits to seamless documentation, key handover to post-sales assistance, every step is handled seamlessly for a hassle-free experience.",
  },
];

const WhyInvest = ({ name }) => {
  return (
    <div className={styles.bgColor}>
      <section className={styles.sectionWhy}>
        <p className={styles.label}>Opportunity Awaits</p>
        <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
          <h2 className={styles.heading}>Why Invest with Inframantra?</h2>
        </div>

        <div className={styles.cardsGrid}>
          {cards.map((card, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.iconWrapper}>{card.icon}</div>
                <h3 className={styles.cardTitle}>{card.title}</h3>
              </div>
              <p className={styles.cardDescription}>{card.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default WhyInvest;
