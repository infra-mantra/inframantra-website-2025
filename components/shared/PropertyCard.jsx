import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import styles from "./PropertyCard.module.css";
import CustomBackdrop from "./Backdrop.jsx";

// Loaded only when a card's enquiry form is opened — no cost to the initial home-page load.
const PropertyPageFloatingContact = dynamic(
  () => import("../property-detail/PropertyPageFloatingContact.jsx"),
  { ssr: false }
);

// CMS status spellings vary ("UNDER CONSTRUCTION", "Under Construction ") — show one form
const titleCase = (v) =>
  String(v || "")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

const FALLBACK =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop&auto=format";

export default function PropertyCard({ property }) {
  // next/image serves a resized, modern-format (WebP/AVIF) version sized to the
  // card instead of the full-resolution source — identical visually, far
  // lighter. This project is on Next 12, whose next/image uses the legacy API:
  // layout="fill" + objectFit (the bare `fill` boolean is Next 13+ and throws
  // "must use width and height … or layout='fill'"). Container is position:
  // relative with a fixed height, so fill matches the previous layout exactly.
  const [errored, setErrored] = React.useState(false);
  const [enquiryOpen, setEnquiryOpen] = React.useState(false);
  const router = useRouter();
  const status = titleCase(property.status);
  const location = [property.subLocality?.name, property.locality?.name]
    .map((x) => (x || "").trim())
    .filter(Boolean)
    .join(", ");
  const src = errored ? FALLBACK : property.imageGallery?.url || FALLBACK;

  const goToProperty = () => {
    if (property?.slug) router.push(`/property/${property.slug}`);
  };
  const openEnquiry = () => setEnquiryOpen(true);

  return (
    <div className={styles.sharedPropCard}>
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

          {/* Developer logo — lazy-loaded so it never blocks the card image / initial paint */}
          {property.developer?.developerImg && (
            <span className={styles.pcLogo}>
              <img
                src={property.developer.developerImg}
                alt={property.developer.name ? `${property.developer.name} logo` : "Developer logo"}
                loading="lazy"
                decoding="async"
                width="64"
                height="26"
              />
            </span>
          )}

          {status && (
            <span className={`${styles.pcStatus} ${/ready/i.test(status) ? styles.pcStatusReady : ""}`}>
              {status}
            </span>
          )}

          {property.configuration && (
            <span className={styles.pcConfig}>{property.configuration.trim()}</span>
          )}
        </div>

        <div className={styles.propertyContent}>
          <h3 className={styles.propertyTitle}>{property.name}</h3>

          <p className={styles.propertyLocation}>
            <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true" className={styles.pcPin}>
              <path
                d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"
                fill="currentColor"
              />
            </svg>
            <span>{location}</span>
          </p>

          {property.configuration && (
            <p className={styles.propertyConfig}>{property.configuration}</p>
          )}

          <p className={styles.propertyPrice}>
            {property.startingPrice ? (
              <>
                <span className={styles.pcPriceLabel}>Starting from</span>
                <strong className={styles.pcPriceValue}>₹ {property.startingPrice}</strong>
              </>
            ) : (
              <span className={styles.pcPriceLabel}>Price on request</span>
            )}
          </p>
        </div>
      </a>

      {/* Three actions, outside the <a> — Enquire Now & Brochure open the same enquiry
          form. Sizing and wrapping now live in PropertyCard.module.css alongside the rest
          of the card, so the breakpoints can reach them. */}
      <div className={styles.propCardActions}>
        <button
          type="button"
          onClick={goToProperty}
          className={`${styles.propCardBtn} ${styles.propCardBtnPrimary}`}
        >
          View More
          <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true" className={styles.propCardBtnIcon}>
            <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          onClick={openEnquiry}
          className={`${styles.propCardBtn} ${styles.propCardBtnSecondary}`}
        >
          Enquire Now
        </button>
        <button
          type="button"
          onClick={openEnquiry}
          title="Download Brochure"
          className={`${styles.propCardBtn} ${styles.propCardBtnGhost}`}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className={styles.propCardBtnIcon}
          >
            <path d="M12 16l-5-5h3V4h4v7h3l-5 5zm-7 2h14v2H5z" />
          </svg>
          Brochure
        </button>
      </div>

      {/* Portal to <body> so the fixed-position backdrop escapes any transformed (Swiper) ancestor */}
      {enquiryOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <CustomBackdrop open={enquiryOpen} onClose={() => setEnquiryOpen(false)}>
            <PropertyPageFloatingContact
              name={property.name}
              configuration={property.configuration}
              onClose={() => setEnquiryOpen(false)}
            />
          </CustomBackdrop>,
          document.body
        )}
    </div>
  );
}
