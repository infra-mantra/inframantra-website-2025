import { AVAILABLE_CITIES } from '../utils/cityUtils';
import styles from './premiumPicks.module.css';

export default function CitySelector({ selectedCity, onCityChange }) {

  const cityDisplayNames = {
    Gurgaon: 'Gurugram',
    Mohali: 'Mohali',
    Pune: 'Pune',
    Jaipur: 'Jaipur',
    Noida: 'Noida',


  };

  return (
    <div className={styles.citySelector}>
      <div className={styles.cityTabs}>
        {AVAILABLE_CITIES.map((city) => (
          <button
            key={city}
            className={`${styles.cityTab} ${
              selectedCity === city ? styles.active : ''
            }`}
            onClick={() => onCityChange(city)}
          >
            {cityDisplayNames[city] || city}
          </button>
        ))}
      </div>
    </div>
  );
}