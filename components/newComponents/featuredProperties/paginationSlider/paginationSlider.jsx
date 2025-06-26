import React from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import styles from "./paginationSlider.module.css";

const PaginationSlider = ({ totalItems, currentIndex, setCurrentIndex }) => {
  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + 1, totalItems - 1)
    );
  };

  const individualWidth = 100 / totalItems;

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.arrowBtn}
        onClick={handlePrevious}
        disabled={currentIndex === 0}
      >
        <IoIosArrowBack />
      </button>

      <button
        className={styles.arrowBtn}
        onClick={handleNext}
        disabled={currentIndex === totalItems - 1}
      >
        <IoIosArrowForward />
      </button>

      <div className={styles.track}>
        <div
          className={styles.progress}
          style={{
            left: `${currentIndex * individualWidth}%`,
            width: `${individualWidth}%`,
          }}
        />
      </div>

      <span className={styles.pageNumbers}>
        {String(currentIndex + 1).padStart(2, "0")} /{" "}
        <span className={styles.totalItems}>
          {String(totalItems).padStart(2, "0")}
        </span>
      </span>
    </div>
  );
};

export default PaginationSlider;
