import React from "react";
import styles from "./LocationCard.module.css";

const locations = [
  {
    city: "SEATTLE",
    date: "30th & 31st May, 2026",
    venue: "InterContinental Seattle Bellevue by IHG",
  },
  {
    city: "SAN JOSE",
    date: "6th & 7th June, 2026",
    venue: "The Domain Hotel Sunnyvale",
  },
];

function LocationCard() {
  return (
    <div className={styles.cardWrapper}>
      {locations.map((loc) => (
        <div key={loc.city} className={styles.cardevent}>
          <p className={styles.city}>{loc.city}</p>
          <p className={styles.date}>{loc.date}</p>
          <p className={styles.venue}>{loc.venue}</p>
        </div>
      ))}
    </div>
  );
}

export default LocationCard;
