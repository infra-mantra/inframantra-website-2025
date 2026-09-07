import React, { useState, useEffect } from "react";
import { useRouter } from "next/router"; // Replaces navigate from react-router-dom
import styles from "./Service.module.css"; // Assuming you have a CSS module for styles

function ServicesCard({ title, Icon, description, id, alt, index }) {
  const router = useRouter();
  const [isDesktop, setIsDesktop] = useState(true);
  // console.log("##########",key,index)

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);

    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  const truncateDescription = (text) => {
    const parts = text.split(".");
    return parts[0] + ".";
  };

  const handleCardClick = () => {
    router.push(`/our-services#${title.replace(/\s+/g, "-")}`);
  };

  return (
    <div
      id={id}
      className={`serviceCard order${index}`}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
      role="link"
      tabIndex={0}
    >
      <div className={styles.serviceCardHeaderRow}>
        <div className={styles.serviceCardIconContainer}>
          <div className={styles.serviceCardIconWrapper}>
            {/* These cards sit below the fold, but the section renders as soon as its
                chunk arrives, so the icons were fetching eagerly against the LCP hero.
                One of them (SitevisitsHome.svg) is 166 KB. */}
            <img src={Icon} alt={alt} loading="lazy" decoding="async" width="56" height="56" />
          </div>
        </div>
        <div className={styles.serviceCardTitleContainer}>
          <p className={styles.serviceCardTitle}>{title}</p>
        </div>
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
