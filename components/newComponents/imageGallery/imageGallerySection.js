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
          <span style={{ color: "#E7B554" }}>A Visual Experience</span>
        </h2>
      </div>
      <Masonry images={itemData} columns={isDesktop ? 3 : 2} gap={8} />
    </section>
  );
};

export default ImageGallerySection;

const itemData = [
  { img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/inframantra%202.4.avif", title: "Shweta Birthday, 2019" },
  { img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/2.avif", title: "2" },
  { img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/3.avif", title: "3" },
  { img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/4.avif", title: "4" },
  { img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/5.avif", title: "5" },
  { img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/6.avif", title: "6" },
  { img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/7.avif", title: "7" },
  { img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/8.avif", title: "8" },
  { img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/9.avif", title: "9" },
  { img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/10.avif", title: "10" },
  { img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/inframantra%202.9.avif", title: "11" },
  { img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/award%20.avif", title: "12" },
  { img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/13.avif", title: "13" },
  { img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/14.avif", title: "14" },
  { img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/15.avif", title: "15" },
  { img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/16.avif", title: "16" },
  { img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/17.avif", title: "17" },
  { img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/g-s%20copy.avif", title: "18" },
  { img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/GURU.avif", title: "19" },
  { img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/SOLO-SHIWANG-SIR.avif", title: "20" }
];
