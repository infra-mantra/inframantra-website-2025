import React, { useEffect, useState } from "react";
import Ajax1 from "../../helper/Ajax1";
import styles from "./developerSlide.module.css";

const DeveloperSlider = () => {
  const [developer, setDeveloper] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const getData = await Ajax1({ url: `/developer` });
        setDeveloper(getData?.data?.data?.developers || []);
      } catch (err) {
        console.error("Developer fetch error:", err);
      }
    })();
  }, []);

  return (
    <div className={styles.sliderWrapper}>
      <h4 className={styles.heading}>TOP REAL ESTATE DEVELOPERS</h4>
      <div className={styles.sliderContainer}>
        <div className={styles.sliderTrack}>
          {developer.concat(developer).map((item, index) => (
            <div key={index} className={styles.slide}>
              <img
                src={item.developerImg}
                alt="Developer"
                className={styles.logo}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeveloperSlider;
