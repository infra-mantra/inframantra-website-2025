import React, { useState, useEffect } from 'react';
import { FaStar, FaTag } from 'react-icons/fa';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import styles from './propertyListingCard.module.css'

const Mapho = dynamic(() => import('../maps/maps'), { ssr: false });

const propertyListCardStyles = {
  card: {
    width: '100%',
    height: '32vh',
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
}) {
  const [mapCenter, setMapCenter] = useState({ lat: 28.4595, lng: 77.0266 });
  const [currentZoom, setCurrentZoom] = useState(12);
  const [fetchedProperties, setFetchedProperties] = useState(propertyData);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    let filteredProperties = propertyData;

    if (propertyTypeFilter) {
      filteredProperties = filteredProperties.filter(
        (property) => property.propertyType.title === propertyTypeFilter
      );
    }

    if (priceRangeFilter) {
      filteredProperties = filteredProperties.filter((property) => {
        const priceInCr = parseFloat(
          property.startingPrice.replace('₹', '').replace(' Cr', '').replace(/,/g, '')
        );
        const priceInNumber = priceInCr * 10000000;
        return (
          priceInNumber >= priceRangeFilter[0] &&
          priceInNumber <= priceRangeFilter[1]
        );
      });
    }

    if (projectStatusFilter) {
      filteredProperties = filteredProperties.filter(
        (property) => property.status.trim() === projectStatusFilter
      );
    }

    setFetchedProperties(filteredProperties);
    // console.log('filteredProperties', filteredProperties);
    setTotalPages(Math.ceil(filteredProperties.length / 10));
  }, [propertyTypeFilter, priceRangeFilter, projectStatusFilter, propertyData]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const points = fetchedProperties.map((property) => ({
    lat: property.coordinates.lat,
    lng: property.coordinates.lng,
    key: property._id,
    name: property.name,
    image: property.imageGallery[0].url,
    location: `${property.subLocality.name}, ${property.locality.name}, ${property.city.name}`,
    price: property.startingPrice,
  }));
  const handleViewMorePropertyClick = (id) => {
    router.push(`/property/${id}`);
  };

  return (
    <div className={styles.propertyListingCardWrapper}>
      <div className={styles.propertyListPageSectionFlex}>
        <div className={styles.propertyListPageLeftSection}>
          <h3>Properties In {propertyData[0]?.city?.name}</h3>
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
                      {prop.subLocality?.name}, {prop.locality?.name}, {prop.city?.name}
                    </p>
                    <div className={styles.propertyListingCardRightSectionGridContainer}>
                      <p>
                        Price:
                        <span
                          style={{
                            color: '#337ab7',
                            fontWeight: '500',
                            marginLeft: '5px',
                          }}
                        >
                          {prop.startingPrice}
                        </span>
                      </p>
                      <p>
                        Config:
                        <span
                          style={{
                            color: '#337ab7',
                            fontWeight: '500',
                            marginLeft: '5px',
                          }}
                        >
                          {prop.configuration}
                        </span>
                      </p>
                      <p>
                        Area:
                        <span
                          style={{
                            color: '#337ab7',
                            fontWeight: '500',
                            marginLeft: '5px',
                          }}
                        >
                          {prop.area.slice(0, 11)}
                        </span>
                      </p>
                      <p>
                        Posession:
                        <span
                          style={{
                            color: '#337ab7',
                            fontWeight: '500',
                            marginLeft: '5px',
                          }}
                        >
                          {prop.possesion}
                        </span>
                      </p>
                    </div>
                    <p className={styles.propertyListingCardRightSectionDescription}>
                      {`" ${prop.tagLine} "`}
                    </p>
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
                          background: '#007bff',
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
              )) : <h3 className={styles.noPropertiesSection}>No Properties Found</h3> 
              }
          <div className={styles.propertyPageListingPaginationWrapper}>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.propertyListPageRightSection}>
          <Mapho center={mapCenter} zoom={currentZoom} points={points} setMapCenter={setMapCenter} setZoom={setCurrentZoom} />
        </div>
      </div>
    </div>
  );
}

export default PropertyListingCard;
