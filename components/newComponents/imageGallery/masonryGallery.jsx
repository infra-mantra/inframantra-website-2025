// components/Masonry.js
import React from "react";
import styles from "./Masonry.module.css";
import Image from "next/image";

const Masonry = ({ images, columns, gap }) => {
  return (
  <>
      {images.map((image, index) => (
        <div
          key={index}
          className={styles.item}
          style={{ marginBottom: `${gap}px` }} position="relative"
        >
          <Image
            src={image.img}
            alt={image.alt}
            loading="lazy"
            className={styles.image}
            width={500}
            height={280}
            style={{
              borderRadius: "10px",
              objectFit: "cover"
            }}
          />
        </div>

      ))}
   </>
  );
};


export default Masonry;


