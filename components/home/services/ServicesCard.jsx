import React, { useState, useEffect } from "react";
import { useRouter } from "next/router"; // Replaces navigate from react-router-dom
import styles from "./Service.module.css"; // Assuming you have a CSS module for styles

const serviceCardStyles = {
  paper: {
    width: "100%",
    borderRadius: "10px",
    padding: "22px",
    background: "#ffffffff",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-evenly",
    cursor: "pointer",
    gap: "15px",
    // Note: media queries inside JS objects don’t apply unless you use a CSS-in-JS library
  },
  icon: {
    color: "white",
    fontSize: "200%",
  },
};

function ServicesCard({ title, Icon, description, key, id, alt, index }) {
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
      key={index}
      style={serviceCardStyles.paper}
      className={`serviceCard order${index}`}
      onClick={handleCardClick}
    >
      <div className={styles.serviceCardHeaderRow}>
        <div className={styles.serviceCardIconContainer}>
          <div className={styles.serviceCardIconWrapper}>
            <img src={Icon} alt={alt} />
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
