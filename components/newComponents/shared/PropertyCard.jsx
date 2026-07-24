import React from 'react';
import Image from 'next/image';
import styles from './PropertyCard.module.css';

const FALLBACK =
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop&auto=format';

export default function PropertyCard({ property }) {
  // next/image serves a resized, modern-format (WebP/AVIF) version sized to the
  // card instead of the full-resolution source — identical visually, far
  // lighter. This project is on Next 12, whose next/image uses the legacy API:
  // layout="fill" + objectFit (the bare `fill` boolean is Next 13+ and throws
  // "must use width and height … or layout='fill'"). Container is position:
  // relative with a fixed height, so fill matches the previous layout exactly.
  const [errored, setErrored] = React.useState(false);
  const src = errored ? FALLBACK : property.imageGallery?.url || FALLBACK;

  return (
    <div className={styles.propertyCard}>
      <a href={`/property/${property.slug}`}>
        <div className={styles.propertyImageContainer}>
          <Image
            src={src}
            alt={property.imageGallery?.title || property.name}
            layout="fill"
            objectFit="cover"
            sizes="(max-width: 480px) 60vw, (max-width: 768px) 40vw, (max-width: 1024px) 25vw, 300px"
            className={styles.propertyImage}
            onError={() => setErrored(true)}
          />
        </div>

        <div className={styles.propertyContent}>
          <h3 className={styles.propertyTitle}>{property.name}</h3>

          <p className={styles.propertyLocation}>
            {[property.subLocality?.name, property.locality?.name]
              .filter(Boolean)
              .join(', ')}
          </p>

          {property.configuration && (
            <p className={styles.propertyConfig}>{property.configuration}</p>
          )}

          <p className={styles.propertyPrice}>
            Starting From Rs. {property.startingPrice}
          </p>
        </div>
      </a>
    </div>
  );
}
