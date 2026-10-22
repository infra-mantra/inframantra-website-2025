import React, { useState, Suspense } from "react";
import { FaHome } from "react-icons/fa";
import { TfiRulerAlt2 } from "react-icons/tfi";
import { CiClock2 } from "react-icons/ci";
import { useRouter } from "next/router";
import styles from "./PropertyListingCardMobile.module.css";
// Project status badge on the photo. CMS spellings vary ("UNDER CONSTRUCTION",
// "Under Construction "), so show one form.
const statusLabel = (s) =>
  String(s || "")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

import CompareToggle from "../compare/CompareToggle.jsx";
import HeartButton from "../shared/shortlist/HeartButton.jsx";
import { optimizedSrc } from "../lib/imageUrl.js";

import { PhotoLocation, ClampedDescription } from "./CardExtras.jsx";
import cb from "../shared/CardButtons.module.css";
function PropertyListingCardMobile({
  propertyData = [],
  onOpenBackdrop,
  totalProperties = 0,
  currentPage: currentPageProp,
  pageSize = 10,
  onPageChange,
  currentPageNumber,
  onReadMore, // (property) => opens the details modal
  renderAfter, // (index) => node inserted after that card (mid-list ad slot)
  emptyState, // node shown when there are no results
}) {
  const router = useRouter();
  const [localPage, setLocalPage] = useState(1);

  // server mode (backend pagination) when onPageChange is provided; otherwise legacy client-side slicing
  const serverMode = typeof onPageChange === "function";
  const allItems = Array.isArray(propertyData) ? propertyData : [];
  const currentPage = serverMode ? currentPageProp || 1 : localPage;
  const totalPages = Math.max(
    1,
    Math.ceil((serverMode ? totalProperties : allItems.length) / pageSize)
  );
  const currentProperties = serverMode
    ? allItems
    : allItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    if (serverMode) onPageChange(pageNumber);
    else {
      setLocalPage(pageNumber);
      currentPageNumber?.(pageNumber);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewMorePropertyClick = (slug) => {
    router.push(`/property/${slug}`);
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
      <div className={styles.mobileListCardWrapper}>
        <div className={styles.mobileListSectionFlex}>
          {currentProperties.length > 0
            ? currentProperties.map((property, index) => (
                <React.Fragment key={property.slug}>
                  <div
                    className={styles.propertyListingCardMobile}
                    style={{ "--plc-i": Math.min(index, 8) }}
                  >
                    {/* Property Image Section */}
                    <div
                      className={styles.propertyListPageMobileImgSection}
                      onClick={() => handleViewMorePropertyClick(property.slug)}
                    >
                      <img
                        src={optimizedSrc(
                          property.imageGallery?.[0]?.url || "/default-property.jpg",
                          384
                        )}
                        alt={property.name}
                        className={styles.propertyListingImage}
                        loading={index === 0 ? "eager" : "lazy"}
                        decoding="async"
                      />

                      {property.status && (
                        <span
                          className={`${styles.cardStatus} ${
                            /ready/i.test(property.status) ? styles.cardStatusReady : ""
                          }`}
                        >
                          {statusLabel(property.status)}
                        </span>
                      )}

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

                      {/*
                    Was `class={...}`, which React drops — it is `className` in JSX —
                    so .propertyLogo (width 4.5rem, max-height 26px, scale-down)
                    never applied and the logo rendered at its intrinsic size.

                    Also guarded: property.developer was read without optional
                    chaining, so a listing with no developer threw on render.
                  */}
                      {property.developer?.developerImg && (
                        <div className={styles.propertyImageChipLogo}>
                          <img
                            className={styles.propertyLogo}
                            src={property.developer.developerImg}
                            alt={
                              property.developer.name
                                ? `${property.developer.name} logo`
                                : "Developer logo"
                            }
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      )}
                      <PhotoLocation property={property} />
                      <CompareToggle property={property} />
                      <HeartButton property={property} corner="left" />
                    </div>

                    {/* Property Details Section */}
                    <div className={styles.propertyListPageMobileDetailSection}>
                      <div className={styles.propertyListPageMobileDetailHeader}>
                        <div className={styles.propertyListPageMobileDetailLocation}>
                          <h3
                            style={{
                              fontWeight: "var(--fw-semibold)",
                              fontSize: "var(--fs-card-title)",
                              color: "var(--color-ink)",
                              display: "inline",
                            }}
                          >
                            {property.name}
                            {property.rera && (
                              <span
                                className={styles.mobileReraBadge}
                                aria-label={`RERA: ${property.rera}`}
                              >
                                <svg
                                  width="9"
                                  height="9"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  aria-hidden="true"
                                >
                                  <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1.2 14.4L6.6 12.2l1.4-1.4 2.8 2.8 5.6-5.6 1.4 1.4-7 7z" />
                                </svg>
                                RERA
                              </span>
                            )}
                          </h3>
                        </div>

                        <div className={styles.propertyListPageMobileDetailLocation}>
                          <p style={{ fontSize: "var(--fs-subtitle)" }}>Starting at</p>
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
                            <img src="/logos/rupeesSymbol.svg" alt="" />
                            {property.startingPrice}*
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
                        <ClampedDescription
                          text={property.description}
                          className={styles.clampTwoLines}
                          onReadMore={() => onReadMore?.(property)}
                        />
                      </div>

                      {/* Three actions — same design as the home page cards; Enquire & Brochure open the enquiry form */}
                      <div style={{ display: "flex", gap: "8px", width: "100%" }}>
                        <button
                          className={`${cb.cbBtn} ${cb.cbView}`}
                          type="button"
                          onClick={() => handleViewMorePropertyClick(property.slug)}
                        >
                          View More
                        </button>
                        <button
                          className={`${cb.cbBtn} ${cb.cbEnquire}`}
                          type="button"
                          onClick={() => onOpenBackdrop(property.name)}
                        >
                          Enquire Now
                        </button>
                        <button
                          className={`${cb.cbBtn} ${cb.cbBrochure}`}
                          type="button"
                          onClick={() => onOpenBackdrop(property.name)}
                          title="Download Brochure"
                        >
                          <svg
                            width="12"
                            height="12"
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
    </Suspense>
  );
}

export default PropertyListingCardMobile;
