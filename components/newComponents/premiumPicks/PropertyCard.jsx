import styles from './premiumPicks.module.css';

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

  return (
    
      
  
    <div className={styles.propertyCard}>
      <div className={styles.propertyImageContainer}>
        <img 
          src={imageUrl} 
          alt={imageAlt}
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
  
  );
}
