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
          Frames of Excellence{" "}
        </h2>
         <p style={{ color: "#000000ff" }}>Where vision meets reality at Inframantra</p>
      </div>
      <div className={styles.imageWrapperFlex}>
      <Masonry images={itemData} columns={isDesktop ? 2 : 2} gap={8} />
      </div>
    </section>
  );
};

export default ImageGallerySection;

const itemData = [
  {
    img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/IMG_2514-min.webp",
    alt: "Shweta's Birthday Celebration, 2019"
  },
  {
    img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/IMG_4972-min.webp",
    alt: "Award recognition by leadership"
  },
  {
    img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/IMG_5639-min.webp",
    alt: "Festive decoration at office"
  },
  {
    img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/2.avif",
    alt: "Office team group photo with certificates"
  }
];
