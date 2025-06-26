import React from 'react';
import LocalityCard from "./localityCardHomePage/localityCard.js";
import { popularLocalities } from './popularLocalitiesData';
import styles from './popularLocalities.module.css';

function PopularLocalities() {
  return (
    <div className={styles.popularLocalitiesSectionWrapper}>
      <div className={styles.popularLocalitiesSectionFlex}>
        <h2>Explore Our Popular Localities</h2>
        <div className={styles.popularLocalitiesFlex}>
          {popularLocalities.map((locality) => {
            const { localityName, localityList, localityImg } = locality;
            return (
              <LocalityCard
                localityName={localityName}
                localityList={localityList}
                localityImg={localityImg}
                key={localityName}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PopularLocalities;
