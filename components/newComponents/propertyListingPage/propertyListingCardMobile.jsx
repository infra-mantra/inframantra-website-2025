import React, { useState, useEffect } from "react";
import { FaHome } from "react-icons/fa";
import { TfiRulerAlt2 } from "react-icons/tfi";
import { CiClock2 } from "react-icons/ci";
import { useRouter } from "next/router";
import styles from "./propertyListingCardMobile.module.css";

function PropertyListingCardMobile({ propertyData = [], onOpenBackdrop , currentPageNumber }) {
  const router = useRouter();
  const { city } = router.query;

  const [fetchedProperties, setFetchedProperties] = useState(propertyData);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 10; // change number for how many items you want per page
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setFetchedProperties(propertyData);
  }, [propertyData, city]);

  useEffect(() => {
    setTotalPages(Math.ceil(fetchedProperties.length / propertiesPerPage));
  }, [fetchedProperties]);

  const handlePageChange = (pageNumber) => {
  
    currentPageNumber(pageNumber);
    
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Slice data for current page
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = fetchedProperties.slice(indexOfFirstProperty, indexOfLastProperty);

  const handleViewMorePropertyClick = (slug) => {
    router.push(`/property/${slug}`);
  };

  return (
    <div className={styles.propertyListingCardWrapper}>
      <div className={styles.propertyListPageSectionFlex}>
        {currentProperties.length > 0 ? (
          currentProperties.map((property) => (
            <div key={property.slug} className={styles.propertyListingCardMobile}>
              {/* Property Image Section */}
              <div className={styles.propertyListPageMobileImgSection}>
                <img
                  src={property.imageGallery?.[0]?.url || "/default-property.jpg"}
                  alt={property.name}
                  className={styles.propertyListingImage}
                />

                {/* Badges */}
                {property.exclusive && (
                  <div className={styles.propertyImageChip}>
                    <span className={styles.propertyListPageMobileImageChip}>Exclusive</span>
                  </div>
                )}
                {property.featured && (
                  <div className={styles.propertyImageChip}>
                    <span className={styles.propertyListPageMobileImageChip}>Featured</span>
                  </div>
                )}
              </div>

              {/* Property Details Section */}
              <div className={styles.propertyListPageMobileDetailSection}>
                <div className={styles.propertyListPageMobileDetailHeader}>
                  <div className={styles.propertyListPageMobileDetailLocation}>
                    <h3 style={{ fontWeight: "700", fontSize: "18px" }}>{property.name}</h3>
                    <p
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        fontSize: "14px",
                      }}
                    >
                      <img src="/icons/mapIconGreen.svg" height={10} />
                      {property.subLocality?.name}, {property.city?.name}
                    </p>
                  </div>

                  <div className={styles.propertyListPageMobileDetailLocation}>
                    <p style={{ fontSize: "15px" }}>Starting at</p>
                    <h3
                      style={{
                        color: "#dcaa4c",
                        fontSize: "17px",
                        fontWeight: "700",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <img src="/logos/rupeesSymbol.svg" />
                      {property.startingPrice}
                    </h3>
                  </div>
                </div>

                {/* Overview Icons */}
                <div className={styles.propertyListPageMobileDetailOverview}>
                  <div className={styles.propertyListPageMobileDetailOverviewValueFlex}>
                    <FaHome className={styles.propertyListingPageIcon} />
                    <p>{property.configuration}</p>
                  </div>
                  <div className={styles.propertyListPageMobileDetailOverviewValueFlex}>
                    <TfiRulerAlt2 className={styles.propertyListingPageIcon} />
                    <p>{property.area}</p>
                  </div>
                  <div className={styles.propertyListPageMobileDetailOverviewValueFlex}>
                    <CiClock2 className={styles.propertyListingPageIcon} />
                    <p>{property.possesion}</p>
                  </div>
                </div>

                {/* Description */}
                <div className={styles.description}>
                  <p className={styles.clampTwoLines}>{property.description}</p>
                </div>

                {/* Buttons */}
                <div className={styles.propertyListPageMobileDetailBtnWrapper}>
                  <button
                    className={styles.searchbutton}
                    style={{
                      padding: "5px 25px",
                      borderRadius: "5px",
                      height: "30px",
                    }}
                    onClick={() => handleViewMorePropertyClick(property.slug)}
                  >
                    View More
                  </button>
                  <button
                    className={styles.searchbutton}
                    style={{
                      padding: "5px 25px",
                      borderRadius: "5px",
                      backgroundColor: "#0b6e21",
                      height: "30px",
                    }}
                    onClick={() => onOpenBackdrop(property.name)}
                  >
                    Enquire
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", marginTop: "20px" }}>No properties found.</p>
        )}
      </div>

  {/* Pagination */}
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
  );
}

export default PropertyListingCardMobile;
