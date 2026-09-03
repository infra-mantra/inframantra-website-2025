import React, { useState, useEffect } from "react";
import Image from "next/image";
import Section from "./Section.jsx";
import Share from "../../pages/share.js";
import PropertyContact from "../property-detail/PropertyHeaderContact.jsx";
import styles from "./PageHeader.module.css";

const formatDate = (dateString) => {
  const [day, month, year] = dateString.split("/");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${monthNames[parseInt(month, 10) - 1]} ${day} ${year}`;
};

const PageHeader = ({ data }) => {
  const { image, title, date, detailContent } = data;
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const updateIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    updateIsDesktop();

    window.addEventListener("resize", updateIsDesktop);

    return () => {
      window.removeEventListener("resize", updateIsDesktop);
    };
  }, []);

  return (
    <Section classes="" id="" pageWidth="fluid">
      <div className={styles.blogBannerContent}>
        {isDesktop ? (
          <div className={styles.blogBannerRow}>
            <div className={styles.blogImageWrapper}>
              <picture className={styles.blogHeaderImageContainerNews}>
                <img src={image} alt="Banner" className={styles.blogHeaderImageNews} />
              </picture>

              <p className={styles.blogTitle}>{title}</p>
            </div>

            <div className={styles.blogFormWrapper}>
              <PropertyContact name="display" />
            </div>
          </div>
        ) : (
          <div className={styles.responsiveBannerContainerNews}>
            <div>
              <Image
                src={image}
                alt="Banner"
                width={800}
                height={450}
                className={styles.blogHeaderImageNews}
                priority
              />

              <p className={styles.blogTitle}>{title}</p>
            </div>
          </div>
        )}

        <div className={styles.pageWidth}>
          <p className={styles.date}>{formatDate(date)}</p>
          <h1>{title}</h1>
          <div className={styles.blogDivider}></div>
          <Share className={styles.shareSection} content={detailContent} />
        </div>
      </div>
    </Section>
  );
};

export default PageHeader;
