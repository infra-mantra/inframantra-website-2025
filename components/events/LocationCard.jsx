import React from 'react'
import styles from './LocationCard.module.css'

// Default = USA NRI Expo (used by /usa-nri-event). Pass `locations` to override.
const defaultLocations = [
  {
    city: 'SEATTLE',
    date: '30th & 31st May, 2026',
    venue: 'InterContinental Seattle Bellevue by IHG',
  },
  {
    city: 'SAN JOSE',
    date: '6th & 7th June, 2026',
    venue: 'The Domain Hotel Sunnyvale',
  },
]

// `highlightVenue` gives the venue the same emphasis as the date - used by
// single-venue events where the address is a headline detail, not fine print.
function LocationCard({
  locations = defaultLocations,
  highlightVenue = false,
  premium = false,
}) {
  return (
    <div className={styles.cardWrapper}>
      {locations.map((loc) => (
        <div
          key={loc.city}
          className={`${styles.cardevent} ${premium ? styles.cardPremium : ''}`}
        >
          <p className={styles.city}>{loc.city}</p>
          <p className={styles.date}>{loc.date}</p>
          <p
            className={`${styles.venue} ${
              highlightVenue ? styles.venueHighlight : ''
            }`}
          >
            {loc.venue}
          </p>
        </div>
      ))}
    </div>
  )
}

export default LocationCard
