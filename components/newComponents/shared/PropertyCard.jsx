import React from 'react';
import styles from './PropertyCard.module.css';

export default function PropertyCard({ property ,  location}) {
  console.log("popererer",property)
  return (
    <div className={styles.propertyCard}>
      {/* Property Image */}
      <div className={styles.propertyImageContainer}>
        <img 
          src={property.imageGallery?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop&auto=format'}
          alt={property.imageGallery?.title || property.name}
          className={styles.propertyImage}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop&auto=format';
          }}
        />
      </div>
      
      {/* Property Content */}
      <div className={styles.propertyContent}>
        <h3 className={styles.propertyTitle}>
          {property.name}
        </h3>
        
        <p className={styles.propertyLocation}>
          {[
            property.subLocality?.name, 
            property.locality?.name
          ].filter(Boolean).join(', ')}
        </p>
        
        {/* Show configuration only if it exists (for locality properties) */}
        {property.configuration && (
          <p className={styles.propertyConfig}>
            {property.configuration}
          </p>
        )}
        
        <p className={styles.propertyPrice}>
          Starting From Rs. {property.startingPrice}
        </p>
      </div>
    </div>
  );
}
