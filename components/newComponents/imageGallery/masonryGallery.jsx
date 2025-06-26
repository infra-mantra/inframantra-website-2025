// components/Masonry.js
import React from "react";
import styles from "./Masonry.module.css";

const Masonry = ({ images, columns, gap }) => {
  return (
    <div
      className={styles.masonry}
      style={{ columnCount: columns, columnGap: `${gap}px` }}
    >
      {images.map((image, index) => (
        <div
          key={index}
          className={styles.item}
          style={{ marginBottom: `${gap}px` }}
        >
          <img
            src={image.img}
            alt={image.alt}
            loading="lazy"
            className={styles.image}
          />
        </div>
      ))}
    </div>
  );
};


export default Masonry;


