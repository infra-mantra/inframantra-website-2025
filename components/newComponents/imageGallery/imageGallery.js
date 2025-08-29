import React, { useState, useEffect } from "react";
import ImageGallery from "./imageGallery.js";
import Masonry from "./masonryGallery.jsx";
import styles from "./imageGallerySection.module.css";

const ImageGallerySection = () => {
  const [isDesktop, setIsDesktop] = useState(true);
  const [isMobile, setIsMobile] = useState(true);

  const checkScreenWidth = () => {
    setIsDesktop(window.innerWidth >= 769);
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);

    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  return (
    <section className={styles.imageGallerySectionContainer}>
      <div className={styles.imageGalleryHeaderFlex}>
        <h2 className={styles.imageGalleryContainerHeader}>
          Our Legacy & Your Future:{" "}
        </h2>
          <p style={{ color: "#E7B554" }}>A Visual Experience</p>
      </div>
      <Masonry images={itemData} columns={isDesktop ? 3 : 2} gap={8} />
    </section>
  );
};

export default ImageGallerySection;

const itemData = [
  { img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/inframantra%202.4.avif", title: "Shweta Birthday, 2019" },
  { img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/2.avif", title: "2" },
  { img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/award%20.avif", title: "12" },
  { img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/13.avif", title: "13" },
  
]



  
