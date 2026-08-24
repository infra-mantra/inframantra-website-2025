import styles from './premiumPicks.module.css';
import { useRouter } from 'next/router';

export default function PropertyCard({ property }) {
  const imageUrl = property.imageGallery?.url ||
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop&auto=format';
  const imageAlt = property.imageGallery?.title || property.name;

  // Format location exactly like in design
  const location = [
    property.subLocality?.name,
    property.locality?.name
  ].filter(Boolean).join(', ');

  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop&auto=format';
  };
  const router = useRouter();

const handleNavigateIndividualProperty = () => {
  if (!property?.slug) {
    console.error("❌ Property slug is missing, cannot navigate!");
    return;
  }

  router.push(`/property/${property.slug}`);
};

  return (

    <>
    <div className={styles.propertyCard} onClick={handleNavigateIndividualProperty}>
      <div className={styles.propertyImageContainer}>
        {/* Explicit dimensions so the browser reserves the card image box from
            the aspect ratio alone. This section is code-split, so its CSS can
            land after the markup — without these the images were sized only once
            the stylesheet applied, which Lighthouse reported as "media element
            lacking an explicit size" and a 0.152 shift inside .premiumReserve.
            The CSS still drives the real size (100% x 150px, object-fit cover). */}
        <img
          src={imageUrl}
          alt={imageAlt}
          width="282"
          height="150"
          loading="lazy"
          onError={handleImageError}
          className={styles.propertyImage}
        />
      </div>

      <div className={styles.propertyContent}>
        <h3 className={styles.propertyTitle}>{property.name}</h3>


        {location && (
          <p className={styles.propertyLocation}>{location}</p>
        )}

        {property.startingPrice && (
          <p className={styles.propertyPrice}>Rs. {property.startingPrice}</p>
        )}
      </div>
    </div>

    </>

  );
}
