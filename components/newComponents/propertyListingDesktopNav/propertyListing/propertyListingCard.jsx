import  { useState, useEffect } from 'react';
import { FaStar, FaTag } from 'react-icons/fa';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from './propertyListingCard.module.css';
import PremiumProperty from './premiumProperty';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const propertyListCardStyles = {
  card: {
    height: '40vh',
    marginBottom: '20px',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2% 2%',
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    position: 'relative',
  },
  chip: {
    position: 'absolute',
    width: '30%',
    borderRadius: '5px',
    left: '0%',
    top: '0%',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '700',
    padding: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageChip: {
    background: '#DCAA4C',
  },
  featuredChip: {
    background: '#0CA92E',
  },
};

function PropertyListingCard({
  name,
  type,
  onOpenBackdrop,
  propertyTypeFilter,
  priceRangeFilter,
  projectStatusFilter,
  propertyData,
  loading,
  currentPageNumber,
}) {
  const [mapCenter, setMapCenter] = useState({ lat: 28.4595, lng: 77.0266 });
  const [currentZoom, setCurrentZoom] = useState(12);
  const [fetchedProperties, setFetchedProperties] = useState(propertyData);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

    


 

  // ✅ Filter properties based on selected filters
  useEffect(() => {
    let filteredProperties = propertyData;

    if (projectStatusFilter) {
      filteredProperties = filteredProperties.filter(
        (property) => property.status.trim() === projectStatusFilter
      );
    }

    setFetchedProperties(filteredProperties);
    setTotalPages(Math.ceil(filteredProperties.length / 10));
  }, [propertyTypeFilter, priceRangeFilter, projectStatusFilter, propertyData]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    currentPageNumber(page);
  };

  const handleViewMorePropertyClick = (id) => {
    router.push(`/property/${id}`);
  };

  return (
    <div className={styles.propertyListingCardWrapper}>
      <div className={styles.propertyListPageSectionFlex}>
        <div className={styles.propertyListPageLeftSection}>
         


                 {fetchedProperties.length > 0 ? fetchedProperties
              .slice((currentPage - 1) * 10, currentPage * 10)
              .map((prop) => (
                <div
                  style={propertyListCardStyles.card}
                  key={prop.id}
                  onMouseEnter={() => {
                    setMapCenter(prop.coordinates);
                    setCurrentZoom(17);
                  }}
                >
                  <div className={styles.propertyListingCardLeftSection}>
                    <img
                      className={styles.propertyListingCardLeftSectionImg}
                      src={prop.imageGallery[0].url}
                      alt="featured"
                    />
                    {prop.exclusive && (
                      <div
                        style={{
                          ...propertyListCardStyles.chip,
                          ...propertyListCardStyles.imageChip,
                        }}
                      >
                        <FaTag style={{ marginRight: '5px' }} />
                        Exclusive
                      </div>
                    )}
                    {prop.featured && (
                      <div
                        style={{
                          ...propertyListCardStyles.chip,
                          ...propertyListCardStyles.featuredChip,
                        }}
                      >
                        <FaStar style={{ marginRight: '5px' }} />
                        Featured
                      </div>
                    )}
                  </div>
                  <div className={styles.propertyListingCardRightSection}>
                    <div className={styles.propertyListingCardHeaderFlex}>
                      <h4>{prop.name}</h4>
                    </div>
                    <p className={styles.propertyListingCardRightSectionLocation}>
                    <svg
     xmlns="http://www.w3.org/2000/svg"
  width="12"
  height="12"
  fill="rgba(0, 0, 0, 0.4)"
  viewBox="0 0 24 24"
>
     <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
     </svg> {prop.subLocality?.name}
                    </p>
                   <div className={styles.propertyListingCardRightSectionGridContainer}>
  <p className={styles.listingDetailRow}>
    Price:
   <span
  className={styles.listingDetailValue}
  style={{ color: "#DCAA4C" }}
>
   ₹ {prop.startingPrice}
</span>
  </p>
  <p className={styles.listingDetailRow}>
    Config:
    <span className={styles.listingDetailValue}>{prop.configuration}</span>
  </p>
  <p className={styles.listingDetailRow}>
    Area:
    <span className={styles.listingDetailValue}>{prop.area.slice(0, 18)}</span>
  </p>
  <p className={styles.listingDetailRow}>
    Posession:
    <span className={styles.listingDetailValue}>{prop.possesion}</span>
  </p>
</div>

                    <div className={styles.description}>
                                     <p className={styles.clampTwoLines}>{prop.description}</p>
                                   </div>
                    <div className={styles.propertyListingCardRightSectionBtnContainer}>
                      <button
                        style={{
                          background: '#0ca92e',
                          marginRight: '15px',
                          borderRadius: '5px',
                          fontSize: '12px',
                          padding: '7px 15px',
                          color: 'white',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                        onClick={() => handleViewMorePropertyClick(prop.slug)}
                      >
                        View More
                      </button>
                      <button
                        style={{
                          background: '#DCAA4C',
                          borderRadius: '5px',
                          fontSize: '12px',
                          padding: '7px 15px',
                          color: 'white',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                        onClick={() => onOpenBackdrop(prop.name)}
                      >
                        Enquire Now
                      </button>
                    </div>
                  </div>
                </div>
              )) 
              : <h3 className={styles.noPropertiesSection}>No Properties Found</h3> 
              }          <div className={styles.propertyPageListingPaginationWrapper}>
           {totalPages > 1 && (
             <div className={styles.paginationContainer}>
               {/* Left Arrow */}
               <button
                 className={styles.paginationArrow}
                 onClick={() => handlePageChange(currentPage - 1)}
                 disabled={currentPage === 1}
               >
                 &#8249;
               </button>
           
               {/* Show only 5 pages at a time */}
               {Array.from({ length: totalPages }, (_, i) => i + 1)
                 .slice(
                   Math.max(0, currentPage - 3),
                   Math.min(totalPages, currentPage + 2)
                 )
                 .map((page) => (
                   <button
                     key={page}
                     onClick={() => handlePageChange(page)}
                     className={`${styles.paginationCircle} ${
                       page === currentPage ? styles.activePage : ""
                     }`}
                   >
                     {page}
                   </button>
                 ))}
           
               {/* Right Arrow */}
               <button
                 className={styles.paginationArrow}
                 onClick={() => handlePageChange(currentPage + 1)}
                 disabled={currentPage === totalPages}
               >
                 &#8250;
               </button>
             </div>
           )}
          </div>

      
        
        </div>
      </div>
    </div>
  );
}

export default PropertyListingCard;
