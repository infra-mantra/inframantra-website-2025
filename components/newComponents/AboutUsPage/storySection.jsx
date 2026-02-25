"use client";

import React, { useState } from "react";
import styles from "../AboutUsPage/aboutUs.module.css";
import RightSlideModal from "../propertyIndividualPage/modal";

const StorySection = ({
  title,
  image,
  shortContent,
  fullContent,
  modalTitle,
  showReadMore = true,
  maxHeight = "300px",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className={styles.storyContainer}>
        <h2 className={styles.headingTitlemobile}>{title}</h2>

        <div className={styles.storyImage}>
          <img src={image} alt={title} />
        </div>

        <div className={styles.storyContent}>
          <h2 className={styles.headingTitleStory}>{title}</h2>

          <div
            className={styles.storyText}
            style={{
              maxHeight: showReadMore ? maxHeight : "none",
              overflow: showReadMore ? "hidden" : "visible",
            }}
          >
            {shortContent}
          </div>

          {showReadMore && (
            <span
              onClick={() => setIsModalOpen(true)}
              className={styles.inlineReadMore}
            >
              Read More
            </span>
          )}
        </div>
      </div>

      {showReadMore && (
        <RightSlideModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={modalTitle || title}
        >
          {fullContent}
        </RightSlideModal>
      )}
    </>
  );
};

export default StorySection;