import React, { useState, useEffect } from 'react';
import styles from './aboutSection.module.css';

function AboutSection({
  totalProperties,
  currentPage = 1,
  minPrice,
  maxPrice,
  type,
  name,
  state,
  city,
  locality,
  sublocality,
  customContent, // optional: overrides the auto-generated about paragraph
  customHeading, // optional: overrides the "Properties in <area>" H1 heading
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [displayArea, setDisplayArea] = useState('');
  const [parentArea, setParentArea] = useState('');

  const toggleReadMore = () => setIsExpanded((prev) => !prev);

  const pageSize = 10; // ✅ Define the page size

  const startIndex = totalProperties === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalProperties);

  const normalizedType = type?.trim()?.toLowerCase();

  // ✅ Recompute displayArea and parentArea when their dependencies change
  useEffect(() => {
    let newDisplayArea = '';
    let newParentArea = '';

    switch (normalizedType) {
      case 'state':
        newDisplayArea = state;
        newParentArea = '';
        break;

      case 'city':
        newDisplayArea = city;
        newParentArea = state || '';
        break;

      case 'locality':
        newDisplayArea = locality;
        newParentArea = city || '';
        break;

      case 'sublocality':
        newDisplayArea =
        sublocality ? `${sublocality}, ${locality || ''}` : locality;
        newParentArea = city || '';
        break;

      default:
        newDisplayArea = city;
        newParentArea = state;
        break;
    }

    setDisplayArea(newDisplayArea);
    setParentArea(newParentArea);
  }, [normalizedType, state, city, locality, sublocality]);

  const fullText = customContent
    ? customContent
    : type === 'search'
    ? 'Discover the finest properties with Inframantra — your gateway to premium living. Explore an exclusive collection of 2–5 BHK apartments, duplexes, villas, and penthouses, each crafted with world-class design and top-tier amenities. Located in one of the fastest-growing residential destinations, Inframantra offers best properties boasting unmatched connectivity, superior convenience, and a lifestyle perfectly suited for families and professionals seeking luxury, comfort, and long-term value.'
    : `Explore the best properties in ${displayArea}${parentArea ? `, ${parentArea}` : ''}. In total, there are more than ${totalProperties} properties for sale in ${displayArea}. The prices of these properties range from Rs. ${minPrice} to Rs. ${maxPrice}. These ${displayArea} properties include 2–5 BHK apartments, duplexes, villas, and penthousesthat are thoughtfully designed and come loaded with world-class amenities. It is one of  the fastest growing residential areas that offers unmatched connectivity and convenience, making properties in ${displayArea} ideal for families and professionals seeking high-quality and luxurious living spaces.`;

  const previewText = fullText.slice(0, 180);

  // console.log('$$$$$$$$$$4'/,currentPage)

  return (
    <>
      <h1 className={styles.headerAbout}>
        {customHeading
          ? customHeading
          : type === 'search'
          ? `Search result has ${totalProperties} properties`
          : `Properties in ${displayArea}${parentArea ? `, ${parentArea}` : ''}`}
      </h1>

      <p className={styles.pageNumberAbout}>
        {totalProperties === 0 ? (
          'No properties found'
        ) : (
          <>
            Showing {startIndex} - {endIndex} of {totalProperties} properties
          </>
        )}
      </p>

      <div className={styles.contentWrapper}>
        <p className={styles.aboutSection}>
          {isExpanded ? fullText : `${previewText}... `}
          <span onClick={toggleReadMore} className={styles.readMoreInline}>
            {isExpanded ? 'Read Less' : 'Read More'}
          </span>
        </p>
      </div>
    </>
  );
}

export default AboutSection;
