import { useState, useEffect, Suspense } from "react";
import { FaStar, FaTag } from "react-icons/fa";
import { useRouter } from "next/router";
import styles from "./PropertyListingCard.module.css";
import { Loader } from "../layout/CustomeLoader.jsx";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { optimizedSrc } from "../lib/imageUrl.js";

const propertyListCardStyles = {
  card: {
    height: "290px",
    marginBottom: "20px",
    borderRadius: "10px",
    display: "flex",
    // Explicit row: the shared home-page card module defines a GLOBAL
    // `.propertyCard { flex-direction: column }` (CSS modules are unhashed) which
    // leaks onto this card when navigating from the home page and stacks it. This
    // inline value only affects this element and beats the leaked class rule.
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: "2% 2%",
    position: "relative",
  },
  chip: {
    position: "absolute",
    width: "30%",
    borderRadius: "5px",
    right: "0%",
    top: "0%",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "700",
    padding: "5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  chipImage: {
    position: "absolute",
    width: "30%",
    height: "auto",
    borderRadius: "5px",
    left: "-5px",
    top: "1px",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "700",
    padding: "5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255, 255, 255, 0.92)", // white backing so light developer logos stay visible
  },
  dimension: {
    width: "5rem",
    objectFit: "scale-down",
  },
  imageChip: {
    background: "#DCAA4C",
  },
  featuredChip: {
    background: "#0CA92E",
  },
};

function PropertyListingCard({
  name,
  type,
  onOpenBackdrop,
  propertyData,
  totalProperties = 0,
  currentPage: currentPageProp,
  pageSize = 10,
  onPageChange,
  currentPageNumber,
  loading,
}) {
  const [mapCenter, setMapCenter] = useState({ lat: 28.4595, lng: 77.0266 });
  const [currentZoom, setCurrentZoom] = useState(12);
  const [localPage, setLocalPage] = useState(1);
  const router = useRouter();

  // server mode (backend pagination) when onPageChange is provided; otherwise legacy client-side slicing
  const serverMode = typeof onPageChange === "function";
  const allItems = Array.isArray(propertyData) ? propertyData : [];
  const currentPage = serverMode ? currentPageProp || 1 : localPage;
  const totalPages = Math.max(
    1,
    Math.ceil((serverMode ? totalProperties : allItems.length) / pageSize)
  );
  const fetchedProperties = serverMode
    ? allItems
    : allItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    if (serverMode) onPageChange(page);
    else {
      setLocalPage(page);
      currentPageNumber?.(page);
    }
  };

  const handleViewMorePropertyClick = (id) => {
    const url = `/property/${id}`;
    const newTab = window.open(url, "_blank");

    if (newTab) {
      newTab.focus();
    }
  };

  return (
    <Suspense
      fallback={
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <div className="loader-container">
            <div className="spinner" />
          </div>
        </div>
      }
    >
      <div className={styles.propertyListingCardWrapper}>
        <div className={styles.propertyListPageSectionFlex}>
          <div className={styles.propertyListPageLeftSection}>
            {fetchedProperties.length > 0 ? (
              fetchedProperties.map((prop) => (
                <div
                  className={styles.propertyCard}
                  style={propertyListCardStyles.card}
                  key={prop.id}
                  onMouseEnter={() => {
                    setMapCenter(prop.coordinates);
                    setCurrentZoom(17);
                  }}
                >
                  <div
                    className={styles.propertyListingCardLeftSection}
                    onClick={() => handleViewMorePropertyClick(prop.slug)}
                  >
                    <img
                      className={styles.propertyListingCardLeftSectionImg}
                      src={optimizedSrc(prop.imageGallery[0].url, 384)}
                      alt="featured"
                    />

                    <div
                      style={{
                        ...propertyListCardStyles.chipImage,
                        // ...propertyListCardStyles.dimension
                      }}
                    >
                      <img
                        style={{
                          ...propertyListCardStyles.dimension,
                        }}
                        src={prop.developer.developerImg}
                      />
                    </div>
                  </div>
                  <div className={styles.propertyListingCardRightSection}>
                    <div className={styles.propertyListingCardHeaderFlex}>
                      <h4>{prop.name}</h4>
                      {prop.exclusive && (
                        <span className={styles.nameTagExclusive}>
                          <FaTag />
                          Exclusive
                        </span>
                      )}
                      {prop.featured && (
                        <span className={styles.nameTagFeatured}>
                          <FaStar />
                          Featured
                        </span>
                      )}
                      {prop.rera && (
                        <span className={styles.reraWrap}>
                          <span className={styles.nameTagRera} aria-label={`RERA: ${prop.rera}`}>
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1.2 14.4L6.6 12.2l1.4-1.4 2.8 2.8 5.6-5.6 1.4 1.4-7 7z" />
                            </svg>
                            RERA
                          </span>
                          <span className={styles.reraTooltip} role="tooltip">
                            <span className={styles.reraTooltipLabel}>RERA Registered</span>
                            {prop.rera}
                          </span>
                        </span>
                      )}
                    </div>
                    <p className={styles.propertyListingCardRightSectionLocation}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        fill="rgba(0, 0, 0, 0.4)"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                      </svg>{" "}
                      {`${prop.subLocality?.name}, ${prop.city.name}`}
                    </p>
                    <div className={styles.propertyListingCardRightSectionGridContainer}>
                      <p className={styles.listingDetailRow}>
                        Price:
                        <span className={styles.listingDetailValue} style={{ color: "#e7b554" }}>
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
                    <div
                      className={styles.propertyListingCardRightSectionBtnContainer}
                      style={{ display: "flex", flexWrap: "nowrap", gap: "8px", width: "100%" }}
                    >
                      <button
                        type="button"
                        onClick={() => handleViewMorePropertyClick(prop.slug)}
                        style={{
                          flex: "1 1 0",
                          minWidth: 0,
                          background: "#3cc76a",
                          borderRadius: "5px",
                          fontSize: "12px",
                          fontWeight: 600,
                          padding: "7px 8px",
                          color: "#fff",
                          border: "none",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        View More
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenBackdrop(prop.name)}
                        style={{
                          flex: "1 1 0",
                          minWidth: 0,
                          background: "#e8c274",
                          borderRadius: "5px",
                          fontSize: "12px",
                          fontWeight: 600,
                          padding: "7px 8px",
                          color: "#fff",
                          border: "none",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Enquire Now
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenBackdrop(prop.name)}
                        title="Download Brochure"
                        style={{
                          flex: "1 1 0",
                          minWidth: 0,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "5px",
                          background: "#fff",
                          borderRadius: "5px",
                          fontSize: "12px",
                          fontWeight: 600,
                          padding: "7px 8px",
                          color: "#3cc76a",
                          border: "1px solid #3cc76a",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                          style={{ flexShrink: 0 }}
                        >
                          <path d="M12 16l-5-5h3V4h4v7h3l-5 5zm-7 2h14v2H5z" />
                        </svg>
                        Brochure
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <h3 className={styles.noPropertiesSection}>No Properties Found</h3>
            )}{" "}
            <div className={styles.propertyPageListingPaginationWrapper}>
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
                    .slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))
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
    </Suspense>
  );
}

export default PropertyListingCard;
