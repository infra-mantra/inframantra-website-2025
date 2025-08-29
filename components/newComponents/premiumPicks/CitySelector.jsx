import { AVAILABLE_CITIES } from '../utils/cityUtils';
import styles from './premiumPicks.module.css';

export default function CitySelector({ selectedCity, onCityChange }) {
  // Map display names (removed Delhi and Bangalore)
  const cityDisplayNames = {
    'Gurgaon': 'Gurugram',
    'Pune': 'Pune',
    'Jaipur': 'Jaipur',
    'Noida': 'Noida'
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
            aria-pressed={selectedCity === city}
          >
            {cityDisplayNames[city]}
          </button>
        ))}
      </div>
    </div>
  );
}
