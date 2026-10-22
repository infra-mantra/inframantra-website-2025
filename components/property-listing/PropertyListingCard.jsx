import React, { useState, Suspense } from "react";
import { FaStar, FaTag } from "react-icons/fa";
import { useRouter } from "next/router";
import styles from "./PropertyListingCard.module.css";
// Project status badge on the photo. CMS spellings vary ("UNDER CONSTRUCTION",
// "Under Construction "), so show one form.
const statusLabel = (s) =>
  String(s || "")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

import { Loader } from "../layout/CustomeLoader.jsx";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import CompareToggle from "../compare/CompareToggle.jsx";
import HeartButton from "../shared/shortlist/HeartButton.jsx";
import { optimizedSrc } from "../lib/imageUrl.js";

import { PhotoLocation, ClampedDescription } from "./CardExtras.jsx";
import cb from "../shared/CardButtons.module.css";
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
  // Developer logo badge over the photo: a white rounded tile (white backing so
  // light logos stay visible), sized by the logo's own proportions.
  chipImage: {
    position: "absolute",
    left: "12px",
    top: "12px",
    height: "44px",
    maxWidth: "45%",
    padding: "6px 10px",
    boxSizing: "border-box",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255, 255, 255, 0.95)",
    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.18)",
    pointerEvents: "none",
  },
  dimension: {
    display: "block",
    height: "100%",
    width: "auto",
    maxWidth: "110px",
    objectFit: "contain",
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
  onReadMore, // (property) => opens the details modal
  renderAfter, // (index) => node inserted after that card (mid-list ad slot)
  emptyState, // node shown when there are no results
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
            {fetchedProperties.length > 0
              ? fetchedProperties.map((prop, index) => (
                  <React.Fragment key={prop.id}>
                    <div
                      className={styles.propertyCard}
                      style={{ ...propertyListCardStyles.card, "--plc-i": Math.min(index, 8) }}
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
                          loading={index === 0 ? "eager" : "lazy"}
                          decoding="async"
                          alt="featured"
                        />

                        {prop.status && (
                          <span
                            className={`${styles.cardStatus} ${
                              /ready/i.test(prop.status) ? styles.cardStatusReady : ""
                            }`}
                          >
                            {statusLabel(prop.status)}
                          </span>
                        )}
                        {prop.developer?.developerImg && (
                          <div style={propertyListCardStyles.chipImage}>
                            <img
                              style={propertyListCardStyles.dimension}
                              src={prop.developer.developerImg}
                              alt={
                                prop.developer.name
                                  ? `${prop.developer.name} logo`
                                  : "Developer logo"
                              }
                              loading="lazy"
                            />
                          </div>
                        )}
                        <PhotoLocation property={prop} />
                        <CompareToggle property={prop} />
                        <HeartButton property={prop} />
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
                              <span
                                className={styles.nameTagRera}
                                aria-label={`RERA: ${prop.rera}`}
                              >
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

                        <div className={styles.propertyListingCardRightSectionGridContainer}>
                          <p className={styles.listingDetailRow}>
                            Price:
                            <span
                              className={styles.listingDetailValue}
                              style={{ color: "#e7b554" }}
                            >
                              ₹ {prop.startingPrice}*
                            </span>
                          </p>
                          <p className={styles.listingDetailRow}>
                            Config:
                            <span className={styles.listingDetailValue}>{prop.configuration}</span>
                          </p>
                          <p className={styles.listingDetailRow}>
                            Area:
                            <span className={styles.listingDetailValue}>
                              {prop.area.slice(0, 18)}
                            </span>
                          </p>
                          <p className={styles.listingDetailRow}>
                            Possession:
                            <span className={styles.listingDetailValue}>{prop.possesion}</span>
                          </p>
                        </div>

                        <div className={styles.description}>
                          <ClampedDescription
                            text={prop.description}
                            className={styles.clampTwoLines}
                            onReadMore={() => onReadMore?.(prop)}
                          />
                        </div>
                        <div
                          className={styles.propertyListingCardRightSectionBtnContainer}
                          style={{
                            display: "flex",
                            flexWrap: "nowrap",
                            gap: "8px",
                            width: "100%",
                          }}
                        >
                          <button
                            className={`${cb.cbBtn} ${cb.cbView}`}
                            type="button"
                            onClick={() => handleViewMorePropertyClick(prop.slug)}
                          >
                            View More
                          </button>
                          <button
                            className={`${cb.cbBtn} ${cb.cbEnquire}`}
                            type="button"
                            onClick={() => onOpenBackdrop(prop.name)}
                          >
                            Enquire Now
                          </button>
                          <button
                            className={`${cb.cbBtn} ${cb.cbBrochure}`}
                            type="button"
                            onClick={() => onOpenBackdrop(prop.name)}
                            title="Download Brochure"
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
                    {renderAfter?.(index)}
                  </React.Fragment>
                ))
              : emptyState || (
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
