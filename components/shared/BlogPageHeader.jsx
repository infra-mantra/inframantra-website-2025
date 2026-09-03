import NoImage from "./NoImage.jsx";
import Section from "./Section.jsx";
import Share from "../../pages/share.js";
import { useEffect, useState } from "react";
import styles from "./BlogHeader.module.css";

const PageHeader = (props) => {
  const {
    image,
    title,
    date,
    detailContent,
    thumbnail,
    imageAlt, // ✅ get imageAlt from props.data
  } = props.data;

  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    handleResize(); // Set on initial render
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Section classes={styles.blogPageHeader} id="" pageWidth="fluid">
      <div className={styles.blogHeaderContent}>
        {/* Title and Date */}
        <div className={styles.blogBannerContent}>
          <div className={styles.pageWidth}>
            <p className={styles.date}>{date}</p>
            <h1>{title}</h1>
            {/* Share Section */}
            <div className={styles.blogDivider}></div>
            <Share content={detailContent} />
          </div>
        </div>

        {image ? (
          <>
            <div>
              <picture className={styles.blogHeaderImageContainer}>
                <img
                  src={isDesktop ? image : thumbnail}
                  alt={imageAlt || title || "Blog Image"}
                  className={styles.blogHeaderImage}
                />
              </picture>
              <p
                className={styles.blogTitlep}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "1rem 21px",
                }}
              >
                {title}
              </p>
            </div>
          </>
        ) : (
          <NoImage />
        )}
      </div>
    </Section>
  );
};

export default PageHeader;
