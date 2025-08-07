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
  {
    img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/inframantra%202.4.avif",
    alt: "Shweta's Birthday Celebration, 2019"
  },
  {
    img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/2.avif",
    alt: "Office team group photo with certificates"
  },
  {
    img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/3.avif",
    alt: "Inframantra team annual party photo"
  },
  {
    img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/4.avif",
    alt: "Award ceremony at Inframantra office"
  },
  {
    img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/5.avif",
    alt: "Colleagues at project site visit"
  },
  {
    img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/6.avif",
    alt: "Team discussion in conference room"
  },
  {
    img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/7.avif",
    alt: "Client meeting at Inframantra office"
  },
  {
    img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/8.avif",
    alt: "Employee appreciation ceremony"
  },
  {
    img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/9.avif",
    alt: "Office workspace with team members"
  },
  {
    img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/10.avif",
    alt: "Outdoor team-building event"
  },
  {
    img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/inframantra%202.9.avif",
    alt: "Inframantra awards wall photo"
  },
  {
    img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/award%20.avif",
    alt: "Award recognition by leadership"
  },
  {
    img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/13.avif",
    alt: "Festive decoration at office"
  },
  {
    img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/14.avif",
    alt: "Team posing in traditional attire"
  },
  {
    img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/15.avif",
    alt: "New year office celebration"
  },
  {
    img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/16.avif",
    alt: "Leadership panel at seminar"
  },
  {
    img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/17.avif",
    alt: "Staff working at their desks"
  },
  {
    img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/g-s%20copy.avif",
    alt: "CEO with leadership team"
  },
  {
    img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/GURU.avif",
    alt: "Guruji blessing the Inframantra team"
  },
  {
    img: "https://inframantra.blr1.cdn.digitaloceanspaces.com/homePageImageGallery/SOLO-SHIWANG-SIR.avif",
    alt: "Shiwang Sir speaking at event"
  }
];
